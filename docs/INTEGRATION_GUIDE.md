# Integration Guide

## Purpose

This guide explains how to integrate the EchoPath Memory Layer pattern into a game, XR prototype, or simulation.

This public repo provides examples and documentation. The production runtime and supported plugins are distributed separately by EchoPath XR.

---

## Integration Model

```text
Game / XR event
  -> adapter
  -> memory event
  -> memory value changes
  -> threshold trigger
  -> game response
```

---

## Unity Mapping

| Game Event | Memory Call |
|---|---|
| Player enters room | `WritePresence("room")` |
| Player hides | `WriteHiding("closet")` |
| Player makes sound | `WriteSound("hallway")` |
| Enemy attacks | `WriteDanger("room")` |
| Player repeats path | `WriteRoute("path_a")` |
| Player uses safe route | `WriteSafe("exit")` |

See:

```text
examples/unity-bridge.cs
examples/unity-example-scene.md
```

---

## Godot Mapping

| Game Signal | Memory Call |
|---|---|
| `player_entered_room` | `write_presence("room")` |
| `player_hid` | `write_hiding("closet")` |
| `noise_made` | `write_sound("hallway")` |
| `danger_triggered` | `write_danger("room")` |
| `route_repeated` | `write_route("path_a")` |

See:

```text
examples/godot-bridge.gd
```

---

## Web Mapping

For browser demos, use a lightweight adapter around DOM events or game-loop events.

Example:

```js
button.addEventListener("click", () => {
  memory.writeEvent({ type: "hiding", targetAnchorId: "closet", strength: 0.18 })
})
```

See:

```text
examples/web-adapter.js
```

---

## Recommended First Build

Start with:

```text
3 anchors
2 memory types
2 rules
1 visible response
```

Example:

```text
closet: hiding memory
hallway: sound memory
exit: safe memory
```

Rules:

```text
closet.hiding > 0.45 -> audio shift
closet.hiding > 0.72 -> NPC investigate
```

---

## What Developers Control

Developers control:

- anchor placement
- event strength
- decay rate
- reinforcement multiplier
- thresholds
- action routing
- visual/audio/gameplay response

---

## What EchoPath Packages Later

Official packages may include:

- tuned runtime
- optimized propagation
- visualizer overlay
- preset loader
- Unity package
- Godot addon
- support docs
- plugin updates

---

## Cross-Repo Handoff

Public integrations should hand off summaries and normalized events, not private internals.

```text
Memory Lite / public examples
  -> public-safe memory events
  -> threshold responses
  -> preset summaries
  -> ledger-style session summaries

EchoGenesis
  -> canonical ecosystem map
  -> sealed-event semantics
  -> cross-construct architecture

EchoNet / EchoChain / Reflection Ledger
  -> future ingest, verification, audit, or telemetry surfaces
```

See [`ECHOGENESIS_INTEGRATION_NOTES.md`](ECHOGENESIS_INTEGRATION_NOTES.md) for the public-safe bridge map.

---

## Adapter Handoff Targets

Track these adapter directions as public-safe scaffolds:

- Memory Lite -> EchoNet ingest event
- Memory Lite -> Memory Ledger Export
- Memory Ledger Export -> EchoChain sealed event candidate
- Memory Lite -> Unity/Godot preview adapter
- Memory Lite -> website demo wrapper

These are handoff patterns only. They should not expose private runtime internals, tuning constants, protected research code, or partner-specific logic.

---

## Boundary

Do not treat the public examples as the full production engine.

They are reference patterns for learning and prototyping.
