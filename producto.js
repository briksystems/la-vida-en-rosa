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
      '<button type="button" class="pp-link pp-carro js-cart-btn" aria-label="Abrir carrito"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5.5 8h13l-1 12.5h-11z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg> Carrito <span class="cart-badge js-cart-count" hidden>0</span></button>' +
    '</div>' +
    '<div class="pp-grid" id="ppGrid">' +
      '<section class="pp-gallery" aria-label="Fotos del producto"><div id="ppFotos"></div></section>' +
      '<section class="pp-info">' +
        '<p class="section-label" id="ppEtiqueta">Flor realista en papel</p>' +
        '<h1 class="pp-title" id="ppNombre"></h1>' +
        '<p class="pp-price-label" id="ppPrecioEtiqueta">Precio unitario</p><p class="pp-price" id="ppPrecio"></p>' +
        '<p class="pp-desc" id="ppDesc"></p>' +
        '<h2 class="pp-sub" id="ppSubtitulo">Especificaciones</h2><ul class="pm-specs" id="ppSpecs"></ul>' +
        '<button type="button" id="ppAgregar" class="pm-wa-btn"><svg width="28" height="28" viewBox="0 0 402 343" fill="white" aria-hidden="true" focusable="false"><use href="#lvr-mark"/></svg> Agregar al carrito</button>' +
        '<a id="ppPedir" href="#" target="_blank" rel="noopener noreferrer" class="pp-wa-link">Pedir solo esta flor por WhatsApp</a>' +
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
    const arreglo = p.tipo === 'arreglo';
    vp.querySelector('#ppNombre').textContent = p.nombre;
    vp.querySelector('#ppEtiqueta').textContent = arreglo ? 'Arreglo de flores en papel' : 'Flor realista en papel';
    vp.querySelector('#ppPrecioEtiqueta').textContent = arreglo ? 'Precio del arreglo' : 'Precio unitario';
    vp.querySelector('#ppPrecio').textContent = formatoPrecio(p.precio);
    vp.querySelector('#ppDesc').textContent = arreglo ? DESCRIPCION_ARREGLO : DESCRIPCION;
    vp.querySelector('#ppSubtitulo').textContent = arreglo ? 'Qué incluye' : 'Especificaciones';
    vp.querySelector('#ppSpecs').innerHTML = (arreglo ? p.composicion : p.specs).map(s => `<li>${s}</li>`).join('');
    vp.querySelector('#ppAgregar').onclick = () => carritoAgregar(p.id);
    const pedir = vp.querySelector('#ppPedir');
    pedir.textContent = arreglo ? 'Personalizar este arreglo por WhatsApp' : 'Pedir solo esta flor por WhatsApp';
    pedir.href = 'https://wa.me/573208654762?text=' + encodeURIComponent(waProducto(p));
    pintarGaleria();
    // "Otras flores" o "Otros arreglos": se recomiendan piezas del mismo grupo
    vp.querySelector('#ppMasTitulo').innerHTML = arreglo ? 'Otros <em>arreglos</em>' : 'Otras <em>flores</em>';
    const mas = vp.querySelector('#ppMasGrid');
    mas.innerHTML = '';
    const grupo = PRODUCTOS.filter(x => x.tipo === p.tipo);
    const i = grupo.indexOf(p);
    for (let k = 1; k <= 4; k++) mas.appendChild(tarjetaProducto(grupo[(i + k) % grupo.length]));
    vp.scrollTop = 0;
    document.title = nombreItem(p) + ' | La Vida en Rosa';
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
    b.setAttribute('aria-label', `${nombreItem(vpProd)}: ver foto ${n + 1} de ${vpProd.fotos.length} en grande`);
    b.innerHTML = `<span class="pp-frame"><img src="${src}" alt="${nombreItem(vpProd)}, foto ${n + 1}" width="3" height="4" decoding="async"></span>`;
    const fotos = vpProd.fotos, nombre = nombreItem(vpProd);
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
