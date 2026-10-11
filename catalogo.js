  // Página del catálogo: muestra todas las flores de la lista PRODUCTOS (productos.js)
  const grid = document.getElementById('catalogGrid');
  PRODUCTOS.forEach(p => grid.appendChild(tarjetaProducto(p)));
  document.getElementById('catalogCount').textContent = PRODUCTOS.length + (PRODUCTOS.length === 1 ? ' producto' : ' productos');
