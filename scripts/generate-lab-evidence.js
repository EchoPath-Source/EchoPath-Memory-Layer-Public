import { mkdirSync, writeFileSync } from "node:fs";
import {
  ROOM_PROFILES, VISUALIZER_PROFILES,
  createRoomLab, runRoomSequence,
  createVisualizerLab, runVisualizerSequence,
} from "../docs/lab/scenarios.js";

const entries = [];
for (const profile of Object.keys(ROOM_PROFILES)) {
  const hostEffects = [];
  const lab = createRoomLab(profile, action => hostEffects.push(action.actionKey));
  const result = runRoomSequence(lab, profile);
  entries.push({
    demo: "room-remembers", scenario: profile, title: ROOM_PROFILES[profile].title,
    inputEvents: result.events.length,
    simTimeSeconds: result.time,
    triggerKeys: result.triggers.map(x => x.actionKey),
    actionOutcomes: result.actionOutcomes.map(x => ({
      actionKey: x.actionKey, status: x.status,
    })),
    hostEffects, memoryByZone: result.memoryByZone,
    retainedHistory: result.retention,
  });
}
for (const profile of Object.keys(VISUALIZER_PROFILES)) {
  const lab = createVisualizerLab();
  const result = runVisualizerSequence(lab, profile);
  entries.push({
    demo: "memory-visualizer", scenario: profile, title: VISUALIZER_PROFILES[profile].title,
    inputEvents: result.events.length,
    simTimeSeconds: result.time,
    triggerKeys: result.triggers.map(x => x.actionKey),
    actionOutcomes: result.actionOutcomes.map(x => ({
      actionKey: x.actionKey, status: x.status,
    })),
    memoryByZone: result.memoryByZone, retainedHistory: result.retention,
  });
}
const report = {
  schema: "echopath.public_memory_lab_test_evidence",
  version: "0.1.0",
  source: "public-safe synthetic demo only",
  commit: process.env.GITHUB_SHA ?? null,
  node: process.version,
  productionRuntimeNumericParity: false,
  unityEditorValidation: false,
  fullSimulationReplay: false,
  scenarios: entries,
};
mkdirSync("outputs", { recursive: true });
writeFileSync("outputs/public-memory-lab-evidence.json", JSON.stringify(report, null, 2) + "\n");
console.log(`Wrote six public scenario evidence records (not production or Unity validation).`);
for (const entry of entries) {
  console.log(`${entry.demo}/${entry.scenario}: ${entry.inputEvents} events, ${entry.triggerKeys.length} triggers, ${entry.actionOutcomes.length} dispatch outcomes`);
}
