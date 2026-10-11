  // ===== PRODUCTOS (aquí se agregan las flores nuevas) =====
  // Para agregar una flor: copia un bloque, cambia los datos y pon sus fotos en assets/img/productos/<id>/
  const DESCRIPCION = 'Flor Realista en Papel Italiano elaborada 100% a mano en papel Italiano, el color puede variar con respecto a las fotos, la producción de la pieza comenzará una vez realice su pedido. El tiempo de entrega se estimará según la complejidad de la pieza.';
  // fotos: cantidad de fotos del producto (assets/img/productos/<id>/<id>-1.jpg ...). La miniatura es <id>-thumb.jpg
  const PRODUCTOS = [
    { id: 'rosa', nombre: 'Rosa', precio: 60000, specs: ['Flor de 14 cms', 'Tallo de 40 cms'], fotos: 4 },
    { id: 'peonia-2', nombre: 'Peonia 2', precio: 120000, specs: ['Flor de 16 cms', 'Tallo de 49 cms'], fotos: 4 },
    { id: 'amapola', nombre: 'Amapola', precio: 40000, specs: ['Flor de 11 cms de diámetro', 'Tallo de 45 cms'], fotos: 6 },
    { id: 'anemona-coronaria', nombre: 'Anémona Coronaria', precio: 35000, specs: ['Flor de 8 cms de diámetro', 'Tallo de 37 cms'], fotos: 3 },
    { id: 'aliso-amarillo', nombre: 'Aliso Amarillo', precio: 22000, specs: ['Flor de 5 cms', 'Tallo de 37 cms'], fotos: 4 },
    { id: 'anemona', nombre: 'Anémona', precio: 30000, specs: ['Flor de 8 cms de diámetro', 'Tallo de 35 cms'], fotos: 3 },
    { id: 'camelia', nombre: 'Camelia', precio: 60000, specs: ['Flor de 10 cms', 'Tallo de 40 cms'], fotos: 3 },
    { id: 'chocolate-cosmos', nombre: 'Chocolate Cosmos', precio: 35000, specs: ['Flor de 7 cms', 'Tallo de 43 cms'], fotos: 3 },
    { id: 'clavel', nombre: 'Clavel', precio: 68000, specs: ['Flor de 9 cms', 'Tallo de 41 cms'], fotos: 4 },
    { id: 'collerette-dhalia', nombre: 'Collerette Dhalia', precio: 40000, specs: ['Flor de 7 cms de diámetro', 'Tallo de 39 cms'], fotos: 3 },
    { id: 'cosmos', nombre: 'Cosmos', precio: 35000, specs: ['Flor de 7 cms', 'Tallo de 37 cms'], fotos: 6 },
    { id: 'cosmos-bipinnatus', nombre: 'Cosmos Bipinnatus', precio: 30000, specs: ['Flor de 7 cms de diámetro', 'Tallo de 37 cms'], fotos: 3 },
    { id: 'cosmos-caudatus', nombre: 'Cosmos Caudatus', precio: 75000, specs: ['2 Flores de 10 cms - botón', 'Tallo de 48 cms'], fotos: 4 },
    { id: 'dhalia', nombre: 'Dhalia', precio: 55000, specs: ['Flor de 11 cms de diámetro', 'Tallo de 40 cms'], fotos: 3 },
    { id: 'eleboro-negro', nombre: 'Eléboro Negro', precio: 25000, specs: ['Flor de 6 cms', 'Tallo de 34 cms'], fotos: 4 },
    { id: 'itho-peony', nombre: 'Itho Peony', precio: 70000, specs: ['Flor de 9 cms', 'Tallo de 38 cms'], fotos: 4 },
    { id: 'malva-salvaje', nombre: 'Malva Salvaje', precio: 65000, specs: ['6 Flores de 3 cms', 'Tallo de 41 cms'], fotos: 4 },
    { id: 'margarita', nombre: 'Margarita', precio: 60000, specs: ['Flor de 10 cms de diámetro', 'Tallo de 38 cms'], fotos: 4 },
    { id: 'nasturtium', nombre: 'Nasturtium', precio: 70000, specs: ['3 Flores de 4 cms', 'Tallo de 45 cms'], fotos: 4 },
    { id: 'peonia', nombre: 'Peonia', precio: 65000, specs: ['Flor de 13 cms', 'Tallo de 41 cms'], fotos: 3 },
    { id: 'sweet-pea', nombre: 'Sweet Pea', precio: 65000, specs: ['3 Flores de 5 cms', '2 Flores de 2 cms', '1 Flor de 6 cms', 'Tallo de 45 cms'], fotos: 6 },
    { id: 'tulipan', nombre: 'Tulipán', precio: 38000, specs: ['Flor de 7 cms de diámetro', 'Tallo de 39 cms'], fotos: 6 },
    { id: 'tulipan-huis-ten-bosch', nombre: 'Tulipán Huis Ten Bosch', precio: 40000, specs: ['Flor de 7 cms de diámetro', 'Tallo de 37 cms'], fotos: 5 },
    { id: 'zinnia', nombre: 'Zinnia', precio: 40000, specs: ['Flor de 9 cms de diámetro', 'Tallo de 38 cms'], fotos: 3 }
  ];
  PRODUCTOS.forEach(p => { p.miniatura = `assets/img/productos/${p.id}/${p.id}-thumb.jpg`; p.fotos = Array.from({ length: p.fotos }, (_, i) => `assets/img/productos/${p.id}/${p.id}-${i + 1}.jpg`); });
  const formatoPrecio = n => '$' + new Intl.NumberFormat('es-CO').format(n);
  function waProducto(p) { return `Hola, quiero pedir ${p.nombre} (precio unitario ${formatoPrecio(p.precio)}).`; }
  function tarjetaProducto(p) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML =
      `<a class="product-link" href="#flor-${p.id}" aria-label="Ver ${p.nombre}">` +
      `<div class="product-img"><div class="product-fill"><img src="${p.miniatura}" alt="${p.nombre}" loading="lazy" decoding="async" width="700" height="933"></div>` +
      `<div class="product-hover-overlay"><span class="ver-detalle-btn">Ver Detalle</span></div></div>` +
      `<div class="product-name">${p.nombre}</div><div class="product-type">Flor realista en papel</div></a>` +
      `<div class="product-footer"><div class="product-price">${formatoPrecio(p.precio)}</div><button class="product-action" type="button" aria-label="Pedir ${p.nombre}">Pedir</button></div>`;
    card.querySelector('.product-link').addEventListener('click', e => { e.preventDefault(); abrirProducto(p.id); });
    card.querySelector('.product-action').addEventListener('click', () => {
      window.open('https://wa.me/573208654762?text=' + encodeURIComponent(waProducto(p)), '_blank', 'noopener');
    });
    return card;
  }
