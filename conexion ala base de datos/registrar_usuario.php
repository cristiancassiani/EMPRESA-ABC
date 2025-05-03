<?php
include("conexion.php");

// Validar que lleguen todos los datos requeridos
if (isset($_POST['nombre']) && isset($_POST['cedula']) && isset($_POST['direccion']) && isset($_POST['correo'])) {
    $nombre = $_POST['nombre'];
    $cedula = $_POST['cedula'];
    $direccion = $_POST['direccion'];
    $correo = $_POST['correo'];

    $sql = "INSERT INTO usuarios (nombre, cedula, direccion, correo) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssss", $nombre, $cedula, $direccion, $correo);

    if ($stmt->execute()) {
        echo "✅ Usuario guardado correctamente";
    } else {
        echo "❌ Error al guardar usuario: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "❌ Faltan datos POST";
}

$conn->close();
?>
