// ============================================
// JADOO — Koi Mil Gaya Interface Engine
// Original implementation
// ============================================

const KEYS = ['B','C','D','E','F'];
const GRID_CELLS = 100; // 10x10 grid of wave bars

// ---- Build wave grids ----
function buildGrid(id) {
  const el = document.getElementById(id);
  for (let i = 0; i < GRID_CELLS; i++) {
    const d = document.createElement('div');
    d.className = 'wv';
    // Each bar gets a unique animation delay for wave ripple
    const row = Math.floor(i / 10);
    const col = i % 10;
    const dist = Math.sqrt(Math.pow(row - 5, 2) + Math.pow(col - 5, 2));
    d.style.animationDelay = (dist * 0.08).toFixed(2) + 's';
    el.appendChild(d);
  }
}

buildGrid('send-grid');
buildGrid('recv-grid');

// ---- Canvas scope (Lissajous) ----
const canvas = document.getElementById('scope');
const ctx = canvas.getContext('2d');
let t = 0;

function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function drawScope() {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  if (!w || !h) return;

  const cx = w * 0.5, cy = h * 0.5;
  const r = Math.min(w, h) * 0.36;
  const active = sendActive || recvActive;

  // Crosshairs
  ctx.strokeStyle = 'rgba(149,226,8,0.1)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx - r * 1.1, cy); ctx.lineTo(cx + r * 1.1, cy);
  ctx.moveTo(cx, cy - r * 1.1); ctx.lineTo(cx, cy + r * 1.1);
  ctx.stroke();

  // Outer ring only
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();

  // Single Lissajous curve (rotating figure-8)
  ctx.beginPath();
  ctx.strokeStyle = `rgba(149,226,8,${active ? 0.6 : 0.25})`;
  ctx.lineWidth = active ? 1.6 : 1.0;
  for (let i = 0; i < 150; i++) {
    const u = (i / 150) * Math.PI * 2;
    const x = cx + Math.sin(u + t * 0.5) * r * 0.75;
    const y = cy + Math.sin(2 * u + t * 0.3) * r * 0.75;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Tracer dot when active
  if (active) {
    const dx = cx + Math.sin(2 * t) * r * 0.8;
    const dy = cy + Math.cos(3 * t) * r * 0.8;
    ctx.beginPath();
    ctx.arc(dx, dy, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(149,226,8,0.9)';
    ctx.fill();
  }
}

// ---- Audio ----
const AUDIO_FILES = {
  B: new Audio('B.mp3'),
  C: new Audio('C.mp3'),
  D: new Audio('D.mp3'),
  E: new Audio('E.mp3'),
  F: new Audio('F.mp3')
};

function playSound(key) {
  const snd = AUDIO_FILES[key];
  if (!snd) return;
  snd.currentTime = 0;
  snd.volume = 0.8;
  snd.play().catch(e => console.warn("Audio play blocked/failed:", e));
}

function playSounds(keys, gap, vol) {
  keys.forEach((k, i) => {
    setTimeout(() => {
      const clone = new Audio(`${k}.mp3`);
      clone.volume = vol;
      clone.play().catch(() => {});
    }, i * gap);
  });
}

// ---- State ----
let started = false;
let sendActive = false;
let recvActive = false;
let busy = false;
let sequence = [];
let sendTimer = null;

// ---- Start Interface ----
function start() {
  console.log("start() function triggered!");
  if (started) return;
  started = true;

  document.getElementById('intro').style.display = 'none';
  document.getElementById('interface').style.opacity = '1';
  document.getElementById('interface').style.pointerEvents = 'all';

  // Try fullscreen
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

// ---- Activate/Deactivate Sending ----
function sendOn() {
  sendActive = true;
  clearTimeout(sendTimer);
  document.querySelectorAll('#send-grid .wv').forEach(w => w.classList.add('on'));
  document.querySelector('#q2 .qlabel').classList.add('lit');
  document.getElementById('send-bar').style.width = '75%';

  sendTimer = setTimeout(sendOff, 1200);
}

function sendOff() {
  sendActive = false;
  document.querySelectorAll('#send-grid .wv').forEach(w => w.classList.remove('on'));
  document.querySelector('#q2 .qlabel').classList.remove('lit');
  document.getElementById('send-bar').style.width = '0%';
}

// ---- Activate/Deactivate Receiving ----
function recvOn() {
  recvActive = true;
  document.querySelectorAll('#recv-grid .wv').forEach(w => w.classList.add('on'));
  document.querySelector('#q1 .qlabel').classList.add('lit');
  document.getElementById('recv-bar').style.width = '100%';
}

function recvOff() {
  recvActive = false;
  document.querySelectorAll('#recv-grid .wv').forEach(w => w.classList.remove('on'));
  document.querySelector('#q1 .qlabel').classList.remove('lit');
  document.getElementById('recv-bar').style.width = '0%';
}

// ---- Telemetry data per key ----
const TDATA = {
  B: { az:"40°", inc:"48° POS", dec:"57° NEG", sig:"80 dB" },
  C: { az:"55°", inc:"52° POS", dec:"34° NEG", sig:"85 dB" },
  D: { az:"33°", inc:"37° POS", dec:"41° POS", sig:"95 dB" },
  E: { az:"88°", inc:"44° NEG", dec:"63° NEG", sig:"70 dB" },
  F: { az:"72°", inc:"61° POS", dec:"29° POS", sig:"92 dB" }
};

function updateTelem(key) {
  const d = TDATA[key];
  if (!d) return;
  document.getElementById('t-az').textContent = d.az;
  document.getElementById('t-in').textContent = d.inc;
  document.getElementById('t-de').textContent = d.dec;
  document.getElementById('t-sig').textContent = d.sig;
}

// ---- Key Press ----
function onKey(key) {
  if (!started || !TDATA[key]) return;

  playSound(key);
  sequence.push(key);
  sendOn();
  updateTelem(key);

  // Update sequence display
  document.getElementById('keybar-seq').textContent = sequence.join(' ');

  // Highlight frequency row
  document.querySelectorAll('#telem-freq p').forEach(p => p.classList.remove('lit'));
  document.getElementById(`fq-${key}`)?.classList.add('lit');
}

// ---- Transmit (SPACE) ----
function transmit() {
  if (!sequence.length || busy) return;
  busy = true;

  const tx = sequence.slice(-5);
  playSounds(tx, 150, 0.6);
  sendOn();
  document.getElementById('send-bar').style.width = '100%';

  setTimeout(() => {
    sendOff();

    // Alien response!
    recvOn();
    document.getElementById('t-up').textContent = 'ACTIVE';
    document.getElementById('t-sig').textContent = '99 dB';

    playSounds(['D','E','F','C','B'], 350, 0.7);

    setTimeout(() => {
      recvOff();
      document.getElementById('t-up').textContent = 'YES';
      busy = false;
    }, 3000);
  }, tx.length * 150 + 600);
}

// ---- Clear (ESC) ----
function clearSeq() {
  sequence = [];
  document.getElementById('keybar-seq').textContent = '';
  document.querySelectorAll('#telem-freq p').forEach(p => p.classList.remove('lit'));
  sendOff();
}

// ---- Events ----
document.addEventListener('keydown', e => {
  if (e.key === 'Enter') { e.preventDefault(); start(); return; }
  if (!started) return;

  const k = e.key.toUpperCase();
  if (KEYS.includes(k)) { e.preventDefault(); onKey(k); }
  else if (e.key === ' ') { e.preventDefault(); transmit(); }
  else if (e.key === 'Escape') { e.preventDefault(); clearSeq(); }
});

document.getElementById('intro').addEventListener('click', start);

// ---- On-Screen Keypad Events ----
document.querySelectorAll('.kbtn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    if (!started) return;
    const key = btn.getAttribute('data-key');
    if (KEYS.includes(key)) {
      onKey(key);
    } else if (key === ' ') {
      transmit();
    } else if (key === 'Escape') {
      clearSeq();
    }
  });
});

// ---- Animation Loop ----
function loop() {
  t += 0.016;
  drawScope();
  requestAnimationFrame(loop);
}
loop();
