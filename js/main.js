  // ===== SPLASH SCREEN =====
  (function() {
    const splash = document.getElementById('splash');
    const seen = sessionStorage.getItem('splashSeen');
    if (seen) { splash.style.display = 'none'; return; }
    splash.querySelector('.splash-btn').focus({ preventScroll: true });
    document.body.style.overflow = 'hidden';

    // Typewriter effect on splash-sub
    const sub = splash.querySelector('.splash-sub');
    const text = 'Flores realistas en papel.';
    sub.textContent = '';
    let i = 0;
    setTimeout(() => {
      const timer = setInterval(() => {
        sub.textContent += text[i];
        i++;
        if (i >= text.length) clearInterval(timer);
      }, 52);
    }, 1850); // start after line animation
  })();

  function startSplash() {
    const splash = document.getElementById('splash');
    splash.classList.add('leaving');
    setTimeout(() => {
      splash.style.display = 'none';
      document.body.style.overflow = '';
      sessionStorage.setItem('splashSeen', '1');
    }, 1150);
  }

  // ===== CURSOR =====
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) document.addEventListener('mousemove', e => {
    document.body.classList.add('has-cursor');
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    ring.style.left = e.clientX + 'px';
    ring.style.top = e.clientY + 'px';
  });
  document.querySelectorAll('a, button, .product-card, .gallery-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  // ===== NAV SCROLL =====
  const nav = document.getElementById('mainNav');
  const progress = document.getElementById('scrollProgress');
  let ticking = false;
  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  // ===== MENÚ MÓVIL =====
  const navToggle = document.getElementById('navToggle');
  function setMenu(open) {
    nav.classList.toggle('menu-open', open);
    navToggle.setAttribute('aria-expanded', open);
    navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  }
  navToggle.addEventListener('click', () => setMenu(!nav.classList.contains('menu-open')));
  document.querySelectorAll('#navLinks a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  // ===== ETIQUETAS ACCESIBLES PARA FOTOS DE FONDO =====
  document.querySelectorAll('.gallery-item').forEach(item => {
    const fill = item.querySelector('.gallery-fill');
    const cap = item.querySelector('.gallery-caption');
    if (fill && cap) { fill.setAttribute('role', 'img'); fill.setAttribute('aria-label', cap.textContent.trim()); }
  });
  document.querySelectorAll('.product-card').forEach(card => {
    const fill = card.querySelector('.product-fill');
    const name = card.querySelector('.product-name');
    if (fill && name) { fill.setAttribute('role', 'img'); fill.setAttribute('aria-label', name.textContent.trim()); }
  });
  document.querySelectorAll('.mosaic-cell').forEach(cell => cell.setAttribute('aria-hidden', 'true'));

  // ===== REVEAL ON SCROLL =====
  const revealEls = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => observer.observe(el));

  // ===== GALLERY FILTER =====
  function filterGallery(btn, cat) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(b => b.setAttribute('aria-pressed', b === btn));
    document.querySelectorAll('.gallery-item').forEach(item => {
      const show = cat === 'todos' || item.dataset.cat === cat;
      item.style.opacity = show ? '1' : '0.2';
      item.style.pointerEvents = show ? 'auto' : 'none';
    });
  }

  // ===== CATÁLOGO =====
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
  function openCatalog() { openLayer(document.getElementById('catalogPage'), '.catalog-back'); }
  function closeCatalog() { closeLayer(document.getElementById('catalogPage')); }

  // ===== PRODUCT MODAL =====
  let pmImages = [], pmIndex = 0, pmName = '';
  function openProduct(name, type, price, desc, images, tag, waName) {
    pmImages = images; pmIndex = 0; pmName = waName || name;
    document.getElementById('pmTag').textContent = tag;
    document.getElementById('pmName').textContent = name;
    document.getElementById('pmType').textContent = type;
    document.getElementById('pmPrice').textContent = price;
    document.getElementById('pmDesc').textContent = desc;
    document.getElementById('pmWa').href = 'https://wa.me/573208654762?text=Hola!%20Quiero%20consultar%20sobre%20' + encodeURIComponent(pmName);
    renderPm();
    openLayer(document.getElementById('productModal'), '.pm-close');
  }
  function closeProduct() { closeLayer(document.getElementById('productModal')); }
  function renderPm() {
    const img = document.getElementById('pmImg');
    img.style.opacity = '0';
    setTimeout(() => { img.src = pmImages[pmIndex]; img.alt = pmName + ' (foto ' + (pmIndex + 1) + ' de ' + pmImages.length + ')'; img.style.opacity = '1'; }, 150);
    const dots = document.getElementById('pmDots');
    dots.innerHTML = pmImages.map((_, i) =>
      `<button type="button" class="pm-dot${i===pmIndex?' active':''}" onclick="pmGo(${i})" aria-label="Ver foto ${i+1}"${i===pmIndex?' aria-current="true"':''}></button>`
    ).join('');
  }
  function pmPrev() { pmIndex = (pmIndex - 1 + pmImages.length) % pmImages.length; renderPm(); }
  function pmNext() { pmIndex = (pmIndex + 1) % pmImages.length; renderPm(); }
  function pmGo(i) { pmIndex = i; renderPm(); }
  document.getElementById('productModal').addEventListener('click', function(e) {
    if (e.target === this) closeProduct();
  });
  function trapFocus(e, root) {
    if (e.key !== 'Tab') return;
    const f = [...root.querySelectorAll('a[href], button, [tabindex="0"], input, select, textarea')].filter(x => !x.disabled && x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  document.addEventListener('keydown', function(e) {
    const pm = document.getElementById('productModal');
    const cat = document.getElementById('catalogPage');
    if (!pm.hidden) {
      if (e.key === 'ArrowLeft') pmPrev();
      if (e.key === 'ArrowRight') pmNext();
      if (e.key === 'Escape') { closeProduct(); return; }
      trapFocus(e, pm);
    } else if (!cat.hidden) {
      if (e.key === 'Escape') { closeCatalog(); return; }
      trapFocus(e, cat);
    }
    const card = e.target.closest && e.target.closest('.product-card');
    if (card && e.target === card && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); card.click(); }
  });
  function setStatus(msg) { document.getElementById('formStatus').textContent = msg; }
  function handleSubmit() {
    const nombre   = document.getElementById('nombre').value.trim();
    const email    = document.getElementById('email').value.trim();
    const tel      = document.getElementById('tel').value.trim();
    const servicio = document.getElementById('servicio').value;
    const mensaje  = document.getElementById('mensaje').value.trim();
    if (!nombre) { setStatus('Por favor escribe tu nombre para continuar.'); document.getElementById('nombre').focus(); return; }
    setStatus('');
    const txt = buildMessage(nombre, email, tel, servicio, mensaje);
    window.open(`https://wa.me/573208654762?text=${encodeURIComponent(txt)}`, '_blank', 'noopener');
  }

  function handleEmail() {
    const nombre   = document.getElementById('nombre').value.trim();
    const email    = document.getElementById('email').value.trim();
    const tel      = document.getElementById('tel').value.trim();
    const servicio = document.getElementById('servicio').value;
    const mensaje  = document.getElementById('mensaje').value.trim();
    if (!nombre) { setStatus('Por favor escribe tu nombre para continuar.'); document.getElementById('nombre').focus(); return; }
    setStatus('');
    const subject = encodeURIComponent(`Consulta de ${nombre}${servicio ? ' · ' + servicio : ''}`);
    const body    = encodeURIComponent(buildMessage(nombre, email, tel, servicio, mensaje));
    window.location.href = `mailto:lavidaenrosaa@gmail.com?subject=${subject}&body=${body}`;
  }

  function buildMessage(nombre, email, tel, servicio, mensaje) {
    let txt = `Hola, mi nombre es ${nombre}.`;
    if (email)   txt += ` Mi correo es ${email}.`;
    if (tel)     txt += ` Mi teléfono es ${tel}.`;
    if (servicio) txt += ` Quisiera pedir asesoría con el servicio de ${servicio}.`;
    if (mensaje) txt += ` Mensaje adicional: ${mensaje}`;
    return txt;
  }
