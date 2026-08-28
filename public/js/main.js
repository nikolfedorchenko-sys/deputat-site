'use strict';
/* Публічна сторінка: scroll-reveal, навбар, паралакс, tilt, count-up,
   форма звернення, лайтбокс галереї, бургер-меню.
   Логіку анімацій портовано з hi-fi прототипу (support.js). */

(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const groups = Array.from(document.querySelectorAll('[data-reveal]'));

  // Каскадна затримка для дочірніх [data-rv]
  groups.forEach((g) => {
    Array.from(g.querySelectorAll('[data-rv]')).forEach((c, i) => {
      c.style.transitionDelay = i * 80 + 'ms';
    });
  });

  function runCounts(root) {
    root.querySelectorAll('[data-count]').forEach((el) => {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      const target = +el.dataset.count;
      if (!Number.isFinite(target)) { el.textContent = el.dataset.count; return; }
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min(1, (now - start) / 1200);
        const e = 1 - Math.pow(1 - p, 3); // ease-out-cubic
        el.textContent = Math.round(target * e);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  // Reduced motion — показати все одразу, без анімацій
  if (reduced) {
    groups.forEach((g) => g.classList.add('rv-in'));
    document.querySelectorAll('[data-count]').forEach((el) => (el.textContent = el.dataset.count));
  } else {
    // IntersectionObserver для появи секцій
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('rv-in');
            runCounts(e.target);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    let pending = [];
    groups.forEach((g) => {
      if (g.dataset.reveal === 'load') {
        setTimeout(() => { g.classList.add('rv-in'); runCounts(g); }, 80);
      } else {
        io.observe(g);
        pending.push(g);
      }
    });

    // Страхувальний механізм: якщо observer не спрацював — показуємо по скролу/таймеру
    function flush() {
      pending = pending.filter((g) => {
        if (g.getBoundingClientRect().top < window.innerHeight * 0.85) {
          g.classList.add('rv-in');
          runCounts(g);
          return false;
        }
        return true;
      });
    }
    const timer = setInterval(() => { flush(); if (!pending.length) clearInterval(timer); }, 300);

    // Навбар / прогрес-бар / паралакс / активний якір
    const nav = document.getElementById('siteNav');
    const pbar = document.getElementById('pbar');
    const links = Array.from(document.querySelectorAll('.nl'));
    const parallax = Array.from(document.querySelectorAll('[data-parallax]'));
    let lastY = 0;

    function onScroll() {
      const y = window.scrollY;
      flush();

      if (pbar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        pbar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      }
      if (nav) {
        nav.classList.toggle('nav-solid', y > 24);
        if (y > 140 && y > lastY + 4) nav.classList.add('nav-hidden');
        else if (y < lastY - 4 || y <= 140) nav.classList.remove('nav-hidden');
      }
      parallax.forEach((el) => (el.style.transform = 'translateY(' + y * 0.1 + 'px)'));

      let current = null;
      links.forEach((l) => {
        const sec = document.getElementById(l.dataset.target);
        if (sec && sec.getBoundingClientRect().top <= 130) current = l;
      });
      links.forEach((l) => l.classList.toggle('active', l === current));
      lastY = y;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // 3D-tilt карток
    document.querySelectorAll('[data-tilt]').forEach((el) => {
      el.addEventListener('mousemove', (ev) => {
        const r = el.getBoundingClientRect();
        const dx = (ev.clientX - r.left) / r.width - 0.5;
        const dy = (ev.clientY - r.top) / r.height - 0.5;
        el.style.transform =
          'translateY(-6px) perspective(700px) rotateX(' + -dy * 5 + 'deg) rotateY(' + dx * 6 + 'deg)';
      });
      el.addEventListener('mouseleave', () => (el.style.transform = ''));
    });
  }
})();

// ── Бургер-меню ──
(function () {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  links.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => links.classList.remove('open')));
})();

// ── Форма звернення ──
(function () {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const msg = document.getElementById('formMsg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.className = 'form__msg';
    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.name || !data.contact || !data.message) {
      msg.textContent = 'Заповніть обов’язкові поля.';
      msg.classList.add('err');
      return;
    }

    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        msg.textContent = 'Дякуємо! Ваше звернення надіслано.';
        msg.classList.add('ok');
        form.reset();
      } else {
        msg.textContent = json.error || 'Не вдалося надіслати. Спробуйте пізніше.';
        msg.classList.add('err');
      }
    } catch (_) {
      msg.textContent = 'Помилка мережі. Спробуйте пізніше.';
      msg.classList.add('err');
    } finally {
      btn.disabled = false;
    }
  });
})();

// ── Лайтбокс галереї (та фото в тексті новини) ──
(function () {
  // Клікабельні зони: галерея та тіло статті (фото, вставлені в текст)
  const roots = [
    document.getElementById('galleryGrid'),
    document.querySelector('.news-article__body'),
  ].filter(Boolean);
  if (!roots.length) return;

  const box = document.createElement('div');
  box.className = 'lightbox';
  box.innerHTML = '<button class="lightbox__close" aria-label="Закрити">×</button><img alt="" />';
  document.body.appendChild(box);
  const bigImg = box.querySelector('img');

  roots.forEach((root) =>
    root.addEventListener('click', (e) => {
      const img = e.target.closest('img');
      if (!img) return;
      bigImg.src = img.src;
      bigImg.alt = img.alt;
      box.classList.add('open');
    })
  );
  function close() { box.classList.remove('open'); bigImg.src = ''; }
  box.addEventListener('click', (e) => {
    if (e.target === box || e.target.classList.contains('lightbox__close')) close();
  });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
})();
