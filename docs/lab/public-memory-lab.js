/**
 * EchoPath Public Memory Lab — deliberately simplified educational runtime.
 *
 * PUBLIC SAFE. Independent of the private Spatial Engram Engine, its tuning,
 * source, signatures, and paid plugin implementation. No hidden networking.
 * Explicit synthetic events, state and threshold action outcomes only.
 *
 * This public reference proves observable workflows, NOT numeric parity with
 * the private engine, Unity compilation, exact replay, or autonomous NPC AI.
 */
const finite = x => typeof x === "number" && Number.isFinite(x);
const key = value => typeof value === "string" && value.trim().length > 0;
const clamp01 = x => Math.max(0, Math.min(1, x));
const copy = value => JSON.parse(JSON.stringify(value));
const sortId = (a, b) => a.id.localeCompare(b.id);

export class PublicMemoryLab {
  constructor({ historyLimit = 72, defaultDecayRate = 0.025 } = {}) {
    if (!Number.isSafeInteger(historyLimit) || historyLimit < 1 || !finite(defaultDecayRate) ||
        defaultDecayRate < 0 || defaultDecayRate > 1) {
      throw new Error("Invalid public memory lab configuration");
    }
    this.historyLimit = historyLimit;
    this.defaultDecayRate = defaultDecayRate;
    this.time = 0;
    this.anchors = new Map();
    this.zones = new Map();
    this.rules = [];
    this.handlers = new Map();
    this.observers = new Set();
    this.events = [];
    this.triggers = [];
    this.actions = [];
    this.droppedEvents = 0;
    this.nextEvent = 1;
  }

  addAnchor({ id, label = id, x = 0, y = 0, z = 0, decayRate = this.defaultDecayRate,
              memory = {} } = {}) {
    if (!key(id) || this.anchors.has(id) || !finite(x) || !finite(y) || !finite(z) ||
        !finite(decayRate) || decayRate < 0 || decayRate > 1 ||
        !memory || typeof memory !== "object" || Array.isArray(memory) ||
        Object.values(memory).some(v => !finite(v) || v < 0 || v > 1)) {
      throw new Error("Invalid or duplicate public anchor");
    }
    const anchor = { id, label: String(label), x, y, z, decayRate, memory: { ...memory } };
    this.anchors.set(id, anchor);
    return anchor;
  }

  addZone({ id, label = id, anchorIds = [] } = {}) {
    if (!key(id) || this.zones.has(id) || !Array.isArray(anchorIds) ||
        new Set(anchorIds).size !== anchorIds.length ||
        anchorIds.some(anchorId => !this.anchors.has(anchorId))) {
      throw new Error("Invalid or duplicate public zone membership");
    }
    const zone = { id, label: String(label), anchorIds: [...anchorIds].sort() };
    this.zones.set(id, zone);
    return zone;
  }

  addRule({ id, anchorId, channel, threshold, mode = "once", actionKey,
            cooldownSeconds = 0 } = {}) {
    if (!key(id) || !this.anchors.has(anchorId) || !key(channel) || !key(actionKey) ||
        this.rules.some(r => r.id === id) || !finite(threshold) || threshold < 0 ||
        threshold > 1 || !["once", "repeat", "cooldown"].includes(mode) ||
        !finite(cooldownSeconds) || cooldownSeconds < 0) {
      throw new Error("Invalid public threshold rule");
    }
    const rule = { id, anchorId, channel, threshold, mode, actionKey, cooldownSeconds,
                   hasFired: false, lastFiredAt: null };
    this.rules.push(rule);
    return rule;
  }

  registerAction(actionKey, handler, type = "world-state") {
    if (!key(actionKey) || typeof handler !== "function" ||
        handler.constructor?.name === "AsyncFunction" || !key(type) ||
        this.handlers.has(actionKey)) {
      throw new Error("Invalid or duplicate public action binding");
    }
    const binding = { handler, type };
    this.handlers.set(actionKey, binding);
    return () => this.handlers.get(actionKey) === binding && this.handlers.delete(actionKey);
  }

  onTrigger(callback) {
    if (typeof callback !== "function") throw new Error("Expected trigger callback");
    this.observers.add(callback);
    return () => this.observers.delete(callback);
  }

  write(anchorId, channel, strength, source = "demo_visitor") {
    const anchor = this.anchors.get(anchorId);
    if (!anchor || !key(channel) || !finite(strength) || strength < 0 || !key(source)) {
      throw new Error("Invalid public memory write");
    }
    const before = anchor.memory[channel] ?? 0;
    anchor.memory[channel] = clamp01(before + strength);
    const event = {
      id: `demo_event_${String(this.nextEvent++).padStart(4, "0")}`,
      time: this.time, anchorId, channel, strength, source,
    };
    this.events.push(event);
    if (this.events.length > this.historyLimit) {
      const dropped = this.events.length - this.historyLimit;
      this.events.splice(0, dropped);
      this.droppedEvents += dropped;
    }
    const triggers = this.evaluate(anchorId, channel);
    return { event: { ...event }, value: anchor.memory[channel], triggers };
  }

  evaluate(anchorId, channel) {
    const anchor = this.anchors.get(anchorId);
    const fired = [];
    for (const rule of this.rules) {
      if (rule.anchorId !== anchorId || rule.channel !== channel) continue;
      const value = anchor.memory[channel] ?? 0;
      if (value < rule.threshold) continue;
      const allowed = rule.mode === "repeat" ||
        (rule.mode === "once" && !rule.hasFired) ||
        (rule.mode === "cooldown" &&
          (rule.lastFiredAt === null || this.time - rule.lastFiredAt >= rule.cooldownSeconds));
      if (!allowed) continue;
      rule.hasFired = true;
      rule.lastFiredAt = this.time;
      const trigger = {
        time: this.time, anchorId, channel, ruleId: rule.id,
        actionKey: rule.actionKey, threshold: rule.threshold, value,
      };
      this.triggers.push(trigger);
      fired.push({ ...trigger });
      this.dispatch(trigger);
      for (const observer of this.observers) {
        // Demo observers should not break the memory engine.
        try { observer({ ...trigger }); } catch { /* local presentation only */ }
      }
    }
    return fired;
  }

  dispatch(trigger) {
    const binding = this.handlers.get(trigger.actionKey);
    const entry = {
      time: this.time, actionKey: trigger.actionKey, ruleId: trigger.ruleId,
      anchorId: trigger.anchorId, type: binding?.type ?? null,
      status: binding ? "handled" : "unhandled",
      reason: binding ? null : "no_host_binding",
    };
    if (binding) {
      try {
        const result = binding.handler(Object.freeze({ ...trigger }));
        if (result && typeof result.then === "function") {
          Promise.resolve(result).catch(() => {});
          entry.status = "failed";
          entry.reason = "async_handler_unsupported";
        }
      } catch {
        entry.status = "failed";
        entry.reason = "host_handler_error";
      }
    }
    this.actions.push(entry);
    return { ...entry };
  }

  advance(seconds) {
    if (!finite(seconds) || seconds < 0) throw new Error("Invalid simulation time step");
    this.time += seconds;
    for (const anchor of this.anchors.values()) {
      for (const channel of Object.keys(anchor.memory)) {
        anchor.memory[channel] = clamp01(
          anchor.memory[channel] * Math.max(0, 1 - anchor.decayRate * seconds),
        );
        this.evaluate(anchor.id, channel);
      }
    }
    return this.time;
  }

  getMemory(anchorId, channel) {
    return this.anchors.get(anchorId)?.memory[channel] ?? 0;
  }

  getZoneTotals(zoneId, { channel = null } = {}) {
    const zone = this.zones.get(zoneId);
    if (!zone) throw new Error("Unknown public zone");
    const totals = {};
    for (const id of zone.anchorIds) {
      const anchor = this.anchors.get(id);
      const channels = channel ? [channel] : Object.keys(anchor.memory);
      for (const item of channels) {
        totals[item] = (totals[item] ?? 0) + (anchor.memory[item] ?? 0);
      }
    }
    return totals;
  }

  queryZone(zoneId, { x = null, y = null, radius = Infinity, channel = null } = {}) {
    const zone = this.zones.get(zoneId);
    if (!zone || (x !== null && !finite(x)) || (y !== null && !finite(y)) ||
        !(radius > 0) || typeof radius !== "number" || Number.isNaN(radius)) {
      throw new Error("Invalid public zone query");
    }
    const positioned = x !== null && y !== null;
    const totals = {};
    let strongestAnchorId = null, strongestScore = 0;
    for (const id of zone.anchorIds) {
      const anchor = this.anchors.get(id);
      const d = positioned ? Math.hypot(anchor.x - x, anchor.y - y) : 0;
      if (d > radius) continue;
      const proximity = Number.isFinite(radius) ? Math.max(0, 1 - d / radius) : 1;
      for (const item of channel ? [channel] : Object.keys(anchor.memory)) {
        const score = (anchor.memory[item] ?? 0) * proximity;
        totals[item] = (totals[item] ?? 0) + score;
        if (score > strongestScore || (score > 0 && score === strongestScore &&
            (strongestAnchorId === null || id < strongestAnchorId))) {
          strongestScore = score;
          strongestAnchorId = id;
        }
      }
    }
    return { zoneId, totals, strongestAnchorId };
  }

  snapshot() {
    return {
      schema: "echopath.public_memory_lab", version: "0.1.0", time: this.time,
      historyLimit: this.historyLimit, defaultDecayRate: this.defaultDecayRate,
      anchors: [...this.anchors.values()].sort(sortId).map(a => copy(a)),
      zones: [...this.zones.values()].sort(sortId).map(z => copy(z)),
      rules: this.rules.map(r => ({ ...r })), events: this.events.map(e => ({ ...e })),
      droppedEvents: this.droppedEvents, nextEvent: this.nextEvent,
      triggers: this.triggers.map(t => ({ ...t })),
      actions: this.actions.map(a => ({ ...a })),
    };
  }

  restore(snapshot) {
    // Build and validate independently; never mutate a live field before
    // the complete candidate (including zone refs and rule states) is valid.
    const s = typeof snapshot === "string" ? JSON.parse(snapshot) : snapshot;
    if (!s || s.schema !== "echopath.public_memory_lab" || s.version !== "0.1.0" ||
        !finite(s.time) || s.time < 0 || !Number.isSafeInteger(s.nextEvent) || s.nextEvent < 1 ||
        !Number.isSafeInteger(s.droppedEvents) || s.droppedEvents < 0 ||
        !Array.isArray(s.anchors) || !Array.isArray(s.zones) || !Array.isArray(s.rules) ||
        !Array.isArray(s.events) || !Array.isArray(s.triggers) || !Array.isArray(s.actions) ||
        s.anchors.length > 100 || s.zones.length > 100) {
      throw new Error("Invalid public lab snapshot");
    }
    const candidate = new PublicMemoryLab({
      historyLimit: s.historyLimit, defaultDecayRate: s.defaultDecayRate,
    });
    for (const a of s.anchors) candidate.addAnchor(a);
    for (const z of s.zones) candidate.addZone(z);
    for (const r of s.rules) {
      const target = candidate.addRule(r);
      if (typeof r.hasFired !== "boolean" ||
          (r.lastFiredAt !== null && (!finite(r.lastFiredAt) ||
            r.lastFiredAt < 0 || r.lastFiredAt > s.time))) {
        throw new Error("Invalid public rule snapshot");
      }
      target.hasFired = r.hasFired;
      target.lastFiredAt = r.lastFiredAt;
    }
    if (s.events.length > candidate.historyLimit || s.events.some(e =>
        !candidate.anchors.has(e.anchorId) || !key(e.channel) || !finite(e.time) ||
        e.time < 0 || e.time > s.time || !finite(e.strength) || e.strength < 0)) {
      throw new Error("Invalid public event history");
    }
    if (s.triggers.some(t => !candidate.anchors.has(t.anchorId) ||
        !finite(t.time) || t.time < 0 || t.time > s.time) ||
        s.actions.some(a => !key(a.actionKey) || !finite(a.time) ||
        a.time < 0 || a.time > s.time)) {
      throw new Error("Invalid public trigger/action history");
    }
    candidate.time = s.time;
    candidate.events = copy(s.events);
    candidate.triggers = copy(s.triggers);
    candidate.actions = copy(s.actions);
    candidate.droppedEvents = s.droppedEvents;
    candidate.nextEvent = s.nextEvent;

    this.time = candidate.time;
    this.historyLimit = candidate.historyLimit;
    this.defaultDecayRate = candidate.defaultDecayRate;
    this.anchors = candidate.anchors;
    this.zones = candidate.zones;
    this.rules = candidate.rules;
    this.events = candidate.events;
    this.triggers = candidate.triggers;
    this.actions = candidate.actions;
    this.droppedEvents = candidate.droppedEvents;
    this.nextEvent = candidate.nextEvent;
    // Registered host callbacks and observers intentionally remain active.
    return this;
  }

  report() {
    return {
      schema: "echopath.public_memory_lab_summary", version: "0.1.0",
      educationalPreview: true, completeSimulationReplay: false,
      time: this.time, anchorCount: this.anchors.size,
      zoneCount: this.zones.size, memoryByZone:
        Object.fromEntries([...this.zones.keys()].sort().map(id => [id, this.getZoneTotals(id)])),
      events: this.events.map(e => ({ ...e })),
      triggers: this.triggers.map(t => ({ ...t })),
      actionOutcomes: this.actions.map(a => ({ ...a })),
      retention: { retainedEvents: this.events.length, droppedEvents: this.droppedEvents,
        status: this.droppedEvents > 0 ? "truncated" : "complete-since-reset" },
    };
  }
}
