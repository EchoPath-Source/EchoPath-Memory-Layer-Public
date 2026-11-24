import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PublicMemoryLab } from "../docs/lab/public-memory-lab.js";
import {
  createRoomLab, runRoomSequence, ROOM_PROFILES,
  createVisualizerLab, runVisualizerSequence, VISUALIZER_PROFILES,
} from "../docs/lab/scenarios.js";

const near = (actual, expected, tolerance = 1e-8) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `Expected ${actual} ~= ${expected}`);

test("Public Lab V2: three room scenarios have deterministic synthetic inputs and action outcomes", () => {
  const expected = {
    room: ["demo.atmosphere", "demo.investigate"],
    door: ["demo.door_glow", "demo.door_open"],
    trail: ["demo.prefer_exit", "demo.avoid_hall"],
  };
  assert.deepEqual(Object.keys(ROOM_PROFILES), Object.keys(expected));
  for (const profile of Object.keys(expected)) {
    const calls = [];
    const first = createRoomLab(profile, event => calls.push(event.actionKey));
    const report = runRoomSequence(first, profile);
    assert.deepEqual(first.triggers.map(t => t.actionKey), expected[profile]);
    assert.deepEqual(calls, expected[profile]);
    assert.deepEqual(first.actions.map(a => a.status), ["handled", "handled"]);
    assert.equal(report.completeSimulationReplay, false);
    assert.equal(report.educationalPreview, true);
    assert.equal(report.zoneCount, 2);
    const second = createRoomLab(profile, () => {});
    runRoomSequence(second, profile);
    assert.deepEqual(second.report(), report, `Repeatability mismatch: ${profile}`);
  }
});

test("Public Lab V2: overlapping zones share exactly one anchor memory value", () => {
  const lab = createRoomLab();
  lab.write("hallway", "danger", .3);
  near(lab.getZoneTotals("west_wing").danger, .3);
  near(lab.getZoneTotals("main_route").danger, .3);
  assert.equal(lab.events.length, 1);
  assert.equal(lab.anchors.size, 4);
  assert.deepEqual(lab.zones.get("west_wing").anchorIds, ["closet", "hallway"]);
  assert.deepEqual(lab.zones.get("main_route").anchorIds, ["door", "exit", "hallway"]);
});

test("Public Lab V2: zone query uses explicit positions and stable closest influence", () => {
  const lab = createRoomLab();
  lab.write("hallway", "danger", .35);
  lab.write("closet", "hiding", .25);
  const zone = lab.queryZone("west_wing", { x: 4, y: 2.5, radius: 5, channel: "danger" });
  assert.equal(zone.strongestAnchorId, "hallway");
  near(zone.totals.danger, .35);
  assert.equal(lab.queryZone("west_wing", { x: 100, y: 100, radius: 1 }).strongestAnchorId, null);
  assert.throws(() => lab.queryZone("missing"), /Invalid public zone query/);
});

test("Public Lab V2: Living Door save/reload preserves once semantics and registered host action", () => {
  const effects = [];
  const lab = createRoomLab("door", t => effects.push(t.actionKey));
  runRoomSequence(lab, "door");
  const before = lab.snapshot();
  const again = createRoomLab("door", t => effects.push(t.actionKey));
  again.restore(JSON.stringify(before));
  assert.equal(again.time, lab.time);
  assert.deepEqual(again.zones.get("main_route").anchorIds, ["door", "exit", "hallway"]);
  assert.deepEqual(again.triggers.map(t => t.actionKey), lab.triggers.map(t => t.actionKey));
  const prior = effects.length;
  again.write("door", "object", .1);
  assert.equal(effects.length, prior, "once action must not refire after restore");
  assert.equal(again.actions.length, lab.actions.length);
  assert.deepEqual(again.report().retention, lab.report().retention);
});

test("Public Lab V2: failed restore is atomic, preserving old memory and callback registration", () => {
  const lab = createRoomLab("door");
  lab.write("door", "object", .15);
  const before = lab.snapshot();
  const corrupted = structuredClone(before);
  corrupted.zones[0].anchorIds.push("ghost");
  assert.throws(() => lab.restore(corrupted), /Invalid or duplicate public zone membership/);
  assert.deepEqual(lab.snapshot(), before);
  const duplicate = structuredClone(before);
  duplicate.anchors.push(structuredClone(duplicate.anchors[0]));
  assert.throws(() => lab.restore(duplicate), /Invalid or duplicate public anchor/);
  assert.deepEqual(lab.snapshot(), before);
});

test("Public Lab V2: once/cooldown/repeat rules and explicit simulation time", () => {
  const lab = new PublicMemoryLab({ defaultDecayRate: 0 });
  lab.addAnchor({ id: "a", memory: { sound: 0 } });
  lab.addRule({ id: "once", anchorId: "a", channel: "sound", threshold: .2, actionKey: "once", mode: "once" });
  lab.addRule({ id: "cool", anchorId: "a", channel: "sound", threshold: .2, actionKey: "cool", mode: "cooldown", cooldownSeconds: 5 });
  lab.addRule({ id: "repeat", anchorId: "a", channel: "sound", threshold: .2, actionKey: "repeat", mode: "repeat" });
  lab.write("a", "sound", .25);
  lab.advance(3);
  lab.advance(2);
  assert.deepEqual(lab.triggers.filter(x=>x.actionKey==="once").map(x=>x.time), [0]);
  assert.deepEqual(lab.triggers.filter(x=>x.actionKey==="cool").map(x=>x.time), [0, 5]);
  assert.deepEqual(lab.triggers.filter(x=>x.actionKey==="repeat").map(x=>x.time), [0, 3, 5]);
});

test("Public Lab V2: missing and failing actions remain visibly unhandled/failed", () => {
  const lab = new PublicMemoryLab();
  lab.addAnchor({ id: "a" });
  lab.addRule({ id: "first", anchorId: "a", channel: "sound", threshold: .2, actionKey: "missing" });
  lab.addRule({ id: "second", anchorId: "a", channel: "sound", threshold: .2, actionKey: "failing" });
  lab.registerAction("failing", () => { throw new Error("local UI failure"); });
  lab.write("a", "sound", .3);
  assert.deepEqual(lab.actions.map(a=>a.status), ["unhandled","failed"]);
  assert.deepEqual(lab.actions.map(a=>a.reason), ["no_host_binding","host_handler_error"]);
  assert.ok(!JSON.stringify(lab.actions).includes("local UI failure"));
  assert.equal(lab.getMemory("a","sound"), .3);
});

test("Public Lab V2: reference visualizer scenarios are repeatable with known action outcome", () => {
  assert.deepEqual(Object.keys(VISUALIZER_PROFILES), ["danger", "safe", "social"]);
  const hazard = createVisualizerLab();
  let effects = 0;
  hazard.registerAction("demo.hazard_warning", () => effects++);
  runVisualizerSequence(hazard, "danger");
  assert.equal(effects, 1);
  assert.equal(hazard.actions[0].status, "handled");
  const safe = createVisualizerLab();
  runVisualizerSequence(safe, "safe");
  assert.equal(safe.actions[0].actionKey, "demo.route_indicator");
  assert.equal(safe.actions[0].status, "unhandled");
  const safeBound = createVisualizerLab();
  let routeEffects = 0;
  safeBound.registerAction("demo.route_indicator", () => routeEffects++);
  runVisualizerSequence(safeBound, "safe");
  assert.equal(routeEffects, 1);
  assert.equal(safeBound.actions[0].status, "handled");
});

test("Public Lab V2: bounded history explicitly signals truncation and never claims full replay", () => {
  const lab = new PublicMemoryLab({ historyLimit: 2, defaultDecayRate: 0 });
  lab.addAnchor({ id: "a" });
  for (let i = 0; i < 5; i++) lab.write("a", "presence", .1);
  const report = lab.report();
  assert.equal(report.events.length, 2);
  assert.equal(report.retention.droppedEvents, 3);
  assert.equal(report.retention.status, "truncated");
  assert.equal(report.completeSimulationReplay, false);
  const saved = lab.snapshot();
  const restored = new PublicMemoryLab().restore(saved);
  assert.equal(restored.report().retention.droppedEvents, 3);
});

test("Public Lab V2: invalid inputs fail closed", () => {
  const lab = new PublicMemoryLab();
  assert.throws(() => lab.addAnchor({ id: "bad", x: Infinity }), /Invalid or duplicate/);
  lab.addAnchor({ id: "a" });
  assert.throws(() => lab.addAnchor({ id: "a" }), /duplicate public anchor/);
  assert.throws(() => lab.write("a", "hiding", Number.NaN), /Invalid public memory write/);
  assert.throws(() => lab.advance(-1), /Invalid simulation time/);
  assert.throws(() => lab.addZone({ id: "z", anchorIds: ["missing"] }), /zone membership/);
  assert.equal(lab.events.length, 0);
});

test("Public Lab V2: both published pages reference one shared public-safe module", () => {
  for (const page of ["room-remembers","memory-visualizer"]) {
    const html = readFileSync(new URL(`../docs/${page}/index.html`, import.meta.url), "utf8");
    const app = readFileSync(new URL(`../docs/${page}/${page === "room-remembers" ? "game.js" : "app.js"}`, import.meta.url), "utf8");
    assert.match(html, /type="module"/);
    assert.match(app, /from "\.\.\/lab\/scenarios\.js"/);
    assert.match(html, /Export summary/);
    assert.match(html, /(?:Save locally|Save)/);
    assert.match(html, /(?:Restore|Restore)/);
  }
});
