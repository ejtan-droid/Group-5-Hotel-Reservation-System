<?php
/**
 * api/reservations.php
 * Create, get, cancel, modify reservations
 */
require "config.php";

$body   = json_decode(file_get_contents("php://input"), true) ?? [];
$action = $body["action"] ?? $_GET["action"] ?? "get";

// ── GET FOR USER ──────────────────────────────────────────────
if ($action === "get") {
    $userId = intval($_GET["userId"] ?? $body["userId"]);
    $stmt   = $pdo->prepare(
        "SELECT r.id AS reservationId, r.*, u.firstName, u.lastName,
                rm.type AS roomType, rm.roomNumber, rm.pricePerNight
         FROM reservations r
         JOIN users u  ON r.userId = u.id
         JOIN rooms rm ON r.roomId = rm.id
         WHERE r.userId = ?
         ORDER BY r.createdAt DESC"
    );
    $stmt->execute([$userId]);
    echo json_encode($stmt->fetchAll());
}

// ── GET ALL (admin) ───────────────────────────────────────────
if ($action === "getAll") {
    $stmt = $pdo->prepare(
        "SELECT r.id AS reservationId, r.*,
                CONCAT(u.firstName,' ',u.lastName) AS guestName,
                rm.type AS roomType, rm.roomNumber, rm.pricePerNight
         FROM reservations r
         JOIN users u  ON r.userId = u.id
         JOIN rooms rm ON r.roomId = rm.id
         ORDER BY r.createdAt DESC"
    );
    $stmt->execute();
    echo json_encode($stmt->fetchAll());
}

// ── CREATE ────────────────────────────────────────────────────
if ($action === "create") {
    // Find room id by roomNumber
    $rmStmt = $pdo->prepare("SELECT id, pricePerNight FROM rooms WHERE roomNumber = ? AND isAvailable = 1");
    $rmStmt->execute([intval($body["roomNumber"])]);
    $room = $rmStmt->fetch();
    if (!$room) {
        echo json_encode(["success" => false, "message" => "Room is not available."]);
        exit();
    }

    // Conflict check
    $conflict = $pdo->prepare(
        "SELECT id FROM reservations
         WHERE roomId = ? AND status = 'CONFIRMED'
         AND checkIn < ? AND checkOut > ?"
    );
    $conflict->execute([$room["id"], $body["checkOut"], $body["checkIn"]]);
    if ($conflict->fetch()) {
        echo json_encode(["success" => false, "message" => "Room is already booked for those dates."]);
        exit();
    }

    $nights   = intval($body["nights"]);
    $total    = $room["pricePerNight"] * $nights;

    $stmt = $pdo->prepare(
        "INSERT INTO reservations
         (userId, roomId, checkIn, checkOut, checkInTime, checkOutTime, nights, totalRoomCost, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMED')"
    );
    $stmt->execute([
        intval($body["userId"]), $room["id"],
        $body["checkIn"], $body["checkOut"],
        $body["checkInTime"]  ?? "14:00",
        $body["checkOutTime"] ?? "12:00",
        $nights, $total,
    ]);

    // Mark room as unavailable
    $pdo->prepare("UPDATE rooms SET isAvailable = 0 WHERE id = ?")->execute([$room["id"]]);

    echo json_encode(["success" => true, "reservationId" => $pdo->lastInsertId(), "totalRoomCost" => $total]);
}

// ── CANCEL ────────────────────────────────────────────────────
if ($action === "cancel") {
    $resId = intval($body["reservationId"]);

    // Get roomId before cancelling
    $r = $pdo->prepare("SELECT roomId FROM reservations WHERE id = ?");
    $r->execute([$resId]);
    $row = $r->fetch();

    $pdo->prepare("UPDATE reservations SET status = 'CANCELLED', lastModified = NOW() WHERE id = ?")
        ->execute([$resId]);

    if ($row) {
        $pdo->prepare("UPDATE rooms SET isAvailable = 1 WHERE id = ?")->execute([$row["roomId"]]);
    }
    echo json_encode(["success" => true]);
}

// ── MODIFY ────────────────────────────────────────────────────
if ($action === "modify") {
    $resId = intval($body["reservationId"]);

    // Get current reservation
    $cur = $pdo->prepare("SELECT * FROM reservations WHERE id = ?");
    $cur->execute([$resId]);
    $res = $cur->fetch();
    if (!$res) { echo json_encode(["success"=>false,"message"=>"Reservation not found."]); exit(); }

    // Conflict check excluding current reservation
    $conflict = $pdo->prepare(
        "SELECT id FROM reservations
         WHERE roomId = ? AND status = 'CONFIRMED' AND id != ?
         AND checkIn < ? AND checkOut > ?"
    );
    $conflict->execute([$res["roomId"], $resId, $body["checkOut"], $body["checkIn"]]);
    if ($conflict->fetch()) {
        echo json_encode(["success" => false, "message" => "Room is already booked during those dates."]);
        exit();
    }

    $nights = intval(ceil((strtotime($body["checkOut"]) - strtotime($body["checkIn"])) / 86400));
    $price  = $pdo->prepare("SELECT pricePerNight FROM rooms WHERE id = ?");
    $price->execute([$res["roomId"]]);
    $pn     = $price->fetchColumn();
    $total  = $pn * $nights;

    $pdo->prepare(
        "UPDATE reservations
         SET checkIn=?, checkOut=?, checkInTime=?, checkOutTime=?,
             nights=?, totalRoomCost=?, lastModified=NOW()
         WHERE id=?"
    )->execute([
        $body["checkIn"], $body["checkOut"],
        $body["checkInTime"]  ?? "14:00",
        $body["checkOutTime"] ?? "12:00",
        $nights, $total, $resId,
    ]);

    echo json_encode(["success" => true]);
}
?>
