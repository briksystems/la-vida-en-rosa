  // ===== CARRITO DE COMPRAS =====
  // Se guarda en el navegador (localStorage). Para cambiar el enlace de pago, edita WOMPI_URL.
  const WOMPI_URL = 'https://checkout.wompi.co/l/VPOS_indO9a';
  const WHATSAPP_PEDIDOS = '573208654762';
  const CARRITO_CLAVE = 'lvr-carrito';
  const CARRITO_MAX = 99;
  const CORREO_PEDIDOS = 'lavidaenrosaa@gmail.com';
  const PEDIDO_CLAVE = 'lvr-pedido';      // copia del pedido para la página gracias.html
  const PAGANDO_CLAVE = 'lvr-pagando';

  let carrito = [];                 // [{ id, n }]
  let carritoQuitada = null;        // última flor quitada, para deshacer
  let carritoAvisoT = null;
  let carritoOverflow = '';
  let carritoPaso = 'carrito';      // 'carrito' | 'comprobante'

  try {
    const g = JSON.parse(localStorage.getItem(CARRITO_CLAVE) || '[]');
    carrito = (Array.isArray(g) ? g : []).filter(x => x && PRODUCTOS.some(p => p.id === x.id) && x.n > 0)
      .map(x => ({ id: x.id, n: Math.min(CARRITO_MAX, Math.floor(x.n)) }));
  } catch (e) { carrito = []; }

  const carritoProd = id => PRODUCTOS.find(p => p.id === id);
  const carritoCuenta = () => carrito.reduce((s, x) => s + x.n, 0);
  const carritoTotal = () => carrito.reduce((s, x) => s + x.n * carritoProd(x.id).precio, 0);
  function carritoGuardar() { try { localStorage.setItem(CARRITO_CLAVE, JSON.stringify(carrito)); } catch (e) {} }
  const carritoEsc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // ----- estructura -----
  const cFondo = document.createElement('div');
  cFondo.id = 'carritoFondo'; cFondo.hidden = true;
  const cPanel = document.createElement('aside');
  cPanel.id = 'carrito'; cPanel.hidden = true;
  cPanel.setAttribute('role', 'dialog'); cPanel.setAttribute('aria-modal', 'true'); cPanel.setAttribute('aria-labelledby', 'carritoTitulo');
  cPanel.innerHTML =
    '<header class="car-cab"><h2 id="carritoTitulo">Tu carrito</h2>' +
      '<button type="button" class="car-cerrar" id="carritoCerrar" aria-label="Cerrar carrito"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></header>' +
    '<div class="car-cuerpo" id="carritoCuerpo"></div>' +
    '<footer class="car-pie" id="carritoPie"></footer>';
  const cAviso = document.createElement('div');
  cAviso.id = 'carritoAviso'; cAviso.setAttribute('role', 'status'); cAviso.setAttribute('aria-live', 'polite'); cAviso.hidden = true;
  document.body.append(cFondo, cPanel, cAviso);

  function carritoPintar() {
    const cuerpo = cPanel.querySelector('#carritoCuerpo'), pie = cPanel.querySelector('#carritoPie');
    const n = carritoCuenta();
    if (carritoPaso === 'comprobante' && n) return carritoPintarComprobante(cuerpo, pie, n);
    carritoPaso = 'carrito';
    cPanel.querySelector('#carritoTitulo').textContent = 'Tu carrito';
    document.querySelectorAll('.js-cart-count').forEach(b => { b.textContent = n; b.hidden = n === 0; });
    document.querySelectorAll('.js-cart-btn').forEach(b => b.setAttribute('aria-label', n ? `Abrir carrito, ${n} ${n === 1 ? 'artículo' : 'artículos'}` : 'Abrir carrito'));
    if (!carrito.length) {
      cuerpo.innerHTML = '<div class="car-vacio"><p class="car-vacio-t">Tu carrito está vacío</p><p>Elige tus flores o arreglos favoritos y aparecerán aquí.</p>' +
        `<a class="btn-primary" href="${vpEnCatalogoCar() ? '#' : 'catalogo.html'}" id="carritoVer">Ver el catálogo</a></div>`;
      pie.innerHTML = '';
      pie.hidden = true;
      const ver = cuerpo.querySelector('#carritoVer');
      if (ver) ver.addEventListener('click', e => { if (vpEnCatalogoCar()) { e.preventDefault(); } carritoCerrar(); });
      return;
    }
    pie.hidden = false;
    cuerpo.innerHTML = '<ul class="car-lista">' + carrito.map(x => {
      const p = carritoProd(x.id);
      return `<li class="car-item" data-id="${p.id}">` +
        `<img class="car-img" src="${p.miniatura}" alt="" width="72" height="96" loading="lazy" decoding="async">` +
        `<div class="car-info"><p class="car-nombre">${carritoEsc(nombreItem(p))}</p><p class="car-unit">${formatoPrecio(p.precio)} c/u</p>` +
        `<div class="car-cant" role="group" aria-label="Cantidad de ${carritoEsc(nombreItem(p))}">` +
          `<button type="button" class="car-mas-menos" data-acc="menos" aria-label="Quitar una ${carritoEsc(nombreItem(p))}"${x.n <= 1 ? ' disabled' : ''}>&minus;</button>` +
          `<span class="car-num" aria-live="polite">${x.n}</span>` +
          `<button type="button" class="car-mas-menos" data-acc="mas" aria-label="Agregar una ${carritoEsc(nombreItem(p))}"${x.n >= CARRITO_MAX ? ' disabled' : ''}>+</button></div></div>` +
        `<div class="car-der"><p class="car-sub">${formatoPrecio(p.precio * x.n)}</p>` +
        `<button type="button" class="car-quitar" data-acc="quitar" aria-label="Eliminar ${carritoEsc(nombreItem(p))} del carrito">Eliminar</button></div></li>`;
    }).join('') + '</ul>';
    const total = formatoPrecio(carritoTotal());
    pie.innerHTML =
      `<div class="car-total"><span>Total</span><strong>${total}</strong></div>` +
      '<button type="button" class="btn-primary car-pagar" id="carritoPagar">Pagar</button>' +
      `<p class="car-nota">Se abre Wompi en otra pestaña. Si te pide el valor, escribe ${total}.</p>` +
      '<a class="car-wa" id="carritoWa" target="_blank" rel="noopener noreferrer" href="#">Enviar el detalle del pedido por WhatsApp</a>';
    pie.querySelector('#carritoPagar').addEventListener('click', carritoPagar);
    pie.querySelector('#carritoWa').href = 'https://wa.me/' + WHATSAPP_PEDIDOS + '?text=' + encodeURIComponent(carritoResumen());
  }
  function vpEnCatalogoCar() { return !!document.getElementById('catalogGrid'); }

  function carritoResumen() {
    const lineas = carrito.map(x => { const p = carritoProd(x.id); return `${x.n} x ${nombreItem(p)} (${formatoPrecio(p.precio)} c/u) = ${formatoPrecio(p.precio * x.n)}`; });
    return 'Hola, este es mi pedido:\n' + lineas.join('\n') + '\nTotal: ' + formatoPrecio(carritoTotal());
  }
  function carritoPagar() {
    try {
      localStorage.setItem(PEDIDO_CLAVE, JSON.stringify({ texto: carritoResumen(), total: carritoTotal(), t: Date.now() }));
      sessionStorage.setItem(PAGANDO_CLAVE, String(Date.now()));
    } catch (e) {}
    try { if (navigator.clipboard) navigator.clipboard.writeText(carritoResumen()).catch(() => {}); } catch (e) {}
    window.open(WOMPI_URL, '_blank', 'noopener');
    carritoPaso = 'comprobante'; carritoPintar();
  }
  // Paso 2: cuando la persona vuelve del pago, se le pide enviar el comprobante por WhatsApp o por correo
  function carritoMensajeComprobante() {
    return 'Hola, ya realicé el pago de mi pedido en La Vida en Rosa. Te envío el comprobante.\n\n' + carritoResumen();
  }
  function carritoPintarComprobante(cuerpo, pie, n) {
    cPanel.querySelector('#carritoTitulo').textContent = 'Envía tu comprobante';
    cuerpo.innerHTML = '<div class="car-paso"><p class="car-paso-t">Cuando termines el pago en Wompi, vuelve a esta página.</p>' +
      '<p>Para confirmar tu pedido, envíanos el comprobante de pago. Elige cómo prefieres hacerlo:</p>' +
      `<p class="car-paso-total">Total del pedido <strong>${formatoPrecio(carritoTotal())}</strong></p></div>`;
    const msg = carritoMensajeComprobante();
    pie.hidden = false;
    pie.innerHTML =
      '<a class="btn-primary car-pagar" target="_blank" rel="noopener noreferrer" href="https://wa.me/' + WHATSAPP_PEDIDOS + '?text=' + encodeURIComponent(msg) + '">Enviar comprobante por WhatsApp</a>' +
      '<a class="car-wa" href="mailto:' + CORREO_PEDIDOS + '?subject=' + encodeURIComponent('Comprobante de pago - pedido La Vida en Rosa') + '&body=' + encodeURIComponent(msg + '\n\n(Adjunta aquí el comprobante de pago)') + '">Enviar comprobante por correo</a>' +
      '<button type="button" class="car-wa car-boton" id="carritoYaEnvie">Ya envié mi comprobante</button>' +
      '<button type="button" class="car-wa car-boton" id="carritoVolver">Volver al carrito</button>' +
      '<button type="button" class="car-wa car-boton" id="carritoOtraVez">Abrir de nuevo la página de pago</button>';
    pie.querySelector('#carritoVolver').addEventListener('click', () => { carritoPaso = 'carrito'; carritoPintar(); });
    pie.querySelector('#carritoOtraVez').addEventListener('click', () => window.open(WOMPI_URL, '_blank', 'noopener'));
    pie.querySelector('#carritoYaEnvie').addEventListener('click', () => {
      carrito = []; carritoGuardar(); carritoPaso = 'carrito';
      try { sessionStorage.removeItem(PAGANDO_CLAVE); localStorage.removeItem(PEDIDO_CLAVE); } catch (e) {}
      carritoPintar(); carritoAviso('Gracias por tu compra. Te confirmaremos tu pedido pronto.');
    });
  }
  // al volver a la pestaña después de pulsar Pagar, se abre el carrito en el paso del comprobante
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState !== 'visible' || !carrito.length) return;
    let t = 0; try { t = Number(sessionStorage.getItem(PAGANDO_CLAVE)) || 0; } catch (e) {}
    if (!t || Date.now() - t > 2 * 60 * 60 * 1000 || carritoPaso !== 'comprobante') return;
    if (!carritoAbiertoFlag) carritoAbrir();
  });

  // ----- acciones -----
  function carritoAviso(texto, accion) {
    clearTimeout(carritoAvisoT);
    cAviso.innerHTML = `<span>${carritoEsc(texto)}</span>` + (accion ? `<button type="button">${accion.etiqueta}</button>` : '');
    if (accion) cAviso.querySelector('button').addEventListener('click', () => { accion.fn(); cAviso.hidden = true; });
    cAviso.hidden = false; cAviso.classList.remove('visible'); void cAviso.offsetWidth; cAviso.classList.add('visible');
    carritoAvisoT = setTimeout(() => { cAviso.hidden = true; }, 4200);
  }
  function carritoAgregar(id, n) {
    const p = carritoProd(id); if (!p) return;
    const x = carrito.find(i => i.id === id);
    if (x) x.n = Math.min(CARRITO_MAX, x.n + (n || 1)); else carrito.push({ id, n: Math.min(CARRITO_MAX, n || 1) });
    carritoGuardar(); carritoPintar();
    document.querySelectorAll('.js-cart-btn').forEach(b => { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); });
    carritoAviso(`${nombreItem(p)} agregado al carrito`, { etiqueta: 'Ver carrito', fn: carritoAbrir });
  }
  function carritoCambiar(id, d) {
    const x = carrito.find(i => i.id === id); if (!x) return;
    x.n = Math.max(1, Math.min(CARRITO_MAX, x.n + d));
    carritoGuardar(); carritoPintar();
    const b = cPanel.querySelector(`.car-item[data-id="${id}"] [data-acc="${d > 0 ? 'mas' : 'menos'}"]`);
    if (b && !b.disabled) b.focus();
  }
  function carritoQuitar(id) {
    const i = carrito.findIndex(x => x.id === id); if (i < 0) return;
    carritoQuitada = { item: carrito[i], pos: i };
    carrito.splice(i, 1);
    carritoGuardar(); carritoPintar();
    const sig = cPanel.querySelector('.car-item .car-quitar') || cPanel.querySelector('#carritoVer') || cPanel.querySelector('#carritoCerrar');
    if (sig) sig.focus();
    carritoAviso(`${nombreItem(carritoProd(id))} eliminado`, { etiqueta: 'Deshacer', fn: () => {
      if (!carritoQuitada) return;
      carrito.splice(Math.min(carritoQuitada.pos, carrito.length), 0, carritoQuitada.item); carritoQuitada = null;
      carritoGuardar(); carritoPintar();
    } });
  }
  cPanel.addEventListener('click', e => {
    const b = e.target.closest('[data-acc]'); if (!b) return;
    const id = b.closest('.car-item').dataset.id;
    if (b.dataset.acc === 'mas') carritoCambiar(id, 1);
    else if (b.dataset.acc === 'menos') carritoCambiar(id, -1);
    else carritoQuitar(id);
  });

  let carritoAbiertoFlag = false, carritoFoco = null;
  const carritoAbierto = () => carritoAbiertoFlag;
  function carritoAbrir() {
    if (carritoAbiertoFlag) return;
    carritoAviso && (cAviso.hidden = true);
    carritoFoco = document.activeElement;
    carritoPintar();
    cFondo.hidden = false; cPanel.hidden = false; carritoAbiertoFlag = true;
    carritoOverflow = document.body.style.overflow; document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => { cFondo.classList.add('on'); cPanel.classList.add('on'); });
    cPanel.querySelector('#carritoCerrar').focus({ preventScroll: true });
  }
  function carritoCerrar() {
    if (!carritoAbiertoFlag) return;
    carritoAbiertoFlag = false;
    cFondo.classList.remove('on'); cPanel.classList.remove('on');
    document.body.style.overflow = carritoOverflow;
    setTimeout(() => { if (!carritoAbiertoFlag) { cFondo.hidden = true; cPanel.hidden = true; } }, 280);
    if (carritoFoco && carritoFoco.focus) carritoFoco.focus({ preventScroll: true });
  }
  cFondo.addEventListener('click', carritoCerrar);
  cPanel.querySelector('#carritoCerrar').addEventListener('click', carritoCerrar);
  document.addEventListener('keydown', e => {
    if (!carritoAbiertoFlag) return;
    if (e.key === 'Escape') { e.stopImmediatePropagation(); carritoCerrar(); } else trapFocus(e, cPanel);
  }, true);
  document.addEventListener('click', e => { if (e.target.closest('.js-cart-btn')) carritoAbrir(); });
  window.addEventListener('storage', e => { if (e.key === CARRITO_CLAVE) { try { carrito = JSON.parse(e.newValue || '[]'); } catch (x) { carrito = []; } carritoPintar(); } });
  carritoPintar();
