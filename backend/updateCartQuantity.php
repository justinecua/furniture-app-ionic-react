<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require 'db.php'; 

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (empty($data['cart_id']) || !isset($data['quantity'])) {
    echo json_encode(['success' => false, 'message' => 'cart_id or quantity not provided']);
    exit;
}

$cart_id = intval($data['cart_id']);
$quantity = intval($data['quantity']);

try {
    if ($quantity < 1) {
        $stmt = $pdo->prepare("DELETE FROM cart WHERE id = :cart_id");
        $success = $stmt->execute(['cart_id' => $cart_id]);
        $message = $success ? 'Item removed from cart' : 'Failed to remove item';
    } else {
        $stmt = $pdo->prepare("UPDATE cart SET quantity = :quantity WHERE id = :cart_id");
        $success = $stmt->execute(['quantity' => $quantity, 'cart_id' => $cart_id]);
        $message = $success ? 'Quantity updated' : 'Failed to update quantity';
    }

    echo json_encode(['success' => $success, 'message' => $message, 'cart_id' => $cart_id, 'quantity' => $quantity]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'DB error: ' . $e->getMessage()]);
}

?>
