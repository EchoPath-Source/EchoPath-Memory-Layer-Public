# Quick Start

## Goal

Use EchoPath Memory Layer concepts to make a simple game or XR space remember repeated behavior.

This public repo teaches the pattern. It does not expose the full production runtime.

---

## Core Loop

```text
Event -> Memory -> Decay/Reinforcement -> Threshold -> Response
```

Example:

```text
Player hides in closet
  -> write hiding memory
  -> hiding memory accumulates
  -> threshold triggers
  -> NPC investigates
```

---

## Step 1: Define Anchors

An anchor is a room, object, path, waypoint, or region that can accumulate memory.

Example anchors:

```text
closet
hallway
exit_zone
basement
safe_route
```

---

## Step 2: Write Engrams

For beginners, use `writeEngram(...)`.

Engrams are behavior events that write memory into the nearest anchor or a specific anchor.

Common memory types:

```text
presence
hiding
sound
danger
safe
route
```

Beginner example:

```js
memory.writeEngram({
  position: player.position,
  eventType: "hiding",
  strength: 0.32,
  source: "player",
  tags: ["stealth", "repeat_behavior"],
  radius: 2
});
```

Use `writeEvent(...)` when you need a lower-level explicit event writer for adapters, deterministic replays, or direct anchor targeting.

```js
memory.writeEvent({
  type: "hiding",
  targetAnchorId: "closet",
  strength: 0.18
});
```

---

## Step 3: Let Memory Decay

Memory should fade if it is not reinforced.

```text
repeated action -> stronger memory
no action -> memory fades
```

This makes environments feel alive without requiring every response to be scripted manually.

---

## Step 4: Trigger Responses

Rules define when memory causes behavior.

Example:

```text
if closet.hiding >= 0.72:
  trigger npc.investigate
```

Responses can map to:

- NPC behavior
- audio changes
- lighting changes
- path preference
- danger state
- UI feedback
- quest or narrative events

---

## Step 5: Let Agents Query Memory

NPCs and agents should not need raw memory internals. They can query local memory near their position.

```js
const readout = memory.getLocalMemoryGradient({
  position: npc.position,
  radius: 5,
  type: "hiding"
});

if (readout.suggestedAction === "investigate memory hotspot") {
  sendNpcTo(readout.gradientTarget);
}
```

---

## Step 6: Use an Adapter

Use one of the bridge examples:

- Unity: `examples/unity-bridge.cs`
- Godot: `examples/godot-bridge.gd`
- Web: `examples/web-adapter.js`

These examples show the public integration pattern.

Before writing a production-style adapter, read:

```text
docs/ADAPTER_CONTRACT.md
```

---

## What To Build First

A good first prototype:

```text
One room
One hiding spot
One memory type
One threshold rule
One NPC response
```

Then expand to:

```text
multiple rooms
propagation
safe routes
danger memory
visualizer overlay
```

---

## Local Preview

From the repo root:

```bash
python3 -m http.server 8080 -d docs
```

Then open:

```text
http://localhost:8080/
```

---

## Product Boundary

This repo gives you examples and documentation.

The official EchoPath Memory Layer runtime, plugin builds, preset products, and partner integrations are distributed separately through EchoPath XR.

Website: https://echopathxr.com

---

Next read: [API Contract](API.md)
