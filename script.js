document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Typing effect for hero role ---------- */
  const roles = [
    'AI / ML Engineer',
    'Software Engineer',
    'Full-Stack Developer',
    'Drummer on the side'
  ];
  const typedEl = document.getElementById('typedRole');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (typedEl) {
    if (prefersReducedMotion) {
      typedEl.textContent = roles[0];
    } else {
      let roleIndex = 0, charIndex = 0, deleting = false;

      const tick = () => {
        const current = roles[roleIndex];

        if (!deleting) {
          charIndex++;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === current.length) {
            deleting = true;
            setTimeout(tick, 1600);
            return;
          }
        } else {
          charIndex--;
          typedEl.textContent = current.slice(0, charIndex);
          if (charIndex === 0) {
            deleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
          }
        }
        setTimeout(tick, deleting ? 45 : 85);
      };
      tick();
    }
  }

  /* ---------- Project modals ---------- */
  const backdrop = document.getElementById('modalBackdrop');
  let lastFocused = null;

  const openModal = (id) => {
    const modal = document.getElementById(id);
    if (!modal || !backdrop) return;
    lastFocused = document.activeElement;
    backdrop.classList.add('open');
    modal.hidden = false;
    modal.querySelector('.modal-close')?.focus();
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    if (!backdrop) return;
    backdrop.classList.remove('open');
    backdrop.querySelectorAll('.modal').forEach(m => (m.hidden = true));
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  document.querySelectorAll('[data-open-modal]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.getAttribute('data-open-modal')));
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop?.classList.contains('open')) closeModal();
  });

  /* ---------- Contact form (Formspree) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  const submitBtn = document.getElementById('contactSubmit');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (form.action.includes('YOUR_FORM_ID')) {
        status.textContent = 'Contact form not yet configured — see README.md to connect it to Formspree.';
        status.classList.add('error');
        return;
      }

      status.classList.remove('error');
      status.textContent = 'Sending…';
      submitBtn.disabled = true;

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          status.textContent = 'Thanks — your message has been sent. I\u2019ll reply soon.';
          form.reset();
        } else {
          status.textContent = 'Something went wrong — please try again or email me directly.';
          status.classList.add('error');
        }
      } catch (err) {
        status.textContent = 'Network error — please try again.';
        status.classList.add('error');
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

});