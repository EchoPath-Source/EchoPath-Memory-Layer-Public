# EchoPath Memory Layer Public API Contract v0.2

## Purpose

This document defines the public integration contract for EchoPath Memory Layer examples.

The full production runtime may differ internally. The public API contract exists so developers can understand the intended integration pattern without exposing private runtime internals, protected research models, protected future-stack internals, or paid plugin source.

---

## Core Loop

```text
Scene event -> memory anchor -> decay / reinforcement -> threshold response -> agent query -> game behavior
```

Example:

```text
Player hides in closet repeatedly
  -> closet.hiding accumulates
  -> threshold fires
  -> NPC queries local memory
  -> NPC investigates closet
```

---

## Core Objects

## Memory Anchor

A spatial zone, object, waypoint, route, or region that can accumulate memory.

```js
{
  id: "closet",
  label: "Closet",
  position: { x: 7, y: 2, z: 0 },
  radius: 1,
  decayRate: 0.02,
  reinforcementMultiplier: 1.2,
  memory: {},
  tags: ["hide_spot"],
  metadata: {}
}
```

## Engram Event

A memory-writing event. Public demos should prefer `writeEngram(...)`, which may target by anchor ID or by nearest position.

```js
{
  type: "hiding",
  source: "player",
  targetAnchorId: "closet",
  position: { x: 7, y: 2, z: 0 },
  strength: 0.18,
  tags: ["player_behavior"],
  metadata: {}
}
```

## Threshold Rule

A rule that fires when a memory value crosses a threshold.

```js
{
  id: "closet_investigate",
  anchorId: "closet",
  memoryType: "hiding",
  threshold: 0.72,
  actionKey: "npc.investigate",
  mode: "cooldown",
  cooldownSeconds: 14
}
```

---

## Suggested Public Methods

```js
addAnchor(anchor)
writeEngram({ anchorId, position, eventType, strength, source, tags, radius })
writeEvent(event)
step(deltaTime)
getAnchor(id)
getMemory(anchorId, memoryType)
getLocalMemoryGradient({ position, radius, type })
onTrigger(callback)
saveState()
loadState(state)
serialize()
deserialize(json)
```

Beginner rule: use `writeEngram(...)` first. Use `writeEvent(...)` only when you need explicit anchor targeting, adapter control, or deterministic replay.

---

## addAnchor(anchor)

Adds a memory-bearing room, object, path, waypoint, or region.

---

## writeEngram(options)

Developer-friendly event writer.

```js
memory.writeEngram({
  position: player.position,
  eventType: "hiding",
  strength: 0.32,
  source: "player",
  tags: ["stealth", "repeat_behavior"],
  radius: 2
})
```

If `anchorId` is provided, the event writes directly to that anchor. If only `position` is provided, the system selects the nearest anchor within `radius`.

---

## writeEvent(event)

Lower-level explicit event writer. Useful for adapters and deterministic replays.

```js
memory.writeEvent({ type: "presence", targetAnchorId: "hallway", strength: 0.12 })
memory.writeEvent({ type: "hiding", targetAnchorId: "closet", strength: 0.18 })
memory.writeEvent({ type: "sound", targetAnchorId: "hallway", strength: 0.20 })
```

---

## step(deltaTime)

Advances memory decay, propagation, and trigger checks.

```js
function update(dt) {
  memory.step(dt)
}
```

Threshold timing note: writes can trigger threshold rules immediately at the current field time. Thresholds are also evaluated during `step(deltaTime)` after decay updates.

---

## getMemory(anchorId, memoryType)

Returns the current memory value for a given anchor and type.

```js
const hiding = memory.getMemory("closet", "hiding")
```

---

## getLocalMemoryGradient(query)

Agent-facing query interface. NPCs can call this every few frames to convert spatial memory into behavior.

```js
const readout = memory.getLocalMemoryGradient({
  position: npc.position,
  radius: 5,
  type: "hiding"
})
```

Suggested response shape:

```js
{
  totals: { hiding: 0.74, sound: 0.12 },
  danger: 0.10,
  familiarity: 0.41,
  curiosity: 0.72,
  strongestAnchorId: "closet",
  strongestAnchorLabel: "Closet",
  gradientTarget: { x: 7, y: 2, z: 0 },
  suggestedAction: "investigate memory hotspot"
}
```

---

## onTrigger(callback)

Receives threshold responses.

```js
memory.onTrigger((event) => {
  if (event.trigger.actionKey === "npc.investigate") {
    sendNpcTo(event.trigger.anchorId)
  }
})
```

---

## Save / Load Memory State

Cross-session memory should use versioned state envelopes.

```js
const snapshot = {
  schema: "echopath.memory_state",
  version: "0.1.0",
  savedAt: new Date().toISOString(),
  engine: "memory-lite",
  metadata: {},
  field: memory.saveState()
}
```

Later:

```js
const restored = MemoryField.loadState(snapshot.field)
```

For public examples, save/load is local and developer-controlled. Production plugin builds may add cloud sync, project-specific schema migrations, replay logs, and engine-native persistence.

---

## API Stability

The current public API contract is draft v0.2. During the v0.x examples phase:

- documented method names should remain stable unless a change is noted;
- beginner examples should prefer `writeEngram(...)`;
- `writeEvent(...)` remains the lower-level adapter/replay path;
- save/load examples should use the versioned snapshot envelope;
- adapter behavior should follow `docs/ADAPTER_CONTRACT.md`.

See also: `docs/VERSIONING.md`.

---

## Public vs Private

Public API:

- stable method names
- configuration schema
- memory anchor pattern
- event writer pattern
- agent query contract
- trigger contract
- save/load shape

Private implementation:

- optimized production runtime internals
- paid plugin source
- protected research engines
- experimental research models
- protected future-stack internals
- partner-specific builds

---

## Status

Draft API contract for public examples and early adopters. This API is intended as the public-facing Memory Lite surface, not the full private engine.

Next reads:

```text
docs/RECIPES.md
docs/ADAPTER_CONTRACT.md
docs/VERSIONING.md
```
