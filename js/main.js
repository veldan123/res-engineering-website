/* RES Engineering Services — Main JS v2 */

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
  document.querySelectorAll('.services-grid, .projects-grid, .why-list, .stats-grid, .blog-grid, .training-grid, .team-grid, .services-page-grid, .trust-bar-inner, .footer-grid').forEach(parent => {
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
    alert('Something went wrong. Please call us directly at +65 9684 2296.');
  }
});
