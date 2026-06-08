# Examples

These examples show the public EchoPath Memory Layer integration pattern.

They are not the full production plugin or private runtime.

---

## Phase 1 Positioning

These examples are learning references. The current Phase 1 product release is browser demos, public product wrappers, starter preset summaries, and the Memory Ledger Export baseline. Unity and Godot examples are parked later-phase adapter references, not production plugin releases.

---

## Example: The Closet Investigates

### Setup

- Unity scene with a closet zone and NPC
- Write hiding memory when the player enters the closet
- Rule: if hiding memory exceeds `0.72`, trigger `npc.investigate`

### Output Console

```text
[EchoPath Memory] Hiding written to Closet: 0.18
[EchoPath Memory] Hiding written to Closet: 0.36
[EchoPath Memory] Hiding written to Closet: 0.54
[EchoPath Memory] Action fired: environment.audio_shift at Closet (0.54)
[EchoPath Memory] Hiding written to Closet: 0.72
[EchoPath Memory] Action fired: npc.investigate at Closet (0.72)
```

### Game Behavior

- NPC notices the closet
- NPC walks over and investigates
- Ambient audio changes to suspicious
- Future hiding can be tuned to make the NPC respond faster

---

## Memory Lite examples

- `memory-lite-basic.js` — Node-only Memory Lite anchor, engram, trigger, query, and restore example.
- `memory-lite-preset-summary.js` — Node-only starter preset summary example that loads `presets/starter/preset-summary.json`, creates public-safe preset anchors, groups them in a `MemoryZone`, writes sample engrams, queries memory, prints triggers, and saves a local state snapshot.

Run them with:

```bash
node examples/memory-lite-basic.js
node examples/memory-lite-preset-summary.js
```

## Files

- `unity-bridge.cs` — Unity C# bridge example
- `godot-bridge.gd` — Godot bridge example
- `web-adapter.js` — browser / JavaScript adapter example
- `memory-lite-basic.js` — Memory Lite runtime preview example
- `memory-lite-preset-summary.js` — starter preset summary integration example
- `unity-example-scene.md` — step-by-step Unity setup

---

## Public Boundary

Use these examples to learn the pattern and prototype.

Production runtime internals, paid plugin source, private tuning constants, EchoPath Neuro implementation, protected future-stack internals, and partner builds are not included here. Official runtime, paid products, and partner support are distributed by EchoPath XR.

Website: https://echopathxr.com
