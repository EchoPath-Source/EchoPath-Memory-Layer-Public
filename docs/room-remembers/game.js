class DemoMemoryLayer {
  constructor() {
    this.anchors = new Map();
    this.rules = [];
    this.time = 0;
    this.listeners = [];
  }

  addAnchor(anchor) {
    this.anchors.set(anchor.id, {
      decayRate: 0.022,
      reinforcementMultiplier: 1,
      memory: {},
      ...anchor,
    });
  }

  addRule(rule) {
    this.rules.push({ cooldownSeconds: 8, lastFiredAt: -Infinity, ...rule });
  }

  writeEvent(event) {
    const anchor = this.anchors.get(event.targetAnchorId);
    if (!anchor) return;
    const type = event.type;
    const strength = event.strength ?? 0.1;
    const current = anchor.memory[type] ?? 0;
    anchor.memory[type] = Math.min(1, current + strength * anchor.reinforcementMultiplier);
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
}

const memory = new DemoMemoryLayer();
const logEl = document.getElementById("log");
const metersEl = document.getElementById("meters");
const npcEl = document.getElementById("npc");

memory.addAnchor({ id: "closet", label: "Closet", decayRate: 0.016, reinforcementMultiplier: 1.2 });
memory.addAnchor({ id: "hallway", label: "Hallway", decayRate: 0.020, reinforcementMultiplier: 1.0 });
memory.addAnchor({ id: "exit", label: "Exit", decayRate: 0.018, reinforcementMultiplier: 1.0 });

memory.addRule({ anchorId: "closet", memoryType: "hiding", threshold: 0.45, actionKey: "environment.audio_shift", cooldownSeconds: 7 });
memory.addRule({ anchorId: "closet", memoryType: "hiding", threshold: 0.72, actionKey: "npc.investigate", cooldownSeconds: 10 });
memory.addRule({ anchorId: "hallway", memoryType: "danger", threshold: 0.55, actionKey: "npc.raise_alert", cooldownSeconds: 8 });

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
  log(`[EchoPath Memory] Action fired: ${trigger.actionKey} at ${trigger.anchorId} (${trigger.value.toFixed(2)})`);

  if (trigger.actionKey.includes("npc")) {
    const pos = zonePosition(trigger.anchorId);
    npcEl.style.left = pos.left;
    npcEl.style.top = pos.top;
    npcEl.classList.add("alert");
    setTimeout(() => npcEl.classList.remove("alert"), 900);
  }
});

function write(type, anchorId, strength) {
  memory.writeEvent({ type, targetAnchorId: anchorId, strength });
  const label = anchorId.charAt(0).toUpperCase() + anchorId.slice(1);
  const value = memory.getMemory(anchorId, type);
  log(`[EchoPath Memory] ${type} written to ${label}: ${value.toFixed(2)}`);
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

let last = performance.now();
function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  memory.step(dt);
  renderMeters();
  requestAnimationFrame(frame);
}

renderMeters();
requestAnimationFrame(frame);
