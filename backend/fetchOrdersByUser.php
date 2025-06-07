<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
require 'db.php';

try {

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $userId = $_GET['user_id'] ?? '';

        if (!$userId) {
            echo json_encode(["error" => "User ID is required"]);
            exit;
        }

        $ordersStmt = $pdo->prepare("SELECT * FROM orders WHERE user_id = ?");
        $ordersStmt->execute([$userId]);
        $orders = [];

        while ($order = $ordersStmt->fetch(PDO::FETCH_ASSOC)) {
            $orderId = $order['id'];

            $itemsStmt = $pdo->prepare("
                SELECT oi.quantity, oi.price, p.name, p.image 
                FROM order_items oi 
                JOIN products p ON oi.product_id = p.id 
                WHERE oi.order_id = ?
            ");
            $itemsStmt->execute([$orderId]);
            $items = $itemsStmt->fetchAll(PDO::FETCH_ASSOC);

            $order['items'] = $items;
            $orders[] = $order;
        }

        echo json_encode($orders);
    } else {
        echo json_encode(["error" => "Invalid request method"]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>

