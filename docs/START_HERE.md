# Start Here in 10 Minutes

Use this path if you are new to EchoPath Memory Layer and want the fastest route from concept to working example.

## 1. Try the demo

Open the public demo hub:

```text
https://echopath-source.github.io/EchoPath-Memory-Layer-Public/
```

Then launch:

```text
The Room Remembers
```

Watch the core loop:

```text
player behavior -> memory anchor -> engram write -> threshold trigger -> NPC response
```

## 2. Read the quick start

Next read:

```text
docs/QUICK_START.md
```

This gives the shortest implementation path.

## 3. Read the API contract

Then read:

```text
docs/API.md
```

The beginner-preferred call is:

```js
memory.writeEngram(...)
```

`writeEvent(...)` is the lower-level explicit event writer used by adapters and deterministic replays.

## 4. Review the examples

Then open:

```text
examples/README.md
```

Use the examples to map the same pattern into Web, Unity, or Godot.

## 5. Review adapter expectations

Before writing an integration, read:

```text
docs/ADAPTER_CONTRACT.md
```

This explains how engine-specific events should become memory events.

---

## Local Preview

This repo is static. Any simple static server works.

From the repo root:

```bash
python3 -m http.server 8080 -d docs
```

Then open:

```text
http://localhost:8080/
```

Alternative with Node:

```bash
npx serve docs
```

---

## Recommended file order

```text
README.md
  -> docs/START_HERE.md
  -> docs/QUICK_START.md
  -> docs/API.md
  -> examples/README.md
  -> docs/ADAPTER_CONTRACT.md
```

---

## Next read

Continue with:

```text
docs/QUICK_START.md
```
