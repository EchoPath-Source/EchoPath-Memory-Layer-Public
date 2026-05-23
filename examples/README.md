# Examples

These examples show the public EchoPath Memory Layer integration pattern.

They are not the full production plugin or private runtime.

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

## Files

- `unity-bridge.cs` — Unity C# bridge example
- `godot-bridge.gd` — Godot bridge example
- `web-adapter.js` — browser / JavaScript adapter example
- `unity-example-scene.md` — step-by-step Unity setup

---

## Public Boundary

Use these examples to learn the pattern and prototype.

Official runtime, plugins, presets, and partner builds are distributed by EchoPath XR.

Website: https://echopathxr.com
