  // ===== PROYECTOS: ventana a pantalla completa con portada, texto, fotos y videos =====
  // Para agregar fotos de un proyecto: ponlas en assets/img/proyectos/<clave>/ y escribe aquí su lista en "fotos".
  // Cada foto es [archivo, ancho, alto]. En "videos", un número es una cápsula (assets/video/proyectos/capsula-N.mp4)
  // y un texto es el nombre de un video (assets/video/proyectos/<nombre>.mp4 con portada assets/img/proyectos/<nombre>.jpg).
  const pyFotos = (k, dims) => dims.map((d, i) => [`${k}-${i + 1}.jpg`, d[0], d[1]]);
  const MARCAS_LISTA = ['Carolina Herrera', 'Lancôme', 'Bronzini', 'Seven Seven', 'Isabel Henao', 'Atelier Olfativo', 'Gloria Saldarriaga', 'Puig', 'Oslé Home Decor', 'Andino', 'Makeno', 'Protela', 'Loto del Sur', 'Ésika', 'Bibi Marini'];
  const PROYECTOS = {
    marcas: {
      nombre: 'Marcas', etiqueta: 'Portafolio', tipo: 'Proyectos para marcas y eventos',
      texto: 'Escenografía, vitrinas y piezas para marcas y pasarelas. Hemos trabajado con Bronzini, Colombia Moda y revistas como Alo Novias.',
      portada: 'assets/img/proyectos/portada-marcas.jpg', enfoque: 'center 45%',
      fotos: pyFotos('marcas', [[1800,1300],[1800,1000],[1499,1501],[808,810],[1435,1466],[1451,1520],[1516,1509],[1443,1522],[1800,1204]]), videos: [3], marcas: true
    },
    novias: {
      nombre: 'Novias', etiqueta: 'Portafolio', tipo: 'Colección Novias',
      texto: 'Bouquets, tocados y detalles para el día más importante. Flores realistas en papel que se quedan para siempre como recuerdo.',
      portada: 'assets/img/proyectos/portada-novias.jpg', enfoque: 'center 55%',
      fotos: pyFotos('novias', [[1515,1513],[1489,1509],[1447,1509],[1486,1476],[1428,1466],[1447,1470],[1372,1488],[1515,1511],[1600,1066],[1066,1600],[1066,1600],[1066,1600],[1068,1600]]), videos: [1, 2]
    },
    home: {
      nombre: 'Home', etiqueta: 'Portafolio', tipo: 'Decoración para espacios',
      texto: 'Flores de papel pensadas para el hogar: piezas que convierten una pared, una mesa o una esquina en un jardín que no se marchita.',
      portada: 'assets/img/proyectos/portada-home.jpg', enfoque: 'center 40%',
      fotos: pyFotos('home', [[1516,1513],[1563,1559],[1545,1571],[1551,1567],[1567,1569],[1557,1571],[1505,1572],[1530,1565],[1491,1499],[1522,1518],[1238,1396],[1126,1560],[1499,1518],[1503,1513]]), videos: [6]
    },
    rosa: {
      nombre: '+Rosa', etiqueta: 'Impacto social', tipo: 'Iniciativa +Rosa',
      texto: 'Somos el equipo de La Vida en Rosa. Hace seis años comenzamos este proyecto con una visión grande: impactar la vida de muchas mujeres. Hoy esa visión tiene nombre propio, +Rosa, nuestra iniciativa con la que hemos generado empleo para mujeres cabeza de familia y para hombres privados de la libertad. Detrás de cada flor hay unas manos que aprendieron un oficio y una oportunidad que cambia una historia. Esas son las razones que nos motivan a seguir trabajando con amor y responsabilidad.',
      portada: 'assets/img/proyectos/portada-rosa.jpg', enfoque: 'center 40%',
      fotos: pyFotos('rosa', [[1800,1495],[1800,1377],[1516,1518],[1432,1488],[836,1234],[1350,1800],[1350,1800],[1800,1200],[1800,1200],[1800,1200]]), videos: [4, 'flores-gigantes']
    }
  };
  const PROYECTOS_ORDEN = ['marcas', 'novias', 'home', 'rosa'];
  Object.entries(PROYECTOS).forEach(([k, p]) => {
    p.id = k;
    p.fotos = p.fotos.map(f => ({ src: `assets/img/proyectos/${k}/${f[0]}`, w: f[1], h: f[2] }));
    p.videos = p.videos.map(n => { const nom = typeof n === 'number' ? `capsula-${n}` : n; return { src: `assets/video/proyectos/${nom}.mp4`, poster: `assets/img/proyectos/${nom}.jpg` }; });
  });

  const pyVista = document.createElement('div');
  pyVista.id = 'vistaProyecto'; pyVista.hidden = true;
  pyVista.setAttribute('role', 'dialog'); pyVista.setAttribute('aria-modal', 'true'); pyVista.setAttribute('aria-labelledby', 'pyTitulo');
  pyVista.innerHTML =
    '<div class="pp-barra">' +
      '<button type="button" class="pp-link" id="pyVolver"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M19 12H5M12 5l-7 7 7 7"/></svg> Volver al inicio</button>' +
      '<button type="button" class="pp-link" id="pySiguiente"></button>' +
    '</div>' +
    '<header class="py-hero"><img class="py-hero-img" id="pyPortada" alt="" fetchpriority="high"><div class="py-hero-sombra"></div>' +
      '<div class="py-hero-texto"><p class="py-etiqueta" id="pyEtiqueta"></p><h1 id="pyTitulo"></h1><p class="py-tipo" id="pyTipo"></p></div></header>' +
    '<section class="py-intro"><p class="py-intro-label">Sobre este proyecto</p><p class="py-intro-texto" id="pyTexto"></p></section>' +
    '<section class="py-marcas" id="pyMarcas" aria-label="Marcas con las que hemos trabajado" hidden><p class="py-marcas-label">Marcas que han confiado en nosotras</p><div class="py-marcas-wrap"><div class="clientes-marquee" id="pyMarcasPista"></div></div></section>' +
    '<div class="py-galeria" id="pyGaleria"></div>' +
    '<p class="py-vacio" id="pyVacio" hidden>Muy pronto más fotos de este proyecto.</p>' +
    '<section class="py-cierre"><p>¿Quieres algo así para tu marca, tu evento o tu hogar?</p>' +
      '<a class="btn-primary" href="https://wa.me/573208654762?text=Hola!%20Vi%20sus%20proyectos%20y%20quiero%20cotizar" target="_blank" rel="noopener noreferrer">Escríbenos por WhatsApp</a></section>';
  document.body.appendChild(pyVista);

  let pyActual = null, pyAbierto = false;
  const pyTituloPagina = document.title;

  const pyMovil = window.matchMedia('(max-width: 900px)');
  function pyConstruirItems(p, cols) {
    // Los videos van siempre en la columna del centro (en celular, la de la derecha).
    // El primero queda en la segunda fila y nunca más abajo. Los demás se separan cada dos filas.
    const items = p.fotos.map((f, i) => ({ tipo: 'foto', f, i }));
    p.videos.forEach((v, k) => {
      const pos = Math.min(items.length, (1 + 2 * k) * cols + 1);
      items.splice(pos, 0, { tipo: 'video', v });
    });
    return items;
  }
  // Videos de la galería: arrancan solos (mudos o con sonido si la persona entró con un clic), uno a la vez, solo mientras se ven.
  const PY_ICO_MUTE = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="m16 9 5 6M21 9l-5 6"/></svg>';
  const PY_ICO_SON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>';
  const pyReducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let pySonidoOn = false, pyObsCarga = null, pyObsJuego = null;
  const pyVisibles = new Set();
  function pyAplicarSonido() {
    pyVista.querySelectorAll('.py-video video').forEach(v => {
      v.muted = !pySonidoOn; if (pySonidoOn) v.volume = 0.8;
      const b = v.parentElement.querySelector('.py-sonido');
      b.innerHTML = pySonidoOn ? PY_ICO_SON : PY_ICO_MUTE;
      b.setAttribute('aria-pressed', pySonidoOn);
      b.setAttribute('aria-label', pySonidoOn ? 'Silenciar video' : 'Activar sonido del video');
    });
  }
  function pyElegirVideo() {
    // reproduce solo el primer video visible; los demás se pausan
    let activo = null;
    pyVista.querySelectorAll('.py-video video').forEach(v => {
      if (!activo && pyVisibles.has(v) && !v.dataset.manual && pyAbierto) activo = v; else v.pause();
    });
    if (activo && activo.paused) {
      if (!activo.src) activo.src = activo.dataset.src;
      activo.muted = !pySonidoOn;
      activo.play().catch(() => { pySonidoOn = false; pyAplicarSonido(); activo.play().catch(() => {}); });
    }
  }
  function pyPrepararObservadores() {
    if (pyObsCarga) pyObsCarga.disconnect();
    if (pyObsJuego) pyObsJuego.disconnect();
    pyVisibles.clear();
    pyObsCarga = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { if (!e.target.src) e.target.src = e.target.dataset.src; pyObsCarga.unobserve(e.target); }
    }), { root: pyVista, rootMargin: '600px 0px' });
    pyObsJuego = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) pyVisibles.add(e.target); else pyVisibles.delete(e.target); });
      if (!pyReducido) pyElegirVideo();
    }, { root: pyVista, threshold: 0.5 });
  }
  function pyPintarMarcas(p) {
    const sec = pyVista.querySelector('#pyMarcas');
    sec.hidden = !p.marcas;
    if (!p.marcas) return;
    const una = MARCAS_LISTA.map(n => `<span class="brand-name">${n}</span><span class="brand-sep" aria-hidden="true">✦</span>`).join('');
    pyVista.querySelector('#pyMarcasPista').innerHTML = una + una;
  }
  function pyPintarGaleria(p) {
    const g = pyVista.querySelector('#pyGaleria');
    g.innerHTML = '';
    pyPrepararObservadores();
    pyPintarMarcas(p);
    const srcs = p.fotos.map(f => f.src);
    const nCols = pyMovil.matches ? 2 : 3;
    const colEls = Array.from({ length: nCols }, () => { const c = document.createElement('div'); c.className = 'py-col'; g.appendChild(c); return c; });
    pyConstruirItems(p, nCols).forEach((it, n) => {
      if (it.tipo === 'foto') {
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'py-item py-foto';
        b.setAttribute('aria-label', `${p.nombre}: ver foto ${it.i + 1} en grande`);
        const ar = it.f.w && it.f.h ? ` style="aspect-ratio:${it.f.w} / ${it.f.h}"` : '';
        b.innerHTML = `<img src="${it.f.src}" alt="${p.nombre}, foto ${it.i + 1}"${it.f.w ? ` width="${it.f.w}" height="${it.f.h}"` : ''}${ar} loading="${n < 4 ? 'eager' : 'lazy'}" decoding="async">`;
        b.addEventListener('click', () => abrirLightbox(srcs, it.i, p.nombre));
        colEls[n % nCols].appendChild(b);
      } else {
        const w = document.createElement('div');
        w.className = 'py-item py-video';
        w.innerHTML = `<video muted loop playsinline preload="none" poster="${it.v.poster}" data-src="${it.v.src}" aria-label="Video de ${p.nombre}"></video>` +
          `<button type="button" class="py-sonido" aria-pressed="false" aria-label="Activar sonido del video">${PY_ICO_MUTE}</button>`;
        const v = w.querySelector('video'), bs = w.querySelector('.py-sonido');
        v.addEventListener('click', () => {
          if (v.paused) { v.dataset.manual = ''; v.play().catch(() => {}); } else { v.dataset.manual = '1'; v.pause(); }
        });
        bs.addEventListener('click', () => { pySonidoOn = v.muted; pyAplicarSonido(); if (v.paused && !v.dataset.manual) v.play().catch(() => {}); });
        colEls[n % nCols].appendChild(w);
        pyObsCarga.observe(v); pyObsJuego.observe(v);
      }
    });
    pyVista.querySelector('#pyVacio').hidden = true;
  }

  function abrirProyecto(id, desdeHistorial) {
    const p = PROYECTOS[id];
    if (!p) return;
    pyActual = p;
    const img = pyVista.querySelector('#pyPortada');
    img.src = p.portada; img.alt = `Portada del proyecto ${p.nombre}`; img.style.objectPosition = p.enfoque || 'center';
    pyVista.querySelector('#pyEtiqueta').textContent = p.etiqueta;
    pyVista.querySelector('#pyTitulo').textContent = p.nombre;
    pyVista.querySelector('#pyTipo').textContent = p.tipo;
    pyVista.querySelector('#pyTexto').textContent = p.texto;
    pySonidoOn = !desdeHistorial && !pyReducido;
    pyPintarGaleria(p);
    pyAplicarSonido();
    const sig = PROYECTOS[PROYECTOS_ORDEN[(PROYECTOS_ORDEN.indexOf(id) + 1) % PROYECTOS_ORDEN.length]];
    const bs = pyVista.querySelector('#pySiguiente');
    bs.dataset.id = sig.id;
    bs.innerHTML = `Siguiente: ${sig.nombre} <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
    pyVista.scrollTop = 0;
    document.title = p.nombre + ' | La Vida en Rosa';
    if (!pyAbierto) {
      lastFocus = document.activeElement;
      pyVista.hidden = false; pyAbierto = true;
      document.body.style.overflow = 'hidden';
      pyVista.querySelector('#pyVolver').focus({ preventScroll: true });
      if (!desdeHistorial) history.pushState({ proyecto: id }, '', '#proyecto-' + id);
    } else if (!desdeHistorial) {
      history.replaceState({ proyecto: id }, '', '#proyecto-' + id);
    }
  }
  function pyOcultar() {
    if (!pyAbierto) return;
    pyVista.hidden = true; pyAbierto = false;
    pyVista.querySelectorAll('video').forEach(v => v.pause());
    pyVisibles.clear();
    document.body.style.overflow = '';
    document.title = pyTituloPagina;
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  function cerrarProyecto() {
    if (history.state && history.state.proyecto) history.back(); else pyOcultar();
  }
  pyMovil.addEventListener('change', () => { if (pyAbierto && pyActual) { pyPintarGaleria(pyActual); pyAplicarSonido(); } });
  pyVista.querySelector('#pyVolver').addEventListener('click', cerrarProyecto);
  pyVista.querySelector('#pySiguiente').addEventListener('click', e => abrirProyecto(e.currentTarget.dataset.id));
  window.addEventListener('popstate', () => {
    const m = location.hash.match(/^#proyecto-(.+)$/);
    if (m && PROYECTOS[m[1]]) abrirProyecto(m[1], true); else pyOcultar();
  });
  document.addEventListener('keydown', e => {
    if (!pyAbierto || (lb && !lb.hidden)) return;
    if (e.key === 'Escape') cerrarProyecto(); else trapFocus(e, pyVista);
  });
  { const m = location.hash.match(/^#proyecto-(.+)$/); if (m && PROYECTOS[m[1]]) abrirProyecto(m[1], true); }
