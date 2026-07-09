# Website Integration Notes

These notes connect the public EchoPath Memory Layer Phase 1 wrappers to the website/product surface.

## Current Website Status

- Memory Layer page: target page is `https://echopathxr.com/echopath-memory-layer/`.
- Repo-side Phase 1 demo hub and wrappers are ready for website linking.
- Website-side deployment should use the absolute link map and checklist in [Memory Layer Website Phase 1 Readiness](WEBSITE_MEMORY_LAYER_PHASE_1_READINESS.md).
- Public search results reviewed during this pass surfaced EchoPath XR and EchoPath Smooth pages, but did not reliably surface Memory Layer product/listing pages yet; treat Memory Layer navigation, indexing, and product-card visibility as website-side launch checks.

## Public Repo Link Targets

Website pages should use absolute public URLs rather than copying local Markdown-relative paths:

- GitHub Pages demo hub: `https://echopath-source.github.io/EchoPath-Memory-Layer-Public/`
- The Room Remembers demo: `https://echopath-source.github.io/EchoPath-Memory-Layer-Public/room-remembers/`
- Memory Visualizer demo: `https://echopath-source.github.io/EchoPath-Memory-Layer-Public/memory-visualizer/`
- Phase 1 wrappers: `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/docs/PHASE_1_PRODUCT_WRAPPERS.md`
- The Room Remembers wrapper: `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/docs/products/ROOM_REMEMBERS.md`
- Memory Visualizer / Debug Heatmap wrapper: `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/docs/products/MEMORY_VISUALIZER_DEBUG_HEATMAP.md`
- Preset Pack Starter Edition wrapper: `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/docs/products/PRESET_PACK_STARTER_EDITION.md`
- Preset Pack public summary: `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/presets/starter/README.md`
- Memory Ledger Export wrapper: `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/docs/products/MEMORY_LEDGER_EXPORT.md`
- EchoGenesis integration notes: `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/docs/ECHOGENESIS_INTEGRATION_NOTES.md`
- Public/private boundary: `https://github.com/EchoPath-Source/EchoPath-Memory-Layer-Public/blob/main/docs/PUBLIC_PRIVATE_BOUNDARY.md`

## Website Copy Guidance

Use Phase 1 language:

```text
Make your worlds remember.
Try the Room Remembers demo.
Open the Memory Visualizer.
Review Starter Edition presets.
Export a readable Memory Ledger baseline.
```

Avoid implying that the public repo includes production runtime internals, paid plugin source, protected research code, or partner builds.

## Cross-Repo Language Guidance

If the website references broader ecosystem fit, keep it short and public-safe:

```text
Memory Layer public demos can produce readable session summaries and memory event patterns. Deeper sealed-event, telemetry, and governance integrations are handled by separate EchoGenesis / EchoNet / EchoChain architecture tracks.
```

Do not use website copy to imply that EchoChain, EchoNet, or Reflection Ledger integrations are production-ready from this public repo.

## Product Polish Order

1. Stabilize public wrappers in this repo.
2. Review website links and CTA paths.
3. Add wrapper links from the Memory Layer page and Live Demos Hub.
4. Polish Preset Pack product image and copy.
5. Only after wrapper review, revisit public-facing adapter/plugin packaging language.

## Preset Pack Website Gap

Preset Pack product image/copy polish remains the next website task. The website should summarize the ten public starter presets without exposing private runtime internals, tuning constants, or future-stack implementation details.

## Boundary Reminder

EchoPath Neuro is a separate research lane and should only appear, if at all, as intentionally not included in the public Memory Layer product repo.
