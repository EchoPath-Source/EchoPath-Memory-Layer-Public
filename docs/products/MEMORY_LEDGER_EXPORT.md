# Memory Ledger Export

## One-line Description

Memory Ledger Export is a public baseline for recording what memory events occurred during a session in a readable replay/export format.

## What It Proves

- Memory behavior can be summarized after a session.
- Designers and QA can review what happened, where it happened, and which public-safe actions were triggered.
- Replay/export language can support trust without exposing private runtime internals.

## What Is Included

- A public product wrapper for the ledger/export concept.
- Suggested high-level export categories: session metadata, anchors, event summaries, channel totals, and public-safe triggered actions.
- Guidance for keeping exports understandable and boundary-safe.

## How To Try It

Use the browser demos to generate visible memory events, then model a public ledger summary around:

```text
session -> anchors -> memory events -> channel totals -> triggered actions
```

For Phase 1, this is documentation baseline rather than a production export service.

## Public-safe Use Cases

- QA notes for why a room reacted.
- Designer review of repeated behavior patterns.
- Replay summaries for demos and prototype sessions.
- Website/product explanation of memory transparency.

## Known Limitations

- This public wrapper is not a complete production schema or private replay processor.
- It does not include partner analytics, server-side processing, private runtime traces, protected schema evolution, or tuning internals.
- Example categories should remain high-level and public-safe.

## Next Step / CTA

Link this wrapper from the website after public review, then decide whether a small downloadable example ledger should be added in a later public-safe pass.

## Boundary Note

No private runtime, protected research internals, EchoPath Neuro implementation, partner details, private replay processors, or protected future-stack internals are included.
