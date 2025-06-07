<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'db.php'; // Uses $pdo

$input = json_decode(file_get_contents('php://input'), true);

if (
    !isset($input['shippingAddress']) || 
    !isset($input['cardNumber']) || 
    !isset($input['user_id'])
) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

$shippingAddress = $input['shippingAddress'];
$cardNumber = $input['cardNumber'];
$user_id = intval($input['user_id']);

try {
    $stmt = $pdo->prepare("SELECT c.product_id, c.quantity, p.price 
                           FROM cart c 
                           JOIN products p ON c.product_id = p.id 
                           WHERE c.user_id = ?");
    $stmt->execute([$user_id]);
    $cartItems = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($cartItems)) {
        echo json_encode(['success' => false, 'message' => 'Cart is empty']);
        exit;
    }

    $totalAmount = 0;
    foreach ($cartItems as $item) {
        $totalAmount += $item['price'] * $item['quantity'];
    }

    $pdo->beginTransaction();

    $orderInsert = $pdo->prepare("INSERT INTO orders (user_id, shipping_address, card_number, total_amount) 
                                  VALUES (?, ?, ?, ?)");
    $orderInsert->execute([$user_id, $shippingAddress, $cardNumber, $totalAmount]);
    $orderId = $pdo->lastInsertId();

    $orderItemInsert = $pdo->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) 
                                      VALUES (?, ?, ?, ?)");
    foreach ($cartItems as $item) {
        $orderItemInsert->execute([
            $orderId,
            $item['product_id'],
            $item['quantity'],
            $item['price']
        ]);
    }

    $clearCart = $pdo->prepare("DELETE FROM cart WHERE user_id = ?");
    $clearCart->execute([$user_id]);

    $pdo->commit();

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => 'Order failed: ' . $e->getMessage()]);
}
?>

