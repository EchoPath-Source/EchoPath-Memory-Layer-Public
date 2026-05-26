# EchoPath Memory Layer — Scenario Recipes

These recipes are small copy/paste patterns for early prototypes.

Each recipe follows the same loop:

```text
anchor -> writeEngram -> threshold -> query/response
```

---

## Recipe 1: Stealth Hiding Spot

Use when a player repeatedly hides in the same location and an NPC should eventually investigate.

### Anchor

```js
memory.addAnchor({
  id: "closet",
  label: "Closet",
  position: { x: 7, y: 2, z: 0 },
  radius: 1,
  decayRate: 0.02,
  reinforcementMultiplier: 1.2,
  memory: { hiding: 0 },
  thresholdRules: [
    {
      id: "closet_investigate",
      memoryType: "hiding",
      threshold: 0.72,
      mode: "cooldown",
      cooldownSeconds: 12,
      actionKey: "npc.investigate"
    }
  ]
});
```

### Event

```js
memory.writeEngram({
  position: player.position,
  eventType: "hiding",
  strength: 0.32,
  source: "player",
  tags: ["stealth", "repeat_behavior"],
  radius: 2
});
```

### Response

```js
memory.onTrigger(({ trigger }) => {
  if (trigger.actionKey === "npc.investigate") {
    sendNpcTo(trigger.anchorId);
  }
});
```

---

## Recipe 2: Patrol Route Familiarity

Use when repeated movement through a hallway should make NPCs predict a route.

```js
memory.addAnchor({
  id: "main_hallway",
  label: "Main Hallway",
  position: { x: 4, y: 2, z: 0 },
  radius: 2,
  decayRate: 0.03,
  reinforcementMultiplier: 1.0,
  memory: { route: 0 },
  thresholdRules: [
    {
      id: "route_prediction",
      memoryType: "route",
      threshold: 0.60,
      mode: "cooldown",
      cooldownSeconds: 10,
      actionKey: "npc.predict_route"
    }
  ]
});

memory.writeEngram({
  position: player.position,
  eventType: "route",
  strength: 0.20,
  source: "player",
  tags: ["path_memory"],
  radius: 2.5
});
```

Agent query:

```js
const readout = memory.getLocalMemoryGradient({
  position: npc.position,
  radius: 6,
  type: "route"
});

if (readout.familiarity > 0.55) {
  biasNpcPatrolToward(readout.gradientTarget);
}
```

---

## Recipe 3: Safe Route Memory

Use when a route should become more attractive as it is repeatedly used without danger.

```js
memory.addAnchor({
  id: "safe_exit",
  label: "Safe Exit",
  position: { x: 10, y: 1, z: 0 },
  radius: 1.5,
  decayRate: 0.018,
  reinforcementMultiplier: 1.0,
  memory: { safe: 0 },
  thresholdRules: [
    {
      id: "safe_route_known",
      memoryType: "safe",
      threshold: 0.50,
      mode: "repeat",
      actionKey: "ui.highlight_safe_route"
    }
  ]
});

memory.writeEngram({
  position: player.position,
  eventType: "safe",
  strength: 0.18,
  source: "player",
  tags: ["route", "survival"],
  radius: 3
});
```

---

## Recipe 4: Noise Draws Attention

Use when sound events should attract NPC curiosity.

```js
memory.addAnchor({
  id: "broken_lamp",
  label: "Broken Lamp",
  position: { x: 5, y: 5, z: 0 },
  radius: 1,
  decayRate: 0.04,
  reinforcementMultiplier: 1.1,
  memory: { sound: 0 },
  thresholdRules: [
    {
      id: "noise_check",
      memoryType: "sound",
      threshold: 0.5,
      mode: "cooldown",
      cooldownSeconds: 6,
      actionKey: "npc.check_noise"
    }
  ]
});

memory.writeEngram({
  position: sound.position,
  eventType: "sound",
  strength: 0.4,
  source: "world_object",
  tags: ["noise", "attention"],
  radius: 2
});
```

---

## Next read

Continue with:

```text
docs/API.md
docs/ADAPTER_CONTRACT.md
```
