# EchoPath Memory Layer — Public Adapter Contract v0.1

## Purpose

This document defines the public adapter contract for EchoPath Memory Layer examples and future Memory Lite integrations.

Adapters translate engine-specific events into the Memory Layer pattern:

```text
engine event -> memory anchor -> engram write -> threshold / query -> game behavior
```

This is a public-facing contract only. Production plugins, private runtime internals, protected research models, protected future-stack internals, and partner builds are distributed separately.

---

## Required Adapter Responsibilities

A Memory Layer adapter should provide:

```text
initializeMemoryField(config?)
registerAnchor(engineObjectOrConfig)
writeEngramFromEngineEvent(engineEvent)
stepMemory(deltaTime)
queryAgentMemory(agentOrPosition, queryOptions?)
subscribeToTriggers(callback)
saveMemory()
loadMemory(snapshot)
```

---

## Canonical Flow

```text
Engine event
  -> adapter normalizes event
  -> memory.writeEngram(...)
  -> memory.step(dt)
  -> threshold trigger / agent query
  -> adapter maps response back into engine behavior
```

---

## Minimum Anchor Shape

```js
{
  id: "closet",
  label: "Closet",
  position: { x: 7, y: 2, z: 0 },
  radius: 1,
  decayRate: 0.02,
  reinforcementMultiplier: 1.2,
  memory: {},
  thresholdRules: [],
  tags: [],
  metadata: {}
}
```

---

## Minimum Engram Shape

```js
{
  anchorId: "closet",
  position: { x: 7, y: 2, z: 0 },
  eventType: "hiding",
  strength: 0.32,
  source: "player",
  tags: ["stealth", "repeat_behavior"],
  radius: 2,
  metadata: {}
}
```

---

## Minimum Agent Query Shape

```js
const readout = memory.getLocalMemoryGradient({
  position: npc.position,
  radius: 5,
  type: "hiding"
})
```

Suggested response:

```js
{
  totals: { hiding: 0.74 },
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

## Save / Load Snapshot Shape

```js
{
  schema: "echopath.memory_state",
  version: "0.1.0",
  savedAt: "2026-01-01T00:00:00.000Z",
  engine: "memory-lite",
  metadata: {},
  field: {}
}
```

---

## Adapter Conformance Checklist

An adapter is minimally compliant when it can:

- register at least three anchors;
- write an engram by explicit anchor;
- write an engram by nearest position;
- advance decay with `stepMemory`;
- receive a threshold trigger;
- return a local memory gradient for an agent;
- save a versioned state snapshot;
- load that snapshot and preserve anchor memory values.

---

## Recommended Adapter Order

1. Web adapter — browser demos and docs reference.
2. Godot adapter — first game-engine MVP path.
3. Unity adapter — UPM/package path after website/demo alignment.

---

## Public-Safe Handoff Targets

The public adapter contract should support these handoff patterns without exposing private runtime internals:

| Adapter direction | Public-safe payload | Notes |
|---|---|---|
| Memory Lite -> EchoNet ingest event | normalized memory event summary | Future-facing telemetry bridge; no EchoNet internals exposed. |
| Memory Lite -> Memory Ledger Export | session metadata, anchors, event summaries, channel totals, triggered actions | Public demo/QA/replay baseline. |
| Memory Ledger Export -> EchoChain sealed event candidate | ledger-style session summary | EchoGenesis / EchoChain own canonical sealed-event semantics. |
| Memory Lite -> Unity/Godot preview adapter | engine events mapped to `writeEngram`, query, trigger, save/load calls | Preview scaffold only, not paid plugin source. |
| Memory Lite -> website demo wrapper | safe demo actions and product-facing readouts | Website hosts product funnel and official downloads. |

See [`ECHOGENESIS_INTEGRATION_NOTES.md`](ECHOGENESIS_INTEGRATION_NOTES.md) for the cross-repo bridge map.

---

## Public / Private Boundary

Public adapters may expose the Memory Lite contract.

Public adapters must not expose:

```text
protected research engines
experimental research models
protected future-stack internals
private tuning parameters
paid plugin source
partner runtime code
```

---

## Anchor Statement

```text
Adapters translate engine behavior into memory events.
MemoryField turns events into persistent world memory.
Agents query that memory to behave as if the world remembers.
```
