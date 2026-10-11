  // ===== VISTA DE PRODUCTO: ventana a pantalla completa que tapa toda la página =====
  // Se abre desde la tienda, el catálogo o "Otras flores". Cantidad de fotos -> distribución
  // (siempre se ve la foto completa, sin huecos): 1 y 2 verticales | 3 una grande y dos apiladas | 4 cuadrados 2x2 | 5 o más carrusel.
  const vpEnCatalogo = !!document.getElementById('catalogGrid');
  const vp = document.createElement('div');
  vp.id = 'vistaProducto'; vp.hidden = true;
  vp.setAttribute('role', 'dialog'); vp.setAttribute('aria-modal', 'true'); vp.setAttribute('aria-labelledby', 'ppNombre');
  vp.innerHTML =
    '<div class="pp-barra">' +
      '<button type="button" class="pp-link" id="ppVolver"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> ' + (vpEnCatalogo ? 'Volver al catálogo' : 'Volver al inicio') + '</button>' +
      (vpEnCatalogo ? '' : '<a class="pp-link" href="catalogo.html">Ver catálogo completo <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a>') +
    '</div>' +
    '<div class="pp-grid" id="ppGrid">' +
      '<section class="pp-gallery" aria-label="Fotos del producto"><div id="ppFotos"></div></section>' +
      '<section class="pp-info">' +
        '<p class="section-label">Flor realista en papel</p>' +
        '<h1 class="pp-title" id="ppNombre"></h1>' +
        '<p class="pp-price-label">Precio unitario</p><p class="pp-price" id="ppPrecio"></p>' +
        '<p class="pp-desc" id="ppDesc"></p>' +
        '<h2 class="pp-sub">Especificaciones</h2><ul class="pm-specs" id="ppSpecs"></ul>' +
        '<a id="ppPedir" href="#" target="_blank" rel="noopener noreferrer" class="pm-wa-btn"><svg width="28" height="28" viewBox="0 0 402 343" fill="white" aria-hidden="true" focusable="false"><use href="#lvr-mark"/></svg> Pedir en línea</a>' +
        '<p class="pp-note">Cada pieza se elabora a mano una vez realizas tu pedido.</p>' +
      '</section>' +
    '</div>' +
    '<div class="pp-zoom" id="ppZoom" hidden aria-hidden="true"></div>' +
    '<section class="pp-mas" aria-labelledby="ppMasTitulo"><h2 class="section-title" id="ppMasTitulo">Otras <em>flores</em></h2><div class="cat-grid" id="ppMasGrid"></div></section>';
  document.body.appendChild(vp);

  const vpGrid = vp.querySelector('#ppGrid');
  const vpFotos = vp.querySelector('#ppFotos');
  const zoomBox = vp.querySelector('#ppZoom');
  let vpProd = null, vpAbierto = false, vpResize = null;

  function abrirProducto(id, desdeHistorial) {
    const p = PRODUCTOS.find(x => x.id === id);
    if (!p) return;
    vpProd = p;
    vp.querySelector('#ppNombre').textContent = p.nombre;
    vp.querySelector('#ppPrecio').textContent = formatoPrecio(p.precio);
    vp.querySelector('#ppDesc').textContent = DESCRIPCION;
    vp.querySelector('#ppSpecs').innerHTML = p.specs.map(s => `<li>${s}</li>`).join('');
    vp.querySelector('#ppPedir').href = 'https://wa.me/573208654762?text=' + encodeURIComponent(waProducto(p));
    pintarGaleria();
    const mas = vp.querySelector('#ppMasGrid');
    mas.innerHTML = '';
    const i = PRODUCTOS.indexOf(p);
    for (let k = 1; k <= 4; k++) mas.appendChild(tarjetaProducto(PRODUCTOS[(i + k) % PRODUCTOS.length]));
    zoomBox.hidden = true;
    vp.scrollTop = 0;
    document.title = p.nombre + ' | La Vida en Rosa';
    if (!vpAbierto) {
      lastFocus = document.activeElement;
      vp.hidden = false; vpAbierto = true;
      document.body.style.overflow = 'hidden';
      vp.querySelector('#ppVolver').focus({ preventScroll: true });
      if (!desdeHistorial) history.pushState({ flor: id }, '', '#flor-' + id);
    } else if (!desdeHistorial) {
      history.replaceState({ flor: id }, '', '#flor-' + id);
    }
  }
  function ocultarProducto() {
    if (!vpAbierto) return;
    vp.hidden = true; vpAbierto = false; zoomBox.hidden = true;
    document.body.style.overflow = '';
    document.title = vpTitulo;
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  const vpTitulo = document.title;
  function cerrarProducto() {
    if (history.state && history.state.flor) history.back(); else ocultarProducto();
  }
  vp.querySelector('#ppVolver').addEventListener('click', cerrarProducto);
  window.addEventListener('popstate', () => {
    const m = location.hash.match(/^#flor-(.+)$/);
    if (m) abrirProducto(m[1], true); else ocultarProducto();
  });
  document.addEventListener('keydown', e => {
    if (!vpAbierto || (lb && !lb.hidden)) return;
    if (e.key === 'Escape') cerrarProducto();
    else trapFocus(e, vp);
  });
  { const m = location.hash.match(/^#flor-(.+)$/); if (m) abrirProducto(m[1], true); }

  function marco(src, n, fondo) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'pp-tile';
    b.setAttribute('aria-label', `${vpProd.nombre}: ver foto ${n + 1} de ${vpProd.fotos.length} en grande`);
    b.innerHTML = `${fondo ? `<span class="pp-fondo" style="background-image:url('${src}')"></span>` : ''}<span class="pp-frame"><img src="${src}" alt="${vpProd.nombre}, foto ${n + 1}" width="3" height="4" decoding="async"><span class="pp-lens"></span></span>`;
    const fotos = vpProd.fotos, nombre = vpProd.nombre;
    b.addEventListener('click', () => abrirLightbox(fotos, n, nombre));
    activarLupa(b.querySelector('.pp-frame'), src);
    return b;
  }
  function pintarGaleria() {
    const p = vpProd, n = p.fotos.length;
    vpFotos.innerHTML = '';
    if (vpResize) { window.removeEventListener('resize', vpResize); vpResize = null; }
    vpFotos.className = 'pp-fotos ' + (n > 4 ? 'pp-n-mas' : 'pp-n-' + n);
    if (n <= 4) { p.fotos.forEach((s, k) => vpFotos.appendChild(marco(s, k, n === 4))); return; }
    const pista = document.createElement('div');
    pista.className = 'pp-pista'; pista.tabIndex = 0;
    pista.setAttribute('role', 'region'); pista.setAttribute('aria-label', 'Fotos de ' + p.nombre);
    p.fotos.forEach((s, k) => { const t = marco(s, k); t.classList.add('pp-slide'); pista.appendChild(t); });
    const ant = document.createElement('button'), sig = document.createElement('button');
    ant.type = sig.type = 'button';
    ant.className = 'pp-flecha pp-ant'; sig.className = 'pp-flecha pp-sig';
    ant.setAttribute('aria-label', 'Fotos anteriores'); sig.setAttribute('aria-label', 'Más fotos');
    ant.innerHTML = '&#8249;'; sig.innerHTML = '&#8250;';
    const cuenta = document.createElement('p'); cuenta.className = 'pp-cuenta'; cuenta.setAttribute('aria-live', 'polite');
    const paso = () => pista.querySelector('.pp-slide').getBoundingClientRect().width + 4;
    ant.addEventListener('click', () => pista.scrollBy({ left: -paso(), behavior: 'smooth' }));
    sig.addEventListener('click', () => pista.scrollBy({ left: paso(), behavior: 'smooth' }));
    function estado() {
      const w = paso(); if (!w) return;
      const visibles = Math.max(1, Math.round(pista.clientWidth / w));
      const ini = Math.round(pista.scrollLeft / w) + 1;
      ant.disabled = pista.scrollLeft < 4;
      sig.disabled = pista.scrollLeft + pista.clientWidth >= pista.scrollWidth - 4;
      cuenta.textContent = visibles > 1 ? `${ini} - ${Math.min(n, ini + visibles - 1)} de ${n}` : `${ini} de ${n}`;
    }
    pista.addEventListener('scroll', estado, { passive: true });
    vpResize = estado; window.addEventListener('resize', vpResize);
    const car = document.createElement('div'); car.className = 'pp-carrusel';
    car.append(pista, ant, sig);
    vpFotos.append(car, cuenta);
    requestAnimationFrame(estado);
  }

  // ===== LUPA: recuadro pequeño sobre la foto y zoom en el panel de la derecha =====
  const LUPA = 110;                       // lado del recuadro en pantalla (px)
  const puedeLupa = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches && window.innerWidth > 900;
  function activarLupa(frame, src) {
    const lente = frame.querySelector('.pp-lens');
    frame.addEventListener('mousemove', ev => {
      if (!puedeLupa()) return;
      const r = frame.getBoundingClientRect();
      const info = vp.querySelector('.pp-info').getBoundingClientRect();
      const lado = Math.min(info.width, window.innerHeight - 32);
      const z = lado / LUPA;                // aumento
      if (zoomBox.hidden || zoomBox.dataset.src !== src) {
        zoomBox.style.backgroundImage = `url("${src}")`; zoomBox.dataset.src = src;
      }
      zoomBox.hidden = false;
      vpGrid.classList.add('lupa-activa');
      Object.assign(zoomBox.style, {
        left: info.left + 'px', width: lado + 'px', height: lado + 'px',
        top: Math.max(16, Math.min(info.top, window.innerHeight - lado - 16)) + 'px',
        backgroundSize: `${r.width * z}px ${r.height * z}px`
      });
      const x = Math.max(0, Math.min(r.width - LUPA, ev.clientX - r.left - LUPA / 2));
      const y = Math.max(0, Math.min(r.height - LUPA, ev.clientY - r.top - LUPA / 2));
      lente.style.transform = `translate(${x}px, ${y}px)`;
      frame.classList.add('lupa-on');
      zoomBox.style.backgroundPosition = `${-x * z}px ${-y * z}px`;
    });
    frame.addEventListener('mouseleave', () => {
      frame.classList.remove('lupa-on'); zoomBox.hidden = true; zoomBox.dataset.src = ''; vpGrid.classList.remove('lupa-activa');
    });
  }
