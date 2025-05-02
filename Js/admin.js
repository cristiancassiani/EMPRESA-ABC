const historialComprasDiv = document.getElementById('historialCompras');
let historial = JSON.parse(localStorage.getItem('historial')) || [];

function mostrarHistorial(lista = historial) {
  historialComprasDiv.innerHTML = '';
  if (lista.length === 0) {
    historialComprasDiv.innerHTML = '<p>No hay compras registradas.</p>';
    return;
  }

  lista.reverse().forEach(compra => {
    const div = document.createElement('div');
    div.className = 'compra-card';
    div.innerHTML = `
      <h3>Factura #${compra.id}</h3>
      <p><strong>Cliente:</strong> ${compra.cliente.nombre}</p>
      <p><strong>Correo:</strong> ${compra.cliente.correo}</p>
      <p><strong>Fecha:</strong> ${compra.fecha} - ${compra.hora}</p>
      <p><strong>Método de Pago:</strong> ${compra.metodoPago}</p>
      <p><strong>Total:</strong> $${compra.total.toLocaleString('es-CO')}</p>
      <button onclick="descargarFactura(${compra.id})">📄 Descargar Factura</button>
      <hr>
    `;
    historialComprasDiv.appendChild(div);
  });
}

function filtrarHistorial() {
  const texto = document.getElementById('buscarCliente').value.toLowerCase();
  const fecha = document.getElementById('buscarFecha').value;

  const filtrado = historial.filter(c =>
    (c.cliente.nombre.toLowerCase().includes(texto) || c.cliente.correo.toLowerCase().includes(texto)) &&
    (!fecha || c.fecha === fecha)
  );

  mostrarHistorial(filtrado);
}

function descargarFactura(id) {
  const { jsPDF } = window.jspdf;
  const compra = historial.find(c => c.id === id);
  if (!compra) return;

  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("Factura TiendaPro", 10, 10);
  doc.setFontSize(12);
  doc.text(`Factura: #${compra.id}`, 10, 20);
  doc.text(`Fecha: ${compra.fecha}`, 10, 30);
  doc.text(`Hora: ${compra.hora}`, 10, 36);
  doc.text(`Cliente: ${compra.cliente.nombre}`, 10, 42);
  doc.text(`Correo: ${compra.cliente.correo}`, 10, 48);
  doc.text(`Método de Pago: ${compra.metodoPago}`, 10, 54);

  const rows = compra.productos.map(p => [p.nombre, `$${p.precio.toLocaleString('es-CO')}`]);

  doc.autoTable({
    head: [['Producto', 'Precio']],
    body: rows,
    startY: 62,
  });

  doc.text(`Total: $${compra.total.toLocaleString('es-CO')}`, 10, doc.lastAutoTable.finalY + 10);
  doc.save(`Factura_${compra.id}.pdf`);
}

mostrarHistorial();

function mostrarHistorial(lista = historial) {
  historialComprasDiv.innerHTML = '';
  if (lista.length === 0) {
    historialComprasDiv.innerHTML = '<p>No hay compras registradas.</p>';
    return;
  }

  lista.reverse().forEach(compra => {
    const div = document.createElement('div');
    div.className = 'compra-card';
    div.innerHTML = `
      <h3>Factura #${compra.id}</h3>
      <p><strong>Cliente:</strong> ${compra.cliente.nombre}</p>
      <p><strong>Correo:</strong> ${compra.cliente.correo}</p>
      <p><strong>Fecha:</strong> ${compra.fecha} - ${compra.hora}</p>
      <p><strong>Método de Pago:</strong> ${compra.metodoPago}</p>
      <p><strong>Total:</strong> $${compra.total.toLocaleString('es-CO')}</p>
      <button onclick="descargarFactura(${compra.id})">📄 Descargar Factura</button>
      <button onclick="eliminarFactura(${compra.id})" style="margin-left:10px; background:#e74c3c;">🗑️ Eliminar</button>
      <hr>
    `;
    historialComprasDiv.appendChild(div);
  });
}

function eliminarFactura(id) {
  if (confirm("¿Estás seguro de eliminar esta factura del historial?")) {
    historial = historial.filter(compra => compra.id !== id);
    localStorage.setItem('historial', JSON.stringify(historial));
    mostrarHistorial();
  }
}

