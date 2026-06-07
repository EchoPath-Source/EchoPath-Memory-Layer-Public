# Memory Lite Runtime

## Purpose

Memory Lite is the public-safe runtime abstraction for EchoPath Memory Layer examples.

It gives the public repo a usable product-preview layer without exposing production runtime internals, paid plugin source, protected research implementation, private tuning constants, partner details, or future-stack internals.

## What it includes

Memory Lite includes:

- `MemoryAnchor`
- `MemoryLiteField`
- `writeEngram(...)`
- `writeEvent(...)`
- `queryMemory(...)`
- `getLocalMemoryGradient(...)`
- `onTrigger(...)`
- `saveState(...)`
- `loadState(...)`
- basic threshold triggers
- public-safe preset summary helpers
- public-safe visual styling hints

## What it does not include

Memory Lite does not include:

- production runtime internals;
- paid plugin source;
- private tuning constants;
- protected research code;
- partner-specific integrations;
- production cloud sync;
- advanced analytics services.

## Import

```js
import {
  MemoryAnchor,
  MemoryLiteField,
  applyPresetSummary,
} from "../src/memory-lite/index.js";
```

## Basic usage

```js
const memory = new MemoryLiteField();

memory.addAnchor(new MemoryAnchor({
  id: "closet_01",
  label: "Closet Hide Spot",
  position: { x: 0, y: 0, z: 0 },
  radius: 2,
  memory: { hiding: 0 },
  thresholdRules: [
    {
      id: "closet_investigate",
      memoryType: "hiding",
      threshold: 0.7,
      mode: "cooldown",
      cooldownSeconds: 10,
      actionKey: "npc.investigate"
    }
  ]
}));

memory.writeEngram({
  position: player.position,
  eventType: "hiding",
  strength: 0.35,
  source: "player",
  radius: 2
});
```

## Agent query

```js
const readout = memory.queryMemory({
  position: npc.position,
  radius: 5,
  type: "hiding"
});

if (readout.suggestedAction === "investigate memory hotspot") {
  sendNpcTo(readout.gradientTarget);
}
```

## Save / load

```js
const snapshot = memory.saveState({ scene: "room_remembers" });
const restored = MemoryLiteField.loadState(snapshot);
```

The state envelope is local and developer-controlled. Production persistence, migrations, and cloud save behavior belong to later private/product builds.

## Preset summary helpers

Memory Lite can map the public preset summary into demo anchors:

```js
applyPresetSummary(memory, presetSummary, {
  id: "haunted_room_anchor_01",
  position: { x: 0, y: 0, z: 0 },
  radius: 2
});
```

This uses public-safe action themes and visual style hints. It does not expose private preset coefficients or production implementation details.

## Boundary note

Memory Lite is a public preview abstraction. It makes the public repo more usable for learning, demos, and wrapper evaluation, but it is not the full production runtime distributed by EchoPath XR.
