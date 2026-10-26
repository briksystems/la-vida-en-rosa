  // Página del catálogo: dos grupos, flores por unidad y arreglos (listas FLORES y ARREGLOS en productos.js)
  const grid = document.getElementById('catalogGrid');
  const tabs = [...document.querySelectorAll('.cat-tab')];
  const cuenta = document.getElementById('catalogCount');
  const GRUPOS = {
    flores:   { lista: FLORES,   texto: n => `${n} flores, cada una se vende por unidad.` },
    arreglos: { lista: ARREGLOS, texto: n => `${n} composiciones de varias flores, con su florero o base.` }
  };
  document.getElementById('nFlores').textContent = FLORES.length;
  document.getElementById('nArreglos').textContent = ARREGLOS.length;
  let grupoActual = null;
  function mostrarGrupo(g, guardarHash) {
    if (!GRUPOS[g]) g = 'flores';
    const cambia = grupoActual !== null && grupoActual !== g;
    grupoActual = g;
    const { lista, texto } = GRUPOS[g];
    grid.innerHTML = '';
    lista.forEach(p => grid.appendChild(tarjetaProducto(p)));
    cuenta.textContent = texto(lista.length);
    tabs.forEach(t => {
      const on = t.dataset.grupo === g;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
    });
    grid.setAttribute('aria-labelledby', 'tab-' + g);
    if (cambia) { grid.classList.remove('cat-entra'); void grid.offsetWidth; grid.classList.add('cat-entra'); }
    if (guardarHash) {
      try { history.replaceState(history.state, '', g === 'arreglos' ? '#arreglos' : location.pathname + location.search); } catch (e) {}
    }
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => mostrarGrupo(t.dataset.grupo, true));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const otro = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
      otro.focus(); mostrarGrupo(otro.dataset.grupo, true);
    });
  });
  // grupo inicial: #arreglos, o el grupo de la pieza que se abre por enlace directo (#flor-...)
  (function () {
    const m = location.hash.match(/^#flor-(.+)$/);
    const p = m && PRODUCTOS.find(x => x.id === m[1]);
    mostrarGrupo(location.hash === '#arreglos' || (p && p.tipo === 'arreglo') ? 'arreglos' : 'flores', false);
  })();
