# Public / Private Boundary

## Purpose

This document clarifies what the EchoPath Memory Layer public repo includes, what it intentionally excludes, and how Phase 1 should be described publicly.

## Public Repo Includes

This repository includes:

- browser demos for Phase 1;
- public API and integration documentation;
- product wrapper docs for Phase 1 surfaces;
- public-safe starter preset summaries;
- Memory Ledger Export baseline documentation;
- example adapter code for learning and prototyping;
- Unity and Godot scaffolds as later-phase adapter references.

This repo teaches and demonstrates the product pattern.

## Public Repo Does Not Include

This repository does not include:

- production runtime internals;
- paid plugin source;
- private optimized kernel logic;
- private tuning constants or coefficients;
- EchoPath Neuro implementation code or research prototypes;
- protected future-stack internals;
- partner builds, partner details, or partner-specific optimization layers;
- unvalidated research claims.

## Phase 1 Product Boundary

Phase 1 is centered on public product wrappers:

```text
browser demos + product docs + starter preset summaries + ledger export baseline
```

Phase 1 is not a release of private runtime internals, paid plugin source, EchoPath Neuro, or a broader future-stack product.

## Unity / Godot Boundary

Unity and Godot folders in this repo are parked later-phase adapter references. They remain useful for developers who want to understand engine mapping, but they should not be presented as the current Phase 1 product release.

## Distribution Model

```text
Public repo = demos + docs + wrappers + public-safe examples
Website = product funnel + demo links + copy + support path
Private/product channels = production runtime + paid plugins + partner builds
```

## Recommended Public Wording

```text
The public repository includes browser demos, documentation, starter preset summaries, and product wrappers.
The production runtime, paid plugin source, private research lanes, and partner builds are distributed separately through EchoPath XR channels.
```

## Anchor Statement

```text
Expose enough to prove value. Protect enough to keep the runtime, research, and partner work safe.
```
