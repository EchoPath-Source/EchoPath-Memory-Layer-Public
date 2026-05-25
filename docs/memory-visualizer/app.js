const canvas = document.getElementById('viz');
const ctx = canvas.getContext('2d');
const readout = document.getElementById('readout');
let selected = 'hiding';
let time = 0;

const anchors = [
  { id: 'closet', label: 'Closet', x: 180, y: 130, memory: {}, decay: 0.016 },
  { id: 'hallway', label: 'Hallway', x: 455, y: 255, memory: {}, decay: 0.020 },
  { id: 'exit', label: 'Exit Zone', x: 720, y: 375, memory: {}, decay: 0.018 },
  { id: 'basement', label: 'Basement', x: 470, y: 430, memory: {}, decay: 0.023 },
  { id: 'bedroom', label: 'Bedroom', x: 710, y: 165, memory: {}, decay: 0.020 }
];

const channels = {
  hiding: [70, 231, 255],
  sound: [0, 229, 200],
  danger: [255, 77, 125],
  safe: [119, 255, 176]
};

function log(msg) {
  readout.textContent += msg + '\n';
  readout.scrollTop = readout.scrollHeight;
}

function nearestAnchor(x, y) {
  return anchors.reduce((best, a) => {
    const d = Math.hypot(a.x - x, a.y - y);
    return d < best.d ? { a, d } : best;
  }, { a: anchors[0], d: Infinity }).a;
}

function write(anchor, type, strength = 0.18) {
  anchor.memory[type] = Math.min(1, (anchor.memory[type] || 0) + strength);
  log(`[EchoPath Visualizer] ${type} memory written to ${anchor.label}: ${anchor.memory[type].toFixed(2)}`);
}

function drawHeat(anchor, type, value) {
  const [r, g, b] = channels[type];
  const radius = 36 + value * 155;
  const grad = ctx.createRadialGradient(anchor.x, anchor.y, 0, anchor.x, anchor.y, radius);
  grad.addColorStop(0, `rgba(${r},${g},${b},${0.52 * value})`);
  grad.addColorStop(0.45, `rgba(${r},${g},${b},${0.20 * value})`);
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(anchor.x, anchor.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawGrid() {
  ctx.strokeStyle = 'rgba(255,255,255,0.055)';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 36) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += 36) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#07101d';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  for (const a of anchors) {
    for (const [type, value] of Object.entries(a.memory)) {
      if (value > 0.004) drawHeat(a, type, value);
    }
  }

  for (const a of anchors) {
    const v = a.memory[selected] || 0;
    ctx.beginPath();
    ctx.arc(a.x, a.y, 28 + v * 18, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${0.10 + v * 0.20})`;
    ctx.fill();
    ctx.strokeStyle = v > 0.45 ? 'rgba(70,231,255,.95)' : 'rgba(255,255,255,.32)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = '#eef7ff';
    ctx.font = '800 16px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(a.label, a.x, a.y + 5);
    ctx.fillStyle = '#9fb1c8';
    ctx.font = '700 12px Inter, system-ui, sans-serif';
    ctx.fillText(`${selected}: ${v.toFixed(2)}`, a.x, a.y + 24);
  }
}

function step() {
  time += 1 / 60;
  for (const a of anchors) {
    for (const type of Object.keys(a.memory)) {
      a.memory[type] *= Math.exp(-a.decay / 2);
      if (a.memory[type] < 0.001) delete a.memory[type];
    }
  }
  draw();
  requestAnimationFrame(step);
}

document.querySelectorAll('[data-channel]').forEach(btn => {
  btn.addEventListener('click', () => {
    selected = btn.dataset.channel;
    document.querySelectorAll('[data-channel]').forEach(b => b.classList.toggle('active', b === btn));
    log(`[EchoPath Visualizer] selected channel: ${selected}`);
  });
});

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) * (canvas.width / rect.width);
  const y = (e.clientY - rect.top) * (canvas.height / rect.height);
  write(nearestAnchor(x, y), selected, selected === 'danger' ? 0.24 : 0.18);
});

document.getElementById('pulse').addEventListener('click', () => {
  const a = anchors[Math.floor(Math.random() * anchors.length)];
  write(a, selected, selected === 'danger' ? 0.24 : 0.18);
});

document.getElementById('decayFast').addEventListener('click', () => {
  for (const a of anchors) for (const type of Object.keys(a.memory)) a.memory[type] *= 0.35;
  log('[EchoPath Visualizer] fast decay burst applied.');
});

document.getElementById('reset').addEventListener('click', () => {
  for (const a of anchors) a.memory = {};
  readout.textContent = 'Visualizer reset.\n';
});

log('Visualizer ready. Select a channel and click near an anchor.');
step();
