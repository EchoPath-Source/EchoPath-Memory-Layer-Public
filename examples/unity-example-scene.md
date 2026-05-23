# Unity Example Scene Setup

## Goal

Build a simple room where a player can hide repeatedly and the environment remembers that behavior.

---

## Scene Concept

```text
Player hides in closet repeatedly
  -> Closet accumulates hiding memory
  -> Memory crosses threshold
  -> NPC investigate action fires
```

---

## Required Objects

Create a new Unity scene with:

```text
EchoPathMemory
Player
ClosetZone
HallwayZone
NPC
```

---

## Step 1: Add the Bridge

Copy:

```text
examples/unity-bridge.cs
```

into:

```text
Assets/Scripts/unity-bridge.cs
```

Create an empty GameObject named:

```text
EchoPathMemory
```

Add the `EchoPathMemoryBridge` component to it.

---

## Step 2: Create Anchors

Create empty GameObjects:

```text
ClosetZone
HallwayZone
```

Use them as transform targets for memory anchors.

---

## Step 3: Configure Anchor Data

In the Inspector, add an anchor:

```text
id: closet
label: Closet
target: ClosetZone
decayRate: 0.02
reinforcementMultiplier: 1.2
```

Add another:

```text
id: hallway
label: Hallway
target: HallwayZone
decayRate: 0.025
reinforcementMultiplier: 1.0
```

---

## Step 4: Configure Rules

Add a rule:

```text
id: closet_audio_shift
anchorId: closet
memoryType: Hiding
threshold: 0.45
actionKey: environment.audio_shift
cooldownSeconds: 8
```

Add another rule:

```text
id: closet_investigate
anchorId: closet
memoryType: Hiding
threshold: 0.72
actionKey: npc.investigate
cooldownSeconds: 14
```

---

## Step 5: Write Events From Gameplay

Example interaction script:

```csharp
public class ClosetInteraction : MonoBehaviour
{
    public EchoPathMemoryBridge memoryBridge;

    public void OnPlayerHide()
    {
        memoryBridge.WriteHiding("closet");
    }

    public void OnPlayerMakeSound()
    {
        memoryBridge.WriteSound("closet");
    }
}
```

---

## Expected Logs

```text
[EchoPath Memory] Hiding written to Closet: 0.18
[EchoPath Memory] Hiding written to Closet: 0.39
[EchoPath Memory] Action fired: environment.audio_shift at Closet
[EchoPath Memory] Action fired: npc.investigate at Closet
```

---

## Next Step

Replace the placeholder action routing with your own systems:

- send NPC to anchor
- adjust audio
- change lighting
- update threat meter
- reveal a path

---

## Product Lesson

```text
Player behavior becomes spatial memory.
Spatial memory becomes adaptive response.
```
