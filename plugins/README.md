# EchoPath Memory Layer — Later-phase Adapter References

This folder contains Unity and Godot adapter scaffolds for EchoPath Memory Layer.

**Phase 1 status:** parked later-phase references, not the current Phase 1 product release.

Phase 1 is centered on:

```text
browser demos + public product wrappers + starter preset summaries + Memory Ledger Export baseline
```

## Current Tracks

```text
plugins/
  unity/
    com.echopath.memory-layer/
  godot/
    addons/echopath_memory_layer/
```

## What These Scaffolds Do

The scaffolds help developers understand how the Memory Layer pattern may map into engines later:

- register memory anchors in a scene;
- write public-safe memory events such as hiding, sound, danger, safe, route, or presence;
- reason about decay and reinforcement;
- trigger engine behavior when memory thresholds are crossed;
- prototype worlds that remember repeated behavior.

## What These Scaffolds Do Not Include

The public adapter scaffolds do not include:

- the private EchoPath production runtime;
- paid plugin source;
- paid preset pack internals;
- private tuning constants or coefficients;
- EchoPath Neuro implementation code or research prototypes;
- protected future-stack internals;
- partner-specific optimization layers or partner details.

## Public / Paid / Partner Boundary

```text
Public repo
  -> browser demos, product wrappers, starter preset summaries, public-safe examples

Phase 1 wrappers
  -> Room Remembers, Memory Visualizer, Preset Pack Starter Edition, Memory Ledger Export

Later phases
  -> packaged Unity/Godot adapter work after public wrappers stabilize

Product/private channels
  -> production runtime, paid plugins, supported integrations, partner builds
```

## Recommended Development Order

1. Keep browser demos live and stable.
2. Stabilize Phase 1 public product wrappers.
3. Link wrappers from the website after review.
4. Polish Preset Pack product image/copy.
5. Revisit Unity/Godot packaging language only after the Phase 1 surface is stable.

## Anchor Statement

```text
The public plugins are later-phase adapter references.
Phase 1 is demos, wrappers, starter presets, and ledger export baseline.
```
