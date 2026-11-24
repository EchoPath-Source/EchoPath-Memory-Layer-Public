import { ROOM_PROFILES, createRoomLab, runRoomSequence } from "../lab/scenarios.js";

const $ = id => document.getElementById(id);
const STORAGE = "echopath.public_memory_lab.room.v2";
const node = {
  scenario: $("scenario"), description: $("scenarioDescription"),
  meters: $("meters"), zoneTotals: $("zoneTotals"), actions: $("actionOutcomes"),
  worldState: $("worldState"), status: $("labStatus"), npc: $("npc"), log: $("log"),
  door: $("door"),
};
let lab, profile = "room";
let host = { npcTarget: null, doorOpen: false, atmosphere: false, avoidHall: false };
let lines = [];

function message(text) {
  lines.push(text);
  lines = lines.slice(-35);
  node.log.textContent = lines.join("\n") + "\n";
  node.log.scrollTop = node.log.scrollHeight;
}
function status(text) { node.status.textContent = text; }
function format(value) { return Number(value).toFixed(2); }

function onHostAction(trigger) {
  if (trigger.actionKey === "demo.atmosphere") host.atmosphere = true;
  if (trigger.actionKey === "demo.investigate") host.npcTarget = "closet";
  if (trigger.actionKey === "demo.door_glow") host.atmosphere = true;
  if (trigger.actionKey === "demo.door_open") host.doorOpen = true;
  if (trigger.actionKey === "demo.prefer_exit") host.npcTarget = "exit";
  if (trigger.actionKey === "demo.avoid_hall") host.avoidHall = true;
  message(`[Host demo] ${trigger.actionKey}: completed visual state update at t=${format(trigger.time)}s`);
}

function init(next = "room") {
  profile = next;
  host = { npcTarget: null, doorOpen: false, atmosphere: false, avoidHall: false };
  lab = createRoomLab(profile, onHostAction);
  lines = [];
  node.scenario.value = profile;
  node.description.textContent = ROOM_PROFILES[profile].description;
  message(`[Public Memory Lab] ${ROOM_PROFILES[profile].title} ready. Synthetic data only.`);
  status("Ready. Use the scripted run or write events yourself.");
  render();
}

function positionNpc(targetId) {
  if (!targetId) {
    node.npc.style.left = "50%";
    node.npc.style.top = "78%";
    return;
  }
  const target = $(targetId);
  const world = $("world");
  if (!target || !world) return;
  const bounds = target.getBoundingClientRect();
  const base = world.getBoundingClientRect();
  node.npc.style.left = `${((bounds.left + bounds.width / 2 - base.left) / base.width) * 100}%`;
  node.npc.style.top = `${((bounds.top + bounds.height / 2 - base.top) / base.height) * 100}%`;
}

function createReadout(label, value) {
  const element = document.createElement("div");
  element.className = "memory-readout";
  const name = document.createElement("span");
  name.textContent = label;
  const val = document.createElement("strong");
  val.textContent = value;
  element.append(name, val);
  return element;
}

function render() {
  node.meters.replaceChildren();
  for (const anchor of lab.anchors.values()) {
    for (const [channel, value] of Object.entries(anchor.memory)) {
      const item = document.createElement("div");
      item.className = "meter";
      const label = document.createElement("div");
      label.className = "meter-label";
      const name = document.createElement("span");
      name.textContent = `${anchor.id}.${channel}`;
      const v = document.createElement("span");
      v.textContent = format(value);
      label.append(name, v);
      const bar = document.createElement("div");
      bar.className = "bar";
      const fill = document.createElement("div");
      fill.className = "fill";
      fill.style.width = `${Math.round(Math.min(1, value) * 100)}%`;
      bar.append(fill);
      item.append(label, bar);
      node.meters.append(item);
    }
    const peak = Math.max(0, ...Object.values(anchor.memory));
    $(anchor.id)?.style.setProperty("--pulse", Math.min(0.9, peak).toFixed(2));
  }

  node.zoneTotals.replaceChildren();
  for (const zone of lab.zones.values()) {
    const totals = lab.getZoneTotals(zone.id);
    const value = Object.entries(totals).filter(([, v]) => v > 0.001)
      .map(([key, v]) => `${key} ${format(v)}`).join(" · ") || "No retained memory";
    node.zoneTotals.append(createReadout(zone.label, value));
  }

  node.actions.replaceChildren();
  const actions = lab.actions.slice(-5).reverse();
  if (!actions.length) node.actions.append(createReadout("Action outcomes", "None yet"));
  for (const action of actions) {
    node.actions.append(createReadout(action.actionKey,
      `${action.status}${action.reason ? ` (${action.reason})` : ""}`));
  }
  node.door.classList.toggle("door-open", host.doorOpen);
  node.door.textContent = host.doorOpen ? "Door OPEN" : "Living Door";
  node.npc.classList.toggle("alert", host.npcTarget !== null || host.avoidHall);
  node.worldState.textContent = `t=${format(lab.time)}s · NPC: ${host.npcTarget ?? "observing"} · Door: ${host.doorOpen ? "open" : "closed"} · Atmosphere: ${host.atmosphere ? "shifted" : "normal"}${host.avoidHall ? " · Avoiding hallway" : ""}`;
  positionNpc(host.npcTarget);
}

function write(anchorId, channel, strength) {
  try {
    const result = lab.write(anchorId, channel, strength);
    lab.advance(0.2); // Explicit simulation step, not an unseen wall-clock timer.
    message(`[Event] ${anchorId}.${channel} += ${format(strength)} -> ${format(result.value)}`);
    if (result.triggers.length) {
      message(`[Threshold] ${result.triggers.map(x => x.actionKey).join(", ")}`);
    }
    render();
  } catch (error) { status(`Input rejected: ${error.message}`); }
}

function save() {
  const data = { kind: "echopath.public_memory_demo", version: "0.1.0",
    profile, lab: lab.snapshot(), host: { ...host } };
  try {
    localStorage.setItem(STORAGE, JSON.stringify(data));
    status("Synthetic browser-only snapshot saved on this device.");
    message("[Snapshot] Saved locally; not uploaded to a server.");
  } catch {
    status("Local storage unavailable. Use Export summary instead.");
  }
}

function restore() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE) ?? "null");
    if (!data || data.kind !== "echopath.public_memory_demo" ||
        data.version !== "0.1.0" || !Object.hasOwn(ROOM_PROFILES, data.profile) ||
        !data.host || typeof data.host !== "object") throw new Error("No compatible saved session");
    const next = createRoomLab(data.profile, onHostAction);
    next.restore(data.lab);
    // No mutation of current visible state until full candidate validation.
    profile = data.profile;
    lab = next;
    host = {
      npcTarget: ["closet", "exit", null].includes(data.host.npcTarget) ? data.host.npcTarget : null,
      doorOpen: data.host.doorOpen === true, atmosphere: data.host.atmosphere === true,
      avoidHall: data.host.avoidHall === true,
    };
    node.scenario.value = profile;
    node.description.textContent = ROOM_PROFILES[profile].description;
    message("[Snapshot] Restored synthetic memory and host state.");
    status("Restored. Once/cooldown state and zone relationships retained.");
    render();
  } catch (error) { status(`Restore unavailable: ${error.message}`); }
}

function downloadReport() {
  const report = { scenario: profile, demoHost: { ...host }, ...lab.report() };
  const data = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(data);
  const a = document.createElement("a");
  a.href = url;
  a.download = `echopath-public-memory-${profile}-summary.json`;
  document.body.append(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  status("Exported a retained synthetic event summary—not deterministic simulation replay.");
}

node.scenario.addEventListener("change", () => init(node.scenario.value));
$("runScenario").addEventListener("click", () => {
  init(node.scenario.value);
  runRoomSequence(lab, profile);
  message(`[Script] Replayed fixed synthetic inputs for ${ROOM_PROFILES[profile].title}.`);
  message(`[Evidence] ${lab.events.length} events, ${lab.triggers.length} triggers, ${lab.actions.length} host-action outcomes.`);
  status("Script complete. Review threshold and zone readouts; repeat after Reset.");
  render();
});
$("stepTime").addEventListener("click", () => {
  lab.advance(5);
  message(`[Time] Advanced 5 simulated seconds to t=${format(lab.time)}.`);
  render();
});
$("resetLab").addEventListener("click", () => init(profile));
$("saveLab").addEventListener("click", save);
$("restoreLab").addEventListener("click", restore);
$("exportLab").addEventListener("click", downloadReport);

document.querySelectorAll("[data-event][data-anchor]").forEach(button => {
  button.addEventListener("click", () => write(button.dataset.anchor,
    button.dataset.event, Number(button.dataset.strength)));
});
document.querySelectorAll(".world .zone").forEach(button => {
  button.addEventListener("click", () => {
    const channel = ({ closet: "hiding", hallway: "danger", exit: "route", door: "object" })[button.id];
    if (channel) write(button.id, channel, 0.2);
  });
});
window.addEventListener("resize", () => positionNpc(host.npcTarget));
init();
