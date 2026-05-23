# EchoPath Memory Layer — Public Examples

**Make your worlds remember.**

EchoPath Memory Layer is adaptive spatial-memory middleware for games, XR, and simulation prototypes.

This public repository contains examples, documentation, and browser demos that show the integration pattern. The full runtime, paid plugin builds, research prototypes, and future EchoPath stack internals are distributed separately through official downloads, partner builds, and EchoPath XR channels.

Website: https://echopathxr.com  
Product page: https://echopathxr.com/echopath-memory-layer/  
Contact: contact@echopathxr.com

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

## Quick Start

1. Try the website demo: https://echopathxr.com/echopath-memory-layer/
2. Read the quick start: [`docs/QUICK_START.md`](docs/QUICK_START.md)
3. Review the API contract: [`docs/API.md`](docs/API.md)
4. Explore engine examples:
   - [`examples/unity-bridge.cs`](examples/unity-bridge.cs)
   - [`examples/godot-bridge.gd`](examples/godot-bridge.gd)
   - [`examples/web-adapter.js`](examples/web-adapter.js)
5. Review the integration guide: [`docs/INTEGRATION_GUIDE.md`](docs/INTEGRATION_GUIDE.md)

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
  API.md
  QUICK_START.md
  INTEGRATION_GUIDE.md
  CAN_I_BUILD_THIS_MYSELF.md
  PUBLIC_PRIVATE_BOUNDARY.md

examples/
  unity-bridge.cs
  godot-bridge.gd
  web-adapter.js
  unity-example-scene.md

public-demo/
  room-remembers/
  memory-visualizer/
```

---

## For Developers

Use this repo if you want to understand the pattern:

- anchors / zones
- memory events
- decay
- reinforcement
- threshold triggers
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
