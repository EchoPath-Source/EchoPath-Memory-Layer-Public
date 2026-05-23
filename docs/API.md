# EchoPath Memory Layer Public API Contract v0.1

## Purpose

This document defines the public integration contract for EchoPath Memory Layer examples.

The full production runtime may differ internally. The public API contract exists so developers can understand the intended integration pattern.

---

## Core Objects

## Memory Anchor

A spatial zone that can accumulate memory.

```js
{
  id: "closet",
  label: "Closet",
  position: { x: 7, y: 2, z: 0 },
  radius: 1,
  decayRate: 0.02,
  reinforcementMultiplier: 1.2,
  memory: {}
}
```

## Memory Event

An event written into an anchor.

```js
{
  type: "hiding",
  source: "player",
  targetAnchorId: "closet",
  strength: 0.18,
  tags: ["player_behavior"]
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
  cooldownSeconds: 14
}
```

---

## Suggested Public Methods

```js
addAnchor(anchor)
writeEvent(event)
step(deltaTime)
getAnchor(id)
getMemory(anchorId, memoryType)
addRule(rule)
onTrigger(callback)
loadPreset(preset)
```

---

## addAnchor(anchor)

Adds a room, object, path, waypoint, or region that can accumulate memory.

---

## writeEvent(event)

Writes a memory event into the field.

Examples:

```js
writeEvent({ type: "presence", targetAnchorId: "hallway", strength: 0.12 })
writeEvent({ type: "hiding", targetAnchorId: "closet", strength: 0.18 })
writeEvent({ type: "sound", targetAnchorId: "hallway", strength: 0.20 })
```

---

## step(deltaTime)

Advances memory decay, propagation, and trigger checks.

Typical usage:

```js
function update(dt) {
  memory.step(dt)
}
```

---

## getMemory(anchorId, memoryType)

Returns the current memory value for a given anchor and type.

```js
const hiding = memory.getMemory("closet", "hiding")
```

---

## onTrigger(callback)

Receives threshold responses.

```js
memory.onTrigger((trigger) => {
  if (trigger.actionKey === "npc.investigate") {
    sendNpcTo(trigger.anchorId)
  }
})
```

---

## loadPreset(preset)

Loads a preset configuration.

Presets may define:

- anchors
- memory curves
- threshold rules
- action keys
- suggested behavior mapping

---

## Public vs Private

Public API:

- stable method names
- configuration schema
- adapter pattern
- trigger contract

Private implementation:

- optimized runtime internals
- advanced propagation
- plugin implementation
- research models
- Q-RRG / Cognition convergence

---

## Status

Draft API contract for public examples and early adopters.
