# Memory Layer Website Phase 1 Readiness

## Purpose

This handoff document is the repo-side checklist for integrating EchoPath Memory Layer Phase 1 with the live Memory Layer page at:

```text
https://echopathxr.com/echopath-memory-layer/
```

It turns the public wrappers, demos, preset summaries, and boundary language in this repository into website-ready sections and CTA targets.

## Readiness Status

| Area | Status | Notes |
| --- | --- | --- |
| Public demo hub | Ready | Static GitHub Pages target is `https://echopath-source.github.io/EchoPath-Memory-Layer-Public/`. |
| The Room Remembers demo | Ready | Browser demo proves memory writes, decay, reinforcement, threshold response, and readable event output. |
| Memory Visualizer demo | Ready | Browser demo shows public-safe anchor pressure, channel intensity, decay, and heatmap readout. |
| Product wrappers | Ready | Four wrapper docs define the Phase 1 product surfaces without exposing private runtime internals. |
| Starter preset summary | Ready | Ten public-safe starter presets are documented in Markdown and JSON for website copy. |
| Memory Ledger Export baseline | Ready | Public wrapper explains readable replay/export categories at a product level. |
| Public/private boundary | Ready | Boundary copy is present and should be linked from the website page or support docs. |
| Engine/plugin positioning | Needs careful wording | Unity and Godot scaffolds are later-phase adapter references, not the current Phase 1 release. |
| Store/product listing copy | Website task | The live shop should not imply this public repo contains the production runtime, paid plugin source, or private tuning rules. |

## Canonical Website Link Targets

Use these absolute targets from the Memory Layer page, product cards, emails, and download instructions.

| Website section | Link label | Target |
| --- | --- | --- |
| Hero CTA | Try the public demo hub | `https://echopath-source.github.io/EchoPath-Memory-Layer-Public/` |
| Demo card | Play The Room Remembers | `https://echopath-source.github.io/EchoPath-Memory-Layer-Public/room-remembers/` |
| Demo card | Open Memory Visualizer | `https://echopath-source.github.io/EchoPath-Memory-Layer-Public/memory-visualizer/` |
| Developer docs | Start here | `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/docs/START_HERE.md` |
| Product docs | Phase 1 wrappers | `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/docs/PHASE_1_PRODUCT_WRAPPERS.md` |
| Product docs | Room Remembers wrapper | `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/docs/products/ROOM_REMEMBERS.md` |
| Product docs | Visualizer wrapper | `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/docs/products/MEMORY_VISUALIZER_DEBUG_HEATMAP.md` |
| Product docs | Preset Pack wrapper | `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/docs/products/PRESET_PACK_STARTER_EDITION.md` |
| Product docs | Memory Ledger Export wrapper | `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/docs/products/MEMORY_LEDGER_EXPORT.md` |
| Presets | Starter preset summary | `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/presets/starter/README.md` |
| Presets | Starter preset JSON | `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/presets/starter/preset-summary.json` |
| Boundary | Public/private boundary | `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/docs/PUBLIC_PRIVATE_BOUNDARY.md` |
| Support | Contact | `mailto:contact@echopathxr.com` |

## Recommended Memory Layer Page Structure

### 1. Hero

Use this message hierarchy:

```text
Make your worlds remember.

EchoPath Memory Layer helps games, XR prototypes, and simulations turn repeated events into spatial memory: places can become suspicious, safe, haunted, familiar, dangerous, or scarred over time.
```

Primary CTA: **Try the public demo hub**  
Secondary CTA: **Review Phase 1 wrappers**  
Tertiary CTA: **Contact EchoPath XR**

### 2. Phase 1 Product Promise

Use this short explanation near the top of the page:

```text
Phase 1 proves the memory loop: scene events write spatial memory, memory decays or reinforces over time, thresholds trigger visible behavior, and designers can inspect what the world remembers.
```

### 3. Demo Cards

Use two cards above any purchase or lead-capture section:

- **The Room Remembers** — click zones, write memory, and watch repeated hiding trigger an NPC investigation.
- **Memory Visualizer / Debug Heatmap** — inspect public-safe memory pressure across anchors, channels, decay, and reinforcement.

### 4. Phase 1 Product Surface Cards

Show the four wrappers as product-readable surfaces:

1. **Room Remembers** — core proof demo.
2. **Memory Visualizer / Debug Heatmap** — designer/debug surface.
3. **Preset Pack Starter Edition** — ten named behavior templates.
4. **Memory Ledger Export** — readable session summary baseline.

### 5. Preset Pack Starter Edition

Website copy can list the ten public presets:

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

Keep the website summary high-level. Do not publish private coefficients, hidden tuning rules, protected runtime details, or partner-specific behavior logic.

### 6. Product Boundary

Include a concise boundary panel:

```text
The public repository includes browser demos, documentation, starter preset summaries, Memory Lite examples, and Phase 1 product wrappers. The production runtime, paid plugin source, private tuning constants, protected research lanes, and partner builds are distributed separately through EchoPath XR channels.
```

## Website Copy Guardrails

### Safe claims

- Worlds can remember repeated behavior.
- Memory can decay, reinforce, and cross thresholds.
- The demos show public-safe memory anchors, channels, and visible responses.
- Starter presets are named design templates for common adaptive-world patterns.
- Memory Ledger Export is currently a public baseline for readable session summaries.
- Memory Lite is a learning/demo abstraction, not the private production runtime.

### Avoid these claims until private/product channels support them

- Do not say the public repo includes the full production runtime.
- Do not say the public repo includes paid plugin source.
- Do not say Unity/Godot adapters are the current Phase 1 production release.
- Do not expose private coefficients, protected tuning rules, or partner details.
- Do not present EchoPath Neuro as included in the Memory Layer public product.
- Do not claim production-scale analytics, cloud replay processing, or authenticated partner endpoints from this repo.

## Pre-deployment QA Checklist

Before announcing full Phase 1 deployment, verify:

- [ ] Memory Layer page hero links to the GitHub Pages demo hub.
- [ ] The Room Remembers card links directly to `/room-remembers/` on GitHub Pages.
- [ ] Memory Visualizer card links directly to `/memory-visualizer/` on GitHub Pages.
- [ ] Product wrapper links use GitHub `blob/main` URLs, not relative repo paths copied from Markdown.
- [ ] Preset Pack copy lists all ten starter presets and links to the public summary.
- [ ] Product/store copy says what buyers receive through EchoPath XR channels, not what is in the public repo.
- [ ] Boundary language is visible before purchase/download CTAs.
- [ ] Support email is `contact@echopathxr.com`.
- [ ] Search/navigation labels use “Memory Layer” consistently.
- [ ] Website copy says “Phase 1” and does not over-position later-phase adapters.

## Repo-side Verification Commands

Run these from the repository root before handing the page to the website deployment process:

```bash
python3 -m http.server 8080 -d docs
```

Then check locally:

```text
http://localhost:8080/
http://localhost:8080/room-remembers/
http://localhost:8080/memory-visualizer/
```

Also run the lightweight syntax check:

```bash
node --check src/memory-lite/MemoryAnchor.js && node --check src/memory-lite/MemoryLiteField.js && node --check src/memory-lite/presets.js && node --check docs/room-remembers/game.js && node --check docs/memory-visualizer/app.js
```

## Launch Recommendation

The repo is ready to support the Memory Layer page as a Phase 1 public product surface if the website uses the absolute links and guardrails above. The main remaining work is website-side: update the Memory Layer page CTAs, product cards, navigation/search labels, and store copy so they match the public/private boundary in this repo.
