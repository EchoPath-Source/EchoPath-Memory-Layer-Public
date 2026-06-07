import { MemoryAnchor, MemoryLiteField } from "../src/memory-lite/index.js";

const memory = new MemoryLiteField();

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
  visualStyle: {
    debugColorHint: "hiding",
    curve: "soft_bloom",
  },
}));

memory.onTrigger(({ trigger }) => {
  console.log("Trigger fired:", trigger.actionKey, "at", trigger.anchorId);
});

memory.writeEngram({
  position: { x: 0.2, y: 0.1, z: 0 },
  eventType: "hiding",
  strength: 0.35,
  source: "player",
  tags: ["stealth", "repeat_behavior"],
  radius: 2,
});

memory.writeEngram({
  anchorId: "closet_01",
  eventType: "hiding",
  strength: 0.4,
  source: "player",
});

const readout = memory.queryMemory({
  position: { x: 0, y: 0, z: 0 },
  radius: 5,
  type: "hiding",
});

console.log("Agent readout:", readout);

const snapshot = memory.saveState({ demo: "memory-lite-basic" });
const restored = MemoryLiteField.loadState(snapshot);

console.log("Restored hiding memory:", restored.getMemory("closet_01", "hiding"));
