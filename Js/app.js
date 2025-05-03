// Inicializo las variables principales: carrito de compras, favoritos (wishlist), lista de productos y usuario registrado.
let carrito = [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
let productos = [];
let usuario = JSON.parse(localStorage.getItem('usuario')) || null;

// Lista fija de productos disponibles en la tienda
productos = [
  { id: 1, nombre: "Teclado Gamer", precio: 120000, img: "./img/productos/teclado.jpg" },
  { id: 2, nombre: "Mouse Inalámbrico", precio: 60000, img: "./img/productos/mouse.jpg" },
  { id: 3, nombre: "Monitor 24\"", precio: 850000, img: "./img/productos/monitor.jpg" },
  { id: 4, nombre: "Laptop HP", precio: 2800000, img: "./img/productos/laptop.jpg" },
  { id: 5, nombre: "Audífonos Bluetooth", precio: 180000, img: "./img/productos/audifonos.jpg" }
];

// Muestra todos los productos en pantalla, permite alternar entre favoritos y no favoritos
function mostrarProductos(lista = productos) {
  const contenedor = document.getElementById('productos');
  contenedor.innerHTML = "";
  lista.forEach(p => {
    const esFavorito = wishlist.find(w => w.id === p.id);
    const card = document.createElement('div');
    card.className = "producto-card";
    card.innerHTML = `
      <img src="${p.img}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <p><strong>$${p.precio.toLocaleString('es-CO')}</strong></p>
      <button onclick="agregarAlCarrito(${p.id})">Agregar al Carrito</button>
      <button onclick="agregarAWishlist(${p.id})">${esFavorito ? '💖 Quitar' : '❤️ Favorito'}</button>
    `;
    contenedor.appendChild(card);
  });
}

// Registro de usuario con validaciones estrictas antes de permitir el acceso a la tienda
function registrarUsuario() {
  const nombre = document.getElementById('nombre').value.trim();
  const cedula = document.getElementById('cedula').value.trim();
  const direccion = document.getElementById('direccion').value.trim();
  const correo = document.getElementById('correo').value.trim();

  // Expresiones regulares para validar campos
  const soloLetras = /^[a-zA-Z\s]+$/;
  const soloNumeros = /^\d+$/;
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validaciones simples pero necesarias
  if (!nombre || !cedula || !direccion || !correo) {
    alert("⚠️ Completa todos los campos para registrarte.");
    return;
  }
  if (!soloLetras.test(nombre)) {
    alert("❌ El nombre solo debe contener letras.");
    return;
  }
  if (!soloNumeros.test(cedula) || cedula.length < 5) {
    alert("❌ Ingresa una cédula válida (solo números).");
    return;
  }
  if (direccion.length < 5) {
    alert("❌ Ingresa una dirección válida.");
    return;
  }
  if (!correoValido.test(correo)) {
    alert("❌ Ingresa un correo electrónico válido.");
    return;
  }

  // Guardar usuario en localStorage y en backend con fetch
  usuario = { nombre, cedula, direccion, correo };
  localStorage.setItem('usuario', JSON.stringify(usuario));
  alert(`✅ ¡Bienvenido, ${usuario.nombre}!`);

  // Ocultar registro y mostrar tienda
  document.getElementById('registro-section').classList.add('hidden');
  document.getElementById('productos').classList.remove('hidden');
  document.getElementById('banner-section').classList.remove('hidden');
  document.getElementById('filtros-section').classList.remove('hidden');
  mostrarNombreUsuario();
  mostrarProductos();

  // Envío del registro al servidor
  fetch("registrar_usuario.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(usuario)
  })
  .then(res => res.text())
  .then(data => console.log("Registro:", data));
}

// Muestra el nombre del usuario en la interfaz y activa el botón de cerrar sesión
function mostrarNombreUsuario() {
  const span = document.getElementById('nombre-usuario');
  if (span && usuario) span.textContent = `👤 ${usuario.nombre}`;
  const cerrarBtn = document.getElementById('cerrar-sesion');
  if (cerrarBtn) cerrarBtn.style.display = 'inline-block';
}

// Cerrar sesión y limpiar todo lo relacionado al usuario y sus datos
function cerrarSesion() {
  localStorage.clear();
  usuario = null;
  carrito = [];
  wishlist = [];
  document.getElementById('nombre-usuario').textContent = '';
  document.getElementById('cerrar-sesion').style.display = 'none';
  document.getElementById('registro-section').classList.remove('hidden');
  document.getElementById('productos').classList.add('hidden');
  document.getElementById('banner-section').classList.add('hidden');
  document.getElementById('filtros-section').classList.add('hidden');
  vaciarCarrito(); // Reinicia visualmente el carrito
}

// Agrega un producto al carrito y actualiza la vista y localStorage
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  carrito.push(producto);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
}

// Elimina un producto del carrito por índice
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
}

// Actualiza visualmente el carrito de compras
function actualizarCarrito() {
  const carritoDiv = document.getElementById('cart-items');
  carritoDiv.innerHTML = "";
  carrito.forEach((p, i) => {
    carritoDiv.innerHTML += `
      <div>${p.nombre} - $${p.precio.toLocaleString('es-CO')}
        <button onclick="eliminarDelCarrito(${i})">Eliminar</button>
      </div>`;
  });
  const total = carrito.reduce((acc, p) => acc + p.precio, 0);
  document.getElementById('cart-total').innerText = `Total: $${total.toLocaleString('es-CO')}`;
  document.getElementById('cart-count').innerText = carrito.length;
}

// Vacía el carrito completamente
function vaciarCarrito() {
  carrito = [];
  localStorage.setItem('carrito', JSON.stringify(carrito));
  actualizarCarrito();
}

// Mostrar u ocultar el carrito
function toggleCarrito() {
  document.getElementById('carrito').classList.toggle('hidden');
}

// Solo muestra alerta (aún no está implementada la vista de favoritos)
function toggleFavoritos() {
  alert("💡 Estos son tus favoritos guardados.");
}

// Añade o quita producto de favoritos (wishlist)
function agregarAWishlist(id) {
  const producto = productos.find(p => p.id === id);
  const index = wishlist.findIndex(p => p.id === id);
  if (index !== -1) {
    wishlist.splice(index, 1);
    alert(`${producto.nombre} eliminado de favoritos`);
  } else {
    wishlist.push(producto);
    alert(`${producto.nombre} agregado a favoritos`);
  }
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  mostrarProductos();

  // Se guarda el favorito también en el servidor
  fetch("guardar_favorito.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ correo: usuario.correo, producto_id: id })
  })
  .then(res => res.json())
  .then(data => {
    if (data.estado === "ok") console.log("Favorito guardado");
  });
}

// Filtro de productos por texto, precio mínimo y máximo, y orden
function filtrarProductos() {
  const texto = document.getElementById('buscarProducto').value.toLowerCase();
  const min = parseInt(document.getElementById('precioMin').value) || 0;
  const max = parseInt(document.getElementById('precioMax').value) || Infinity;
  const orden = document.getElementById('ordenarPor').value;
  let res = productos.filter(p => p.nombre.toLowerCase().includes(texto) && p.precio >= min && p.precio <= max);
  if (orden === "menor") res.sort((a, b) => a.precio - b.precio);
  if (orden === "mayor") res.sort((a, b) => b.precio - a.precio);
  mostrarProductos(res);
}

// Restablece todos los filtros y muestra todos los productos de nuevo
function limpiarFiltros() {
  document.getElementById('buscarProducto').value = "";
  document.getElementById('precioMin').value = "";
  document.getElementById('precioMax').value = "";
  document.getElementById('ordenarPor').value = "";
  mostrarProductos();
}

// Cambia el modo oscuro/claro de la página
function toggleModo() {
  document.body.classList.toggle('oscuro');
}

// Verifica si el usuario está registrado y el carrito no está vacío antes de permitir pagar
function confirmarCompra() {
  if (!usuario || !usuario.nombre) {
    alert("🚫 Debes registrarte antes de comprar.");
    return;
  }
  if (carrito.length === 0) {
    alert("🛒 Tu carrito está vacío.");
    return;
  }
  document.getElementById('modal-pago').classList.remove('hidden');
}

// Una vez se selecciona método de pago, se genera factura, se guarda el pedido y se vacía el carrito
function seleccionarMetodoPago(metodo) {
  document.getElementById('modal-pago').classList.add('hidden');
  document.getElementById('mensaje-final').classList.remove('hidden');

  const productosFactura = [...carrito];
  const total = productosFactura.reduce((acc, p) => acc + p.precio, 0);
  const hoy = new Date();
  const fecha = hoy.toISOString().split("T")[0];

  const compra = {
    id: Date.now(),
    cliente: usuario,
    productos: productosFactura,
    metodoPago: metodo,
    total,
    fecha
  };

  // Guardar en historial local
  const historial = JSON.parse(localStorage.getItem("historial")) || [];
  historial.push(compra);
  localStorage.setItem("historial", JSON.stringify(historial));

  // Guardar pedido en base de datos
  fetch("guardar_pedido.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(compra)
  })
  .then(res => res.json())
  .then(data => {
    if (data.estado === "ok") console.log("Pedido guardado en la base de datos");
  });

  generarFacturaPDF(metodo, productosFactura);
  carrito = [];
  actualizarCarrito();
}

// Oculta el mensaje final después de comprar
function cerrarMensajeFinal() {
  document.getElementById('mensaje-final').classList.add('hidden');
}

// Genera una factura en PDF con jsPDF y autoTable
function generarFacturaPDF(metodoPago, productosFactura) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const total = productosFactura.reduce((sum, p) => sum + p.precio, 0);
  const productosTabla = productosFactura.map(p => [p.nombre, `$${p.precio.toLocaleString('es-CO')}`]);
  const fecha = new Date();
  const hora = fecha.toLocaleTimeString('es-CO');
  const fechaStr = fecha.toLocaleDateString('es-CO');
  doc.text("Factura Empresa ABC", 14, 20);
  doc.text(`Cliente: ${usuario?.nombre || "-"}`, 14, 30);
  doc.text(`Cédula: ${usuario?.cedula || "-"}`, 14, 36);
  doc.text(`Dirección: ${usuario?.direccion || "-"}`, 14, 42);
  doc.text(`Correo: ${usuario?.correo || "-"}`, 14, 48);
  doc.text(`Método de pago: ${metodoPago}`, 14, 54);
  doc.text(`Fecha: ${fechaStr}`, 14, 60);
  doc.text(`Hora: ${hora}`, 14, 66);
  doc.autoTable({ head: [["Producto", "Precio"]], body: productosTabla, startY: 72 });
  doc.text(`Total: $${total.toLocaleString('es-CO')}`, 14, doc.lastAutoTable.finalY + 10);
  doc.save("Factura_Empresa_ABC.pdf");
}

// Cuando se carga la página, verifico si ya hay usuario y carrito en memoria
document.addEventListener('DOMContentLoaded', () => {
  mostrarProductos();
  const user = JSON.parse(localStorage.getItem('usuario'));
  const carritoStored = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito = carritoStored;
  actualizarCarrito();
  if (user) {
    usuario = user;
    document.getElementById('registro-section').classList.add('hidden');
    document.getElementById('productos').classList.remove('hidden');
    document.getElementById('banner-section').classList.remove('hidden');
    document.getElementById('filtros-section').classList.remove('hidden');
    mostrarNombreUsuario();
  }
});
