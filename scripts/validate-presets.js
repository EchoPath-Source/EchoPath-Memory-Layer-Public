import { readFile } from "node:fs/promises";

const summaryPath = new URL("../presets/starter/preset-summary.json", import.meta.url);
const expectedPresetCount = 10;
const requiredArrayFields = ["suggestedUseCases", "publicSafeActionThemes"];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function assertNonEmptyString(value, fieldName, presetId = "preset") {
  assert(typeof value === "string" && value.trim().length > 0, `${presetId} requires non-empty ${fieldName}.`);
}

const data = JSON.parse(await readFile(summaryPath, "utf8"));

assert(data.publicSafe === true, "Starter preset summary must be publicSafe true.");
assert(Array.isArray(data.presets), "Starter preset summary requires a presets array.");
assert(data.presets.length === expectedPresetCount, `Expected ${expectedPresetCount} starter presets.`);

const ids = new Set();
for (const preset of data.presets) {
  assertNonEmptyString(preset.id, "id");
  assert(!ids.has(preset.id), `Duplicate preset id: ${preset.id}.`);
  ids.add(preset.id);

  assertNonEmptyString(preset.name, "name", preset.id);
  assertNonEmptyString(preset.category, "category", preset.id);
  assertNonEmptyString(preset.summary, "summary", preset.id);
  assert(preset.publicSafe === true, `${preset.id} must be publicSafe true.`);

  for (const field of requiredArrayFields) {
    assert(Array.isArray(preset[field]) && preset[field].length > 0, `${preset.id} requires a non-empty ${field} array.`);
    for (const value of preset[field]) {
      assertNonEmptyString(value, field, preset.id);
    }
  }
}

console.log(`Validated ${data.presets.length} public-safe starter presets.`);
