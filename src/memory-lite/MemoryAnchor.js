export class MemoryAnchor {
  constructor({
    id,
    label = id,
    position = { x: 0, y: 0, z: 0 },
    radius = 1,
    decayRate = 0.02,
    reinforcementMultiplier = 1,
    memory = {},
    thresholdRules = [],
    tags = [],
    metadata = {},
    visualStyle = {},
  } = {}) {
    if (!id || typeof id !== "string") {
      throw new Error("MemoryAnchor requires a string id.");
    }

    this.id = id;
    this.label = label;
    this.position = normalizePosition(position);
    this.radius = Number(radius);
    this.decayRate = Number(decayRate);
    this.reinforcementMultiplier = Number(reinforcementMultiplier);
    this.memory = { ...memory };
    this.thresholdRules = thresholdRules.map(rule => ({ ...rule }));
    this.tags = [...tags];
    this.metadata = { ...metadata };
    this.visualStyle = { ...visualStyle };
  }

  toJSON() {
    return {
      id: this.id,
      label: this.label,
      position: { ...this.position },
      radius: this.radius,
      decayRate: this.decayRate,
      reinforcementMultiplier: this.reinforcementMultiplier,
      memory: { ...this.memory },
      thresholdRules: this.thresholdRules.map(rule => ({ ...rule })),
      tags: [...this.tags],
      metadata: { ...this.metadata },
      visualStyle: { ...this.visualStyle },
    };
  }
}

export function normalizePosition(position = {}) {
  return {
    x: Number(position.x ?? 0),
    y: Number(position.y ?? 0),
    z: Number(position.z ?? 0),
  };
}

export function distance3(a, b) {
  const ap = normalizePosition(a);
  const bp = normalizePosition(b);
  const dx = ap.x - bp.x;
  const dy = ap.y - bp.y;
  const dz = ap.z - bp.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
