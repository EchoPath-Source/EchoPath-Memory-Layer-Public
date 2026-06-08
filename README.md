# EchoPath Memory Layer Public

**Make your worlds remember.**

EchoPath Memory Layer is a spatial-memory product surface for games, XR, and simulation prototypes. It helps worlds remember repeated behavior, decay or reinforce that memory over time, and turn remembered history into readable game responses.

This public repo contains Phase 1 browser demos, public-safe docs, examples, starter preset summaries, product wrappers, and a lightweight **Memory Lite** runtime abstraction. It is intentionally not a dump of private runtime internals or protected research code.

Website: https://echopathxr.com  
Product page: https://echopathxr.com/echopath-memory-layer/  
Website readiness handoff: [`docs/WEBSITE_MEMORY_LAYER_PHASE_1_READINESS.md`](docs/WEBSITE_MEMORY_LAYER_PHASE_1_READINESS.md)  
Contact: contact@echopathxr.com

---

## Try Now

1. **The Room Remembers** — click zones, write memory, watch thresholds trigger behavior.  
   Demo: [GitHub Pages hub](https://echopath-source.github.io/EchoPath-Memory-Layer-Public/) / local path: [`docs/room-remembers/`](docs/room-remembers/)
2. **Memory Visualizer / Debug Heatmap** — inspect public-safe memory pressure across anchors.  
   Demo: [GitHub Pages hub](https://echopath-source.github.io/EchoPath-Memory-Layer-Public/) / local path: [`docs/memory-visualizer/`](docs/memory-visualizer/)

Run locally:

```bash
python3 -m http.server 8080 -d docs
```

Then open:

```text
http://localhost:8080/
```

---

## What Is EchoPath Memory Layer?

EchoPath Memory Layer is middleware/product infrastructure for adaptive worlds:

```text
Scene event -> spatial memory -> decay / reinforcement -> threshold response -> game behavior
```

Example:

```text
Player hides in closet repeatedly
  -> closet accumulates hiding memory
  -> memory crosses a response threshold
  -> NPC investigates the closet
```

The public Phase 1 repo proves this pattern with browser demos, product wrappers, starter preset summaries, and Memory Lite while keeping the production runtime and protected research lanes private.

---

## Memory Lite Public Runtime

Memory Lite is the public-safe runtime abstraction for examples and product previews.

It includes:

- `MemoryAnchor`
- `MemoryLiteField`
- `writeEngram(...)`
- `queryMemory(...)` / `getLocalMemoryGradient(...)`
- `onTrigger(...)`
- `saveState(...)` / `loadState(...)`
- public-safe preset summary helpers

Start here:

- [`docs/MEMORY_LITE_RUNTIME.md`](docs/MEMORY_LITE_RUNTIME.md)
- [`src/memory-lite/`](src/memory-lite/)
- [`examples/memory-lite-basic.js`](examples/memory-lite-basic.js)

Memory Lite is intentionally lightweight. It makes the public repo usable without exposing private production runtime internals, paid plugin source, protected research implementation, private tuning constants, partner details, or future-stack internals.

---

## Phase 1 Product Surfaces

| Surface | What it is | Wrapper |
| --- | --- | --- |
| Room Remembers | Browser demo proving spatial memory, reinforcement, decay, and threshold response. | [`docs/products/ROOM_REMEMBERS.md`](docs/products/ROOM_REMEMBERS.md) |
| Memory Visualizer / Debug Heatmap | Public-safe visualization for memory intensity and anchor pressure. | [`docs/products/MEMORY_VISUALIZER_DEBUG_HEATMAP.md`](docs/products/MEMORY_VISUALIZER_DEBUG_HEATMAP.md) |
| Preset Pack Starter Edition | Ten named behavior templates for common memory patterns. | [`docs/products/PRESET_PACK_STARTER_EDITION.md`](docs/products/PRESET_PACK_STARTER_EDITION.md) |
| Memory Ledger Export | Public baseline for readable replay/export summaries. | [`docs/products/MEMORY_LEDGER_EXPORT.md`](docs/products/MEMORY_LEDGER_EXPORT.md) |
| Public product wrappers | Product-readable docs that connect demos, presets, export, and website copy. | [`docs/PHASE_1_PRODUCT_WRAPPERS.md`](docs/PHASE_1_PRODUCT_WRAPPERS.md) |

---

## Preset Pack Starter Edition

Preset Pack Starter Edition is the Phase 1 starter set of public-safe memory behavior templates:

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

Public summary files:

- [`presets/starter/README.md`](presets/starter/README.md)
- [`presets/starter/preset-summary.json`](presets/starter/preset-summary.json)

The public preset summary intentionally omits private coefficients, raw runtime internals, protected tuning rules, research details, partner details, and future-stack implementation details.

---

## Memory Ledger Export

Memory Ledger Export is the Phase 1 baseline for explaining what happened during a memory session:

```text
session -> anchors -> memory events -> channel totals -> triggered actions
```

For Phase 1, this repo provides the public wrapper and baseline language, not a private replay processor or production export service. Start with [`docs/products/MEMORY_LEDGER_EXPORT.md`](docs/products/MEMORY_LEDGER_EXPORT.md).

---

## What Is Public Here?

This repo includes:

- public Phase 1 browser demos;
- public product wrapper docs;
- public-safe starter preset summaries;
- Memory Lite runtime abstraction;
- Memory Ledger Export baseline documentation;
- quick-start, API, and integration docs;
- examples that teach the Memory Layer pattern;
- Unity/Godot adapter scaffolds as parked later-phase references.

This repo does **not** include:

- production runtime internals;
- paid plugin source;
- private tuning constants or protected coefficients;
- EchoPath Neuro code or research prototypes;
- protected future-stack internals;
- partner builds, partner details, or partner-specific optimization layers;
- unvalidated research claims.

Boundary details: [`docs/PUBLIC_PRIVATE_BOUNDARY.md`](docs/PUBLIC_PRIVATE_BOUNDARY.md)

---

## Unity / Godot Status

Unity and Godot folders in this repo are later-phase adapter references. They help developers understand how Memory Layer concepts may map into engines, but they are **not** the current Phase 1 product release.

Phase 1 is:

```text
browser demos + public product wrappers + starter preset summaries + Memory Lite + Memory Ledger Export baseline
```

---

## Start Here

Recommended path:

```text
README.md
  -> docs/PHASE_1_PRODUCT_WRAPPERS.md
  -> docs/MEMORY_LITE_RUNTIME.md
  -> docs/products/ROOM_REMEMBERS.md
  -> docs/products/MEMORY_VISUALIZER_DEBUG_HEATMAP.md
  -> docs/products/PRESET_PACK_STARTER_EDITION.md
  -> docs/products/MEMORY_LEDGER_EXPORT.md
  -> docs/PUBLIC_PRIVATE_BOUNDARY.md
  -> docs/START_HERE.md
  -> docs/QUICK_START.md
```

Additional developer docs:

- [`docs/API.md`](docs/API.md)
- [`docs/INTEGRATION_GUIDE.md`](docs/INTEGRATION_GUIDE.md)
- [`docs/ADAPTER_CONTRACT.md`](docs/ADAPTER_CONTRACT.md)
- [`examples/`](examples/)

---

## Repository Map

```text
docs/
  index.html
  MEMORY_LITE_RUNTIME.md
  PHASE_1_PRODUCT_WRAPPERS.md
  KNOWN_LIMITATIONS.md
  PUBLIC_PRIVATE_BOUNDARY.md
  WEBSITE_INTEGRATION_NOTES.md
  products/
    ROOM_REMEMBERS.md
    MEMORY_VISUALIZER_DEBUG_HEATMAP.md
    PRESET_PACK_STARTER_EDITION.md
    MEMORY_LEDGER_EXPORT.md
  room-remembers/
  memory-visualizer/

src/memory-lite/
  MemoryAnchor.js
  MemoryLiteField.js
  presets.js
  index.js

presets/starter/
  README.md
  preset-summary.json

examples/
  memory-lite-basic.js
  web-adapter.js
  unity-bridge.cs
  godot-bridge.gd

plugins/
  unity/   later-phase adapter reference
  godot/   later-phase adapter reference
```

---

## Website Integration

Website integration notes are tracked in [`docs/WEBSITE_INTEGRATION_NOTES.md`](docs/WEBSITE_INTEGRATION_NOTES.md). Public repo wrappers should be linked from the website after review, and Preset Pack product image/copy polish remains the next website task.

---

## License

The public examples and docs are provided for learning, evaluation, and prototype reference. See [`LICENSE`](LICENSE) for current terms.

Commercial plugin builds, preset products, and partner integrations may use separate terms.

---

## Anchor Statement

```text
This repo proves the public Memory Layer product surface.
EchoPath XR distributes the production runtime, paid plugins, presets, and partner builds separately.
```
