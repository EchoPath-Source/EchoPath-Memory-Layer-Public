import { readFile } from "node:fs/promises";

import {
  MemoryLiteField,
  MemoryZone,
  applyPresetSummary,
  getPresetChannel,
} from "../src/memory-lite/index.js";

const presetSummary = JSON.parse(
  await readFile(new URL("../presets/starter/preset-summary.json", import.meta.url), "utf8"),
);

const selectedPresets = ["haunted_room", "safe_path"].map(presetId => {
  const preset = presetSummary.presets.find(candidate => candidate.id === presetId);
  if (!preset) throw new Error(`Missing starter preset summary: ${presetId}`);
  return preset;
});

const memory = new MemoryLiteField();
const anchors = selectedPresets.map((preset, index) => applyPresetSummary(memory, preset, {
  id: `${preset.id}_preview_anchor`,
  position: { x: index * 3, y: 0, z: 0 },
  radius: 3,
  threshold: 0.55,
}));

const roomZone = memory.addZone(new MemoryZone({
  id: "starter_preview_room",
  label: "Starter Preset Preview Room",
  anchors,
  tags: ["public-preview", "starter-presets"],
  visualStyle: {
    debugColorHint: "preset_mix",
    curve: "soft_bloom",
  },
}));

memory.onTrigger(({ trigger }) => {
  console.log("Trigger fired:", trigger.actionKey, "from", trigger.anchorId, "on", trigger.memoryType);
});

for (const [index, preset] of selectedPresets.entries()) {
  const channel = getPresetChannel(preset);
  memory.writeEngram({
    anchorId: anchors[index].id,
    eventType: channel,
    strength: 0.3,
    source: "example-script",
    tags: ["preset-summary", preset.id],
  });
  memory.writeEngram({
    anchorId: anchors[index].id,
    eventType: channel,
    strength: 0.3,
    source: "example-script",
    tags: ["preset-summary", preset.id, "repeat"],
  });
}

const readout = memory.queryMemory({
  position: { x: 0, y: 0, z: 0 },
  radius: 6,
});

const zoneReadout = memory.queryZoneMemory(roomZone.id, {
  position: { x: 0, y: 0, z: 0 },
  radius: 6,
});

const snapshot = memory.saveState({
  metadata: {
    demo: "memory-lite-preset-summary",
    packId: presetSummary.packId,
  },
});

console.log("Selected presets:", selectedPresets.map(preset => preset.name).join(", "));
console.log("Agent readout:", readout);
console.log("Zone readout:", zoneReadout);
console.log("Saved state:", {
  schema: snapshot.schema,
  anchors: snapshot.anchors.length,
  zones: snapshot.zones.length,
  triggers: snapshot.triggerLog.length,
});
