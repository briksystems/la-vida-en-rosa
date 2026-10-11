  // ===== CÓDIGO COMPARTIDO POR TODAS LAS PÁGINAS =====
  // Cursor, barra de navegación, menú móvil, aparición al hacer scroll y visor de fotos en grande.
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', e => {
      document.body.classList.add('has-cursor');
      dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px';
      ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px';
    });
    document.addEventListener('mouseover', e => ring.classList.toggle('hovered', !!e.target.closest('a, button, .product-card')));
  }

  const nav = document.getElementById('mainNav');
  const progress = document.getElementById('scrollProgress');
  const paginaInterior = document.body.classList.contains('pagina-interior');
  let ticking = false;
  function onScroll() {
    if (!paginaInterior) nav.classList.toggle('scrolled', window.scrollY > 60);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  const navToggle = document.getElementById('navToggle');
  function setMenu(open) {
    nav.classList.toggle('menu-open', open);
    navToggle.setAttribute('aria-expanded', open);
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  navToggle.addEventListener('click', () => setMenu(!nav.classList.contains('menu-open')));
  document.querySelectorAll('#navLinks a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) { setTimeout(() => e.target.classList.add('visible'), i * 80); revealObs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ----- capas (ventanas) y foco -----
  let lastFocus = null;
  function openLayer(el, focusSel) {
    lastFocus = document.activeElement;
    el.hidden = false;
    document.body.style.overflow = 'hidden';
    const f = el.querySelector(focusSel);
    if (f) f.focus();
  }
  function closeLayer(el) {
    el.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function trapFocus(e, root) {
    if (e.key !== 'Tab') return;
    const f = [...root.querySelectorAll('a[href], button, [tabindex="0"], input, select, textarea')].filter(x => !x.disabled && x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // ----- visor de fotos en grande (flechas, teclado, cerrar) -----
  let lb = null, lbFotos = [], lbIdx = 0, lbCaption = '';
  function crearLightbox() {
    lb = document.createElement('div');
    lb.id = 'lightbox'; lb.hidden = true;
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-label', 'Fotos en grande');
    lb.innerHTML =
      '<button class="lb-close" type="button" aria-label="Cerrar">&#10005;</button>' +
      '<button class="lb-arrow lb-prev" type="button" aria-label="Foto anterior">&#8249;</button>' +
      '<img class="lb-img" src="" alt="">' +
      '<button class="lb-arrow lb-next" type="button" aria-label="Foto siguiente">&#8250;</button>' +
      '<p class="lb-count" aria-live="polite"></p>';
    document.body.appendChild(lb);
    lb.querySelector('.lb-close').addEventListener('click', cerrarLightbox);
    lb.querySelector('.lb-prev').addEventListener('click', () => irLightbox(-1));
    lb.querySelector('.lb-next').addEventListener('click', () => irLightbox(1));
    lb.addEventListener('click', e => { if (e.target === lb) cerrarLightbox(); });
    document.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') cerrarLightbox();
      else if (e.key === 'ArrowLeft') irLightbox(-1);
      else if (e.key === 'ArrowRight') irLightbox(1);
      else trapFocus(e, lb);
    });
  }
  function pintarLightbox() {
    const im = lb.querySelector('.lb-img');
    im.src = lbFotos[lbIdx]; im.alt = `${lbCaption}, foto ${lbIdx + 1} de ${lbFotos.length}`;
    lb.querySelector('.lb-count').textContent = `${lbCaption} · ${lbIdx + 1} / ${lbFotos.length}`;
    const solo = lbFotos.length < 2;
    lb.querySelector('.lb-prev').hidden = solo; lb.querySelector('.lb-next').hidden = solo;
  }
  function irLightbox(d) { lbIdx = (lbIdx + d + lbFotos.length) % lbFotos.length; pintarLightbox(); }
  function abrirLightbox(fotos, i, caption) {
    if (!lb) crearLightbox();
    lbFotos = fotos; lbIdx = i || 0; lbCaption = caption || '';
    pintarLightbox();
    openLayer(lb, '.lb-close');
  }
  function cerrarLightbox() { closeLayer(lb); }
