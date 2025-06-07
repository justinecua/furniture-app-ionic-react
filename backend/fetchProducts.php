<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require 'db.php';

try {

    $category_id = isset($_GET['category_id']) ? intval($_GET['category_id']) : 0;

    if ($category_id === 0) {
        $stmt = $pdo->prepare("SELECT * FROM products");
    } else { 
        $stmt = $pdo->prepare("SELECT * FROM products WHERE category_id = :category_id");
        $stmt->bindParam(":category_id", $category_id, PDO::PARAM_INT);
    }

    $stmt->execute();
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($products);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}

