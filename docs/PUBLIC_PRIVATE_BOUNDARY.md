# Public / Private Boundary

## Purpose

This document clarifies what the EchoPath Memory Layer public repo includes, what it intentionally excludes, which artifacts are public vs private, and how Phase 1 should be described publicly.

## Public Repo Includes

This repository includes:

- browser demos for Phase 1;
- public API and integration documentation;
- product wrapper docs for Phase 1 surfaces;
- public-safe starter preset summaries;
- Memory Lite runtime abstraction;
- Memory Ledger Export baseline documentation;
- example adapter code for learning and prototyping;
- Unity and Godot scaffolds as later-phase adapter references;
- public-safe EchoGenesis handoff notes.

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
- unvalidated research claims;
- canonical EchoGenesis sealed-event implementation;
- EchoNet telemetry internals;
- EchoChain governance or ledger implementation.

## Artifact Exposure Map

| Artifact | Public repo status | Notes |
|---|---|---|
| Browser demos | Public | Room Remembers, Memory Visualizer, demo hub, static assets. |
| Memory Lite runtime | Public | Lightweight behavior reference only; not production runtime. |
| Public API docs | Public | Stable observable API surface such as anchors, writes, queries, thresholds, and exports. |
| Public product wrapper docs | Public | Product explanation, phase scope, and website-ready copy. |
| Starter preset summaries | Public | Names, use cases, public-safe memory channels, and high-level behavior summaries. |
| Preset private coefficients | Private | Do not expose protected weights, tuning constants, or proprietary internal mappings. |
| Memory Ledger Export baseline | Public | Public-safe replay/event summary examples only. |
| EchoGenesis integration notes | Public-safe | Handoff map only; canonical sealed-event semantics live in EchoGenesis. |
| Demo smoke artifacts | Public-safe if generated from demo data | Must use synthetic/demo anchors, actions, and positions only. |
| Unity/Godot scaffolds | Public-safe | Adapter examples and preview structure only, not paid plugin source. |
| Production runtime internals | Private | No private scheduler, kernel, optimizer, adapter internals, or tuned runtime constants. |
| EchoPath Neuro / CNN-SoCT code | Private/internal | Research implementation and raw model state stay out of this repo. |
| Q-RRG internals | Private/internal | No protected tube/spine/kernel constants or private geometry logic. |
| Partner integrations | Private | No partner details, scene data, custom tuning, or partner-specific optimization layers. |
| Future-stack internals | Private/internal | EchoNet, EchoChain, Native, Cognition, and other future-stack details require explicit public-safe wrappers before exposure. |

## Public Artifact Checklist

Before adding or updating an artifact in this public repo, confirm:

- the artifact is demo-only, documentation-only, or public API surface;
- any runtime behavior is Memory Lite/public-safe behavior, not production internals;
- data is synthetic, sanitized, or intentionally public;
- no private constants, protected coefficients, or partner details are present;
- no unvalidated scientific or research claims are presented as proof;
- any future-stack reference is framed as a public-safe integration stub or roadmap item;
- any EchoGenesis / EchoNet / EchoChain mention is a handoff note, not canonical implementation.

## Phase 1 Product Boundary

Phase 1 is centered on public product wrappers:

```text
browser demos + product docs + starter preset summaries + ledger export baseline + Memory Lite
```

Phase 1 is not a release of private runtime internals, paid plugin source, EchoPath Neuro, or a broader future-stack product.

## Cross-Repo Boundary

```text
Memory Layer Public
  -> public-safe demos, docs, Memory Lite, preset summaries, adapter scaffolds, and ledger-style summaries

EchoGenesis
  -> canonical ecosystem mapping, sealed-event semantics, governance language, and cross-construct architecture

EchoNet
  -> future telemetry/coherence ingest layer for normalized memory events

EchoChain / Reflection Ledger
  -> future verification, audit, and sealed-session layer
```

This repo may document public handoff shapes. It should not define canonical EchoGenesis governance semantics or expose protected future-stack internals.

## Handoff Payload Rule

Allowed handoff payloads:

- public-safe memory events;
- starter preset summaries;
- threshold responses;
- local save/load snapshots;
- ledger-style session summaries;
- website wrapper readouts;
- Unity/Godot preview adapter examples.

Disallowed handoff payloads:

- raw production traces;
- private coefficients;
- protected tuning rules;
- paid plugin internals;
- EchoPath Neuro source or model state;
- Q-RRG kernel internals;
- partner/customer data;
- canonical sealed-event implementation details.

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
The public repository includes browser demos, documentation, starter preset summaries, Memory Lite, and product wrappers.
The production runtime, paid plugin source, private research lanes, and partner builds are distributed separately through EchoPath XR channels.
```

## Anchor Statement

```text
Expose enough to prove value. Protect enough to keep the runtime, research, and partner work safe.
```
