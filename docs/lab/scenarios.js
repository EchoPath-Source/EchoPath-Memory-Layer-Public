import { PublicMemoryLab } from "./public-memory-lab.js";

export const ROOM_PROFILES = {
  room: {
    title: "The Room Remembers",
    description: "Repeated hiding raises room suspicion. Demo host callbacks add an atmosphere cue, then move the NPC to investigate.",
    actions: [
      { anchorId: "closet", channel: "hiding", strength: 0.2, label: "Hide in Closet" },
      { anchorId: "hallway", channel: "sound", strength: 0.22, label: "Make Sound in Hallway" },
    ],
    sequence: Array.from({ length: 4 }, () => ({ anchorId: "closet", channel: "hiding", strength: 0.21 })),
  },
  door: {
    title: "Living Door",
    description: "A standalone sample recipe: repeated interactions build object memory until a door opens. The door effect is a demo host action.",
    actions: [
      { anchorId: "door", channel: "object", strength: 0.22, label: "Interact with Door" },
      { anchorId: "hallway", channel: "sound", strength: 0.2, label: "Knock in Hallway" },
    ],
    sequence: Array.from({ length: 4 }, () => ({ anchorId: "door", channel: "object", strength: 0.22 })),
  },
  trail: {
    title: "Predator Trail",
    description: "Memory-informed route preference in a simplified NPC visualization; this is not autonomous navigation or pathfinding.",
    actions: [
      { anchorId: "exit", channel: "route", strength: 0.19, label: "Travel toward Exit" },
      { anchorId: "hallway", channel: "danger", strength: 0.19, label: "Mark Hallway Hazard" },
    ],
    sequence: [
      ...Array.from({ length: 4 }, () => ({ anchorId: "exit", channel: "route", strength: 0.19 })),
      ...Array.from({ length: 3 }, () => ({ anchorId: "hallway", channel: "danger", strength: 0.19 })),
    ],
  },
};

export function createRoomLab(profile = "room", onHostAction = null) {
  if (!Object.hasOwn(ROOM_PROFILES, profile)) throw new Error("Unknown room scenario");
  const lab = new PublicMemoryLab({ historyLimit: 64, defaultDecayRate: 0.015 });
  for (const anchor of [
    { id: "closet", label: "Closet", x: 1, y: 1, memory: { hiding: 0 } },
    { id: "hallway", label: "Hallway", x: 4, y: 2.5, memory: { sound: 0, danger: 0 } },
    { id: "exit", label: "Exit", x: 7, y: 4, memory: { route: 0, safe: 0 } },
    { id: "door", label: "Living Door", x: 7, y: 1, memory: { object: 0 } },
  ]) lab.addAnchor(anchor);
  lab.addZone({ id: "west_wing", label: "West Wing", anchorIds: ["closet", "hallway"] });
  lab.addZone({ id: "main_route", label: "Main Route", anchorIds: ["hallway", "exit", "door"] });
  const rules = {
    room: [
      { id: "atmosphere", anchorId: "closet", channel: "hiding", threshold: 0.4, mode: "once", actionKey: "demo.atmosphere" },
      { id: "investigate", anchorId: "closet", channel: "hiding", threshold: 0.7, mode: "once", actionKey: "demo.investigate" },
    ],
    door: [
      { id: "door-glow", anchorId: "door", channel: "object", threshold: 0.4, mode: "once", actionKey: "demo.door_glow" },
      { id: "door-open", anchorId: "door", channel: "object", threshold: 0.7, mode: "once", actionKey: "demo.door_open" },
    ],
    trail: [
      { id: "route-preference", anchorId: "exit", channel: "route", threshold: 0.55, mode: "once", actionKey: "demo.prefer_exit" },
      { id: "avoid-hall", anchorId: "hallway", channel: "danger", threshold: 0.53, mode: "once", actionKey: "demo.avoid_hall" },
    ],
  };
  for (const rule of rules[profile]) lab.addRule(rule);
  if (typeof onHostAction === "function") {
    for (const { actionKey } of rules[profile]) {
      lab.registerAction(actionKey, trigger => onHostAction(trigger), "demo-visual-effect");
    }
  }
  return lab;
}

export function runRoomSequence(lab, profile, { advanceSeconds = 0.25 } = {}) {
  const config = ROOM_PROFILES[profile];
  if (!config) throw new Error("Unknown room scenario");
  for (const step of config.sequence) {
    lab.write(step.anchorId, step.channel, step.strength, "synthetic_sequence");
    lab.advance(advanceSeconds);
  }
  return lab.report();
}

export const VISUALIZER_PROFILES = {
  "danger": {
    title: "Hazard Recall",
    description: "Repeated hazard observations form an explicit danger field and area totals.",
    sequence: [
      { anchorId: "hallway", channel: "danger", strength: 0.24 },
      { anchorId: "hallway", channel: "danger", strength: 0.24 },
      { anchorId: "basement", channel: "danger", strength: 0.18 },
    ],
  },
  "safe": {
    title: "Familiar Route",
    description: "A remembered safe corridor influences a lightweight, host-side recommendation.",
    sequence: [
      { anchorId: "exit", channel: "safe", strength: 0.23 },
      { anchorId: "exit", channel: "safe", strength: 0.23 },
      { anchorId: "hallway", channel: "route", strength: 0.26 },
    ],
  },
  "social": {
    title: "Room Usage",
    description: "Presence and sound readings illustrate how zones aggregate memory from overlapping areas.",
    sequence: [
      { anchorId: "bedroom", channel: "presence", strength: 0.22 },
      { anchorId: "closet", channel: "presence", strength: 0.22 },
      { anchorId: "hallway", channel: "sound", strength: 0.19 },
    ],
  },
};

export const VISUALIZER_ANCHORS = [
  { id: "closet", label: "Closet", x: 180, y: 130 },
  { id: "hallway", label: "Hallway", x: 455, y: 255 },
  { id: "exit", label: "Exit", x: 720, y: 375 },
  { id: "basement", label: "Basement", x: 470, y: 430 },
  { id: "bedroom", label: "Bedroom", x: 710, y: 165 },
];

export function createVisualizerLab() {
  const lab = new PublicMemoryLab({ historyLimit: 72, defaultDecayRate: 0.015 });
  for (const anchor of VISUALIZER_ANCHORS) lab.addAnchor({ ...anchor, memory: {} });
  lab.addZone({ id: "interior", label: "Interior", anchorIds: ["closet", "bedroom", "hallway"] });
  lab.addZone({ id: "transit", label: "Transit Corridor", anchorIds: ["hallway", "exit", "basement"] });
  lab.addZone({ id: "quiet", label: "Quiet Corner", anchorIds: ["closet", "bedroom"] });
  lab.addRule({
    id: "hazard-cue", anchorId: "hallway", channel: "danger",
    threshold: 0.45, mode: "once", actionKey: "demo.hazard_warning",
  });
  // Intentionally unbound to demonstrate a truthful missing host action.
  lab.addRule({
    id: "route-cue", anchorId: "exit", channel: "safe",
    threshold: 0.45, mode: "once", actionKey: "demo.route_indicator",
  });
  return lab;
}

export function runVisualizerSequence(lab, profile = "danger") {
  const sequence = VISUALIZER_PROFILES[profile]?.sequence;
  if (!sequence) throw new Error("Unknown visualizer sequence");
  for (const event of sequence) {
    lab.write(event.anchorId, event.channel, event.strength, "synthetic_sequence");
    lab.advance(0.2);
  }
  return lab.report();
}
