<?php
/**
 * api/rooms.php
 * Get all rooms, toggle availability
 */
require "config.php";

$body   = json_decode(file_get_contents("php://input"), true) ?? [];
$action = $body["action"] ?? $_GET["action"] ?? "getAll";

// ── GET ALL ROOMS ─────────────────────────────────────────────
if ($action === "getAll") {
    $stmt = $pdo->query("SELECT * FROM rooms ORDER BY roomNumber ASC");
    echo json_encode($stmt->fetchAll());
}

// ── TOGGLE AVAILABILITY (admin) ───────────────────────────────
if ($action === "toggle") {
    $roomNumber = intval($body["roomNumber"]);
    // Don't toggle if there's an active reservation
    $check = $pdo->prepare(
        "SELECT COUNT(*) FROM reservations r
         JOIN rooms rm ON r.roomId = rm.id
         WHERE rm.roomNumber = ? AND r.status = 'CONFIRMED'"
    );
    $check->execute([$roomNumber]);
    if ($check->fetchColumn() > 0) {
        echo json_encode(["success" => false, "message" => "Room has an active reservation."]);
        exit();
    }
    $pdo->prepare("UPDATE rooms SET isAvailable = NOT isAvailable WHERE roomNumber = ?")
        ->execute([$roomNumber]);
    echo json_encode(["success" => true]);
}
?>
