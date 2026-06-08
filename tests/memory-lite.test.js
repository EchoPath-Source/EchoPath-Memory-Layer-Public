import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import {
  MemoryAnchor,
  MemoryLiteField,
  MemoryZone,
  applyPresetSummary,
  getPresetChannel,
} from "../src/memory-lite/index.js";

const execFileAsync = promisify(execFile);
const presetSummary = JSON.parse(
  await readFile(new URL("../presets/starter/preset-summary.json", import.meta.url), "utf8"),
);

test("MemoryLiteField writes engrams, fires threshold triggers, and restores saved state", () => {
  const memory = new MemoryLiteField();
  const fired = [];

  memory.addAnchor(new MemoryAnchor({
    id: "closet_01",
    label: "Closet Hide Spot",
    position: { x: 0, y: 0, z: 0 },
    radius: 2,
    memory: { hiding: 0 },
    thresholdRules: [
      {
        id: "closet_investigate",
        memoryType: "hiding",
        threshold: 0.7,
        mode: "cooldown",
        cooldownSeconds: 10,
        actionKey: "npc.investigate",
      },
    ],
  }));

  memory.onTrigger(({ trigger }) => fired.push(trigger));

  const firstWrite = memory.writeEngram({
    position: { x: 0.2, y: 0.1, z: 0 },
    eventType: "hiding",
    strength: 0.35,
    source: "player",
    radius: 2,
  });
  assert.equal(firstWrite.written, true);
  assert.equal(firstWrite.triggers.length, 0);

  const secondWrite = memory.writeEngram({
    anchorId: "closet_01",
    eventType: "hiding",
    strength: 0.4,
    source: "player",
  });
  assert.equal(secondWrite.written, true);
  assert.equal(secondWrite.triggers.length, 1);
  assert.equal(secondWrite.triggers[0].actionKey, "npc.investigate");
  assert.equal(fired.length, 1);

  const readout = memory.queryMemory({ position: { x: 0, y: 0, z: 0 }, radius: 5, type: "hiding" });
  assert.equal(readout.strongestAnchorId, "closet_01");
  assert.equal(readout.suggestedAction, "investigate memory hotspot");

  const restored = MemoryLiteField.loadState(memory.saveState({ metadata: { demo: "test" } }));
  assert.equal(restored.getMemory("closet_01", "hiding"), 0.75);
});

test("MemoryZone groups anchors and reports memory totals", () => {
  const hidingAnchor = new MemoryAnchor({
    id: "sofa_01",
    position: { x: 0, y: 0, z: 0 },
    memory: { hiding: 0.4, sound: 0.1 },
  });
  const safeAnchor = new MemoryAnchor({
    id: "lamp_01",
    position: { x: 2, y: 0, z: 0 },
    memory: { safe: 0.5, hiding: 0.2 },
  });

  const zone = new MemoryZone({
    id: "room_01",
    label: "Living Room",
    anchors: [hidingAnchor],
    tags: ["room", "horror"],
    visualStyle: { debugColorHint: "danger", curve: "soft_bloom" },
  });

  zone.addAnchor(safeAnchor);
  assert.equal(zone.getAnchor("sofa_01"), hidingAnchor);
  assert.deepEqual(zone.getMemoryTotals(), { hiding: 0.6000000000000001, sound: 0.1, safe: 0.5 });
  assert.deepEqual(zone.getMemoryTotals({ type: "hiding" }), { hiding: 0.6000000000000001 });

  const readout = zone.queryMemory({ position: { x: 0, y: 0, z: 0 }, radius: 4 });
  assert.equal(readout.zoneId, "room_01");
  assert.equal(readout.strongestAnchorId, "sofa_01");
  assert.equal(zone.removeAnchor("lamp_01"), true);
  assert.equal(zone.getAnchor("lamp_01"), null);
});

test("MemoryLiteField can register and query MemoryZone instances", () => {
  const field = new MemoryLiteField();
  const zone = field.addZone(new MemoryZone({
    id: "room_zone",
    anchors: [
      new MemoryAnchor({ id: "door_01", position: { x: 0, y: 0, z: 0 }, memory: { sound: 0.8 } }),
    ],
  }));

  assert.equal(field.getZone("room_zone"), zone);
  assert.equal(field.getAnchor("door_01")?.id, "door_01");
  assert.equal(field.queryZoneMemory("room_zone", { position: { x: 0, y: 0, z: 0 }, radius: 2 }).totals.sound, 0.8);
  assert.equal(field.queryZoneMemory("missing_zone"), null);

  const restored = MemoryLiteField.loadState(field.saveState());
  assert.equal(restored.getZone("room_zone")?.getAnchor("door_01")?.id, "door_01");
});

test("multi-channel threshold rules fire for any listed memory type while single-channel rules stay compatible", () => {
  const field = new MemoryLiteField();
  const triggers = [];
  field.addAnchor(new MemoryAnchor({
    id: "hall_01",
    memory: { hiding: 0, sound: 0, safe: 0 },
    thresholdRules: [
      {
        id: "attention_any",
        memoryTypes: ["hiding", "sound"],
        threshold: 0.5,
        mode: "repeat",
        actionKey: "npc.attention.any",
      },
      {
        id: "safe_only",
        memoryType: "safe",
        threshold: 0.5,
        mode: "repeat",
        actionKey: "npc.safe.only",
      },
    ],
  }));
  field.onTrigger(({ trigger }) => triggers.push(trigger));

  assert.equal(field.writeEngram({ anchorId: "hall_01", eventType: "sound", strength: 0.55 }).triggers[0].actionKey, "npc.attention.any");
  assert.equal(field.writeEngram({ anchorId: "hall_01", eventType: "safe", strength: 0.55 }).triggers[0].actionKey, "npc.safe.only");
  assert.deepEqual(triggers.map(trigger => trigger.memoryType), ["sound", "safe"]);
});

test("starter preset summaries create public-safe anchors", () => {
  const field = new MemoryLiteField();

  for (const preset of presetSummary.presets) {
    const anchor = applyPresetSummary(field, preset);
    const channel = getPresetChannel(preset);

    assert.equal(anchor.metadata.presetId, preset.id);
    assert.equal(anchor.thresholdRules[0].memoryType, channel);
    assert.equal(anchor.thresholdRules[0].actionKey, `${preset.id}.public_response`);
    assert.ok(anchor.tags.includes("preset"));
  }

  assert.equal(field.anchors.size, 10);
});

test("preset summary example runs", async () => {
  const { stdout } = await execFileAsync(process.execPath, ["examples/memory-lite-preset-summary.js"], {
    cwd: new URL("..", import.meta.url),
  });

  assert.match(stdout, /Selected presets: Haunted Room, Safe Path/);
  assert.match(stdout, /Saved state:/);
  assert.match(stdout, /starter_preview_room/);
});
