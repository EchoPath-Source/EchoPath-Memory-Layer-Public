# Memory Visualizer / Debug Heatmap

## One-line Description

The Memory Visualizer is a public-safe heatmap/debug surface showing what anchors remember across simple memory channels.

## What It Proves

- Spatial memory can be inspected, not just triggered.
- Designers can reason about anchor intensity, decay, reinforcement, and threshold pressure.
- Debug views can make adaptive worlds easier to tune and explain.

## What Is Included

- A public visualizer in [`docs/memory-visualizer/`](../../docs/memory-visualizer/).
- Click-to-write memory pulses.
- Public channels for hiding, sound, danger, and safe memory.
- A readable heatmap-style canvas and text readout.

## How To Try It

Open the GitHub Pages demo hub and choose **Memory Visualizer**, or run locally:

```bash
python3 -m http.server 8080 -d docs
```

Then open:

```text
http://localhost:8080/memory-visualizer/
```

## Public-safe Use Cases

- Debugging why a location feels haunted, dangerous, safe, or suspicious.
- Explaining spatial memory to designers and technical artists.
- Reviewing memory pressure before adding engine-specific tooling.
- Demonstrating the product layer without exposing the protected runtime.

## Known Limitations

- The heatmap is a public-safe visualization, not a full production debugger.
- The demo uses small maps and simplified channel logic.
- It does not expose private runtime internals, hidden coefficients, or partner tooling.

## Next Step / CTA

Review the [Preset Pack Starter Edition wrapper](PRESET_PACK_STARTER_EDITION.md) to see how common memory behaviors can be packaged into named templates.

## Boundary Note

No private runtime, protected research internals, EchoPath Neuro implementation, partner details, or protected future-stack internals are included.
