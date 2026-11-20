// ─────────────────────────────────────────
//  PARVA SHAH PORTFOLIO v2 — SCRIPT.JS
//  Bento Grid + Editorial Design
// ─────────────────────────────────────────

/* ── THEME TOGGLE ── */
const THEME_KEY = 'ps-theme';
const html = document.documentElement;
const themeBtn = document.getElementById('themeToggle');

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

// Load saved preference, default dark
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
applyTheme(savedTheme);

themeBtn.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');

  // Tiny bounce animation on toggle
  themeBtn.style.transform = 'scale(0.88)';
  setTimeout(() => { themeBtn.style.transform = ''; }, 180);
});

/* ── NAVBAR ── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-center a');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  // Highlight active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.style.color = '';
    link.style.background = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--accent)';
    }
  });
}, { passive: true });

/* ── HAMBURGER MOBILE MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open');
  // Animate hamburger lines to X
  const spans = hamburger.querySelectorAll('span');
  if (hamburger.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(4px, 5px)';
    spans[1].style.transform = 'rotate(-45deg) translate(4px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.transform = '';
  }
});

mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ── SCROLL REVEAL ── */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    // Stagger siblings for cascade effect
    const parent = entry.target.parentElement;
    const siblings = Array.from(parent.querySelectorAll('.reveal'));
    const idx = siblings.indexOf(entry.target);
    setTimeout(() => {
      entry.target.classList.add('visible');
    }, Math.min(idx * 90, 360));
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ── BENTO CARD MICRO-INTERACTIONS ── */
document.querySelectorAll('.bento-card, .proj-card, .exp-card, .sk-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    if (window.innerWidth < 768) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
    card.style.transform = `perspective(900px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-3px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ── MARQUEE PAUSE ON HOVER (handled in CSS but also add cursor) ── */
document.querySelector('.marquee-wrap')?.addEventListener('mouseenter', function() {
  this.style.cursor = 'default';
});

/* ── ANIMATED NUMBER COUNTERS IN BENTO STATS ── */
function animateCount(el, to, suffix = '') {
  let start = 0;
  const dur = 1200;
  const step = 16;
  const inc = (to / (dur / step));
  const timer = setInterval(() => {
    start = Math.min(start + inc, to);
    el.textContent = Math.floor(start) + suffix;
    if (start >= to) clearInterval(timer);
  }, step);
}

// Observe stat cards
const statObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const card = entry.target;
    const big = card.querySelector('.stat-big');
    if (!big || big.dataset.animated) return;
    big.dataset.animated = 'true';

    // Read data from existing text
    const text = big.textContent.trim();
    if (text.startsWith('125')) {
      big.innerHTML = '<span id="cnt-125">0</span><span>/190</span>';
      animateCount(document.getElementById('cnt-125'), 125);
    } else if (text.startsWith('20')) {
      big.innerHTML = '<span id="cnt-20">0</span><span>s</span>';
      animateCount(document.getElementById('cnt-20'), 20);
    } else if (text.startsWith('25')) {
      big.innerHTML = '<span id="cnt-25">0</span><span>%</span>';
      animateCount(document.getElementById('cnt-25'), 25);
    }
    statObserver.unobserve(card);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.b-stat').forEach(el => statObserver.observe(el));

/* ── SKILL PILL HOVER RIPPLE ── */
document.querySelectorAll('.sk-pills span, .b-tech-pills span').forEach(pill => {
  pill.addEventListener('click', e => {
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position:absolute; border-radius:50%; pointer-events:none;
      background:rgba(255,107,107,0.25);
      width:50px; height:50px;
      transform:translate(-50%,-50%) scale(0);
      animation:rippleOut 0.45s ease-out forwards;
      left:${e.offsetX}px; top:${e.offsetY}px;
    `;
    pill.style.position = 'relative';
    pill.style.overflow = 'hidden';
    pill.appendChild(ripple);
    setTimeout(() => ripple.remove(), 450);
  });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes rippleOut { to { transform:translate(-50%,-50%) scale(3); opacity:0; } }`;
document.head.appendChild(rippleStyle);

/* ── PAGE LOAD FADE IN ── */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });
});

/* ── CERT ITEMS SLIDE ON HOVER ── */
document.querySelectorAll('.cert-item').forEach(item => {
  item.style.transition = 'padding-left 0.25s ease, background 0.25s ease, border-radius 0.25s ease';
});
