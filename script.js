/* ─── REDUCED MOTION / INPUT CHECKS ─── */
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ─── TYPED.JS ─── */
if (typeof Typed !== 'undefined') {
  new Typed('.typing-text', {
    strings: ['PHP &amp; Laravel', 'Clean Architecture', 'React.js', 'Open Source'],
    typeSpeed: 55, backSpeed: 30, loop: true,
    showCursor: !prefersReduced,
  });
}

/* ─── CURSOR-REACTIVE SPOTLIGHT (ambient glow) ─── */
if (!prefersReduced && hasFinePointer) {
  let rafId = null, lastX = 50, lastY = 18;
  document.addEventListener('mousemove', e => {
    lastX = (e.clientX / window.innerWidth) * 100;
    lastY = (e.clientY / window.innerHeight) * 100;
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mx', lastX + '%');
        document.documentElement.style.setProperty('--my', lastY + '%');
        rafId = null;
      });
    }
  }, { passive: true });
}

/* ─── CUSTOM CURSOR ─── */
if (!prefersReduced && hasFinePointer) {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  }, { passive: true });
  (function animRing() {
    rx += (mx - rx) * .14; ry += (my - ry) * .14;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();
  document.querySelectorAll('a,button,[role=button],.proj-card,.skill-pill,.cert-card,.fact-item,.c-item,.tl-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

/* ─── MAGNETIC BUTTONS ─── */
if (!prefersReduced && hasFinePointer) {
  document.querySelectorAll('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * .18}px, ${y * .3}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
  });
}

/* ─── HEADER shrink + active nav + sliding indicator ─── */
const header     = document.getElementById('header');
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav-link');
const navbar     = document.getElementById('navbar');
const navIndicator = document.querySelector('.nav-indicator');

function moveIndicator(link) {
  if (!navIndicator || !link) return;
  navIndicator.style.opacity = '1';
  navIndicator.style.transform = `translateX(${link.offsetLeft}px)`;
  navIndicator.style.width = link.offsetWidth + 'px';
}

function setActiveLink() {
  const y = window.scrollY;
  header.classList.toggle('compact', y > 60);
  document.getElementById('scroll-top').classList.toggle('show', y > 300);
  let current = null;
  sections.forEach(sec => {
    if (y >= sec.offsetTop - 140 && y < sec.offsetTop + sec.offsetHeight) {
      current = sec;
    }
  });
  if (current) {
    navLinks.forEach(a => a.classList.remove('active'));
    navLinks.forEach(a => a.removeAttribute('aria-current'));
    const m = document.querySelector(`.nav-link[href="#${current.id}"]`);
    if (m) {
      m.classList.add('active');
      m.setAttribute('aria-current', 'page');
      moveIndicator(m);
    }
  }
}
window.addEventListener('scroll', setActiveLink, { passive: true });
window.addEventListener('resize', () => {
  const active = document.querySelector('.nav-link.active');
  moveIndicator(active);
});
window.addEventListener('load', setActiveLink);

/* ─── HAMBURGER ─── */
const menuBtn = document.getElementById('menu');
function toggleMenu() {
  const open = menuBtn.classList.toggle('open');
  navbar.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
}
menuBtn.addEventListener('click', toggleMenu);
menuBtn.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); }
});
navbar.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  menuBtn.classList.remove('open');
  navbar.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
}));

/* ─── SCROLL REVEAL ─── */
const srObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); srObs.unobserve(e.target); } });
}, { threshold: .1 });
document.querySelectorAll('.sr').forEach(el => srObs.observe(el));

/* ─── COUNTER ANIMATION ─── */
function animCount(el, target, dur) {
  if (prefersReduced) { el.textContent = target; return; }
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    el.textContent = Math.round(p * target);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statsEl = document.getElementById('stats');
if (statsEl) {
  const statsObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animCount(document.getElementById('s1'), 5, 1000);
      animCount(document.getElementById('s2'), 49, 1200);
      animCount(document.getElementById('s3'), 9, 1100);
      animCount(document.getElementById('s4'), 100, 1400);
      animCount(document.getElementById('s5'), 5274, 1200);
      statsObs.disconnect();
    }
  }, { threshold: .3 });
  statsObs.observe(statsEl);
}

/* ─── SKILL BARS ─── */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.prof-fill').forEach(b => { b.style.width = b.dataset.w || '0%'; });
      barObs.unobserve(e.target);
    }
  });
}, { threshold: .2 });
document.querySelectorAll('.prof-bars').forEach(el => barObs.observe(el));

/* ─── SMOOTH SCROLL (anchor links) ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const t = document.querySelector(id);
    if (t) {
      e.preventDefault();
      t.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
    }
  });
});

/* ─── CONTACT FORM (EmailJS) ─── */
const form = document.getElementById('contact-form');
const note = form.querySelector('.form-note');
const submitBtn = form.querySelector('button[type="submit"]');
const submitLabel = submitBtn.querySelector('.btn-label');

function showNote(type, message) {
  note.textContent = message;
  note.className = 'form-note show ' + type;
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  if (typeof emailjs === 'undefined') {
    showNote('err', 'Email service unavailable right now. Please email me directly.');
    return;
  }
  submitBtn.disabled = true;
  submitLabel.innerHTML = '<i class="fas fa-spinner"></i> Sending...';

  emailjs.init('user_TTDmetQLYgWCLzHTDgqxm');
  emailjs.sendForm('contact_service', 'template_contact', '#contact-form')
    .then(() => {
      this.reset();
      showNote('ok', 'Message sent successfully! I\'ll get back to you soon. 🎉');
    })
    .catch(() => {
      showNote('err', 'Failed to send. Please try again or email me directly.');
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitLabel.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
    });
});
