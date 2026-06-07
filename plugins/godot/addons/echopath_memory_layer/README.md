# EchoPath Memory Layer — Godot Adapter Scaffold

**Status:** later-phase adapter reference
**Target:** Godot 4.x
**Boundary:** reference scaffold only, not the Phase 1 product release and not the private production runtime

## Purpose

This Godot folder gives developers a public-safe reference for how EchoPath Memory Layer concepts may map into a Godot project later.

It demonstrates the conceptual loop:

```text
Godot event -> memory anchor -> memory write -> decay/reinforcement -> threshold trigger -> game behavior
```

## Phase 1 Positioning

The current Phase 1 product release is:

```text
browser demos + public product wrappers + starter preset summaries + Memory Ledger Export baseline
```

Godot packaging is parked for a later phase. Do not present this scaffold as a production addon release.

## Reference Install During Exploration

Copy the addon folder into your Godot project:

```text
addons/echopath_memory_layer/
```

Then enable it from:

```text
Project -> Project Settings -> Plugins -> EchoPath Memory Layer
```

## Example Behavior

```text
Player hides in closet repeatedly
  -> closet.hiding rises
  -> response threshold crosses
  -> npc.investigate action fires
```

## Public / Private Boundary

This addon is intended for learning and lightweight prototyping only.

It does not include:

- private production runtime;
- paid plugin source;
- paid preset pack internals;
- private tuning constants or coefficients;
- EchoPath Neuro implementation code or research prototypes;
- protected future-stack internals;
- partner-specific optimization layers or partner details.

## Next Steps

- Keep this language aligned with Phase 1 wrappers.
- Add sample scene only after wrapper review.
- Add debug overlay only as public-safe adapter work.
- Promote to an installable preview only in a later phase.
