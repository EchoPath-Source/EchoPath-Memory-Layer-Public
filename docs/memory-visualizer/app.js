import {
  createVisualizerLab, runVisualizerSequence, VISUALIZER_PROFILES, VISUALIZER_ANCHORS,
} from "../lab/scenarios.js";

const $ = id => document.getElementById(id);
const canvas = $("viz");
const ctx = canvas.getContext("2d");
const STORAGE = "echopath.public_memory_lab.visualizer.v2";
const colors = {
  hiding: [182,149,255], sound: [41,255,210], danger: [255,124,124],
  safe: [128,232,178], route: [124,167,255], presence: [255,189,89],
  object: [196,180,255],
};
let selected = "hiding";
let lab, routeBound = false, showZones = true;
let host = { hazardCue: false, routeCue: false };
let lines = [];

function fmt(value) { return Number(value).toFixed(2); }
function log(value) {
  lines.push(value);
  lines = lines.slice(-28);
  $("readout").textContent = lines.join("\n") + "\n";
  $("readout").scrollTop = $("readout").scrollHeight;
}
function status(value) { $("vizStatus").textContent = value; }
function readout(label, value) {
  const row = document.createElement("div");
  row.className = "memory-readout";
  const name = document.createElement("span");
  name.textContent = label;
  const amount = document.createElement("strong");
  amount.textContent = value;
  row.append(name, amount);
  return row;
}
function setDescription() {
  $("vizScenarioDescription").textContent = VISUALIZER_PROFILES[$("vizScenario").value].description;
}

function init() {
  lab = createVisualizerLab();
  host = { hazardCue: false, routeCue: false };
  lab.registerAction("demo.hazard_warning", () => { host.hazardCue = true; }, "demo-visual-effect");
  if (routeBound) {
    lab.registerAction("demo.route_indicator", () => { host.routeCue = true; }, "demo-visual-effect");
  }
  lines = [];
  log("[Public Memory Lab] Ready. All inputs are synthetic and local.");
  status("Choose a scenario and run the fixed sequence, or click a memory anchor.");
  render();
}

function nearestAnchor(x, y) {
  let best = VISUALIZER_ANCHORS[0], distance = Infinity;
  for (const anchor of VISUALIZER_ANCHORS) {
    const d = Math.hypot(anchor.x - x, anchor.y - y);
    if (d < distance) { distance = d; best = anchor; }
  }
  return best;
}

function drawGrid() {
  ctx.strokeStyle = "rgba(169,186,199,0.07)";
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 36) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 36) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
}
function drawZones() {
  if (!showZones) return;
  const strokes = ["rgba(182,149,255,.6)", "rgba(41,255,210,.6)", "rgba(255,189,89,.55)"];
  let index = 0;
  for (const zone of lab.zones.values()) {
    const anchors = zone.anchorIds.map(id => lab.anchors.get(id));
    if (!anchors.length) continue;
    const left = Math.max(10, Math.min(...anchors.map(a => a.x)) - 56);
    const right = Math.min(canvas.width - 10, Math.max(...anchors.map(a => a.x)) + 56);
    const top = Math.max(10, Math.min(...anchors.map(a => a.y)) - 70);
    const bottom = Math.min(canvas.height - 10, Math.max(...anchors.map(a => a.y)) + 58);
    ctx.strokeStyle = strokes[index++ % strokes.length];
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(left, top, right - left, bottom - top);
    ctx.setLineDash([]);
    ctx.fillStyle = ctx.strokeStyle;
    ctx.font = "600 13px system-ui";
    ctx.textAlign = "left";
    ctx.fillText(zone.label, left + 8, top + 18);
  }
}

function drawHeat(anchor, channel, value) {
  const [r,g,b] = colors[channel] ?? [182,149,255];
  const radius = 33 + Math.min(1, value) * 160;
  const gradient = ctx.createRadialGradient(anchor.x, anchor.y, 0, anchor.x, anchor.y, radius);
  gradient.addColorStop(0, `rgba(${r},${g},${b},${0.5 * Math.min(1, value)})`);
  gradient.addColorStop(.4, `rgba(${r},${g},${b},${0.19 * Math.min(1, value)})`);
  gradient.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = gradient;
  ctx.beginPath(); ctx.arc(anchor.x, anchor.y, radius, 0, Math.PI * 2); ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#071019";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  drawZones();

  for (const anchor of lab.anchors.values()) {
    for (const [channel, value] of Object.entries(anchor.memory)) {
      if (value > 0.004) drawHeat(anchor, channel, value);
    }
  }

  if (host.routeCue) {
    const from = lab.anchors.get("hallway"), to = lab.anchors.get("exit");
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y);
    ctx.lineWidth = 5; ctx.strokeStyle = "rgba(128,232,178,.95)"; ctx.stroke();
    ctx.fillStyle = "#80e8b2"; ctx.font = "700 16px system-ui";
    ctx.fillText("remembered route", (from.x + to.x)/2 - 15, (from.y + to.y)/2 - 16);
  }

  for (const anchor of lab.anchors.values()) {
    const strength = anchor.memory[selected] ?? 0;
    ctx.beginPath();
    ctx.arc(anchor.x, anchor.y, 28 + strength * 15, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(244,248,251,${0.10 + strength * 0.2})`;
    ctx.fill();
    ctx.strokeStyle = host.hazardCue && anchor.id === "hallway"
      ? "#ffbd59" : strength > 0.4 ? "#b695ff" : "rgba(169,186,199,.4)";
    ctx.lineWidth = 2; ctx.stroke();
    ctx.font = "700 15px system-ui"; ctx.textAlign = "center";
    ctx.fillStyle = "#f4f8fb"; ctx.fillText(anchor.label, anchor.x, anchor.y + 5);
    ctx.font = "12px monospace"; ctx.fillStyle = "#a9bac7";
    ctx.fillText(`${selected}: ${fmt(strength)}`, anchor.x, anchor.y + 25);
  }
}

function render() {
  draw();
  const zones = $("vizZoneTotals");
  zones.replaceChildren();
  for (const zone of lab.zones.values()) {
    const totals = lab.getZoneTotals(zone.id);
    const summary = Object.entries(totals).filter(([, value]) => value >= 0.002)
      .map(([channel, value]) => `${channel} ${fmt(value)}`).join(" · ") || "no memory";
    zones.append(readout(zone.label, summary));
  }
  const actions = $("vizActionOutcomes");
  actions.replaceChildren();
  const items = lab.actions.slice(-4).reverse();
  if (!items.length) actions.append(readout("Action outcomes", "none yet"));
  for (const item of items) {
    actions.append(readout(item.actionKey, `${item.status}${item.reason ? ` (${item.reason})` : ""}`));
  }
  $("vizHostState").textContent =
    `t=${fmt(lab.time)}s · Hazard cue: ${host.hazardCue ? "shown" : "off"} · Route cue: ${host.routeCue ? "shown" : "unbound/off"} · Retained events: ${lab.events.length}`;
}

function write(anchorId, channel, strength) {
  try {
    const event = lab.write(anchorId, channel, strength);
    lab.advance(0.2);
    log(`[Event] ${anchorId}.${channel}: +${fmt(strength)} → ${fmt(event.value)}`);
    for (const action of lab.actions.slice(-event.triggers.length)) {
      log(`[Action] ${action.actionKey}: ${action.status}${action.reason ? ` (${action.reason})` : ""}`);
    }
    render();
  } catch (error) { status(`Write rejected: ${error.message}`); }
}

function save() {
  try {
    localStorage.setItem(STORAGE, JSON.stringify({
      kind: "echopath.public_memory_visualizer", version: "0.1.0",
      lab: lab.snapshot(), host: { ...host }, routeBound,
    }));
    status("Saved synthetic session locally in this browser. No upload.");
  } catch { status("Browser storage unavailable; try Export summary."); }
}
function restore() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE) ?? "null");
    if (!data || data.kind !== "echopath.public_memory_visualizer" ||
        data.version !== "0.1.0" || typeof data.routeBound !== "boolean" ||
        !data.host || typeof data.host !== "object") throw new Error("No compatible save");
    const candidate = createVisualizerLab();
    candidate.restore(data.lab);
    routeBound = data.routeBound;
    lab = candidate;
    host = { hazardCue: data.host.hazardCue === true, routeCue: data.host.routeCue === true };
    lab.registerAction("demo.hazard_warning", () => { host.hazardCue = true; }, "demo-visual-effect");
    if (routeBound) lab.registerAction("demo.route_indicator", () => { host.routeCue = true; }, "demo-visual-effect");
    $("bindRoute").textContent = routeBound ? "Route action bound" : "Bind route action";
    log("[Snapshot] Restored synthetic field and visual host state.");
    status("Restore complete; threshold once-state retained.");
    render();
  } catch (error) { status(`Restore unavailable: ${error.message}`); }
}

function exportSummary() {
  const payload = { ...lab.report(), visualHost: { ...host }, selectedChannel: selected };
  const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
  const link = document.createElement("a"); link.href = url;
  link.download = "echopath-public-visualizer-summary.json";
  document.body.append(link); link.click(); link.remove(); URL.revokeObjectURL(url);
  status("Downloaded retained synthetic event summary—not exact replay.");
}

document.querySelectorAll("[data-channel]").forEach(button => {
  button.addEventListener("click", () => {
    selected = button.dataset.channel;
    document.querySelectorAll("[data-channel]").forEach(b => b.classList.toggle("active", b === button));
    render();
  });
});
canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * canvas.width / rect.width;
  const y = (e.clientY - rect.top) * canvas.height / rect.height;
  write(nearestAnchor(x,y).id, selected, selected === "danger" ? 0.24 : 0.2);
});
$("vizScenario").addEventListener("change", setDescription);
$("runVizScenario").addEventListener("click", () => {
  init();
  const profile = $("vizScenario").value;
  runVisualizerSequence(lab, profile);
  log(`[Script] ${VISUALIZER_PROFILES[profile].title}: fixed synthetic inputs applied.`);
  log(`[Evidence] ${lab.events.length} writes, ${lab.triggers.length} triggers, ${lab.actions.length} dispatch outcomes.`);
  status("Fixed sequence complete. Re-run after Reset for the same observable behavior.");
  render();
});
$("advanceViz").addEventListener("click", () => {
  lab.advance(5); log(`[Time] +5 simulated seconds → ${fmt(lab.time)}s`); render();
});
$("zonesToggle").addEventListener("click", e => {
  showZones = !showZones;
  e.currentTarget.textContent = showZones ? "Hide zone overlay" : "Show zone overlay";
  e.currentTarget.setAttribute("aria-pressed", String(showZones));
  render();
});
$("bindRoute").addEventListener("click", () => {
  if (routeBound) { status("Route action already bound. Reset and rerun Familiar Route to compare."); return; }
  routeBound = true;
  lab.registerAction("demo.route_indicator", () => { host.routeCue = true; }, "demo-visual-effect");
  $("bindRoute").textContent = "Route action bound";
  status("Route host action bound. Run the Familiar Route scenario to verify the visible response.");
});
$("pulse").addEventListener("click", () => write("hallway", selected, 0.22));
$("decayFast").addEventListener("click", () => {
  lab.advance(20);
  log("[Time] Advanced 20 simulated seconds for decay comparison.");
  render();
});
$("reset").addEventListener("click", init);
$("saveViz").addEventListener("click", save);
$("restoreViz").addEventListener("click", restore);
$("exportViz").addEventListener("click", exportSummary);

init();
setDescription();
