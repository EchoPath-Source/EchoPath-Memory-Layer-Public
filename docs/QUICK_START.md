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

## Step 2: Write Events

Events are actions that happen at anchors.

Common memory types:

```text
presence
hiding
sound
danger
safe
route
```

Example:

```js
memory.writeEvent({
  type: "hiding",
  targetAnchorId: "closet",
  strength: 0.18,
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

## Step 5: Use an Adapter

Use one of the bridge examples:

- Unity: `examples/unity-bridge.cs`
- Godot: `examples/godot-bridge.gd`
- Web: `examples/web-adapter.js`

These examples show the public integration pattern.

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

## Product Boundary

This repo gives you examples and documentation.

The official EchoPath Memory Layer runtime, plugin builds, preset products, and partner integrations are distributed separately through EchoPath XR.

Website: https://echopathxr.com
