# Website Integration Notes

These notes connect the public EchoPath Memory Layer Phase 1 wrappers to the website/product surface.

## Current Website Status

- Memory Layer page: live/fixed.
- Live Demos Hub: live/fixed.
- Memory Visualizer page: live/fixed.
- Navigation menu: live/fixed.

## Public Repo Link Targets

After review, website pages should link to:

- [GitHub Pages demo hub](../docs/index.html)
- [The Room Remembers wrapper](products/ROOM_REMEMBERS.md)
- [Memory Visualizer / Debug Heatmap wrapper](products/MEMORY_VISUALIZER_DEBUG_HEATMAP.md)
- [Preset Pack Starter Edition wrapper](products/PRESET_PACK_STARTER_EDITION.md)
- [Preset Pack public summary](../presets/starter/README.md)
- [Memory Ledger Export wrapper](products/MEMORY_LEDGER_EXPORT.md)
- [Public/private boundary](PUBLIC_PRIVATE_BOUNDARY.md)

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
