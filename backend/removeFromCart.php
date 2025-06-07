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

if (empty($data['cart_id'])) {
    echo json_encode(['success' => false, 'message' => 'No cart_id provided', 'input' => $data]);
    exit;
}

try {
    $cart_id = intval($data['cart_id']);

    $stmt = $pdo->prepare("DELETE FROM cart WHERE id = :cart_id");
    $success = $stmt->execute(['cart_id' => $cart_id]);

    echo json_encode([
        'success' => $success,
        'message' => $success ? '' : 'Failed to delete',
        'cart_id' => $cart_id
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

?>
