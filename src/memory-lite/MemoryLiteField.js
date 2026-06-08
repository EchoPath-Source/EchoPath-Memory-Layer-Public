import { MemoryAnchor, distance3, normalizePosition } from "./MemoryAnchor.js";
import { MemoryZone } from "./MemoryZone.js";

const DEFAULT_CHANNELS = [
  "presence",
  "hiding",
  "sound",
  "danger",
  "safe",
  "route",
  "object",
  "reward",
  "territory",
  "custom",
];

export class MemoryLiteField {
  constructor({ decayRate = 0.02, reinforcementMultiplier = 1, channels = DEFAULT_CHANNELS } = {}) {
    this.decayRate = Number(decayRate);
    this.reinforcementMultiplier = Number(reinforcementMultiplier);
    this.channels = new Set(channels);
    this.anchors = new Map();
    this.zones = new Map();
    this.time = 0;
    this.triggerLog = [];
    this.triggerCallbacks = new Set();
    this.cooldowns = new Map();
  }

  addAnchor(anchorLike) {
    const anchor = anchorLike instanceof MemoryAnchor ? anchorLike : new MemoryAnchor(anchorLike);
    this.anchors.set(anchor.id, anchor);
    return anchor;
  }

  getAnchor(anchorId) {
    return this.anchors.get(anchorId) ?? null;
  }

  addZone(zoneLike) {
    const zone = zoneLike instanceof MemoryZone ? zoneLike : new MemoryZone(zoneLike);
    this.zones.set(zone.id, zone);
    for (const anchor of zone.anchors.values()) {
      this.anchors.set(anchor.id, anchor);
    }
    return zone;
  }

  getZone(zoneId) {
    return this.zones.get(zoneId) ?? null;
  }

  queryZoneMemory(zoneId, query = {}) {
    const zone = this.getZone(zoneId);
    if (!zone) return null;
    return zone.queryMemory(query);
  }

  onTrigger(callback) {
    if (typeof callback !== "function") {
      throw new Error("onTrigger requires a callback function.");
    }
    this.triggerCallbacks.add(callback);
    return () => this.triggerCallbacks.delete(callback);
  }

  writeEngram({ anchorId = null, position = null, eventType, channel = eventType, strength = 0.1, source = "unknown", tags = [], radius = Infinity, metadata = {} } = {}) {
    const target = anchorId ? this.getAnchor(anchorId) : this.findNearestAnchor(position, radius);
    if (!target) {
      return { written: false, reason: "no_anchor_found" };
    }

    return this.writeEvent({
      type: channel,
      targetAnchorId: target.id,
      position: position ?? target.position,
      strength,
      source,
      tags,
      metadata,
    });
  }

  writeEvent({ type, targetAnchorId, strength = 0.1, source = "unknown", position = null, tags = [], metadata = {} } = {}) {
    if (!type || typeof type !== "string") {
      throw new Error("writeEvent requires a string type.");
    }
    if (!targetAnchorId || typeof targetAnchorId !== "string") {
      throw new Error("writeEvent requires targetAnchorId.");
    }

    const anchor = this.getAnchor(targetAnchorId);
    if (!anchor) {
      return { written: false, reason: "unknown_anchor" };
    }

    const safeStrength = Math.max(0, Number(strength));
    const previous = Number(anchor.memory[type] ?? 0);
    const gain = safeStrength * anchor.reinforcementMultiplier * this.reinforcementMultiplier;
    anchor.memory[type] = previous + gain;

    const event = {
      type,
      source,
      targetAnchorId,
      strength: safeStrength,
      position: normalizePosition(position ?? anchor.position),
      tags: [...tags],
      metadata: { ...metadata },
      time: this.time,
    };

    const triggers = this.evaluateThresholds(anchor, type);
    return { written: true, anchorId: anchor.id, memoryValue: anchor.memory[type], event, triggers };
  }

  step(deltaTime = 1) {
    const dt = Math.max(0, Number(deltaTime));
    this.time += dt;

    for (const anchor of this.anchors.values()) {
      const anchorDecay = Math.max(0, Math.min(1, anchor.decayRate || this.decayRate));
      const factor = Math.max(0, 1 - anchorDecay * dt);
      for (const channel of Object.keys(anchor.memory)) {
        anchor.memory[channel] = Math.max(0, Number(anchor.memory[channel]) * factor);
      }
      for (const channel of Object.keys(anchor.memory)) {
        this.evaluateThresholds(anchor, channel);
      }
    }
  }

  getMemory(anchorId, channel) {
    const anchor = this.getAnchor(anchorId);
    if (!anchor) return 0;
    return Number(anchor.memory[channel] ?? 0);
  }

  findNearestAnchor(position, radius = Infinity) {
    if (!position) return null;
    let best = null;
    let bestDistance = Infinity;
    for (const anchor of this.anchors.values()) {
      const distance = distance3(position, anchor.position);
      const maxDistance = Math.min(Number(radius), anchor.radius || Infinity);
      if (distance <= maxDistance && distance < bestDistance) {
        best = anchor;
        bestDistance = distance;
      }
    }
    return best;
  }

  queryMemory({ position, radius = 5, type = null } = {}) {
    const query = normalizePosition(position);
    const totals = {};
    let strongestAnchor = null;
    let strongestValue = 0;

    for (const anchor of this.anchors.values()) {
      const distance = distance3(query, anchor.position);
      if (distance > radius) continue;
      const weight = 1 - distance / Math.max(radius, 0.0001);
      const channels = type ? [type] : Object.keys(anchor.memory);
      for (const channel of channels) {
        const weighted = Number(anchor.memory[channel] ?? 0) * weight;
        totals[channel] = (totals[channel] ?? 0) + weighted;
        if (weighted > strongestValue) {
          strongestValue = weighted;
          strongestAnchor = anchor;
        }
      }
    }

    const danger = Number(totals.danger ?? 0);
    const familiarity = Number((totals.safe ?? 0) + (totals.route ?? 0) + (totals.presence ?? 0));
    const curiosity = Number((totals.hiding ?? 0) + (totals.sound ?? 0) + (totals.object ?? 0));

    return {
      totals,
      danger,
      familiarity,
      curiosity,
      strongestAnchorId: strongestAnchor?.id ?? null,
      strongestAnchorLabel: strongestAnchor?.label ?? null,
      gradientTarget: strongestAnchor ? { ...strongestAnchor.position } : null,
      suggestedAction: suggestAction({ danger, familiarity, curiosity, type }),
    };
  }

  getLocalMemoryGradient(query) {
    return this.queryMemory(query);
  }

  saveState({ metadata = {} } = {}) {
    return {
      schema: "echopath.memory_lite_state",
      version: "0.1.0",
      savedAt: new Date().toISOString(),
      engine: "memory-lite",
      time: this.time,
      metadata: { ...metadata },
      anchors: [...this.anchors.values()].map(anchor => anchor.toJSON()),
      zones: [...this.zones.values()].map(zone => zone.toJSON()),
      triggerLog: this.triggerLog.map(trigger => ({ ...trigger })),
    };
  }

  loadState(state = {}) {
    if (state.schema && state.schema !== "echopath.memory_lite_state") {
      throw new Error(`Unsupported memory-lite state schema: ${state.schema}`);
    }
    this.time = Number(state.time ?? 0);
    this.anchors.clear();
    this.zones.clear();
    for (const anchor of state.anchors ?? []) {
      this.addAnchor(anchor);
    }
    for (const zoneLike of state.zones ?? []) {
      const anchors = (zoneLike.anchors ?? []).map(anchorLike => this.getAnchor(anchorLike.id) ?? anchorLike);
      this.addZone({ ...zoneLike, anchors });
    }
    this.triggerLog = (state.triggerLog ?? []).map(trigger => ({ ...trigger }));
    this.cooldowns.clear();
    return this;
  }

  serialize() {
    return JSON.stringify(this.saveState());
  }

  static loadState(state, options = {}) {
    return new MemoryLiteField(options).loadState(state);
  }

  static deserialize(json, options = {}) {
    return MemoryLiteField.loadState(JSON.parse(json), options);
  }

  evaluateThresholds(anchor, channel) {
    const value = Number(anchor.memory[channel] ?? 0);
    const fired = [];
    for (const rule of anchor.thresholdRules ?? []) {
      const ruleChannels = getRuleChannels(rule);
      if (ruleChannels.length === 0 || !ruleChannels.includes(channel)) continue;
      if (value < Number(rule.threshold ?? Infinity)) continue;
      if (!this.canFire(rule, anchor)) continue;

      const trigger = {
        time: this.time,
        anchorId: anchor.id,
        anchorLabel: anchor.label,
        memoryType: channel,
        value,
        ruleId: rule.id ?? `${anchor.id}.${channel}`,
        actionKey: rule.actionKey ?? null,
        threshold: Number(rule.threshold),
      };
      this.triggerLog.push(trigger);
      this.markFired(rule, anchor);
      fired.push(trigger);
      for (const callback of this.triggerCallbacks) {
        callback({ trigger, anchor: anchor.toJSON() });
      }
    }
    return fired;
  }

  canFire(rule, anchor) {
    const key = `${anchor.id}:${rule.id ?? rule.actionKey ?? "rule"}`;
    const mode = rule.mode ?? "cooldown";
    if (mode === "repeat") return true;
    const last = this.cooldowns.get(key);
    if (mode === "once") return last === undefined;
    const cooldown = Number(rule.cooldownSeconds ?? 0);
    return last === undefined || this.time - last >= cooldown;
  }

  markFired(rule, anchor) {
    const key = `${anchor.id}:${rule.id ?? rule.actionKey ?? "rule"}`;
    this.cooldowns.set(key, this.time);
  }
}

function getRuleChannels(rule) {
  if (Array.isArray(rule.memoryTypes)) {
    return rule.memoryTypes.filter(memoryType => typeof memoryType === "string");
  }
  return [rule.memoryType, rule.channel].filter(memoryType => typeof memoryType === "string");
}

function suggestAction({ danger, familiarity, curiosity, type }) {
  if (danger > 0.6) return "avoid or prepare";
  if (curiosity > 0.45 || type === "hiding" || type === "sound") return "investigate memory hotspot";
  if (familiarity > 0.45) return "prefer familiar route";
  return "observe";
}
