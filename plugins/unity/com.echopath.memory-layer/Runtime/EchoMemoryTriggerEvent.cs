using System;

namespace EchoPath.MemoryLayer
{
    [Serializable]
    public struct EchoMemoryTriggerEvent
    {
        public string ruleId;
        public string anchorId;
        public string actionKey;
        public EchoMemoryType memoryType;
        public float value;
        public float threshold;
        public float time;
    }
}
