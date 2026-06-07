# EchoPath Memory Lite — Packaging Plan

## Purpose

EchoPath Memory Lite is the future public reference API package for the Memory Layer pattern.

It should teach developers how to work with memory anchors, engram writing, threshold triggers, agent queries, and local save/load without exposing private production runtime internals.

---

## Recommended Package Name

```text
@echopath/memory-lite
```

This package should be public-safe, small, dependency-light, and browser-friendly.

---

## What Belongs in Memory Lite

```text
MemoryField
MemoryAnchor schema
writeEngram(...)
writeEvent(...)
getLocalMemoryGradient(...)
onTrigger(...)
saveState()
loadState()
serialize()
deserialize()
small presets for demos
web adapter example
```

---

## What Does Not Belong in Memory Lite

```text
protected research engines
experimental research prototypes
protected future-stack internals
private tuning parameters
paid plugin source
partner-specific builds
server-side replay processing
research sandbox backend
```

---

## Suggested Rollout

### Step 1 — Current

Keep the API inside the public demo examples and document the contract in `docs/API.md`.

### Step 2 — Package Scaffold

Create:

```text
packages/memory-lite/
  package.json
  src/
    MemoryField.js
    types.js
    presets/
  README.md
```

### Step 3 — Public Demo Consumption

Update `docs/room-remembers/game.js` to import from the package source instead of carrying a local embedded demo engine.

### Step 4 — npm Publish

Publish only after the website, demo, and docs are aligned.

### Step 5 — Production Upsell

Use Memory Lite as the learning layer and funnel developers toward:

```text
paid preset packs
Unity/Godot plugins
studio support
partner builds
production runtime
```

---

## Deployment Guidance

Use GitHub Pages for static demos and docs.

Use Render or a similar backend only when the project needs:

```text
CSV/replay uploads
server-side processing
private runtime execution
API keys
session storage
authenticated partner endpoints
Python/PyTorch backend jobs
```

Do not introduce a hosted backend until the public demo and Memory Lite API are polished.

---

## Anchor Statement

```text
Memory Lite teaches the pattern.
EchoPath XR distributes the production runtime, plugins, presets, and partner builds.
```
