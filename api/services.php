<?php
/**
 * api/services.php
 * Create, get, modify, update status for service requests
 */
require "config.php";

$body   = json_decode(file_get_contents("php://input"), true) ?? [];
$action = $body["action"] ?? $_GET["action"] ?? "get";

// ── GET FOR USER ──────────────────────────────────────────────
if ($action === "get") {
    $userId = intval($_GET["userId"] ?? $body["userId"]);
    $stmt   = $pdo->prepare(
        "SELECT s.*, CONCAT(u.firstName,' ',u.lastName) AS guestName
         FROM services s JOIN users u ON s.userId = u.id
         WHERE s.userId = ? ORDER BY s.createdAt DESC"
    );
    $stmt->execute([$userId]);
    echo json_encode($stmt->fetchAll());
}

// ── GET ALL (admin) ───────────────────────────────────────────
if ($action === "getAll") {
    $stmt = $pdo->query(
        "SELECT s.*, CONCAT(u.firstName,' ',u.lastName) AS guestName
         FROM services s JOIN users u ON s.userId = u.id
         ORDER BY s.createdAt DESC"
    );
    echo json_encode($stmt->fetchAll());
}

// ── CREATE ────────────────────────────────────────────────────
if ($action === "create") {
    $stmt = $pdo->prepare(
        "INSERT INTO services (userId, serviceName, serviceId, cost, scheduledDate, scheduledTime, status)
         VALUES (?, ?, ?, ?, ?, ?, 'PENDING')"
    );
    $stmt->execute([
        intval($body["userId"]),
        $body["serviceName"],
        $body["serviceId"],
        floatval($body["cost"]),
        $body["date"],
        $body["time"] ?? "09:00",
    ]);
    echo json_encode(["success" => true, "id" => $pdo->lastInsertId()]);
}

// ── MODIFY (date and time only) ───────────────────────────────
if ($action === "modify") {
    $svcId = intval($body["serviceId"]);
    $check = $pdo->prepare("SELECT status FROM services WHERE id = ?");
    $check->execute([$svcId]);
    $row   = $check->fetch();
    if (!$row || $row["status"] !== "PENDING") {
        echo json_encode(["success" => false, "message" => "Only PENDING services can be modified."]);
        exit();
    }
    $pdo->prepare(
        "UPDATE services SET scheduledDate=?, scheduledTime=?, lastModified=NOW() WHERE id=?"
    )->execute([$body["date"], $body["time"] ?? "09:00", $svcId]);
    echo json_encode(["success" => true]);
}

// ── UPDATE STATUS (admin) ─────────────────────────────────────
if ($action === "updateStatus") {
    $allowed = ["PENDING", "IN_PROGRESS", "COMPLETED"];
    if (!in_array($body["status"], $allowed)) {
        echo json_encode(["success" => false, "message" => "Invalid status."]);
        exit();
    }
    $pdo->prepare("UPDATE services SET status=?, lastModified=NOW() WHERE id=?")
        ->execute([$body["status"], intval($body["serviceId"])]);
    echo json_encode(["success" => true]);
}
?>
