  // ===== PRODUCTOS (aquí se agregan las flores nuevas) =====
  // Para agregar una flor: copia un bloque, cambia los datos y pon sus fotos en assets/img/productos/<id>/
  const DESCRIPCION = 'Flor realista en papel italiano elaborada 100% a mano. El color puede variar con respecto a las fotos, la producción de la pieza comenzará una vez realice su pedido. El tiempo de entrega se estimará según la complejidad de la pieza.';
  const DESCRIPCION_ARREGLO = 'Composición de flores realistas en papel, elaboradas 100% a mano. La pieza se entrega según la imagen de referencia o puede modificarse según tu requerimiento; si el cambio excede el valor del arreglo, la diferencia la asume el cliente. El tiempo de entrega se estimará después de la confirmación formal y el pago.';
  // fotos: cantidad de fotos del producto (assets/img/productos/<id>/<id>-1.jpg ...). La miniatura es <id>-thumb.jpg
  const FLORES = [
    { id: 'rosa', nombre: 'Rosa', precio: 60000, specs: ['Flor de 14 cms', 'Tallo de 40 cms'], fotos: 4 },
    { id: 'peonia-2', nombre: 'Peonia 2', precio: 130000, specs: ['Flor de 16 cms', 'Tallo de 49 cms'], fotos: 4 },
    { id: 'amapola', nombre: 'Amapola', precio: 40000, specs: ['Flor de 11 cms de diámetro', 'Tallo de 45 cms'], fotos: 6 },
    { id: 'anemona-coronaria', nombre: 'Anémona Coronaria', precio: 45000, specs: ['Flor de 8 cms de diámetro', 'Tallo de 37 cms'], fotos: 3 },
    { id: 'aliso-amarillo', nombre: 'Aliso Amarillo', precio: 25000, specs: ['Flor de 5 cms', 'Tallo de 37 cms'], fotos: 4 },
    { id: 'anemona', nombre: 'Anémona', precio: 38000, specs: ['Flor de 8 cms de diámetro', 'Tallo de 35 cms'], fotos: 3 },
    { id: 'camelia', nombre: 'Camelia', precio: 65000, specs: ['Flor de 10 cms', 'Tallo de 40 cms'], fotos: 3 },
    { id: 'chocolate-cosmos', nombre: 'Chocolate Cosmos', precio: 38000, specs: ['Flor de 7 cms', 'Tallo de 43 cms'], fotos: 3 },
    { id: 'clavel', nombre: 'Clavel', precio: 130000, specs: ['Flor de 9 cms', 'Tallo de 41 cms'], fotos: 4 },
    { id: 'collerette-dhalia', nombre: 'Collerette Dhalia', precio: 48000, specs: ['Flor de 7 cms de diámetro', 'Tallo de 39 cms'], fotos: 3 },
    { id: 'cosmos', nombre: 'Cosmos', precio: 38000, specs: ['Flor de 7 cms', 'Tallo de 37 cms'], fotos: 6 },
    { id: 'cosmos-bipinnatus', nombre: 'Cosmos Bipinnatus', precio: 38000, specs: ['Flor de 7 cms de diámetro', 'Tallo de 37 cms'], fotos: 3 },
    { id: 'cosmos-caudatus', nombre: 'Cosmos Caudatus', precio: 80000, specs: ['2 Flores de 10 cms - botón', 'Tallo de 48 cms'], fotos: 4 },
    { id: 'dhalia', nombre: 'Dhalia', precio: 70000, specs: ['Flor de 11 cms de diámetro', 'Tallo de 40 cms'], fotos: 3 },
    { id: 'eleboro-negro', nombre: 'Eléboro Negro', precio: 38000, specs: ['Flor de 6 cms', 'Tallo de 34 cms'], fotos: 4 },
    { id: 'itho-peony', nombre: 'Itho Peony', precio: 75000, specs: ['Flor de 9 cms', 'Tallo de 38 cms'], fotos: 4 },
    { id: 'lisianthus', nombre: 'Lisianthus', precio: 80000, specs: ['Flor de 9 cms de diámetro', 'Tallo de 35 cms'], fotos: 5 },
    { id: 'malva-salvaje', nombre: 'Malva Salvaje', precio: 90000, specs: ['6 Flores de 3 cms', 'Tallo de 41 cms'], fotos: 4 },
    { id: 'margarita', nombre: 'Margarita', precio: 90000, specs: ['Flor de 10 cms de diámetro', 'Tallo de 38 cms'], fotos: 4 },
    { id: 'nasturtium', nombre: 'Nasturtium', precio: 85000, specs: ['3 Flores de 4 cms', 'Tallo de 45 cms'], fotos: 4 },
    { id: 'peonia', nombre: 'Peonia', precio: 90000, specs: ['Flor de 13 cms', 'Tallo de 41 cms'], fotos: 3 },
    { id: 'sweet-pea', nombre: 'Sweet Pea', precio: 80000, specs: ['3 Flores de 5 cms', '2 Flores de 2 cms', '1 Flor de 6 cms', 'Tallo de 45 cms'], fotos: 6 },
    { id: 'tulipan', nombre: 'Tulipán', precio: 70000, specs: ['Flor de 7 cms de diámetro', 'Tallo de 39 cms'], fotos: 6 },
    { id: 'tulipan-huis-ten-bosch', nombre: 'Tulipán Huis Ten Bosch', precio: 75000, specs: ['Flor de 7 cms de diámetro', 'Tallo de 37 cms'], fotos: 5 },
    { id: 'zinnia', nombre: 'Zinnia', precio: 60000, specs: ['Flor de 9 cms de diámetro', 'Tallo de 38 cms'], fotos: 3 }
  ];
  // ===== ARREGLOS (composiciones de varias flores con florero o base) =====
  // composicion: lo que lleva el arreglo, tal como aparece en la ficha de cada uno. Las fotos van en assets/img/productos/<id>/
  const ARREGLOS = [
    { id: 'arreglo-abigail', nombre: 'Abigail', precio: 980000, fotos: 5, resumen: 'Tulipanes y poppy en florero de vidrio',
      composicion: ['2 Tulipanes Huis Ten Bosch', '4 Tulipanes', '3 Poppy', '2 Ramas de follaje', '1 Florero en vidrio templado, 17 cm de alto x 12 cm de ancho'] },
    { id: 'arreglo-ester', nombre: 'Ester', precio: 920000, fotos: 6, resumen: 'Sweet pea, nasturtium y cosmos en cerámica',
      composicion: ['2 Sweet Pea', '2 Nasturtium', '5 Garden Cosmos', '1 Follaje', '1 Florero redondo en cerámica, 16 cm de alto x 16 cm de ancho'] },
    { id: 'arreglo-isabel', nombre: 'Isabel', precio: 890000, fotos: 4, resumen: 'Camelias, anémonas y amapolas en vidrio',
      composicion: ['4 Camelias', '5 Anémonas coronarias', '2 Poppies', '2 Amapolas de California', '2 Ramas de follaje', '1 Base en vidrio templado, 18 cm de alto x 10 cm de ancho'] },
    { id: 'arreglo-lia', nombre: 'Lía', precio: 490000, fotos: 4, resumen: 'Sweet pea y cosmos caudatus',
      composicion: ['3 Sweet Pea', '1 Cosmos Caudatus', '1 Florero en cerámica, 12 cm de alto x 5 cm de ancho'] },
    { id: 'arreglo-raab', nombre: 'Raab', precio: 410000, fotos: 4, resumen: 'Una peonia en florero de vidrio',
      composicion: ['1 Peonia', '1 Florero en vidrio templado, 12 cm de alto x 13 cm de ancho'] },
    { id: 'arreglo-raquel', nombre: 'Raquel', precio: 520000, fotos: 4, resumen: 'Poppy y zinnias en base de cerámica',
      composicion: ['1 Poppy', '2 Zinnias', '2 Ramas de follaje', '1 Base en cerámica, 14 cm de alto x 9 cm de ancho'] },
    { id: 'arreglo-rebeca', nombre: 'Rebeca', precio: 890000, fotos: 4, resumen: 'Camelias, itho peony y eléboros',
      composicion: ['4 Camelias', '2 Itho Peony', '3 Eléboros negros', '1 Centaurea', '1 Rama de follaje', '1 Base en cerámica, 21 cm de alto x 12 cm de ancho'] },
    { id: 'arreglo-rut', nombre: 'Rut', precio: 720000, fotos: 5, resumen: 'Alisos, amapolas y peonias en vidrio',
      composicion: ['2 Alisos amarillos', '4 Amapolas', '2 Peonias', '2 Follajes', '1 Base en vidrio templado, 17 cm de alto x 8 cm de ancho'] },
    { id: 'arreglo-salome', nombre: 'Salome', precio: 460000, fotos: 4, resumen: 'Malva salvaje en florero de cerámica',
      composicion: ['3 Malva Salvaje', '1 Florero en cerámica, 12 cm de alto x 5 cm de ancho'] },
    { id: 'arreglo-sara', nombre: 'Sara', precio: 920000, fotos: 5, resumen: 'Anémonas, tulipanes y eléboros en cerámica',
      composicion: ['7 Anémonas', '4 Tulipanes', '3 Eléboros negros', '2 Follajes', '1 Florero en cerámica, 22 cm de alto x 12 cm de ancho'] }
  ];
  // orden alfabético dentro de cada grupo: así no quedan flores del mismo color seguidas
  FLORES.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  ARREGLOS.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
  FLORES.forEach(p => { p.tipo = 'flor'; });
  ARREGLOS.forEach(p => { p.tipo = 'arreglo'; });
  // PRODUCTOS reúne todo lo que se puede comprar (flores por unidad y arreglos): el carrito y las ventanas lo usan
  const PRODUCTOS = FLORES.concat(ARREGLOS);
  PRODUCTOS.forEach(p => { p.miniatura = `assets/img/productos/${p.id}/${p.id}-thumb.jpg`; p.fotos = Array.from({ length: p.fotos }, (_, i) => `assets/img/productos/${p.id}/${p.id}-${i + 1}.jpg`); });
  const formatoPrecio = n => '$' + new Intl.NumberFormat('es-CO').format(n);
  // nombre completo para el carrito y los mensajes: "Arreglo Abigail" o "Rosa"
  const nombreItem = p => (p.tipo === 'arreglo' ? 'Arreglo ' : '') + p.nombre;
  function waProducto(p) {
    return p.tipo === 'arreglo'
      ? `Hola, quiero pedir el ${nombreItem(p)} (${formatoPrecio(p.precio)}). Me gustaría saber si se puede ajustar.`
      : `Hola, quiero pedir ${p.nombre} (precio unitario ${formatoPrecio(p.precio)}).`;
  }
  function tarjetaProducto(p) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML =
      `<a class="product-link" href="#flor-${p.id}" aria-label="Ver ${nombreItem(p)}">` +
      `<div class="product-img"><div class="product-fill"><img src="${p.miniatura}" alt="${nombreItem(p)}" loading="lazy" decoding="async" width="700" height="933"></div>` +
      `<div class="product-hover-overlay"><span class="ver-detalle-btn">Ver Detalle</span></div></div>` +
      `<div class="product-name">${p.tipo === 'arreglo' ? '<span class="product-kind">Arreglo</span> ' : ''}${p.nombre}</div><div class="product-type${p.tipo === 'arreglo' ? ' product-type-resumen' : ''}">${p.tipo === 'arreglo' ? p.resumen : 'Flor realista en papel'}</div></a>` +
      `<div class="product-footer"><div class="product-price">${formatoPrecio(p.precio)}</div><button class="product-action" type="button" aria-label="Agregar ${nombreItem(p)} al carrito">Agregar</button></div>`;
    card.querySelector('.product-link').addEventListener('click', e => { e.preventDefault(); abrirProducto(p.id); });
    const btn = card.querySelector('.product-action');
    btn.addEventListener('click', () => {
      carritoAgregar(p.id);
      btn.textContent = 'Agregada'; btn.classList.add('ok');
      setTimeout(() => { btn.textContent = 'Agregar'; btn.classList.remove('ok'); }, 1400);
    });
    return card;
  }
