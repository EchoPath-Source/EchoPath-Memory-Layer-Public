// EchoPath Memory Layer — Unity Bridge Example
// Public reference scaffold. Not the full production plugin.

using System;
using System.Collections.Generic;
using UnityEngine;

public enum EchoMemoryType
{
    Presence,
    Hiding,
    Sound,
    Danger,
    Safe,
    Route
}

[Serializable]
public class EchoMemoryAnchor
{
    public string id;
    public string label;
    public Transform target;
    public float decayRate = 0.025f;
    public float reinforcementMultiplier = 1f;
    public Dictionary<EchoMemoryType, float> memory = new Dictionary<EchoMemoryType, float>();
}

[Serializable]
public class EchoMemoryRule
{
    public string id;
    public string anchorId;
    public EchoMemoryType memoryType;
    public float threshold = 0.7f;
    public string actionKey;
    public float cooldownSeconds = 10f;
    public float lastFiredAt = -99999f;
}

public class EchoPathMemoryBridge : MonoBehaviour
{
    public List<EchoMemoryAnchor> anchors = new List<EchoMemoryAnchor>();
    public List<EchoMemoryRule> rules = new List<EchoMemoryRule>();
    public bool showDebugLogs = true;

    private readonly Dictionary<string, EchoMemoryAnchor> anchorLookup = new Dictionary<string, EchoMemoryAnchor>();

    private void Awake()
    {
        foreach (var anchor in anchors)
        {
            if (anchor != null && !string.IsNullOrWhiteSpace(anchor.id))
            {
                anchorLookup[anchor.id] = anchor;
            }
        }
    }

    private void Update()
    {
        StepMemory(Time.deltaTime);
        CheckRules();
    }

    public void WriteMemory(string anchorId, EchoMemoryType type, float strength)
    {
        if (!anchorLookup.TryGetValue(anchorId, out var anchor)) return;

        if (!anchor.memory.ContainsKey(type)) anchor.memory[type] = 0f;
        anchor.memory[type] = Mathf.Clamp01(anchor.memory[type] + strength * anchor.reinforcementMultiplier);

        if (showDebugLogs)
        {
            Debug.Log($"[EchoPath Memory] {type} written to {anchor.label}: {anchor.memory[type]:0.00}");
        }
    }

    public void WritePresence(string anchorId) => WriteMemory(anchorId, EchoMemoryType.Presence, 0.12f);
    public void WriteHiding(string anchorId) => WriteMemory(anchorId, EchoMemoryType.Hiding, 0.18f);
    public void WriteSound(string anchorId) => WriteMemory(anchorId, EchoMemoryType.Sound, 0.20f);
    public void WriteDanger(string anchorId) => WriteMemory(anchorId, EchoMemoryType.Danger, 0.24f);
    public void WriteSafe(string anchorId) => WriteMemory(anchorId, EchoMemoryType.Safe, 0.14f);
    public void WriteRoute(string anchorId) => WriteMemory(anchorId, EchoMemoryType.Route, 0.16f);

    private void StepMemory(float deltaTime)
    {
        foreach (var anchor in anchors)
        {
            var keys = new List<EchoMemoryType>(anchor.memory.Keys);
            foreach (var type in keys)
            {
                anchor.memory[type] *= Mathf.Exp(-anchor.decayRate * deltaTime);
                if (anchor.memory[type] < 0.001f) anchor.memory.Remove(type);
            }
        }
    }

    private void CheckRules()
    {
        foreach (var rule in rules)
        {
            if (!anchorLookup.TryGetValue(rule.anchorId, out var anchor)) continue;
            var value = anchor.memory.TryGetValue(rule.memoryType, out var v) ? v : 0f;
            var canFire = Time.time - rule.lastFiredAt >= rule.cooldownSeconds;

            if (value >= rule.threshold && canFire)
            {
                rule.lastFiredAt = Time.time;
                HandleMemoryAction(rule, anchor, value);
            }
        }
    }

    private void HandleMemoryAction(EchoMemoryRule rule, EchoMemoryAnchor anchor, float value)
    {
        Debug.Log($"[EchoPath Memory] Action fired: {rule.actionKey} at {anchor.label} ({value:0.00})");

        // Route actionKey into your own AI, audio, UI, or world-state systems.
    }
}
