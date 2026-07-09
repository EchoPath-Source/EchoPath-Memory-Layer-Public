# Memory Ledger Export

## One-line Description

Memory Ledger Export is a public baseline for recording what memory events occurred during a session in a readable replay/export format.

## What It Proves

- Memory behavior can be summarized after a session.
- Designers and QA can review what happened, where it happened, and which public-safe actions were triggered.
- Replay/export language can support trust without exposing private runtime internals.
- Public Memory Layer demos can produce ledger-style summaries before any future EchoChain or Reflection Ledger integration exists.

## What Is Included

- A public product wrapper for the ledger/export concept.
- Suggested high-level export categories: session metadata, anchors, event summaries, channel totals, and public-safe triggered actions.
- Guidance for keeping exports understandable and boundary-safe.
- A public-safe bridge concept for future sealed-session handoff.

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
- Future handoff sketch for EchoGenesis / EchoChain / Reflection Ledger, using summaries only.

## Cross-Repo Handoff

Memory Ledger Export is the public-safe bridge from Memory Lite sessions toward later audit and verification systems.

```text
Memory Lite session
  -> Memory Ledger Export summary
  -> EchoGenesis sealed-event candidate mapping
  -> EchoChain / Reflection Ledger verification path later
```

EchoGenesis owns canonical sealed-event semantics. This public wrapper should only expose readable demo/session summaries, not private replay processors or future-stack internals.

## Suggested Public Export Categories

```json
{
  "session": {},
  "anchors": [],
  "events": [],
  "channelTotals": {},
  "triggeredActions": [],
  "notes": {}
}
```

This is a product-facing baseline, not a canonical production schema.

## Known Limitations

- This public wrapper is not a complete production schema or private replay processor.
- It does not include partner analytics, server-side processing, private runtime traces, protected schema evolution, or tuning internals.
- Example categories should remain high-level and public-safe.
- It is not a canonical EchoGenesis sealed-event packet.

## Next Step / CTA

Link this wrapper from the website after public review, then decide whether a small downloadable example ledger should be added in a later public-safe pass.

See also [`../ECHOGENESIS_INTEGRATION_NOTES.md`](../ECHOGENESIS_INTEGRATION_NOTES.md).

## Boundary Note

No private runtime, protected research internals, EchoPath Neuro implementation, partner details, private replay processors, Q-RRG kernel internals, protected future-stack internals, or unvalidated scientific claims are included.
