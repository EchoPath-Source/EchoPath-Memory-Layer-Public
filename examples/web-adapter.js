// EchoPath Memory Layer — Web Adapter Example
// Public reference scaffold. Not the full production runtime.

export class SimpleMemoryLayer {
  constructor() {
    this.anchors = new Map();
    this.rules = [];
    this.time = 0;
    this.listeners = [];
  }

  addAnchor(anchor) {
    this.anchors.set(anchor.id, {
      decayRate: 0.025,
      reinforcementMultiplier: 1,
      memory: {},
      ...anchor,
    });
  }

  addRule(rule) {
    this.rules.push({
      cooldownSeconds: 10,
      lastFiredAt: -Infinity,
      ...rule,
    });
  }

  writeEvent(event) {
    const anchor = this.anchors.get(event.targetAnchorId);
    if (!anchor) return;

    const type = event.type;
    const strength = event.strength ?? 0.1;
    const current = anchor.memory[type] ?? 0;

    anchor.memory[type] = Math.min(
      1,
      current + strength * anchor.reinforcementMultiplier
    );
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
    const anchor = this.anchors.get(anchorId);
    if (!anchor) return 0;
    return anchor.memory[type] ?? 0;
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
        const trigger = {
          time: this.time,
          anchorId: rule.anchorId,
          memoryType: rule.memoryType,
          value,
          threshold: rule.threshold,
          actionKey: rule.actionKey,
        };
        this.listeners.forEach((listener) => listener(trigger));
      }
    }
  }
}

// Example usage:
//
// const memory = new SimpleMemoryLayer();
// memory.addAnchor({ id: "closet", label: "Closet", decayRate: 0.02, reinforcementMultiplier: 1.2 });
// memory.addRule({ anchorId: "closet", memoryType: "hiding", threshold: 0.72, actionKey: "npc.investigate" });
// memory.onTrigger((trigger) => console.log("Action:", trigger.actionKey));
// memory.writeEvent({ type: "hiding", targetAnchorId: "closet", strength: 0.18 });
// memory.step(0.016);
