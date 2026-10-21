/* Phren Lhantom — single-page portfolio */

/*
 * Paintings, in display order.
 * Put each photo in the images/ folder with the file name below.
 * Until a photo exists, a dark placeholder tile is shown at `ratio`.
 * Once the photo loads, it is shown at its own natural shape.
 * `alt` should describe what the painting looks like, for people using screen readers.
 */
const PAINTINGS = [
  { file: 'images/01.jpg', title: 'Untitled I',    year: 2024, medium: 'Oil on canvas',    size: '60 × 80 cm',  ratio: '3/4', alt: 'Placeholder: describe painting 01' },
  { file: 'images/02.jpg', title: 'Untitled II',   year: 2025, medium: 'Oil on linen',     size: '50 × 50 cm',  ratio: '4/5', alt: 'Placeholder: describe painting 02' },
  { file: 'images/03.jpg', title: 'Untitled III',  year: 2026, medium: 'Acrylic on panel', size: '90 × 120 cm', ratio: '1/1', alt: 'Placeholder: describe painting 03' },
  { file: 'images/04.jpg', title: 'Untitled IV',   year: 2024, medium: 'Oil on canvas',    size: '40 × 60 cm',  ratio: '2/3', alt: 'Placeholder: describe painting 04' },
  { file: 'images/05.jpg', title: 'Untitled V',    year: 2025, medium: 'Oil on linen',     size: '60 × 80 cm',  ratio: '5/4', alt: 'Placeholder: describe painting 05' },
  { file: 'images/06.jpg', title: 'Untitled VI',   year: 2026, medium: 'Acrylic on panel', size: '50 × 50 cm',  ratio: '3/4', alt: 'Placeholder: describe painting 06' },
  { file: 'images/07.jpg', title: 'Untitled VII',  year: 2024, medium: 'Oil on canvas',    size: '90 × 120 cm', ratio: '4/3', alt: 'Placeholder: describe painting 07' },
  { file: 'images/08.jpg', title: 'Untitled VIII', year: 2025, medium: 'Oil on linen',     size: '40 × 60 cm',  ratio: '2/3', alt: 'Placeholder: describe painting 08' },
  { file: 'images/09.jpg', title: 'Untitled IX',   year: 2026, medium: 'Acrylic on panel', size: '60 × 80 cm',  ratio: '1/1', alt: 'Placeholder: describe painting 09' },
];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Gallery ---------- */

function buildGallery() {
  const grid = document.querySelector('.gallery__grid');
  if (!grid) return;

  PAINTINGS.forEach((p, i) => {
    const number = String(i + 1).padStart(2, '0');

    const figure = document.createElement('figure');
    figure.className = 'piece reveal';
    figure.tabIndex = 0;

    const art = document.createElement('div');
    art.className = 'piece__art';

    const placeholder = document.createElement('div');
    placeholder.className = 'piece__placeholder';
    placeholder.style.aspectRatio = p.ratio;
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.textContent = 'painting ' + number;

    const img = document.createElement('img');
    img.className = 'piece__img';
    img.src = p.file;
    img.alt = p.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('load', () => figure.classList.add('has-image'));
    img.addEventListener('error', () => img.remove());

    art.append(placeholder, img);

    const caption = document.createElement('figcaption');
    caption.className = 'piece__caption';
    caption.innerHTML = '<span class="piece__title"></span><span class="piece__meta"></span>';
    caption.querySelector('.piece__title').textContent = p.title;
    caption.querySelector('.piece__meta').textContent = `${p.year} · ${p.medium} · ${p.size}`;

    figure.append(art, caption);
    grid.append(figure);
  });

  // Tap (or Enter/Space) toggles the details; only one open at a time.
  const pieces = grid.querySelectorAll('.piece');
  const toggle = (piece) => {
    const open = !piece.classList.contains('is-open');
    pieces.forEach((other) => other.classList.remove('is-open'));
    piece.classList.toggle('is-open', open);
  };
  pieces.forEach((piece) => {
    piece.addEventListener('click', () => toggle(piece));
    piece.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle(piece);
      }
    });
    piece.addEventListener('blur', () => piece.classList.remove('is-open'));
  });
}

/* ---------- Scroll reveal ---------- */

function setUpReveal() {
  const items = document.querySelectorAll('.reveal');

  if (reducedMotion || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  items.forEach((el) => observer.observe(el));

  // Anything that receives keyboard focus should never stay hidden.
  document.addEventListener('focusin', (e) => {
    const el = e.target.closest('.reveal');
    if (el) el.classList.add('is-visible');
  });
}

/* ---------- Cursor halo (mouse only) ---------- */

function setUpHalo() {
  const halo = document.querySelector('.halo');
  if (!halo || reducedMotion || !window.matchMedia('(pointer: fine)').matches) return;

  halo.classList.add('is-enabled');

  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 3;
  let x = tx;
  let y = ty;

  window.addEventListener('pointermove', (e) => {
    tx = e.clientX;
    ty = e.clientY;
    halo.style.opacity = 1;
  });
  document.documentElement.addEventListener('mouseleave', () => {
    halo.style.opacity = 0;
  });

  const tick = () => {
    x += (tx - x) * 0.12;
    y += (ty - y) * 0.12;
    halo.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- Tap light (touch only) ---------- */

function setUpTapLight() {
  if (reducedMotion) return;

  // Links, buttons, form fields and paintings already respond to taps.
  const interactive = 'a, button, input, textarea, select, label, .piece';

  document.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'touch' || e.target.closest(interactive)) return;

    const light = document.createElement('div');
    light.className = 'tap-light';
    light.setAttribute('aria-hidden', 'true');
    light.style.left = e.clientX + 'px';
    light.style.top = e.clientY + 'px';
    light.addEventListener('animationend', () => light.remove());
    document.body.append(light);
  });
}

/* ---------- Forms (Formspree) ---------- */

function setUpForms() {
  document.querySelectorAll('.form').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const status = form.querySelector('.form__status');
      const button = form.querySelector('button[type="submit"]');

      button.disabled = true;
      status.textContent = 'Sending…';

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error('Request failed');

        const thanks = document.createElement('p');
        thanks.className = 'form-thanks';
        thanks.setAttribute('role', 'status');
        thanks.tabIndex = -1;
        thanks.textContent = 'Thank you, Phren will be in touch.';
        form.replaceWith(thanks);
        thanks.focus();
      } catch {
        status.textContent = 'Sorry, that didn’t send. Please try again in a moment.';
        button.disabled = false;
      }
    });
  });
}

buildGallery();
setUpReveal();
setUpHalo();
setUpTapLight();
setUpForms();
