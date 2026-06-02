/* =============================
   CUSTOM CURSOR
============================= */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');
let mx = 0, my = 0, tx = 0, ty = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animTrail() {
  tx += (mx - tx) * 0.12;
  ty += (my - ty) * 0.12;
  cursorTrail.style.left = tx + 'px';
  cursorTrail.style.top  = ty + 'px';
  requestAnimationFrame(animTrail);
})();

/* =============================
   CANVAS PARTICLE BG
============================= */
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

let W, H, particles = [];

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

function randBetween(a,b) { return Math.random() * (b-a) + a; }

class Particle {
  constructor() { this.reset(true); }
  reset(init) {
    this.x  = Math.random() * W;
    this.y  = init ? Math.random() * H : H + 10;
    this.vy = randBetween(0.15, 0.6);
    this.vx = randBetween(-0.1, 0.1);
    this.r  = randBetween(0.5, 1.5);
    this.a  = randBetween(0.1, 0.5);
    this.color = Math.random() > 0.6 ? '0,229,200' : '124,58,237';
  }
  update() {
    this.y -= this.vy;
    this.x += this.vx;
    if (this.y < -10) this.reset(false);
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(${this.color},${this.a})`;
    ctx.fill();
  }
}

// create 80 particles
for (let i=0; i<80; i++) particles.push(new Particle());

// grid lines
function drawGrid() {
  ctx.strokeStyle = 'rgba(255,255,255,0.025)';
  ctx.lineWidth = 1;
  const step = 60;
  for (let x=0; x<W; x+=step) {
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke();
  }
  for (let y=0; y<H; y+=step) {
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke();
  }
}

function loop() {
  ctx.clearRect(0,0,W,H);

  // deep background
  const grad = ctx.createRadialGradient(W*0.2, H*0.2, 0, W*0.2, H*0.2, W*0.6);
  grad.addColorStop(0, 'rgba(0,50,60,0.4)');
  grad.addColorStop(1, 'rgba(8,12,20,0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0,0,W,H);

  const grad2 = ctx.createRadialGradient(W*0.8, H*0.8, 0, W*0.8, H*0.8, W*0.5);
  grad2.addColorStop(0, 'rgba(50,0,80,0.3)');
  grad2.addColorStop(1, 'rgba(8,12,20,0)');
  ctx.fillStyle = grad2;
  ctx.fillRect(0,0,W,H);

  drawGrid();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(loop);
}
loop();

/* =============================
   NAVBAR SCROLL
============================= */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* =============================
   REVEAL ON SCROLL
============================= */
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => observer.observe(el));

/* =============================
   COUNTER ANIMATION
============================= */
function animateCounter(el, target, duration=1800) {
  let start = 0, step = target / (duration / 16);
  const t = setInterval(() => {
    start = Math.min(start+step, target);
    el.textContent = Math.round(start);
    if (start >= target) clearInterval(t);
  }, 16);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.counter-num').forEach(el => {
        animateCounter(el, +el.dataset.target);
      });
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

const heroCounter = document.querySelector('.hero-counter');
if (heroCounter) counterObserver.observe(heroCounter);

/* =============================
   FORM SUBMIT (demo)
============================= */
document.getElementById('contactForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const btn = this.querySelector('.form-submit');
  btn.innerHTML = '<span>Message Sent!</span> ✓';
  btn.style.background = 'linear-gradient(135deg,#22c55e,#16a34a)';
  setTimeout(() => {
    btn.innerHTML = '<span>Send Message</span><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>';
    btn.style.background = '';
    this.reset();
  }, 3000);
});

/* =============================
   ACTIVE NAV LINK
============================= */
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let cur = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 200) cur = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#'+cur ? 'var(--accent)' : '';
  });
});
