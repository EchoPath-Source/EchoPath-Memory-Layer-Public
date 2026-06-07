import { MemoryAnchor } from "./MemoryAnchor.js";

const DEFAULT_STYLE_BY_CATEGORY = {
  atmosphere: { debugColorHint: "tension", curve: "soft_bloom", heatmapIntensity: "hiding" },
  "navigation-pressure": { debugColorHint: "route", curve: "trail", heatmapIntensity: "route" },
  guidance: { debugColorHint: "safe", curve: "gentle_ramp", heatmapIntensity: "safe" },
  "hazard-memory": { debugColorHint: "danger", curve: "pulse", heatmapIntensity: "danger" },
  exploration: { debugColorHint: "reward", curve: "spark", heatmapIntensity: "reward" },
  "social-space": { debugColorHint: "presence", curve: "crowd_flow", heatmapIntensity: "presence" },
  "ritual-interaction": { debugColorHint: "object", curve: "charge", heatmapIntensity: "object" },
  territory: { debugColorHint: "territory", curve: "boundary", heatmapIntensity: "territory" },
  routine: { debugColorHint: "presence", curve: "loop", heatmapIntensity: "presence" },
  aftermath: { debugColorHint: "danger", curve: "linger", heatmapIntensity: "danger" },
};

const DEFAULT_CHANNEL_BY_CATEGORY = {
  atmosphere: "hiding",
  "navigation-pressure": "route",
  guidance: "safe",
  "hazard-memory": "danger",
  exploration: "reward",
  "social-space": "presence",
  "ritual-interaction": "object",
  territory: "territory",
  routine: "presence",
  aftermath: "danger",
};

export function createAnchorFromPresetSummary(preset, {
  id = `${preset.id || "preset"}_anchor_01`,
  label = preset.name,
  position = { x: 0, y: 0, z: 0 },
  radius = 2,
  threshold = 0.65,
} = {}) {
  const channel = DEFAULT_CHANNEL_BY_CATEGORY[preset.category] ?? "presence";
  const actionNamespace = String(preset.id ?? "preset").replaceAll("-", "_");
  const actionTheme = preset.publicSafeActionThemes?.[0] ?? "memory response";

  return new MemoryAnchor({
    id,
    label,
    position,
    radius,
    memory: { [channel]: 0 },
    thresholdRules: [
      {
        id: `${actionNamespace}_${channel}_threshold`,
        memoryType: channel,
        threshold,
        mode: "cooldown",
        cooldownSeconds: 10,
        actionKey: `${actionNamespace}.public_response`,
        publicLabel: actionTheme,
      },
    ],
    tags: ["preset", preset.id, preset.category].filter(Boolean),
    metadata: {
      presetId: preset.id,
      category: preset.category,
      summary: preset.summary,
      suggestedUseCases: preset.suggestedUseCases ?? [],
      publicSafeActionThemes: preset.publicSafeActionThemes ?? [],
    },
    visualStyle: DEFAULT_STYLE_BY_CATEGORY[preset.category] ?? {},
  });
}

export function applyPresetSummary(field, preset, options = {}) {
  const anchor = createAnchorFromPresetSummary(preset, options);
  field.addAnchor(anchor);
  return anchor;
}

export function getPresetChannel(preset) {
  return DEFAULT_CHANNEL_BY_CATEGORY[preset.category] ?? "presence";
}
