/* Phren Lhantom — portfolio (home, gallery and contact pages share this file) */

/*
 * Paintings, in display order on the gallery page.
 * Put each photo in the images/ folder with the file name below.
 * Until a photo exists, a dark placeholder tile is shown at `ratio`.
 * Once the photo loads, it is shown at its own natural shape.
 * `alt` should describe what the painting looks like, for people using screen readers.
 * `availability` is shown when a painting is enlarged, e.g. 'Original available',
 *   'Sold', 'Prints available', or 'Sold · Prints available'.
 * `featured: true` puts that painting on the home page (the first one marked is used).
 */
const PAINTINGS = [
  { file: 'images/01.jpg', title: 'Untitled I',    year: 2024, medium: 'Oil on canvas',    size: '60 × 80 cm',  ratio: '3/4', availability: 'Original available', featured: true, alt: 'Placeholder: describe painting 01' },
  { file: 'images/02.jpg', title: 'Untitled II',   year: 2025, medium: 'Oil on linen',     size: '50 × 50 cm',  ratio: '4/5', availability: 'Original available', alt: 'Placeholder: describe painting 02' },
  { file: 'images/03.jpg', title: 'Untitled III',  year: 2026, medium: 'Acrylic on panel', size: '90 × 120 cm', ratio: '1/1', availability: 'Original available', alt: 'Placeholder: describe painting 03' },
  { file: 'images/04.jpg', title: 'Untitled IV',   year: 2024, medium: 'Oil on canvas',    size: '40 × 60 cm',  ratio: '2/3', availability: 'Original available', alt: 'Placeholder: describe painting 04' },
  { file: 'images/05.jpg', title: 'Untitled V',    year: 2025, medium: 'Oil on linen',     size: '60 × 80 cm',  ratio: '5/4', availability: 'Original available', alt: 'Placeholder: describe painting 05' },
  { file: 'images/06.jpg', title: 'Untitled VI',   year: 2026, medium: 'Acrylic on panel', size: '50 × 50 cm',  ratio: '3/4', availability: 'Original available', alt: 'Placeholder: describe painting 06' },
  { file: 'images/07.jpg', title: 'Untitled VII',  year: 2024, medium: 'Oil on canvas',    size: '90 × 120 cm', ratio: '4/3', availability: 'Original available', alt: 'Placeholder: describe painting 07' },
  { file: 'images/08.jpg', title: 'Untitled VIII', year: 2025, medium: 'Oil on linen',     size: '40 × 60 cm',  ratio: '2/3', availability: 'Original available', alt: 'Placeholder: describe painting 08' },
  { file: 'images/09.jpg', title: 'Untitled IX',   year: 2026, medium: 'Acrylic on panel', size: '60 × 80 cm',  ratio: '1/1', availability: 'Original available', alt: 'Placeholder: describe painting 09' },
  { file: 'images/10.jpg', title: 'Untitled X',    year: 2026, medium: 'Oil on canvas',    size: '50 × 70 cm',  ratio: '3/4', availability: 'Original available', alt: 'Placeholder: describe painting 10' },
  { file: 'images/11.jpg', title: 'Untitled XI',   year: 2026, medium: 'Oil on linen',     size: '60 × 60 cm',  ratio: '1/1', availability: 'Original available', alt: 'Placeholder: describe painting 11' },
  { file: 'images/12.jpg', title: 'Untitled XII',  year: 2026, medium: 'Oil on canvas',    size: '70 × 90 cm',  ratio: '4/5', availability: 'Original available', alt: 'Placeholder: describe painting 12' },
];

/*
 * Photo uploads on the contact form.
 * Formspree's free plan does not accept files, so this stays false until the
 * Formspree plan is upgraded (Personal or above). Set it to true to switch the
 * upload field on; until then commission clients are asked to email the photo.
 */
const UPLOADS_ENABLED = false;
const UPLOAD_MAX_MB = 10;
const UPLOAD_TYPES = ['jpg', 'jpeg', 'png', 'heic'];

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Copyright mark laid over every painting (decorative, so hidden from screen readers) */
function makeWatermark() {
  const mark = document.createElement('span');
  mark.className = 'watermark';
  mark.setAttribute('aria-hidden', 'true');
  mark.textContent = '© Phren Lhantom';
  return mark;
}

/* ---------- Gallery ---------- */

// data-gallery="all" shows every painting; "featured" shows the home page's one.
function buildGallery() {
  const grid = document.querySelector('[data-gallery]');
  if (!grid) return;

  const list = grid.dataset.gallery === 'featured'
    ? [PAINTINGS.find((p) => p.featured) || PAINTINGS[0]]
    : PAINTINGS;

  list.forEach((p) => {
    const number = String(PAINTINGS.indexOf(p) + 1).padStart(2, '0');

    const figure = document.createElement('figure');
    figure.className = 'piece reveal';
    figure.tabIndex = 0;
    figure.setAttribute('role', 'button');
    figure.setAttribute('aria-label', `Enlarge ${p.title}`);

    const art = document.createElement('div');
    art.className = 'piece__art';

    const placeholder = document.createElement('div');
    placeholder.className = 'piece__placeholder';
    placeholder.style.aspectRatio = p.ratio;
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.textContent = 'painting ' + number;

    const img = document.createElement('img');
    img.className = 'piece__img';
    img.src = p.file;
    img.alt = p.alt;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('load', () => figure.classList.add('has-image'));
    img.addEventListener('error', () => img.remove());

    art.append(placeholder, img, makeWatermark());

    const caption = document.createElement('figcaption');
    caption.className = 'piece__caption';
    caption.innerHTML = '<span class="piece__title"></span><span class="piece__meta"></span>';
    caption.querySelector('.piece__title').textContent = p.title;
    caption.querySelector('.piece__meta').textContent = `${p.year} · ${p.medium} · ${p.size}`;

    figure.append(art, caption);
    grid.append(figure);

    // Tap/click (or Enter/Space) enlarges the painting.
    figure.addEventListener('click', () => openLightbox(figure, p));
    figure.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(figure, p);
      }
    });
  });
}

/* ---------- Lightbox (enlarged painting) ---------- */

function openLightbox(piece, p) {
  const box = document.querySelector('.lightbox');
  if (!box || box.open) return;

  // Reuse whatever the tile is showing: the photo, or its placeholder.
  const art = box.querySelector('.lightbox__art');
  const img = piece.querySelector('.piece__img');
  if (piece.classList.contains('has-image') && img) {
    const big = document.createElement('img');
    big.className = 'lightbox__img';
    big.src = img.src;
    big.alt = p.alt;
    art.replaceChildren(big);
  } else {
    const placeholder = piece.querySelector('.piece__placeholder').cloneNode(true);
    placeholder.classList.add('lightbox__placeholder');
    art.replaceChildren(placeholder);
  }
  art.append(makeWatermark());

  box.querySelector('.lightbox__title').textContent = p.title;
  box.querySelector('.lightbox__meta').textContent = `${p.year} · ${p.medium} · ${p.size}`;
  box.querySelector('.lightbox__availability').textContent = p.availability;

  document.documentElement.classList.add('lightbox-open');
  box.showModal();
}

function setUpLightbox() {
  const box = document.querySelector('.lightbox');
  if (!box) return;

  box.addEventListener('close', () => {
    document.documentElement.classList.remove('lightbox-open');
  });
  // A tap anywhere (or the close button, or Escape) closes it.
  box.addEventListener('click', () => box.close());
}

/* Discourage saving paintings by right-click or dragging (a deterrent, not a lock) */
function setUpImageGuard() {
  ['contextmenu', 'dragstart'].forEach((type) => {
    document.addEventListener(type, (e) => {
      if (e.target.closest('.piece, .lightbox__art')) e.preventDefault();
    });
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

  document.addEventListener('pointerdown', (e) => {
    // Everywhere except over an enlarged painting.
    if (e.pointerType !== 'touch' || document.querySelector('.lightbox[open]')) return;

    const light = document.createElement('div');
    light.className = 'tap-light';
    light.setAttribute('aria-hidden', 'true');
    light.style.left = e.clientX + 'px';
    light.style.top = e.clientY + 'px';
    light.addEventListener('animationend', () => light.remove());
    document.body.append(light);
  });
}

/* ---------- Contact form: follow-up fields and photo upload ---------- */

function setUpEnquiryForm() {
  const form = document.querySelector('.form--enquiry');
  if (!form) return;

  const details = form.querySelectorAll('.detail[data-for]');
  const subject = form.querySelector('input[name="_subject"]');
  const upload = form.querySelector('.upload');
  const uploadOff = form.querySelector('.upload-off');
  const file = form.querySelector('input[type="file"]');
  const fileName = form.querySelector('.upload__name');

  // Painting lists: originals leave out anything marked Sold; prints list every painting.
  form.querySelectorAll('select[data-paintings]').forEach((select) => {
    PAINTINGS
      .filter((p) => select.dataset.paintings === 'all' || !/sold/i.test(p.availability))
      .forEach((p) => select.add(new Option(`${p.title} (${p.size})`, p.title)));
  });

  // Show the fields for the chosen enquiry type. A disabled fieldset is
  // hidden, skipped by validation, and not sent.
  const update = () => {
    const type = form.querySelector('input[name="enquiry_type"]:checked');
    details.forEach((fieldset) => {
      const on = !!type && fieldset.dataset.for === type.value;
      fieldset.disabled = !on;
      fieldset.hidden = !on;
    });
    subject.value = type ? `Website enquiry: ${type.value}` : 'Website enquiry';
  };
  form.addEventListener('change', update);
  update();

  if (!UPLOADS_ENABLED) {
    upload.remove();
    return;
  }
  uploadOff?.remove();
  form.enctype = 'multipart/form-data';

  file.addEventListener('change', () => {
    const f = file.files[0];
    let problem = '';
    if (f) {
      const ext = f.name.split('.').pop().toLowerCase();
      if (!UPLOAD_TYPES.includes(ext)) problem = 'Please choose a JPG, PNG or HEIC photo.';
      else if (f.size > UPLOAD_MAX_MB * 1024 * 1024) problem = `Please choose a photo under ${UPLOAD_MAX_MB} MB.`;
    }
    file.setCustomValidity(problem);
    fileName.textContent = problem || (f ? f.name : 'No photo chosen');
    if (problem) file.reportValidity();
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
setUpLightbox();
setUpImageGuard();
setUpReveal();
setUpHalo();
setUpTapLight();
setUpEnquiryForm();
setUpForms();
