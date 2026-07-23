/* ==========================================================================
   ABDELWAHAB ADEL — PORTFOLIO
   Modular JS Architecture (v3.0)
   ─────────────────────────────────────────────────────────────────────────
   Modules:
   1. Preloader
   2. Lucide icons
   3. Theme manager (dark/light)
   4. Typing effect (hero)
   5. Mobile menu
   6. Header scroll behaviour + active nav + scroll progress
   7. Back-to-top button with progress ring
   8. Scroll reveal (IntersectionObserver)
   9. Skill progress bars
   10. Stat counters
   11. Project filter
   12. Testimonials slider
   13. FAQ accordion (CSS-driven)
   14. Contact form (validation + simulation)
   15. Newsletter form
   16. Magnetic buttons
   17. Toast notifications
   18. Smooth in-page anchor scrolling
   19. Footer year
   ─────────────────────────────────────────────────────────────────────────
   All modules use vanilla JS, no dependencies. Code is ES6+,
   organised in IIFEs to keep scope clean.
   ========================================================================== */

(() => {
  'use strict';

  /* ─── Tiny helpers ─────────────────────────────────────────────────── */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const debounce = (fn, wait = 100) => {
    let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
  };
  const throttle = (fn, limit = 16) => {
    let last = 0; return (...args) => {
      const now = Date.now();
      if (now - last >= limit) { last = now; fn(...args); }
    };
  };
  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  /* ─── 1. Preloader ─────────────────────────────────────────────────── */
  const initPreloader = () => {
    const el = $('#preloader');
    if (!el) return;
    const hide = () => {
      el.classList.add('hidden');
      setTimeout(() => el.remove(), 700);
    };
    window.addEventListener('load', hide);
    // Safety fallback in case 'load' takes too long
    setTimeout(hide, 3500);
  };

  /* ─── 2. Lucide icons ──────────────────────────────────────────────── */
  const initLucide = () => {
    if (typeof lucide !== 'undefined') lucide.createIcons();
  };

  /* ─── 3. Theme manager (dark/light) ────────────────────────────────── */
  const initTheme = () => {
    const STORAGE_KEY = 'aa-theme';
    const root = document.documentElement;
    const toggles = [$('#theme-toggle'), $('#theme-toggle-mobile')].filter(Boolean);

    const apply = (theme) => {
      root.classList.toggle('light', theme === 'light');
      root.classList.toggle('dark',  theme !== 'light');
      localStorage.setItem(STORAGE_KEY, theme);
    };

    // Initial
    const saved = localStorage.getItem(STORAGE_KEY);
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    apply(saved || (prefersLight ? 'light' : 'dark'));

    toggles.forEach(btn => btn.addEventListener('click', () => {
      const isLight = root.classList.contains('light');
      apply(isLight ? 'dark' : 'light');
    }));
  };

  /* ─── 4. Typing effect (hero) ──────────────────────────────────────── */
  const initTyping = () => {
    const el = $('#typing-text');
    if (!el) return;
    const roles = ['PHP & Laravel', 'Clean Architecture', 'React.js', 'Full-Stack Apps', 'Open Source'];
    let ri = 0, ci = 0, deleting = false, speed = 100;
    const tick = () => {
      const cur = roles[ri];
      el.textContent = deleting ? cur.substring(0, ci - 1) : cur.substring(0, ci + 1);
      deleting ? ci-- : ci++;
      speed = deleting ? 50 : 120;
      if (!deleting && ci === cur.length) { deleting = true; speed = 2000; }
      else if (deleting && ci === 0)      { deleting = false; ri = (ri + 1) % roles.length; speed = 500; }
      setTimeout(tick, speed);
    };
    setTimeout(tick, 1200);
  };

  /* ─── 5. Mobile menu ───────────────────────────────────────────────── */
  const initMobileMenu = () => {
    const btn = $('#menu-btn');
    const nav = $('#mobile-nav');
    const icon = $('#menu-icon');
    if (!btn || !nav) return;

    const open = () => {
      nav.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      if (icon) { icon.setAttribute('data-lucide', 'x'); lucide.createIcons(); }
    };
    const close = () => {
      nav.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      if (icon) { icon.setAttribute('data-lucide', 'menu'); lucide.createIcons(); }
    };

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      nav.classList.contains('open') ? close() : open();
    });
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== btn) close();
    });
    $$('.nav-link', nav).forEach(link => link.addEventListener('click', close));
    window.addEventListener('resize', () => { if (window.innerWidth >= 1024) close(); });
  };

  /* ─── 6. Header scroll behaviour + active nav + scroll progress ────── */
  const initHeader = () => {
    const header  = $('#header');
    const navLinks = $$('.nav-desktop .nav-link');
    const sections = $$('main section[id]');
    const progressBar = $('#scroll-progress');

    if (!header) return;

    let lastScroll = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const docH = document.documentElement.scrollHeight - window.innerHeight;

      // Sticky / shrink
      header.classList.toggle('scrolled', y > 50);

      // Hide on scroll down, show on scroll up (only after 200px)
      if (y > 200 && y > lastScroll) header.classList.add('hidden');
      else                              header.classList.remove('hidden');
      lastScroll = y;

      // Active nav link
      let activeId = '';
      sections.forEach(section => {
        const top    = section.offsetTop - 140;
        const height = section.offsetHeight;
        const id     = section.getAttribute('id');
        if (y >= top && y < top + height) activeId = id;
      });
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        link.classList.toggle('active', href === `#${activeId}`);
      });

      // Scroll progress bar
      if (progressBar) {
        const pct = Math.min(100, Math.max(0, (y / docH) * 100));
        progressBar.style.width = `${pct}%`;
      }
    };
    window.addEventListener('scroll', throttle(onScroll, 16), { passive: true });
    onScroll();
  };

  /* ─── 7. Back to top button ────────────────────────────────────────── */
  const initBackToTop = () => {
    const btn = $('#back-to-top');
    const circle = $('.progress-ring__circle', btn);
    if (!btn || !circle) return;

    const radius = circle.r.baseVal.value;
    const circumference = radius * 2 * Math.PI;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;

    const onScroll = () => {
      const y     = window.scrollY;
      const docH  = document.documentElement.scrollHeight - window.innerHeight;
      const pct   = docH > 0 ? y / docH : 0;
      circle.style.strokeDashoffset = circumference - (pct * circumference);
      btn.classList.toggle('visible', y > 300);
    };
    window.addEventListener('scroll', throttle(onScroll, 16), { passive: true });
    onScroll();

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  };

  /* ─── 8. Scroll reveal (IntersectionObserver) ──────────────────────── */
  const initReveal = () => {
    const els = $$('.reveal');
    if (!els.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    els.forEach(el => observer.observe(el));
  };

  /* ─── 9. Skill progress bars ───────────────────────────────────────── */
  const initSkillBars = () => {
    const bars = $$('.progress-bar');
    if (!bars.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const target = bar.getAttribute('data-target');
          bar.style.width = `${target}%`;
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.5 });

    bars.forEach(bar => observer.observe(bar));
  };

  /* ─── 10. Stat counters (animated) ─────────────────────────────────── */
  const initCounters = () => {
    const counters = $$('[data-count]');
    if (!counters.length) return;

    const animate = (el) => {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const duration = 1800;
      const start = performance.now();
      const step = (now) => {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.floor(target * eased);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(c => observer.observe(c));
  };

  /* ─── 11. Project filter ───────────────────────────────────────────── */
  const initProjectFilter = () => {
    const pills   = $$('.filter-pill');
    const cards   = $$('.project-card');
    const loadMoreBtn = $('#projects-load-more');
    const LIMIT = 6;
    if (!pills.length) return;

    let currentFilter = 'all';
    let expanded = false;

    const applyFilter = () => {
      const matched = cards.filter(card => {
        const categories = card.getAttribute('data-category') || '';
        return currentFilter === 'all' || categories.split(/\s+/).includes(currentFilter);
      });
      const visible = expanded ? matched : matched.slice(0, LIMIT);
      const visibleSet = new Set(visible);

      cards.forEach(card => {
        if (visibleSet.has(card)) {
          card.classList.remove('hidden');
          card.style.animation = 'fade-in-up 0.5s var(--ease-expo) both';
        } else {
          card.classList.add('hidden');
        }
      });

      if (loadMoreBtn) {
        const hasMore = !expanded && matched.length > LIMIT;
        loadMoreBtn.hidden = !hasMore;
      }
    };

    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => { p.classList.remove('active'); p.setAttribute('aria-selected', 'false'); });
        pill.classList.add('active');
        pill.setAttribute('aria-selected', 'true');
        currentFilter = pill.getAttribute('data-filter');
        expanded = false;
        applyFilter();
      });
    });

    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        expanded = true;
        applyFilter();
      });
    }

    applyFilter();
  };

  /* ─── 12. Testimonials slider ──────────────────────────────────────── */
  const initTestimonials = () => {
    const track  = $('#testimonial-track');
    const prev   = $('#slider-prev-btn');
    const next   = $('#slider-next-btn');
    const dotsCt = $('#slider-dots');
    if (!track) return;

    const slides = Array.from(track.children);
    const total  = slides.length;
    let index = 0, timer;

    // Build dots
    if (dotsCt) {
      dotsCt.innerHTML = '';
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
        dot.addEventListener('click', () => go(i, true));
        dotsCt.appendChild(dot);
      });
    }

    const update = () => {
      track.style.transform = `translateX(-${index * 100}%)`;
      if (dotsCt) $$('.testimonial-dot', dotsCt).forEach((d, i) => d.classList.toggle('active', i === index));
    };
    const go = (i, manual = false) => {
      index = (i + total) % total;
      update();
      if (manual) restart();
    };
    const start = () => { timer = setInterval(() => go(index + 1), 5500); };
    const stop  = () => clearInterval(timer);
    const restart = () => { stop(); start(); };

    if (prev) prev.addEventListener('click', () => go(index - 1, true));
    if (next) next.addEventListener('click', () => go(index + 1, true));
    track.addEventListener('mouseenter', stop);
    track.addEventListener('mouseleave', start);

    update();
    start();
  };

  /* ─── 12b. Project detail modal ────────────────────────────────────── */
  const initProjectModal = () => {
    const modal   = $('#project-modal');
    const dialog  = $('.pm-dialog', modal);
    const imgEl   = $('#pm-image', modal);
    const typeEl  = $('#pm-type', modal);
    const statusEl= $('#pm-status', modal);
    const titleEl = $('#pm-title', modal);
    const descEl  = $('#pm-desc', modal);
    const actionsEl = $('#pm-actions', modal);
    const techEl  = $('#pm-tech', modal);
    const aboutEl = $('#pm-about-text', modal);
    if (!modal || !dialog) return;

    let lastFocused = null;

    const buildActions = (links) => {
      actionsEl.innerHTML = '';
      links.forEach(({ href, label, icon, variant }) => {
        if (!href) return;
        const a = document.createElement('a');
        a.href = href;
        a.target = '_blank';
        a.rel = 'noopener';
        a.className = `pm-btn ${variant === 'primary' ? 'pm-btn-primary' : 'pm-btn-ghost'}`;
        a.innerHTML = `<i data-lucide="${icon}" aria-hidden="true"></i><span>${label}</span>`;
        actionsEl.appendChild(a);
      });
      initLucide();
    };

    const openFromCard = (card) => {
      const img    = $('img', card);
      const title  = $('.project-body h3', card)?.textContent.trim() || '';
      const desc   = $('.project-body p', card)?.textContent.trim() || '';
      const tags   = $$('.project-tag', card).map(t => t.textContent.trim());
      const overlayLinks = $$('.project-overlay-btn', card);
      const demoHref = overlayLinks[0]?.getAttribute('href') || '';
      const codeHref = overlayLinks[1]?.getAttribute('href') || '';
      const type   = card.getAttribute('data-type') || 'Web Project';
      const status = card.getAttribute('data-status') || 'Completed';
      const about  = card.getAttribute('data-about') || desc;

      imgEl.src = img ? img.src : '';
      imgEl.alt = img ? img.alt : title;
      typeEl.textContent = type;
      statusEl.innerHTML = `<span class="pm-dot" aria-hidden="true"></span>${status}`;
      titleEl.textContent = title;
      descEl.textContent = desc;
      aboutEl.textContent = about;

      techEl.innerHTML = '';
      tags.forEach(tag => {
        const span = document.createElement('span');
        span.textContent = tag;
        techEl.appendChild(span);
      });

      buildActions([
        { href: demoHref, label: 'Live Demo', icon: 'external-link', variant: 'primary' },
      ]);

      lastFocused = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('pm-locked');
      initLucide();
      requestAnimationFrame(() => $('.pm-close', modal)?.focus());
    };

    const close = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('pm-locked');
      if (lastFocused) lastFocused.focus();
    };

    const trapFocus = (e) => {
      if (e.key !== 'Tab' || !modal.classList.contains('open')) return;
      const focusable = $$('button, a[href]', dialog).filter(el => el.offsetParent !== null);
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus();
      }
    };
    document.addEventListener('keydown', trapFocus);

    $$('.project-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.project-overlay-btn')) return; // let icon links navigate normally
        openFromCard(card);
      });
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('.project-overlay-btn')) {
          e.preventDefault();
          openFromCard(card);
        }
      });
    });

    $$('[data-pm-close]', modal).forEach(el => el.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key === 'Tab') {
        const focusable = $$('button, a[href]', dialog).filter(el => el.offsetParent !== null);
        if (!focusable.length) return;
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
  };

  /* ─── 12c. Workflow snapshot — code panel switcher ─────────────────── */
  const initWorkflow = () => {
    const steps    = $$('.workflow-step');
    const fileEl   = $('#workflow-file');
    const codeEl   = $('#workflow-code-text');
    const codePanel= $('.workflow-code');
    const dots     = $$('.workflow-dots span');
    if (!steps.length || !codeEl) return;

    let isFirst = true;

    const applyContent = (btn) => {
      if (fileEl) fileEl.textContent = btn.getAttribute('data-file') || '';
      codeEl.innerHTML = btn.getAttribute('data-code') || '';
      const idx = steps.indexOf(btn);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    };

    const render = (btn) => {
      steps.forEach(s => { s.classList.remove('active'); s.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      if (isFirst || !codePanel) {
        applyContent(btn);
        isFirst = false;
        return;
      }

      codePanel.classList.add('is-switching');
      window.setTimeout(() => {
        applyContent(btn);
        codePanel.classList.remove('is-switching');
      }, 180);
    };

    steps.forEach(btn => btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      render(btn);
    }));
    render(steps[0]);
  };

  /* ─── 13. FAQ accordion — single-open behaviour ────────────────────── */
  const initFaq = () => {
    const items = $$('.faq-item');
    items.forEach(item => {
      item.addEventListener('toggle', () => {
        if (item.open) items.forEach(o => { if (o !== item) o.open = false; });
      });
    });
  };

  /* ─── 17. Toast notifications (defined early so modules below can use) ─ */
  let toastTimer;
  const showToast = (msg, type = 'success') => {
    const el = $('#toast');
    if (!el) return;
    el.hidden = false;
    el.classList.remove('success', 'error');
    el.classList.add(type);
    el.textContent = msg;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 4000);
  };

  /* ─── 14. Contact form (validation + simulated submit) ─────────────── */
  const initContactForm = () => {
    const form    = $('#contact-form');
    const btn     = $('#submit-btn');
    const txt     = $('#submit-text');
    const feed    = $('#form-feedback');
    if (!form) return;

    const validators = {
      name:    v => v.trim().length >= 2 || 'Name must be at least 2 characters',
      email:   v => isValidEmail(v) || 'Please enter a valid email',
      subject: v => v.trim().length >= 3 || 'Subject must be at least 3 characters',
      message: v => v.trim().length >= 10 || 'Message must be at least 10 characters',
    };

    const showError = (id, msg) => {
      const el = $(`#err-${id}`);
      if (el) { el.textContent = msg; el.style.color = msg ? 'var(--color-error)' : ''; }
      const input = $(`#${id}`);
      if (input) input.style.borderColor = msg ? 'var(--color-error)' : '';
    };

    // Live validation
    Object.keys(validators).forEach(id => {
      const input = $(`#${id}`);
      if (!input) return;
      input.addEventListener('blur', () => {
        const msg = validators[id](input.value);
        showError(id, msg === true ? '' : msg);
      });
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form));
      let valid = true;

      Object.keys(validators).forEach(id => {
        const msg = validators[id](data[id] || '');
        showError(id, msg === true ? '' : msg);
        if (msg !== true) valid = false;
      });

      if (!valid) {
        showToast('Please fix the errors above', 'error');
        return;
      }

      // Simulate submission
      btn.disabled = true;
      txt.innerHTML = '<span class="spinner-inline"></span> Sending...';

      setTimeout(() => {
        btn.disabled = false;
        txt.textContent = 'Send Message';
        if (typeof lucide !== 'undefined') lucide.createIcons();

        form.reset();
        feed.hidden = false;
        feed.classList.remove('error');
        feed.classList.add('success');
        feed.textContent = `Thank you, ${data.name}! Your message has been sent. I'll reply within 24 hours.`;
        showToast('Message sent successfully! 🎉', 'success');

        setTimeout(() => { feed.hidden = true; }, 6000);
      }, 1500);
    });
  };

  /* ─── 15. Newsletter form ──────────────────────────────────────────── */
  const initNewsletter = () => {
    const form = $('#newsletter-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('input[name="newsletter-email"]', form);
      const value = input.value.trim();
      if (!isValidEmail(value)) {
        showToast('Please enter a valid email', 'error');
        return;
      }
      input.value = '';
      showToast('Thanks for subscribing! 🎉', 'success');
    });
  };

  /* ─── 16. Magnetic buttons (subtle effect on desktop only) ─────────── */
  const initMagnetic = () => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const magnets = $$('.magnetic');
    magnets.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  };



  /* ─── 18. Smooth anchor scrolling (with offset) ────────────────────── */
  const initSmoothScroll = () => {
    $$('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  };

  /* ─── 19. Footer year ──────────────────────────────────────────────── */
  const initFooterYear = () => {
    const el = $('#current-year');
    if (el) el.textContent = new Date().getFullYear();
  };

  /* ─── 19b. Dynamic age (calculated from birth year, no manual upkeep) ── */
  const initDynamicAge = () => {
    const el = $('#dynamic-age');
    if (!el) return;
    const birthYear = parseInt(el.getAttribute('data-birth-year'), 10);
    if (!birthYear) return;
    el.textContent = new Date().getFullYear() - birthYear;
  };

  /* ─────────────────────────────────────────────────────────────────────
     Bootstrap — run on DOMContentLoaded
     ───────────────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initLucide();
    initTheme();
    initTyping();
    initMobileMenu();
    initHeader();
    initBackToTop();
    initReveal();
    initSkillBars();
    initCounters();
    initProjectFilter();
    initProjectModal();
    initWorkflow();
    initTestimonials();
    initFaq();
    initContactForm();
    initNewsletter();
    initMagnetic();
    initSmoothScroll();
    initFooterYear();
    initDynamicAge();
  });

  // Re-render Lucide icons after late DOM mutations (form states)
  const refreshIcons = () => { if (typeof lucide !== 'undefined') lucide.createIcons(); };
  window.addEventListener('load', refreshIcons);
})();
