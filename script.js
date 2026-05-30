// ── CURSOR ──
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  rx += (mx - rx) * 0.15; ry += (my - ry) * 0.15;
  if (cursor) { cursor.style.left = mx + 'px'; cursor.style.top = my + 'px'; }
  if (cursorRing) { cursorRing.style.left = rx + 'px'; cursorRing.style.top = ry + 'px'; }
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button, .pill, .skill-category, .project-card, .cert-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing && cursorRing.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing && cursorRing.classList.remove('hover'));
});

// ── SCROLL PROGRESS ──
const bar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  if (bar) bar.style.width = pct + '%';
});

// ── NAV ──
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) current = s.id; });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ── TYPEWRITER ──
const words = ['Full Stack Engineer', 'MERN Developer', 'Backend Architect', 'React Specialist'];
let wi = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter');
function type() {
  if (!tw) return;
  const word = words[wi];
  tw.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
  let delay = deleting ? 60 : 100;
  if (!deleting && ci === word.length + 1) { delay = 1800; deleting = true; }
  if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 300; }
  setTimeout(type, delay);
}
type();

// ── PARTICLE CANVAS ──
const canvas = document.getElementById('particles');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < 60; i++) {
    particles.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.5 + .5, vx: (Math.random() - .5) * .4, vy: (Math.random() - .5) * .4, alpha: Math.random() * .5 + .1 });
  }
  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(124,58,237,${p.alpha})`; ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  }
  drawParticles();
}

// ── STAT COUNTERS ──
function animateCount(el, target) {
  let start = 0, duration = 1800;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString();
  };
  requestAnimationFrame(step);
}
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(el => {
        animateCount(el, parseInt(el.dataset.target));
      });
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: .3 });
const statsSection = document.querySelector('.stats-section');
if (statsSection) statsObserver.observe(statsSection);

// ── FADE IN ON SCROLL ──
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.skill-category, .project-card, .timeline-item, .cert-card, .contact-item, .edu-card, .stat-item')
  .forEach(el => { el.classList.add('fade-in'); fadeObserver.observe(el); });
