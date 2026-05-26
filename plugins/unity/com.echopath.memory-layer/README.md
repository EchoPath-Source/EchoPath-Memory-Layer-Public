# EchoPath Memory Layer — Unity Plugin Scaffold

**Status:** public Phase 1 scaffold  
**Package:** `com.echopath.memory-layer`  
**Target:** Unity 2021.3+  
**Boundary:** reference plugin scaffold, not the private production runtime

## Purpose

This Unity package gives developers a clean starting point for EchoPath Memory Layer integration.

It demonstrates the core loop:

```text
Unity event -> memory anchor -> memory write -> decay/reinforcement -> threshold trigger -> game behavior
```

## Install During Phase 1

Use Unity Package Manager with a Git URL once the repo structure is stable:

```text
https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public.git?path=/plugins/unity/com.echopath.memory-layer
```

Or copy the package folder into your project:

```text
Assets/Packages/com.echopath.memory-layer/
```

## Quick Start

1. Add `EchoPathMemoryBridge` to a GameObject.
2. Add anchors for rooms, hiding spots, patrol points, or interaction zones.
3. Add memory rules for threshold-triggered behavior.
4. Call helper methods from player/NPC scripts:

```csharp
memoryBridge.WriteHiding("closet");
memoryBridge.WriteSound("hallway");
memoryBridge.WriteDanger("basement");
memoryBridge.WriteSafe("exit_zone");
```

## Example Behavior

```text
Player hides in closet repeatedly
  -> closet.hiding rises
  -> threshold crosses 0.72
  -> npc.investigate action fires
```

## Public / Private Boundary

This package is intended for learning and lightweight prototyping.

It does not include:

- private production runtime;
- paid preset pack internals;
- Collapse Neural Network research models;
- Q-RRG convergence logic;
- partner-specific optimization layers.

## Next Steps

- Add demo scene manifest.
- Add ScriptableObject preset definitions.
- Add visual debugging overlay.
- Add preset pack import examples.
- Promote to a packaged preview release when stable.
