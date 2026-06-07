# Known Limitations

This page describes public-safe limitations for EchoPath Memory Layer Phase 1.

## Phase 1 Scope

Phase 1 is a public product-wrapper layer around browser demos, starter preset summaries, and a Memory Ledger Export baseline. It is designed to communicate value without exposing private runtime internals.

## Demo Limitations

- Browser demos use simplified scenes and small memory fields.
- Demo behavior is intentionally deterministic and readable rather than production-tuned.
- Heatmap output is a public visualization aid, not a full engine debugger.
- Memory channels are limited to a small set of understandable examples.
- Thresholds and values shown in demos are illustrative and should not be treated as production tuning guidance.

## Preset Summary Limitations

- Starter presets are public-safe behavior summaries only.
- The public summary does not include private coefficients, tuning tables, runtime internals, or protected implementation rules.
- Presets are intended to explain design patterns and product packaging, not to reproduce the private preset runtime.

## Memory Ledger Export Limitations

- The public Memory Ledger Export wrapper describes a baseline session/export shape.
- It does not include private replay processors, partner analytics, server infrastructure, or protected schema evolution details.
- Any example fields should be treated as public interoperability guidance, not a complete production contract.

## Engine Adapter Limitations

Unity and Godot scaffolds are later-phase adapter references. They are not the current Phase 1 product release and should not be represented as production plugin packages.

## Research Boundary

EchoPath Neuro is a separate research lane and is not included in this public repo. This repo should not be used to publish private research code, protected future-stack internals, or unvalidated research claims.

## Practical Expectation

Use this repo to understand the product surface, try the demos, review public wrappers, and prepare website/product copy. Use official EchoPath XR channels for production runtime access, plugin support, paid products, or partner integration.
