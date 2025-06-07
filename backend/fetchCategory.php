<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require 'db.php';

try {
    $stmt = $pdo->query("SELECT id, name, image FROM category");
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}

