/* RES Engineering Services — Main JS v3 */

/* Reveal styles only apply once JS is confirmed running */
document.documentElement.classList.add('js');

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* === WHATSAPP FLOATING BUTTON (appears on every page) === */
(function () {
  if (document.querySelector('.wa-fab')) return;
  const a = document.createElement('a');
  a.className = 'wa-fab';
  a.href = 'https://wa.me/6592372285?text=' + encodeURIComponent("Hi RES Engineering Services, I'd like to enquire about your services.");
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', 'Chat with us on WhatsApp');
  a.title = 'Chat with us on WhatsApp';
  a.innerHTML = '<span class="wa-fab-label">Chat with us</span><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.002-5.45 4.437-9.884 9.889-9.884a9.82 9.82 0 016.988 2.898 9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.463 3.488"/></svg>';
  document.body.appendChild(a);
})();

/* === PAGE TRANSITIONS ===
   Exit fade only. No entrance fade: gating the whole body on a
   JS transition ships a blank page to fast crawlers/previews. */
(function () {
  if (reducedMotion) return;

  document.addEventListener('click', e => {
    const link = e.target.closest('a[href]');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('/') || link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;
    if (href === window.location.pathname) return;
    if (href.endsWith('.xml') || href.endsWith('.pdf')) return;
    e.preventDefault();
    document.body.style.transition = 'opacity 0.2s ease-in';
    document.body.style.opacity = '0';
    setTimeout(() => { window.location.href = href; }, 210);
  });

  window.addEventListener('pageshow', e => {
    if (e.persisted) document.body.style.opacity = '1';
  });
})();

/* === SCROLL CURRENT — progress flows along the busbar rule === */
(function () {
  if (reducedMotion) return;
  const hdr = document.querySelector('.site-header');
  if (!hdr) return;
  const bar = document.createElement('div');
  bar.className = 'scroll-current';
  bar.setAttribute('aria-hidden', 'true');
  hdr.appendChild(bar);
  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

/* === SHUTDOWN SEQUENCE SCRUB === */
(function () {
  const sd = document.querySelector('.shutdown-scroll');
  if (!sd) return;
  const update = () => {
    const total = Math.max(1, sd.offsetHeight - window.innerHeight);
    const p = Math.min(1, Math.max(0, -sd.getBoundingClientRect().top / total));
    const step = p < 0.22 ? 1 : p < 0.5 ? 2 : p < 0.78 ? 3 : 4;
    if (sd.dataset.step !== String(step)) sd.dataset.step = String(step);
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();

  /* click a step to jump the sequence there */
  const targets = { 1: 0.1, 2: 0.36, 3: 0.64, 4: 0.9 };
  sd.querySelectorAll('.shutdown-steps li').forEach(li => {
    li.setAttribute('role', 'button');
    li.setAttribute('tabindex', '0');
    const go = () => {
      const total = Math.max(1, sd.offsetHeight - window.innerHeight);
      const top = sd.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: top + total * targets[li.dataset.step],
        behavior: reducedMotion ? 'instant' : 'smooth'
      });
    };
    li.addEventListener('click', go);
    li.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
    });
  });
})();

/* === NAVIGATION === */
const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

navToggle?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  const [a, b, c] = navToggle.querySelectorAll('span');
  a.style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
  b.style.opacity   = open ? '0' : '1';
  c.style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

navLinks?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

/* Active nav link */
const path = window.location.pathname.replace(/\/$/, '') || '/';
document.querySelectorAll('.nav-links a').forEach(link => {
  const href = (link.getAttribute('href') || '').replace(/\/$/, '') || '/';
  if (href === path) link.classList.add('active');
});

/* === SCROLL REVEAL with STAGGER === */
const revealEls = document.querySelectorAll('[data-reveal]');
if (revealEls.length) {
  /* Assign stagger delays to siblings in the same grid/list */
  document.querySelectorAll('.svc-ledger, .services-grid, .projects-grid, .why-list, .stats-grid, .blog-grid, .training-grid, .team-grid, .services-page-grid, .trust-bar-inner, .footer-grid').forEach(parent => {
    parent.querySelectorAll('[data-reveal]').forEach((el, i) => {
      el.style.setProperty('--delay', `${i * 80}ms`);
    });
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => obs.observe(el));
}

/* === COUNTER ANIMATION === */
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(easeOut(progress) * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counters = document.querySelectorAll('[data-count]');
if (counters.length) {
  const counterObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObs.observe(el));
}

/* === HERO PARALLAX (subtle) === */
const hero = document.querySelector('.hero-bg');
if (hero) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    hero.style.transform = `translateY(${y * 0.25}px)`;
  }, { passive: true });
}

/* === CONTACT FORM (Formspree) === */
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const res = await fetch(contactForm.action, {
      method: 'POST',
      body: new FormData(contactForm),
      headers: { Accept: 'application/json' }
    });
    if (res.ok) {
      window.location.href = '/thank-you/';
    } else {
      throw new Error();
    }
  } catch {
    btn.textContent = orig;
    btn.disabled = false;
    alert('Something went wrong. Please call us directly at +65 9237 2285.');
  }
});
