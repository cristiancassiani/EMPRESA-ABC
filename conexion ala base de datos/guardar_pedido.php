<?php
header("Content-Type: application/json");
include("conexion.php");

$input = json_decode(file_get_contents("php://input"), true);

$correo = $input["correo"];
$productos = $input["productos"];
$metodo = $input["metodo"];
$total = $input["total"];
$fecha = date("Y-m-d");

$sql = "INSERT INTO pedidos (correo, productos, metodo_pago, total, fecha)
        VALUES ('$correo', '".json_encode($productos)."', '$metodo', '$total', '$fecha')";

if ($conn->query($sql) === TRUE) {
    echo json_encode(["estado" => "ok"]);
} else {
    echo json_encode(["estado" => "error", "mensaje" => $conn->error]);
}
$conn->close();
?>

