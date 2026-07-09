# EchoGenesis Integration Notes

## Purpose

This document explains how the public EchoPath Memory Layer repo connects to the broader EchoGenesis / EchoNet / EchoChain ecosystem without exposing private runtime internals or protected research code.

## Boundary

Memory Lite is the public-safe runtime abstraction. It demonstrates the spatial memory product pattern without exposing:

- private production runtime internals;
- paid plugin source;
- private tuning constants or protected coefficients;
- partner-specific logic or customer details;
- EchoPath Neuro source or research prototypes;
- Q-RRG kernel internals;
- unvalidated SoCT or scientific claims as product claims.

## Current Public Surface

The public repo should remain focused on:

- The Room Remembers;
- Memory Visualizer / Debug Heatmap;
- Preset Pack Starter Edition;
- Memory Ledger Export baseline;
- Memory Lite runtime abstraction;
- public-safe examples and adapter scaffolds.

## Cross-Repo Handoff

```text
Memory Layer Public
  -> emits public-safe memory events, preset summaries, threshold responses, and ledger-style session summaries

EchoGenesis
  -> owns canonical ecosystem mapping, sealed-event semantics, governance language, and cross-construct architecture

EchoChain / Reflection Ledger
  -> can later verify sealed memory sessions and replay/audit records

EchoNet
  -> can later ingest normalized memory events for telemetry and coherence mapping
```

## Integration Adapters to Track

1. **Memory Lite -> EchoNet ingest event**
   - Converts public-safe memory writes, anchor summaries, and trigger responses into a normalized event shape.
   - Future-facing only; do not expose telemetry internals here.

2. **Memory Lite -> Memory Ledger Export**
   - Converts a local session into readable JSON/CSV-style summary categories.
   - Safe for demos, QA review, and designer replay summaries.

3. **Memory Ledger Export -> EchoChain sealed event**
   - Converts a session summary into a candidate sealed-event envelope.
   - EchoGenesis / EchoChain own canonical sealing semantics.

4. **Memory Lite -> Unity/Godot preview adapter**
   - Maps engine events into `writeEngram(...)`, `queryMemory(...)`, `onTrigger(...)`, and save/load calls.
   - Preview adapters remain scaffolds, not production plugins.

5. **Memory Lite -> Website demo wrapper**
   - Wraps demos and product copy for EchoPathXR.com.
   - Website hosts official downloads and product funnels.

## Public Event Sketch

A public-safe memory event can be summarized as:

```json
{
  "schema": "echopath.memory_event.public",
  "version": "0.1.0",
  "sessionId": "demo_session_001",
  "anchorId": "closet",
  "eventType": "hiding",
  "strength": 0.18,
  "source": "player",
  "tags": ["demo", "stealth"],
  "metadata": {
    "demo": "room_remembers"
  }
}
```

This is a public handoff sketch only. It is not the canonical EchoGenesis sealed event packet.

## Recommended Doc Links

- `docs/API.md`
- `docs/MEMORY_LITE.md`
- `docs/MEMORY_LITE_RUNTIME.md`
- `docs/ADAPTER_CONTRACT.md`
- `docs/products/MEMORY_LEDGER_EXPORT.md`
- `docs/PUBLIC_PRIVATE_BOUNDARY.md`

## Anchor Statement

```text
Memory Lite proves the public spatial-memory pattern.
EchoGenesis owns the canonical sealed-event and ecosystem semantics.
Future integrations should hand off summaries, not private internals.
```
