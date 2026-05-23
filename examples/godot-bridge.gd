# EchoPath Memory Layer — Godot Bridge Example
# Public reference scaffold. Not the full production addon.

extends Node
class_name EchoPathMemoryBridge

enum MemoryType {
	PRESENCE,
	HIDING,
	SOUND,
	DANGER,
	SAFE,
	ROUTE
}

@export var show_debug_logs: bool = true

var anchors: Dictionary = {}
var rules: Array = []

func _process(delta: float) -> void:
	step_memory(delta)
	check_rules()

func add_anchor(id: String, label: String, node: Node3D, decay_rate: float = 0.025, reinforcement_multiplier: float = 1.0) -> void:
	anchors[id] = {
		"id": id,
		"label": label,
		"node": node,
		"decay_rate": decay_rate,
		"reinforcement_multiplier": reinforcement_multiplier,
		"memory": {}
	}

func add_rule(id: String, anchor_id: String, memory_type: int, threshold: float, action_key: String, cooldown_seconds: float = 10.0) -> void:
	rules.append({
		"id": id,
		"anchor_id": anchor_id,
		"memory_type": memory_type,
		"threshold": threshold,
		"action_key": action_key,
		"cooldown_seconds": cooldown_seconds,
		"last_fired_at": -99999.0
	})

func write_memory(anchor_id: String, memory_type: int, strength: float) -> void:
	if not anchors.has(anchor_id):
		return

	var anchor = anchors[anchor_id]
	var memory: Dictionary = anchor["memory"]
	if not memory.has(memory_type):
		memory[memory_type] = 0.0

	memory[memory_type] = clamp(memory[memory_type] + strength * anchor["reinforcement_multiplier"], 0.0, 1.0)

	if show_debug_logs:
		print("[EchoPath Memory] memory written to ", anchor["label"], ": ", memory[memory_type])

func write_presence(anchor_id: String) -> void:
	write_memory(anchor_id, MemoryType.PRESENCE, 0.12)

func write_hiding(anchor_id: String) -> void:
	write_memory(anchor_id, MemoryType.HIDING, 0.18)

func write_sound(anchor_id: String) -> void:
	write_memory(anchor_id, MemoryType.SOUND, 0.20)

func write_danger(anchor_id: String) -> void:
	write_memory(anchor_id, MemoryType.DANGER, 0.24)

func write_safe(anchor_id: String) -> void:
	write_memory(anchor_id, MemoryType.SAFE, 0.14)

func write_route(anchor_id: String) -> void:
	write_memory(anchor_id, MemoryType.ROUTE, 0.16)

func step_memory(delta: float) -> void:
	for anchor_id in anchors.keys():
		var anchor = anchors[anchor_id]
		var memory: Dictionary = anchor["memory"]
		for memory_type in memory.keys():
			memory[memory_type] *= exp(-anchor["decay_rate"] * delta)

func check_rules() -> void:
	var now = Time.get_ticks_msec() / 1000.0

	for rule in rules:
		var anchor_id = rule["anchor_id"]
		if not anchors.has(anchor_id):
			continue

		var anchor = anchors[anchor_id]
		var memory: Dictionary = anchor["memory"]
		var value = memory.get(rule["memory_type"], 0.0)
		var can_fire = now - rule["last_fired_at"] >= rule["cooldown_seconds"]

		if value >= rule["threshold"] and can_fire:
			rule["last_fired_at"] = now
			handle_memory_action(rule, anchor, value)

func handle_memory_action(rule: Dictionary, anchor: Dictionary, value: float) -> void:
	print("[EchoPath Memory] Action fired: ", rule["action_key"], " at ", anchor["label"], " (", value, ")")

	# Route action_key into your own AI, audio, UI, or world-state systems.
