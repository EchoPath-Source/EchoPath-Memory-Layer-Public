# EchoPath Memory Layer — Plugin Track

This folder contains the public Phase 1 plugin scaffolds for EchoPath Memory Layer.

These packages are intentionally lightweight. They expose the Memory Lite pattern for engine integration without exposing the private production runtime, research prototypes, Q-RRG internals, or partner builds.

## Current Tracks

```text
plugins/
  unity/
    com.echopath.memory-layer/
  godot/
    addons/echopath_memory_layer/
```

## What These Plugins Do

The Phase 1 plugins help developers:

- register memory anchors in a scene;
- write memory events such as hiding, sound, danger, safe, route, or presence;
- decay and reinforce memory over time;
- trigger engine behavior when memory thresholds are crossed;
- prototype worlds that remember repeated behavior.

## What These Plugins Do Not Include

The public plugin scaffolds do not include:

- the private EchoPath production runtime;
- paid preset pack internals;
- Collapse Neural Network v7/v8 research models;
- Q-RRG convergence logic;
- partner-specific optimization layers;
- studio support code.

## Public / Paid / Partner Boundary

```text
Public repo
  -> concept docs, browser demos, starter adapters, public plugin scaffolds

Preset pack
  -> tuned behavior templates and starter design assets

Future plugin builds
  -> packaged Unity/Godot distribution and visual debugging tools

Partner builds
  -> custom integration, private runtime tuning, deeper EchoPath stack convergence
```

## Recommended Development Order

1. Keep browser demos live and stable.
2. Maintain public Unity and Godot scaffolds as learning/reference packages.
3. Add preset import examples.
4. Package Unity as a UPM-ready folder.
5. Package Godot as an installable addon.
6. Add visual debugging overlays.
7. Move production-ready runtime pieces into paid/private distribution.

## Anchor Statement

```text
The public plugins teach the integration pattern.
EchoPath XR distributes production builds, presets, and partner support.
```
