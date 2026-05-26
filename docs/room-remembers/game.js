class DemoMemoryLayer {
  constructor() {
    this.anchors = new Map();
    this.rules = [];
    this.time = 0;
    this.listeners = [];
  }

  addAnchor(anchor) {
    this.anchors.set(anchor.id, {
      position: { x: 0, y: 0, z: 0 },
      radius: 1,
      decayRate: 0.022,
      reinforcementMultiplier: 1,
      memory: {},
      eventHistory: [],
      tags: [],
      metadata: {},
      ...anchor,
    });
  }

  addRule(rule) {
    this.rules.push({ cooldownSeconds: 8, lastFiredAt: -Infinity, ...rule });
  }

  writeEvent(event) {
    const anchor = this.anchors.get(event.targetAnchorId);
    if (!anchor) return null;

    const type = event.type ?? "custom";
    const strength = event.strength ?? 0.1;
    const current = anchor.memory[type] ?? 0;
    const repeatCount = anchor.eventHistory.filter((evt) => evt.type === type).length;
    const reinforcement = 1 + repeatCount * 0.04;

    anchor.memory[type] = Math.min(1, current + strength * anchor.reinforcementMultiplier * reinforcement);
    anchor.eventHistory.push({
      id: `evt_${Math.random().toString(36).slice(2, 9)}`,
      timestamp: this.time,
      type,
      source: event.source ?? "demo",
      targetAnchorId: anchor.id,
      strength,
      tags: [...(event.tags ?? [])],
    });
    anchor.eventHistory = anchor.eventHistory.slice(-24);
    this.checkRules();
    return anchor;
  }

  writeEngram({ anchorId = null, position = null, eventType = "custom", strength = 0.1, source = "demo", tags = [], radius = Infinity } = {}) {
    let targetAnchorId = anchorId;
    if (!targetAnchorId && position) {
      const nearest = this.getNearestAnchor(position, radius);
      targetAnchorId = nearest?.id;
    }
    if (!targetAnchorId) return null;
    return this.writeEvent({
      type: eventType,
      targetAnchorId,
      position,
      strength,
      source,
      tags,
    });
  }

  getNearestAnchor(position, radius = Infinity) {
    let best = null;
    let bestDistance = Infinity;
    for (const anchor of this.anchors.values()) {
      const d = this.distance(position, anchor.position);
      if (d <= radius && d < bestDistance) {
        best = anchor;
        bestDistance = d;
      }
    }
    return best;
  }

  getNearbyAnchors(position, radius) {
    return [...this.anchors.values()].filter((anchor) => this.distance(position, anchor.position) <= radius);
  }

  getLocalMemoryGradient({ position, radius = 5, type = null }) {
    const totals = {};
    const nearby = this.getNearbyAnchors(position, radius);
    let strongestAnchor = null;
    let strongestScore = 0;
    let weighted = { x: 0, y: 0, z: 0 };
    let totalWeight = 0;

    for (const anchor of nearby) {
      const d = this.distance(position, anchor.position);
      const proximity = Math.max(0, 1 - d / radius);
      const memoryEntries = type ? [[type, anchor.memory[type] ?? 0]] : Object.entries(anchor.memory);
      for (const [memoryType, value] of memoryEntries) {
        const score = value * proximity;
        totals[memoryType] = (totals[memoryType] ?? 0) + score;
        if (score > strongestScore) {
          strongestScore = score;
          strongestAnchor = anchor;
        }
        weighted.x += anchor.position.x * score;
        weighted.y += anchor.position.y * score;
        weighted.z += (anchor.position.z ?? 0) * score;
        totalWeight += score;
      }
    }

    const danger = Math.min(1, totals.danger ?? totals.combat ?? 0);
    const familiarity = Math.min(1, (totals.presence ?? 0) + (totals.route ?? 0) + (totals.safe ?? 0));
    const curiosity = Math.min(1, (totals.hiding ?? 0) + (totals.sound ?? 0) + strongestScore * 0.5);
    const gradientTarget = totalWeight > 0
      ? { x: weighted.x / totalWeight, y: weighted.y / totalWeight, z: weighted.z / totalWeight }
      : null;

    return {
      totals,
      danger,
      familiarity,
      curiosity,
      strongestAnchorId: strongestAnchor?.id ?? null,
      strongestAnchorLabel: strongestAnchor?.label ?? null,
      strongestScore: Math.min(1, strongestScore),
      gradientTarget,
      suggestedAction: this.suggestAction({ danger, familiarity, curiosity, strongestAnchor }),
    };
  }

  suggestAction({ danger, familiarity, curiosity, strongestAnchor }) {
    if (!strongestAnchor) return "patrol";
    if (danger >= 0.65) return "avoid / raise alert";
    if (curiosity >= 0.55) return "investigate memory hotspot";
    if (familiarity >= 0.55) return "predict repeated route";
    return "patrol";
  }

  step(deltaTime) {
    this.time += deltaTime;
    for (const anchor of this.anchors.values()) {
      for (const type of Object.keys(anchor.memory)) {
        anchor.memory[type] *= Math.exp(-anchor.decayRate * deltaTime);
        if (anchor.memory[type] < 0.001) delete anchor.memory[type];
      }
    }
    this.checkRules();
  }

  getMemory(anchorId, type) {
    return this.anchors.get(anchorId)?.memory[type] ?? 0;
  }

  onTrigger(callback) {
    this.listeners.push(callback);
  }

  checkRules() {
    for (const rule of this.rules) {
      const value = this.getMemory(rule.anchorId, rule.memoryType);
      const canFire = this.time - rule.lastFiredAt >= rule.cooldownSeconds;
      if (value >= rule.threshold && canFire) {
        rule.lastFiredAt = this.time;
        this.listeners.forEach((cb) => cb({ ...rule, value, time: this.time }));
      }
    }
  }

  distance(a, b) {
    const dx = (a.x ?? 0) - (b.x ?? 0);
    const dy = (a.y ?? 0) - (b.y ?? 0);
    const dz = (a.z ?? 0) - (b.z ?? 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

const memory = new DemoMemoryLayer();
const logEl = document.getElementById("log");
const metersEl = document.getElementById("meters");
const npcEl = document.getElementById("npc");

memory.addAnchor({ id: "closet", label: "Closet", position: { x: 1, y: 1, z: 0 }, decayRate: 0.016, reinforcementMultiplier: 1.2, tags: ["hide_spot"] });
memory.addAnchor({ id: "hallway", label: "Hallway", position: { x: 4, y: 2.5, z: 0 }, decayRate: 0.020, reinforcementMultiplier: 1.0, tags: ["route"] });
memory.addAnchor({ id: "exit", label: "Exit", position: { x: 7, y: 4, z: 0 }, decayRate: 0.018, reinforcementMultiplier: 1.0, tags: ["safe_zone"] });

memory.addRule({ anchorId: "closet", memoryType: "hiding", threshold: 0.45, actionKey: "environment.audio_shift", cooldownSeconds: 7 });
memory.addRule({ anchorId: "closet", memoryType: "hiding", threshold: 0.72, actionKey: "npc.investigate", cooldownSeconds: 10 });
memory.addRule({ anchorId: "hallway", memoryType: "danger", threshold: 0.55, actionKey: "npc.raise_alert", cooldownSeconds: 8 });
memory.addRule({ anchorId: "hallway", memoryType: "route", threshold: 0.50, actionKey: "npc.predict_route", cooldownSeconds: 9 });

function log(message) {
  logEl.textContent += `${message}\n`;
  logEl.scrollTop = logEl.scrollHeight;
}

function zonePosition(anchorId) {
  const zone = document.getElementById(anchorId);
  const world = document.getElementById("world");
  const z = zone.getBoundingClientRect();
  const w = world.getBoundingClientRect();
  return {
    left: `${((z.left + z.width / 2 - w.left) / w.width) * 100}%`,
    top: `${((z.top + z.height / 2 - w.top) / w.height) * 100}%`,
  };
}

memory.onTrigger((trigger) => {
  log(`[EchoPath Memory] Threshold fired: ${trigger.actionKey} at ${trigger.anchorId} (${trigger.value.toFixed(2)})`);

  if (trigger.actionKey.includes("npc")) {
    const pos = zonePosition(trigger.anchorId);
    npcEl.style.left = pos.left;
    npcEl.style.top = pos.top;
    npcEl.classList.add("alert");
    setTimeout(() => npcEl.classList.remove("alert"), 900);
  }
});

function anchorPosition(anchorId) {
  return memory.anchors.get(anchorId)?.position ?? { x: 0, y: 0, z: 0 };
}

function write(type, anchorId, strength) {
  const anchor = memory.writeEngram({
    anchorId,
    position: anchorPosition(anchorId),
    eventType: type,
    strength,
    source: "demo_user",
    tags: ["public_demo"],
  });
  if (!anchor) return;
  const value = memory.getMemory(anchorId, type);
  log(`[EchoPath Memory] writeEngram(${type}) -> ${anchor.label}: ${value.toFixed(2)}`);
  renderNpcQuery();
}

document.querySelectorAll("[data-event]").forEach((button) => {
  button.addEventListener("click", () => {
    write(button.dataset.event, button.dataset.anchor, Number(button.dataset.strength));
  });
});

document.querySelectorAll(".zone").forEach((zone) => {
  zone.addEventListener("click", () => {
    const type = zone.id === "closet" ? "hiding" : zone.id === "exit" ? "safe" : "presence";
    write(type, zone.id, 0.16);
  });
});

const meterKeys = [
  ["closet", "hiding"],
  ["hallway", "sound"],
  ["hallway", "danger"],
  ["hallway", "route"],
  ["exit", "safe"],
];

function renderMeters() {
  metersEl.innerHTML = meterKeys.map(([anchor, type]) => {
    const value = memory.getMemory(anchor, type);
    return `
      <div class="meter">
        <div class="meter-label"><span>${anchor}.${type}</span><span>${value.toFixed(2)}</span></div>
        <div class="bar"><div class="fill" style="width:${Math.round(value * 100)}%"></div></div>
      </div>
    `;
  }).join("");

  for (const [anchorId] of memory.anchors) {
    const peak = Math.max(...Object.values(memory.anchors.get(anchorId).memory), 0);
    document.getElementById(anchorId)?.style.setProperty("--pulse", Math.min(0.9, peak).toFixed(2));
  }
}

function renderNpcQuery() {
  const query = memory.getLocalMemoryGradient({ position: { x: 4.2, y: 2.5, z: 0 }, radius: 5 });
  log(`[NPC Query] action=${query.suggestedAction}; curiosity=${query.curiosity.toFixed(2)}; familiarity=${query.familiarity.toFixed(2)}; danger=${query.danger.toFixed(2)}; hotspot=${query.strongestAnchorId ?? "none"}`);
}

let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  memory.step(dt);
  renderMeters();
  requestAnimationFrame(frame);
}

renderMeters();
renderNpcQuery();
requestAnimationFrame(frame);
