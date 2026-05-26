using System;
using System.Collections.Generic;
using UnityEngine;

namespace EchoPath.MemoryLayer
{
    public class EchoPathMemoryBridge : MonoBehaviour
    {
        public List<EchoMemoryAnchor> anchors = new List<EchoMemoryAnchor>();
        public List<EchoMemoryRule> rules = new List<EchoMemoryRule>();
        public bool showDebugLogs = true;

        public event Action<EchoMemoryTriggerEvent> OnMemoryTriggered;

        private readonly Dictionary<string, EchoMemoryAnchor> anchorLookup = new Dictionary<string, EchoMemoryAnchor>();

        private void Awake()
        {
            RebuildAnchorLookup();
        }

        private void Update()
        {
            StepMemory(Time.deltaTime);
            CheckRules();
        }

        public void RebuildAnchorLookup()
        {
            anchorLookup.Clear();
            foreach (var anchor in anchors)
            {
                if (anchor != null && !string.IsNullOrWhiteSpace(anchor.id))
                {
                    anchorLookup[anchor.id] = anchor;
                }
            }
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

        public void WriteMemoryAtPosition(Vector3 position, EchoMemoryType type, float strength, float maxDistance = 5f)
        {
            var nearest = FindNearestAnchor(position, maxDistance);
            if (nearest == null) return;
            WriteMemory(nearest.id, type, strength);
        }

        public EchoMemoryAnchor FindNearestAnchor(Vector3 position, float maxDistance = 5f)
        {
            EchoMemoryAnchor nearest = null;
            var best = maxDistance;

            foreach (var anchor in anchors)
            {
                if (anchor?.target == null) continue;
                var d = Vector3.Distance(position, anchor.target.position);
                if (d < best)
                {
                    best = d;
                    nearest = anchor;
                }
            }

            return nearest;
        }

        public float GetMemory(string anchorId, EchoMemoryType type)
        {
            if (!anchorLookup.TryGetValue(anchorId, out var anchor)) return 0f;
            return anchor.memory.TryGetValue(type, out var value) ? value : 0f;
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
            var evt = new EchoMemoryTriggerEvent
            {
                ruleId = rule.id,
                anchorId = anchor.id,
                actionKey = rule.actionKey,
                memoryType = rule.memoryType,
                value = value,
                threshold = rule.threshold,
                time = Time.time
            };

            OnMemoryTriggered?.Invoke(evt);

            if (showDebugLogs)
            {
                Debug.Log($"[EchoPath Memory] Action fired: {rule.actionKey} at {anchor.label} ({value:0.00})");
            }
        }
    }
}
