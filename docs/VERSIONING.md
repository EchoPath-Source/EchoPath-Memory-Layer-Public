# EchoPath Memory Layer — Public Versioning Policy

## Status

The public API contract is currently a draft Memory Lite surface.

Current public contract:

```text
API contract: v0.2
Memory state snapshot: echopath.memory_state / 0.1.0
Adapter contract: v0.1
```

---

## Compatibility Expectations

During the v0.x public examples phase:

- beginner examples should prefer `writeEngram(...)`;
- `writeEvent(...)` should remain available as the lower-level adapter/replay path;
- public method names documented in `docs/API.md` should not change without a note;
- breaking changes should be documented before demos/examples rely on them;
- save/load snapshots should include a schema and version;
- adapters should preserve threshold timing behavior documented in the API.

---

## Deprecation Policy

If a public method changes:

1. Keep the old method working in examples when practical.
2. Mark it as deprecated in docs.
3. Provide the replacement call.
4. Update recipes and demo code after the replacement is stable.

---

## Snapshot Policy

Versioned save/load snapshots should use this envelope:

```js
{
  schema: "echopath.memory_state",
  version: "0.1.0",
  savedAt: "2026-01-01T00:00:00.000Z",
  engine: "memory-lite",
  metadata: {},
  field: {}
}
```

Future versions should include migration notes.

---

## Public / Private Boundary

Public versioning applies to:

```text
Memory Lite API docs
public browser demos
example adapters
public save/load shape
```

It does not apply to private internals:

```text
production plugin source
private runtime optimizations
protected research engine
experimental research prototypes
protected future-stack internals
partner builds
```

---

## Next read

Continue with:

```text
docs/API.md
docs/ADAPTER_CONTRACT.md
```
