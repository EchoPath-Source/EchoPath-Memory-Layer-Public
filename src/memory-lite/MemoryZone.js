import { MemoryAnchor, distance3, normalizePosition } from "./MemoryAnchor.js";

export class MemoryZone {
  constructor({
    id,
    label = id,
    anchors = [],
    tags = [],
    metadata = {},
    visualStyle = {},
  } = {}) {
    if (!id || typeof id !== "string") {
      throw new Error("MemoryZone requires a string id.");
    }

    this.id = id;
    this.label = label;
    this.anchors = new Map();
    this.tags = [...tags];
    this.metadata = { ...metadata };
    this.visualStyle = { ...visualStyle };

    for (const anchor of anchors) {
      this.addAnchor(anchor);
    }
  }

  addAnchor(anchorLike) {
    const anchor = anchorLike instanceof MemoryAnchor ? anchorLike : new MemoryAnchor(anchorLike);
    this.anchors.set(anchor.id, anchor);
    return anchor;
  }

  removeAnchor(anchorId) {
    return this.anchors.delete(anchorId);
  }

  getAnchor(anchorId) {
    return this.anchors.get(anchorId) ?? null;
  }

  getMemoryTotals({ type = null } = {}) {
    const totals = {};
    for (const anchor of this.anchors.values()) {
      const channels = type ? [type] : Object.keys(anchor.memory);
      for (const channel of channels) {
        totals[channel] = (totals[channel] ?? 0) + Number(anchor.memory[channel] ?? 0);
      }
    }
    return totals;
  }

  queryMemory({ position = { x: 0, y: 0, z: 0 }, radius = Infinity, type = null } = {}) {
    const query = normalizePosition(position);
    const totals = {};
    let strongestAnchor = null;
    let strongestValue = 0;

    for (const anchor of this.anchors.values()) {
      const distance = distance3(query, anchor.position);
      if (distance > radius) continue;
      const finiteRadius = Number.isFinite(radius) ? Math.max(radius, 0.0001) : Infinity;
      const weight = Number.isFinite(finiteRadius) ? 1 - distance / finiteRadius : 1;
      const channels = type ? [type] : Object.keys(anchor.memory);
      for (const channel of channels) {
        const weighted = Number(anchor.memory[channel] ?? 0) * weight;
        totals[channel] = (totals[channel] ?? 0) + weighted;
        if (weighted > strongestValue) {
          strongestValue = weighted;
          strongestAnchor = anchor;
        }
      }
    }

    return {
      zoneId: this.id,
      zoneLabel: this.label,
      totals,
      strongestAnchorId: strongestAnchor?.id ?? null,
      strongestAnchorLabel: strongestAnchor?.label ?? null,
      gradientTarget: strongestAnchor ? { ...strongestAnchor.position } : null,
    };
  }

  toJSON() {
    return {
      id: this.id,
      label: this.label,
      anchors: [...this.anchors.values()].map(anchor => anchor.toJSON()),
      tags: [...this.tags],
      metadata: { ...this.metadata },
      visualStyle: { ...this.visualStyle },
    };
  }
}
