# Memory Lite

Memory Lite is the public-safe EchoPath Memory Layer preview runtime. It lets developers try the core product idea — places can remember repeated events, expose those memories to agents, and produce threshold-triggered responses — without exposing private production runtime internals.

Use this page as the short product-facing overview. For the full reference, see [`MEMORY_LITE_RUNTIME.md`](MEMORY_LITE_RUNTIME.md).

## What Memory Lite is

Memory Lite is a lightweight JavaScript runtime under [`src/memory-lite/`](../src/memory-lite/) that supports:

- spatial memory anchors;
- room or area memory zones;
- engram-style event writes;
- local agent queries;
- basic threshold triggers;
- local save/load snapshots;
- public-safe starter preset helpers.

Run the basic example with [`examples/memory-lite-basic.js`](../examples/memory-lite-basic.js), or run the preset summary example with [`examples/memory-lite-preset-summary.js`](../examples/memory-lite-preset-summary.js).

## MemoryAnchor

`MemoryAnchor` is a memory-bearing point, object, waypoint, region, or interaction spot. It has an `id`, label, position, radius, memory channel values, optional threshold rules, tags, metadata, and public-safe visual style hints.

Examples:

- a closet that accumulates `hiding` memory;
- a hallway that accumulates `sound` memory;
- a safe path marker that accumulates `safe` or `route` memory.

## MemoryZone

`MemoryZone` groups multiple anchors into a room or area-level memory container. A zone can represent a room, trail, arena, hub, territory, or other authored space.

A zone can:

- add, remove, and retrieve anchors;
- report channel totals across grouped anchors;
- answer zone-local memory queries;
- carry public-safe tags and visual style hints.

This keeps the preview product-friendly: designers can talk about "what the room remembers" without needing private runtime internals.

## How presets connect

Starter presets are published as public-safe summaries in [`presets/starter/preset-summary.json`](../presets/starter/preset-summary.json). Memory Lite includes helper functions that turn those summaries into demo anchors with:

- a public channel choice;
- a basic threshold rule;
- public action labels/themes;
- metadata copied from the summary;
- visual style hints.

See [`examples/memory-lite-preset-summary.js`](../examples/memory-lite-preset-summary.js) for a Node-only example that loads Haunted Room and Safe Path from the preset summary file.

## How agents query memory

Agents call `queryMemory({ position, radius, type })` on `MemoryLiteField`, or `queryZoneMemory(zoneId, query)` for a zone-specific readout. The result includes channel totals, the strongest nearby anchor, a gradient target, and a simple suggested action.

The suggested action is intentionally basic. It is a public preview behavior hint, not a private AI controller or production decision system.

## How save/load works

`saveState()` returns a local JSON-friendly snapshot containing schema metadata, anchors, zones, trigger history, and developer-provided metadata. `loadState()` restores the preview field from that snapshot.

Memory Lite does not prescribe cloud persistence, account sync, migrations, or production storage policy.

## What is intentionally not included

Memory Lite does **not** include:

- production runtime internals;
- paid plugin source;
- private tuning constants or protected coefficients;
- EchoPath Neuro implementation;
- protected research logic;
- partner details;
- future-stack implementation details;
- unvalidated research claims.
