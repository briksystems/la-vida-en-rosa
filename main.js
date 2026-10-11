  // ===== PÁGINA DE INICIO =====
  // Tienda: muestra las primeras 4 flores. El catálogo completo está en catalogo.html
  (function pintarTienda() {
    const tienda = document.getElementById('shopGrid');
    PRODUCTOS.slice(0, 4).forEach(p => tienda.appendChild(tarjetaProducto(p)));
  })();

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

  let heroSonidoFn = null, heroSonidoPendiente = false;
  function startSplash() {
    // el clic en "Entrar" es un gesto del usuario: el navegador deja activar el sonido del hero
    if (heroSonidoFn) heroSonidoFn(true); else heroSonidoPendiente = true;
    const splash = document.getElementById('splash');
    splash.classList.add('leaving');
    setTimeout(() => {
      splash.style.display = 'none';
      document.body.style.overflow = '';
      sessionStorage.setItem('splashSeen', '1');
    }, 1150);
  }

  document.addEventListener('keydown', function(e) {
    const vm = document.getElementById('videoModal');
    if (!vm.hidden) {
      if (e.key === 'Escape') { closeVideo(); return; }
      trapFocus(e, vm);
    }
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

  // ===== VIDEO HERO =====
  (function () {
    const hero = document.getElementById('inicio');
    const v = document.getElementById('heroVideo');
    const toggle = document.getElementById('heroToggle');
    const sound = document.getElementById('heroSound');
    const watch = document.getElementById('heroWatch');
    if (watch && (watch.dataset.embed || watch.dataset.video)) {
      watch.hidden = false;
      watch.addEventListener('click', () => openVideo(watch));
    }
    if (!v) return;
    const conn = navigator.connection || {};
    const ahorro = conn.saveData || /(^|-)2g$/.test(conn.effectiveType || '');
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (ahorro || sinMovimiento) return; // se queda la imagen quieta
    let manualPause = false;
    function pintarSonido() {
      const on = !v.muted;
      sound.classList.toggle('on', on);
      sound.setAttribute('aria-pressed', on);
      sound.setAttribute('aria-label', on ? 'Silenciar video' : 'Activar sonido del video');
    }
    function ponerSonido(on) {
      v.muted = !on;
      if (on) v.volume = 0.8;
      if (on && v.src && v.paused && !manualPause) v.play().catch(() => { v.muted = true; v.play().catch(() => {}); pintarSonido(); });
      pintarSonido();
    }
    heroSonidoFn = ponerSonido;
    sound.addEventListener('click', () => ponerSonido(v.muted));
    function start() {
      const movil = window.matchMedia('(max-width: 768px)').matches;
      v.src = (movil && v.dataset.srcMobile) ? v.dataset.srcMobile : v.dataset.src;
      v.addEventListener('playing', () => { hero.classList.add('is-playing'); toggle.hidden = false; sound.hidden = false; }, { once: true });
      if (heroSonidoPendiente) v.muted = false;
      v.play().catch(() => { v.muted = true; v.play().catch(() => {}); }).finally(pintarSonido);
    }
    // carga el video solo cuando la página ya terminó de cargar
    const after = () => (window.requestIdleCallback ? requestIdleCallback(start, { timeout: 2500 }) : setTimeout(start, 800));
    if (document.readyState === 'complete') after(); else window.addEventListener('load', after, { once: true });
    // pausa cuando el hero no se ve
    new IntersectionObserver(([en]) => {
      if (!v.src) return;
      if (en.isIntersecting && !manualPause) v.play().catch(() => {}); else v.pause();
    }, { threshold: 0.15 }).observe(hero);
    toggle.addEventListener('click', () => {
      manualPause = !v.paused;
      if (manualPause) v.pause(); else v.play().catch(() => {});
      toggle.classList.toggle('paused', manualPause);
      toggle.setAttribute('aria-label', manualPause ? 'Reanudar video de fondo' : 'Pausar video de fondo');
    });
  })();

  // ===== VIDEOS EN OTRAS SECCIONES =====
  // 1) <video class="lazy-video" muted loop playsinline preload="none" data-src="assets/video/x.mp4" poster="assets/img/x.jpg">
  //    carga al acercarse y solo reproduce mientras se ve.
  const lazyObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      const el = en.target;
      if (en.isIntersecting) {
        if (!el.src && el.dataset.src) el.src = el.dataset.src;
        el.play().catch(() => {});
      } else { el.pause(); }
    });
  }, { rootMargin: '200px', threshold: 0.2 });
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('video.lazy-video').forEach(el => lazyObs.observe(el));
  }
  // 2) <button class="video-card" data-video="assets/video/x.mp4"> o data-embed="https://www.youtube-nocookie.com/embed/ID">
  //    no descarga nada hasta que la persona le da clic.
  document.querySelectorAll('.video-card').forEach(b => b.addEventListener('click', () => openVideo(b)));
  function openVideo(btn) {
    const stage = document.getElementById('videoStage');
    const embed = btn.dataset.embed, file = btn.dataset.video;
    if (embed) {
      const sep = embed.includes('?') ? '&' : '?';
      stage.innerHTML = '<iframe src="' + embed + sep + 'autoplay=1&rel=0" title="Video" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>';
    } else if (file) {
      stage.innerHTML = '<video src="' + file + '" controls autoplay playsinline></video>';
    } else return;
    openLayer(document.getElementById('videoModal'), '.video-close');
  }
  function closeVideo() {
    document.getElementById('videoStage').innerHTML = '';
    closeLayer(document.getElementById('videoModal'));
  }
