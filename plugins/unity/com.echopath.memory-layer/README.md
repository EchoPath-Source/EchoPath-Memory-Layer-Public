# EchoPath Memory Layer — Unity Adapter Scaffold

**Status:** later-phase adapter reference
**Package:** `com.echopath.memory-layer`
**Target:** Unity 2021.3+
**Boundary:** reference scaffold only, not the Phase 1 product release and not the private production runtime

## Purpose

This Unity folder gives developers a public-safe reference for how EchoPath Memory Layer concepts may map into a Unity project later.

It demonstrates the conceptual loop:

```text
Unity event -> memory anchor -> memory write -> decay/reinforcement -> threshold trigger -> game behavior
```

## Phase 1 Positioning

The current Phase 1 product release is:

```text
browser demos + public product wrappers + starter preset summaries + Memory Ledger Export baseline
```

Unity packaging is parked for a later phase. Do not present this scaffold as a production plugin release.

## Reference Install During Exploration

If you are exploring the scaffold, use Unity Package Manager with a Git URL once the repo structure is stable:

```text
https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public.git?path=/plugins/unity/com.echopath.memory-layer
```

Or copy the package folder into your project:

```text
Assets/Packages/com.echopath.memory-layer/
```

## Example Behavior

```text
Player hides in closet repeatedly
  -> closet.hiding rises
  -> response threshold crosses
  -> npc.investigate action fires
```

## Public / Private Boundary

This package is intended for learning and lightweight prototyping only.

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
- Add demo scene manifest only after wrapper review.
- Add visual debugging overlay only as public-safe adapter work.
- Promote to a packaged preview only in a later phase.
