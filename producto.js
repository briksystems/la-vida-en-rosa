  // ===== VISTA DE PRODUCTO: ventana a pantalla completa que tapa toda la página =====
  // Se abre desde la tienda, el catálogo o "Otras flores". Cantidad de fotos -> distribución
  // (siempre se ve la foto completa, sin huecos ni fondos): 1 y 2 verticales | 3 una grande y dos apiladas (cambia de lado) | 4 o más: todas iguales en 2 columnas.
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
    '<section class="pp-mas" aria-labelledby="ppMasTitulo"><h2 class="section-title" id="ppMasTitulo">Otras <em>flores</em></h2><div class="cat-grid" id="ppMasGrid"></div></section>';
  document.body.appendChild(vp);

  const vpGrid = vp.querySelector('#ppGrid');
  const vpFotos = vp.querySelector('#ppFotos');
  let vpProd = null, vpAbierto = false;

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
    vp.hidden = true; vpAbierto = false;
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

  function marco(src, n) {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'pp-tile';
    b.setAttribute('aria-label', `${vpProd.nombre}: ver foto ${n + 1} de ${vpProd.fotos.length} en grande`);
    b.innerHTML = `<span class="pp-frame"><img src="${src}" alt="${vpProd.nombre}, foto ${n + 1}" width="3" height="4" decoding="async"></span>`;
    const fotos = vpProd.fotos, nombre = vpProd.nombre;
    b.addEventListener('click', () => abrirLightbox(fotos, n, nombre));
    return b;
  }
  function pintarGaleria() {
    const p = vpProd, n = p.fotos.length;
    vpFotos.innerHTML = '';
    const inv = n === 3 && PRODUCTOS.indexOf(p) % 2 === 1;   // con 3 fotos la grande alterna de lado
    vpFotos.className = 'pp-fotos ' + (n > 4 ? 'pp-n-mas' + (n % 2 ? ' pp-impar' : '') : 'pp-n-' + n + (inv ? ' pp-inv' : ''));
    p.fotos.forEach((s, k) => vpFotos.appendChild(marco(s, k)));
  }
