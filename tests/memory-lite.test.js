import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { MemoryAnchor, MemoryLiteField, applyPresetSummary, getPresetChannel } from "../src/memory-lite/index.js";

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
