# Public Memory Lab V2 — Validation and Content Playbook

**Created:** 2026-11-24  
**Status:** proposed review-branch expansion; **not verified on GitHub Pages until merged and smoke-tested in a browser**  
**Privacy:** public synthetic anchors and illustrative values only, no private Spatial Engram source or research kernels.

## Purpose

Extend the existing browser demos for two specific outcomes:

1. **Product content:** show an easily understood cause → accumulating memory → threshold → host effect, with strong in-scene visualization and repeatable presentation steps.
2. **Behavioral validation:** test deterministic sequences, zone aggregation, once/cooldown rules, action-binding results, local save/restore and bounded export *in the public reference*. This supplements—but does not replace—private engine CI and Unity EditMode/PlayMode tests.

The demos share `docs/lab/public-memory-lab.js` and the six synthetic reference sequences in `docs/lab/scenarios.js`. The public module is independent educational code; it does **not** import `src/core` from the private repository or reproduce its numerically tuned implementation.

## Demonstrations and repeatable capture scripts

| Location | Scripted scenario | Visual point | Engineering observation |
| --- | --- | --- | --- |
| Room Remembers | Room Remembers | Four hiding events → atmosphere shifts → NPC investigates | Multi-threshold state and handled host callbacks |
| Room Remembers | Living Door | Four door interactions → door glow → door opens | Persistent object state via separate browser host handler |
| Room Remembers | Predator Trail | Remembered exit route and hallway danger alter a display NPC | Memory-informed route cue, **not real pathfinding** |
| Memory Visualizer | Hazard Recall | Hazard intensity appears in area heat; warning action registered | Zone aggregation and handled warning cue |
| Memory Visualizer | Familiar Route | Retained safe-route signal with unbound route response; bind and rerun | Unbound vs handled action semantics |
| Memory Visualizer | Room Usage | Presence/sound activity across overlapping zones | Zone totals do not clone the underlying memory |

### Capture procedure

For each scenario, load the public page, select its named profile, press **Run scripted scenario** / **Run fixed sequence** once, and capture:

- **Before:** state after Reset with baseline meters/zone summaries;
- **During:** event/threshold progression (for a staged clip, press corresponding event buttons manually);
- **After:** final memory pressure, action diagnostics, zone totals and actual browser host state;
- **Persistence:** choose Save locally, reload/reset, then Restore, showing state continuity;
- **Evidence:** Export summary, confirm event counts, action statuses, synthetic data and retention disclaimer.

Browser storage is local and opt-in per button press. Export uses a local JSON Blob; do not collect real user data or claim records were sent to EchoChain/EchoNet.

## Reproducible validation

From the public repository root:

```bash
npm run validate:presets
npm test
npm run smoke:lab
npm run evidence:lab
```

The last command writes `outputs/public-memory-lab-evidence.json`, explicitly flagged as public synthetic evidence, with six scenario results: event counts, simulation time, rule action keys, handled/unhandled status, shared-zone totals and history retention.

Run actual browser QA (desktop and mobile) as a **separate required acceptance**, checking:

- both pages load ES modules under GitHub Pages' `docs/` publication root (relative `../lab/` imports resolve);
- new scenario controls, buttons, canvas scaling and mobile layout;
- Room/door/trail host effects correspond to actual rule firing rather than timed fake animations;
- reset, manual writing, explicit time advance and repeatable scripted run;
- zone outlines and area totals reflect the same anchors, including overlapping membership;
- missing route handler in the Visualizer is labeled `unhandled`, and becomes `handled` **only after an explicit binding and a new scenario run**;
- once-only trigger doesn't refire after local snapshot restore;
- exported JSON parses and says `completeSimulationReplay: false`;
- no browser console errors, no 404 asset paths or hidden cross-origin API calls.

**Not tested by Node CI alone:** actual DOM layout, canvas visuals, mobile accessibility, frame rate, GitHub Pages publication or WordPress embedding. Record browser/device observations before merging or promoting to the website.

## Safe messaging and content claims

**Supported by the public demonstrations:**

- “Explore how remembered events can change a simulated environment.”
- “Compare memory in overlapping zones and inspect rule outcomes.”
- “Run fixed synthetic scenarios and export a readable event summary.”
- “See the difference between a memory threshold and a registered host action.”
- “Create repeatable test inputs before moving behavior into a Unity host.”

**Not supported by this work alone:**

- “The private Spatial Engram Engine has now been numerically validated by the public demo.”
- “The Unity Living Memory Plugin is complete, performance-tested or on sale.”
- “Memory Lab delivers full autonomous NPC behavior, true pathfinding, exact deterministic world replay, or self-organizing resonance research.”
- “The ten Starter presets all include working Unity NPC/VFX/quest adapters.”
- Any claims of proprietary kernel disclosure, physics breakthroughs, or performance superiority.

## Why this helps the Unity port

The public demo tests **observable product semantics**—event → memory → zone → threshold → action outcome → snapshot/report—using platform-neutral examples and clear customer vocabulary. It can reveal contradictory UX or missing API concepts before Unity inspector implementation. The **private** engine's versioned golden fixtures remain authoritative for numerical and state behavior; Unity must conform to those separately.

### Follow-up acceptance gate before changing Unity code

1. Merge this public PR only after source/privacy review and green CI.
2. Confirm live browser functionality and six scenario results after GitHub Pages publishes.
3. Cross-check the public scenarios against private Gate 3D behavior at the **conceptual API/observable level**. Document deliberate differences: public Lab uses simple clamped writes and synthetic thresholds; private MemoryField uses its own tested reinforcement, propagation and timing semantics.
4. Keep the customer tutorial and preset authoring guide as required Gate 4 product deliverables. The public Lab can supply real screenshots and educational narrative, but not fictitious Unity editor screenshots.

## Content package opportunities

- Short clip: **“A room learns where you hide.”** Four repeated hiding events, memory meter climbs, host NPC changes position.
- Short clip: **“A door remembers you.”** Repeated interactions open the door; save, reload and verify.
- Short clip: **“Memory changes route preference.”** Compare room baseline to host display cue; do not suggest a real pathfinder.
- Engineering carousel: **“Signals are not actions.”** Unbound route cue versus registered callback, plus visible diagnostic statuses.
- Technical explainer: **“Why zones matter.”** Show one hallway anchor contributing to two overlapping zones without memory duplication.

These are production plans, not videos already recorded.
