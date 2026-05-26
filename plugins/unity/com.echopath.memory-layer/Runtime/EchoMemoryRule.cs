using System;

namespace EchoPath.MemoryLayer
{
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
}
