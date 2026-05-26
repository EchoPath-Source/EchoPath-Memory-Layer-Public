# EchoPath Memory Layer — Godot Addon Scaffold

**Status:** public Phase 1 scaffold  
**Target:** Godot 4.x  
**Boundary:** reference addon scaffold, not the private production runtime

## Purpose

This Godot addon gives developers a clean starting point for EchoPath Memory Layer integration.

It demonstrates the core loop:

```text
Godot event -> memory anchor -> memory write -> decay/reinforcement -> threshold trigger -> game behavior
```

## Install During Phase 1

Copy the addon folder into your Godot project:

```text
addons/echopath_memory_layer/
```

Then enable it from:

```text
Project -> Project Settings -> Plugins -> EchoPath Memory Layer
```

## Quick Start

1. Add `EchoPathMemoryBridge.gd` to a Node in your scene.
2. Register anchors for rooms, hiding spots, patrol points, or interaction zones.
3. Add threshold rules for behavior triggers.
4. Call helper methods from player/NPC scripts:

```gdscript
memory_bridge.write_hiding("closet")
memory_bridge.write_sound("hallway")
memory_bridge.write_danger("basement")
memory_bridge.write_safe("exit_zone")
```

## Example Behavior

```text
Player hides in closet repeatedly
  -> closet.hiding rises
  -> threshold crosses 0.72
  -> npc.investigate action fires
```

## Public / Private Boundary

This addon is intended for learning and lightweight prototyping.

It does not include:

- private production runtime;
- paid preset pack internals;
- Collapse Neural Network research models;
- Q-RRG convergence logic;
- partner-specific optimization layers.

## Next Steps

- Add sample scene.
- Add exported preset resources.
- Add debug overlay.
- Add preset pack import examples.
- Promote to installable preview release when stable.
