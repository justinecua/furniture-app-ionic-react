<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require 'db.php';

try {
  if (!isset($_GET['id'])) {
    echo json_encode(['error' => 'Product ID not provided']);
    exit;
  }

  $id = intval($_GET['id']);

  $stmt = $pdo->prepare("SELECT * FROM products WHERE id = :id");
  $stmt->execute(['id' => $id]);

  $product = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($product) {
    echo json_encode($product);
  } else {
    echo json_encode(['error' => 'Product not found']);
  }
} catch (PDOException $e) {
  echo json_encode(['error' => $e->getMessage()]);
}
?>

