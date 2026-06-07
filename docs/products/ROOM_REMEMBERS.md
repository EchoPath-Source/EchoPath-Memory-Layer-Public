# The Room Remembers

## One-line Description

The Room Remembers is a browser demo where repeated player behavior leaves spatial memory that can trigger an NPC-style response.

## What It Proves

- A room, zone, or anchor can accumulate memory from repeated events.
- Memory can decay and reinforce over time.
- Thresholds can turn invisible history into visible behavior.
- The Memory Layer concept can be understood without exposing private runtime internals.

## What Is Included

- A public browser demo in [`docs/room-remembers/`](../../docs/room-remembers/).
- A lightweight scene with closet, hallway, and exit anchors.
- Public-safe memory channels such as hiding, sound, safe, and danger.
- Console-style output showing readable memory changes.

## How To Try It

Open the GitHub Pages demo hub and choose **The Room Remembers**, or run the static site locally:

```bash
python3 -m http.server 8080 -d docs
```

Then open:

```text
http://localhost:8080/room-remembers/
```

## Public-safe Use Cases

- Stealth prototypes where repeated hiding changes NPC attention.
- Horror rooms that become suspicious after repeated actions.
- Tutorial zones that react to repeated player confusion.
- Lightweight product demos for spatial memory behavior.

## Known Limitations

- The demo uses a small scene and simplified browser logic.
- Values are illustrative and not production tuning guidance.
- The public demo does not include production runtime internals, private tuning constants, or paid plugin source.

## Next Step / CTA

After trying the demo, open the [Memory Visualizer wrapper](MEMORY_VISUALIZER_DEBUG_HEATMAP.md) to see how spatial memory can be inspected as a debug layer.

## Boundary Note

No private runtime, protected research internals, EchoPath Neuro implementation, partner details, or protected future-stack internals are included.
