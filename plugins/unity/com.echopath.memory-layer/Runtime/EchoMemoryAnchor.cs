using System;
using System.Collections.Generic;
using UnityEngine;

namespace EchoPath.MemoryLayer
{
    [Serializable]
    public class EchoMemoryAnchor
    {
        public string id;
        public string label;
        public Transform target;
        public float decayRate = 0.025f;
        public float reinforcementMultiplier = 1f;
        public List<string> tags = new List<string>();

        [NonSerialized]
        public readonly Dictionary<EchoMemoryType, float> memory = new Dictionary<EchoMemoryType, float>();
    }
}
