/* 1) NAV: show only after scrolling past hero (nav is display:none by default in CSS) */
const nav = document.getElementById('nav');
const hero = document.getElementById('home');
function checkNav(){
  const heroH = hero.clientHeight;
  if(window.scrollY > heroH - 60) {
    nav.classList.add('show');
  } else {
    nav.classList.remove('show');
  }
}
window.addEventListener('scroll', checkNav);
window.addEventListener('resize', checkNav);
checkNav();

/* 2) TYPEWRITER: fixed-size white box, typing + deleting */
const phrases = [
  "Controlling oilfields with IoT",
  "Forcing messy workflows into order",
  "Cutting downtime with automation",
  "Turning operations into real-time"
];


const tEl = document.getElementById('typewriter');
let pi = 0, ci = 0, deleting = false;
function tick(){
  const word = phrases[pi];
  if(!deleting){
    ci++;
    tEl.textContent = word.slice(0,ci);
    if(ci === word.length){
      deleting = true;
      setTimeout(tick, 900);
      return;
    }
  } else {
    ci--;
    tEl.textContent = word.slice(0,ci);
    if(ci === 0){
      deleting = false;
      pi = (pi + 1) % phrases.length;
    }
  }
  setTimeout(tick, deleting?35:55);
}
tick();

/* 3) WAVES: multi-layer, many thin colored layers, more wavey */
/* Canvas setup with DPR for crispness */
const canvas = document.getElementById('waves');
const ctx = canvas.getContext('2d');
const DPR = Math.max(1, window.devicePixelRatio || 1);

function resizeCanvas(){
  const wrap = canvas.parentElement;
  canvas.width = Math.max(300, wrap.clientWidth) * DPR;
  canvas.height = Math.max(120, wrap.clientHeight) * DPR;
  ctx.setTransform(DPR,0,0,DPR,0,0);
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

/* parameters for layers: many thin layers from light -> dark (frontmost is darkest) */
const layers = [
  { amp: 12, len: 120, speed: 1.8, yOff: 0.88, color: 'rgba(182,225,255,0.75)' }, // very light (back)
  { amp: 10, len: 160, speed: 1.6, yOff: 0.84, color: 'rgba(140,205,255,0.55)' },
  { amp: 9,  len: 200, speed: 1.4, yOff: 0.80, color: 'rgba(100,170,236,0.38)' },
  { amp: 10, len: 240, speed: 1.1, yOff: 0.74, color: 'rgba(60,120,180,0.28)' },
  { amp: 14, len: 300, speed: 0.9, yOff: 0.70, color: 'rgba(40,90,150,0.24)' },
  { amp: 20, len: 380, speed: 0.7, yOff: 0.66, color: 'rgba(28,60,96,0.94)' }  // front (dark)
];

let t = 0;
let mouseX = 0.5;
window.addEventListener('pointermove', (e) => {
  const r = canvas.getBoundingClientRect();
  mouseX = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
});

/* helper to compute wave y at x for a layer */
// Interactive waves
(function(){
    const c = document.getElementById('waves');
    const ctx = c.getContext('2d');
    let t = 0, mouseX = 0.5;
    const DPR = Math.max(1, window.devicePixelRatio || 1);
  
    function size(){
      c.width = c.clientWidth * DPR;
      c.height = c.clientHeight * DPR;
      ctx.scale(DPR, DPR);
    }
    size(); addEventListener('resize', size);
  
    addEventListener('pointermove', e => {
      const rect = c.getBoundingClientRect();
      mouseX = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    }, { passive: true });
  
    function wave(yBase, amp, len, speed, color, phase=0){
      ctx.beginPath();
      const W = c.clientWidth, H = c.clientHeight;
      for(let x=0; x<=W; x++){
        const y = yBase + Math.sin((x/len) + t*speed + phase + mouseX*2.2) 
                  * amp * (0.6 + mouseX*0.8);
        if(x===0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath();
      ctx.fillStyle = color; ctx.fill();
    }

  
    const boat = document.querySelector('.boat');
    // --- helper untuk ambil tinggi gelombang di titik x ---
function waveAt(yBase, amp, len, speed, phase, time, H){
  return yBase + Math.sin(( (window.innerWidth*0.92)/len ) + time*speed + phase) * amp;
}

// --- boat update ---
function updateBoat(time){
  const boat = document.getElementById('boat');
  if(!boat) return;

  const c = document.getElementById('waves');
  const H = c.clientHeight;

  // ambil layer paling depan (yang terakhir di-draw)
  const yBase = H*0.95;   // sama kayak param wave terakhir
  const amp   = 20;
  const len   = 320;
  const speed = 0.9;
  const phase = 2.1;

  // posisi X kapal: 82% dari lebar layar
  const x = window.innerWidth * 0.82;

  // hitung Y di wave terakhir
  const y = waveAt(yBase, amp, len, speed, phase, time, H);

  // hitung slope (untuk rotasi)
  const dx = 6;
  const y1 = yBase + Math.sin(((x-dx)/len) + time*speed + phase) * amp;
  const y2 = yBase + Math.sin(((x+dx)/len) + time*speed + phase) * amp;
  const slope = (y2 - y1) / (2*dx);
  const angle = Math.atan(slope) * (180/Math.PI) * 0.8;

  // apply style
  const boatW = boat.clientWidth;
  const boatH = boat.clientHeight;

  boat.style.left = (x - boatW/2) + 'px';
  boat.style.top  = (y - boatH*1.1) + 'px';
  boat.style.transform = `rotate(${angle}deg)`;
}

    function animate(){
  const W = c.clientWidth, H = c.clientHeight;
  ctx.clearRect(0,0,W,H);

  // layer belakang
  wave(H*0.55, 16, 120, 1.4, 'rgba(88,208,255,.35)', 0.0);
  wave(H*0.60, 20, 180, 1.2, 'rgba(138,121,255,.32)', 1.3);

  // ungu → kasih phase lebih jauh biar beda pola
  wave(H*0.68, 26, 240, 0.85, 'rgba(234, 98, 255, 0.19)', 4.7);

  // depan (dark)
  const grad = ctx.createLinearGradient(0, H*0.85, 0, H);
  grad.addColorStop(0, 'rgb(48,90,140)');
  grad.addColorStop(1, 'rgb(48,90,140)');
  wave(H*0.75, 32, 320, 1.1, grad, 0.8);

  // // paling depan (untuk transisi ke skills)
  // const waveSkillTop = getComputedStyle(document.documentElement)
  //                       .getPropertyValue('--wave-skill-top').trim();
  // wave(H*0.95, 40, 320, 0.9, waveSkillTop, 5.4);

  t += 0.015 + mouseX*0.007;
  updateBoat(t);
  requestAnimationFrame(animate);
}


      
    animate();
  })();
  
  

/* main draw loop: draw back -> front */
function draw(){
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  ctx.clearRect(0,0,W,H);

  for(let i = 0; i < layers.length; i++){
    const l = layers[i];
    ctx.beginPath();
    // draw smooth curve: sample every 2 px for performance
    for(let x = 0; x <= W; x += 2){
      const y = waveAt(l, x, W, H, t);
      if(x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fillStyle = l.color;
    ctx.fill();
  }

  // increment time; mouseX slightly nudges speed for interactivity
  t += 0.015 + (mouseX - 0.5) * 0.005;

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

/* 4) Animate skill meters on load */
window.addEventListener('load', () => {
  document.querySelectorAll('.meter > i').forEach(bar => {
    const w = bar.style.width;
    bar.style.width = '0';
    setTimeout(()=> bar.style.width = w, 180);
  });
});

document.querySelectorAll('.xp-card').forEach(card => {
  card.addEventListener('click', () => {
    card.classList.toggle('open');
  });
});

// const cloudsWrap = document.querySelector('.clouds-wrap');

// // fungsi buat bikin awan baru
// function spawnCloud() {
//   const cloud = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//   cloud.setAttribute("viewBox", "0 0 200 60");
//   cloud.classList.add("cloud");

//   // bikin isi awan (2 ellipse biar ada bentuk)
//   const e1 = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
//   e1.setAttribute("cx", 60);
//   e1.setAttribute("cy", 30);
//   e1.setAttribute("rx", 50);
//   e1.setAttribute("ry", 28);

//   const e2 = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
//   e2.setAttribute("cx", 120);
//   e2.setAttribute("cy", 30);
//   e2.setAttribute("rx", 60);
//   e2.setAttribute("ry", 30);

//   cloud.appendChild(e1);
//   cloud.appendChild(e2);

//   // ukuran random 100–220px
//   const size = 100 + Math.random()*120;
//   cloud.style.width = size + "px";
//   cloud.style.height = "auto";

//   // posisi vertikal random (0–120px)
//   const top = Math.random() * 500;
//   cloud.style.top = top + "px";

//   // durasi random (8–16s)
//   const duration = 8 + Math.random()*8;

//   // start di kanan
//   cloud.style.left = "100vw";

//   // animasi manual pakai CSS transition
//   requestAnimationFrame(() => {
//     cloud.style.transition = `transform ${duration}s linear`;
//     cloud.style.transform = `translateX(-120vw)`;
//   });

//   // hapus setelah selesai jalan
//   setTimeout(() => cloud.remove(), duration * 1000);

//   cloudsWrap.appendChild(cloud);
// }

// // spawn cloud tiap 3–6 detik
// setInterval(spawnCloud, 3000 + Math.random()*3000);

// // spawn awal
// spawnCloud();


