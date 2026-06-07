# Phase 1 Product Wrappers

EchoPath Memory Layer Phase 1 is the public-safe product surface for proving that worlds can remember player behavior and respond over time.

Phase 1 is not plugin packaging, protected runtime release, or research publication. It is the public wrapper layer around browser demos, starter preset descriptions, and a replay/export baseline.

## Phase 1 Surfaces

| Surface | Public role | Where to start |
| --- | --- | --- |
| The Room Remembers | Interactive proof of spatial memory, reinforcement, decay, and threshold response. | [Room Remembers wrapper](products/ROOM_REMEMBERS.md) |
| Memory Visualizer / Debug Heatmap | Public-safe debug view for anchor intensity and memory pressure. | [Visualizer wrapper](products/MEMORY_VISUALIZER_DEBUG_HEATMAP.md) |
| Preset Pack Starter Edition | Ten named behavior templates for communicating common memory patterns. | [Preset Pack wrapper](products/PRESET_PACK_STARTER_EDITION.md) |
| Memory Ledger Export baseline | Replay/export schema baseline for explaining what happened in a memory session. | [Ledger Export wrapper](products/MEMORY_LEDGER_EXPORT.md) |
| Public product wrappers | Product-readable docs that explain the demos without exposing internals. | This document |
| Website/product integration notes | Checklist for linking the public repo into the live product site. | [Website integration notes](WEBSITE_INTEGRATION_NOTES.md) |

## What Phase 1 Proves

Phase 1 proves the public product promise:

```text
World events can become spatial memory.
Spatial memory can decay, reinforce, and cross thresholds.
Thresholds can drive visible game behavior and readable debug output.
```

## What Phase 1 Includes

- Browser demos hosted through the GitHub Pages demo hub.
- Public wrapper documentation for each Phase 1 surface.
- Public-safe starter preset summaries.
- A public Memory Ledger Export baseline description.
- Clear boundary language for what is intentionally excluded.

## What Phase 1 Does Not Include

- Production runtime internals.
- Paid plugin source.
- Private tuning constants or protected runtime coefficients.
- Partner-specific builds or implementation details.
- EchoPath Neuro implementation code or research prototypes.
- Protected future-stack internals.
- Unvalidated research claims.

## Later-Phase Adapter References

Unity and Godot scaffolds in this repo are parked later-phase adapter references. They are useful for understanding how browser demo concepts may map into engines, but they are not the current Phase 1 product release.

## Public CTA

Start with the [demo hub](index.html), then read the four product wrappers in `docs/products/` before connecting website copy or product packaging.
