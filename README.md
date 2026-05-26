# EchoPath Memory Layer — Public Examples

**Make your worlds remember.**

EchoPath Memory Layer is adaptive spatial-memory middleware for games, XR, and simulation prototypes.

This public repository contains examples, documentation, and browser demos that show the integration pattern. The full runtime, paid plugin builds, research prototypes, and future EchoPath stack internals are distributed separately through official downloads, partner builds, and EchoPath XR channels.

Website: https://echopathxr.com  
Product page: https://echopathxr.com/echopath-memory-layer/  
Contact: contact@echopathxr.com

---

## Start Here

For the fastest onboarding path, follow:

```text
README.md
  -> docs/START_HERE.md
  -> docs/QUICK_START.md
  -> docs/API.md
  -> examples/README.md
  -> docs/ADAPTER_CONTRACT.md
```

1. **See it live** -> [Try the GitHub demo](https://echopath-source.github.io/EchoPath-Memory-Layer-Public/)
2. **Start in 10 minutes** -> [Follow the Start Here path](docs/START_HERE.md)
3. **Build the core loop** -> [Read Quick Start](docs/QUICK_START.md)
4. **Understand the API** -> [Read API docs](docs/API.md)
5. **Explore examples** -> [Explore example code](examples/)
6. **Use it** -> [Buy the preset pack](https://echopathxr.com/product/preset-pack-starter-edition/)
7. **Ship it** -> [Get plugin + support](https://echopathxr.com/echopath-memory-layer/)

---

## Run Locally

This repo is static. Any simple static server works.

```bash
python3 -m http.server 8080 -d docs
```

Then open:

```text
http://localhost:8080/
```

Alternative:

```bash
npx serve docs
```

---

## What Is This?

EchoPath Memory Layer helps developers create environments that remember repeated behavior and respond over time.

Core loop:

```text
Scene event -> spatial memory -> decay / reinforcement -> threshold response -> game behavior
```

Example:

```text
Player hides in closet repeatedly
  -> closet accumulates hiding memory
  -> memory crosses threshold
  -> NPC investigates the closet
```

---

## Beginner API Rule

Use `writeEngram(...)` first.

```js
memory.writeEngram({
  position: player.position,
  eventType: "hiding",
  strength: 0.32,
  source: "player",
  tags: ["stealth", "repeat_behavior"],
  radius: 2
})
```

Use `writeEvent(...)` when you need a lower-level explicit event writer for adapters, deterministic replay, or direct anchor targeting.

---

## What Is Public Here?

This repo includes:

- public API documentation
- quick-start docs
- Unity and Godot bridge examples
- web adapter example
- browser demo scaffolds
- integration guide
- “Can I build this myself?” transparency page

This repo does **not** include:

- private production runtime
- paid plugin source
- EchoPath Neuro research prototypes
- Collapse Neural Network v7+ research models
- Q-RRG convergence internals
- future EchoPath Cognition / Native / Director internals
- partner-specific builds

---

## Developer Funnel

```text
Try the demo
  -> learn the pattern
  -> prototype with examples
  -> use starter presets
  -> request plugin / partner support
```

The public examples are designed for learning and prototyping. Production plugin builds and supported integrations are distributed separately through EchoPath XR.

---

## Repository Map

```text
docs/
  index.html
  styles.css
  API.md
  START_HERE.md
  QUICK_START.md
  INTEGRATION_GUIDE.md
  ADAPTER_CONTRACT.md
  MEMORY_LITE_PACKAGING.md
  CAN_I_BUILD_THIS_MYSELF.md
  PUBLIC_PRIVATE_BOUNDARY.md

examples/
  README.md
  unity-bridge.cs
  godot-bridge.gd
  web-adapter.js
  unity-example-scene.md

docs/room-remembers/
  index.html
  game.js

docs/memory-visualizer/
```

---

## API Stability

The public API contract is currently documented as a draft Memory Lite surface.

Compatibility expectations:

- method names in `docs/API.md` should remain stable within the v0.x public examples;
- breaking changes should be documented in API notes before demos/examples rely on them;
- beginner examples should prefer `writeEngram(...)`;
- `writeEvent(...)` remains available as the lower-level adapter/replay path.

---

## For Developers

Use this repo if you want to understand the pattern:

- anchors / zones
- memory events
- decay
- reinforcement
- threshold triggers
- agent memory queries
- engine adapter mapping

For production use, EchoPath XR plans to provide plugin builds, tuned presets, visualizer support, and studio integration support.

---

## For Researchers

EchoPath Memory Layer is informed by deeper research into memory-field computation and adaptive systems, but this public repository is not the research repository.

The research lane is separate under EchoPath Neuro and is not included here.

---

## License

The public examples and docs are provided for learning, evaluation, and prototype reference. See [`LICENSE`](LICENSE) for current terms.

Commercial plugin builds, preset products, and partner integrations may use separate terms.

---

## Anchor Statement

```text
This repo teaches the pattern.
EchoPath XR distributes the production runtime, plugins, presets, and partner builds.
```

Next read: [Start Here in 10 Minutes](docs/START_HERE.md)
