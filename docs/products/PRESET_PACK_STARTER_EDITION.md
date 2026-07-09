# Preset Pack Starter Edition

## One-line Description

Preset Pack Starter Edition is a public-safe set of ten named memory behavior templates for common adaptive-world patterns.

## What It Proves

- The Memory Layer can be packaged as understandable design patterns.
- Common behaviors can be named, documented, and discussed without exposing private tuning internals.
- Designers can start from known templates instead of inventing every memory behavior from scratch.
- Presets can act as public handoff objects between demos, Memory Lite, website wrappers, and later engine adapters.

## What Is Included

The public summary lists ten starter presets:

1. Haunted Room
2. Predator Trail
3. Safe Path
4. Danger Echo
5. Loot Memory
6. Crowd Wear
7. Shrine Activation
8. Animal Territory
9. NPC Habit
10. Encounter Scar

See [`presets/starter/README.md`](../../presets/starter/README.md) and [`presets/starter/preset-summary.json`](../../presets/starter/preset-summary.json).

## How To Try It

Use the preset summary as a design reference while trying:

- [The Room Remembers](ROOM_REMEMBERS.md)
- [Memory Visualizer / Debug Heatmap](MEMORY_VISUALIZER_DEBUG_HEATMAP.md)

The website product page can link to this public summary after review.

## Public-safe Use Cases

- Communicating starter behavior concepts to developers and designers.
- Planning demo scenarios around haunted, dangerous, safe, crowded, territorial, or scarred spaces.
- Website copy and product packaging for the starter edition.
- Prototype planning before private runtime or paid plugin integration.
- Public-safe seed data for Memory Lite examples and Memory Ledger Export summaries.

## Integration Role

Preset summaries should remain product-facing handoff objects.

```text
Preset Pack public summary
  -> Memory Lite demo anchors
  -> threshold response examples
  -> Memory Ledger Export summaries
  -> future Unity/Godot preview adapter examples
```

The public preset summary may describe behavior themes, memory channels, action labels, and visual style hints. It should not include private coefficients, protected tuning rules, production runtime mappings, partner details, or unvalidated research claims.

## Known Limitations

- The public preset summary intentionally omits private coefficients, raw runtime internals, protected tuning rules, and research details.
- It is a product/design summary, not a full preset implementation package.
- It should not be used to claim production tuning performance.
- It does not include paid plugin source or private production preset behavior.

## Next Step / CTA

After reviewing the starter presets, read the [Memory Ledger Export wrapper](MEMORY_LEDGER_EXPORT.md) to understand how sessions can be summarized for replay, QA, and design review.

See also [`../ECHOGENESIS_INTEGRATION_NOTES.md`](../ECHOGENESIS_INTEGRATION_NOTES.md) for cross-repo handoff notes.

## Boundary Note

No private runtime, protected research internals, EchoPath Neuro implementation, partner details, private tuning constants, Q-RRG kernel internals, protected future-stack internals, or unvalidated scientific claims are included.
