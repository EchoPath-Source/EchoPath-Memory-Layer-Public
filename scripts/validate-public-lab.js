import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const modules = [
  "docs/lab/public-memory-lab.js",
  "docs/lab/scenarios.js",
  "docs/room-remembers/game.js",
  "docs/memory-visualizer/app.js",
];
for (const module of modules) {
  assert.ok(existsSync(module), `Missing public lab module: ${module}`);
  const result = spawnSync(process.execPath, ["--check", module], { encoding: "utf8" });
  assert.equal(result.status, 0, `Syntax failure in ${module}: ${result.stderr}`);
}
const pages = [
  ["docs/room-remembers/index.html", "game.js", [
    "scenario", "runScenario", "stepTime", "saveLab", "restoreLab", "exportLab",
    "zoneTotals", "actionOutcomes", "worldState", "labStatus", "door", "closet",
  ]],
  ["docs/memory-visualizer/index.html", "app.js", [
    "viz", "vizScenario", "runVizScenario", "advanceViz", "zonesToggle",
    "bindRoute", "saveViz", "restoreViz", "exportViz",
    "vizZoneTotals", "vizActionOutcomes", "vizHostState", "vizStatus",
  ]],
];
for (const [file, script, ids] of pages) {
  const html = readFileSync(file, "utf8");
  assert.ok(html.includes(`<script type="module" src="${script}"></script>`),
    `${file} must load the local module script`);
  for (const id of ids) assert.ok(html.includes(`id="${id}"`), `${file} missing #${id}`);
  assert.ok(!html.includes("echopath-kernel-private"), "Never expose private repo identifiers in public HTML");
}
const css = readFileSync("docs/styles.css", "utf8");
for (const selector of [".lab-controls", ".lab-select", ".lab-readouts", ".door-open"]) {
  assert.ok(css.includes(selector), `Missing lab style: ${selector}`);
}
console.log("Public Lab V2 module syntax and static HTML/CSS smoke checks passed. This is NOT browser E2E validation.");
