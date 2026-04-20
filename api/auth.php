<?php
/**
 * api/auth.php
 * Handles register and login
 */
require "config.php";

$body   = json_decode(file_get_contents("php://input"), true) ?? [];
$action = $body["action"] ?? $_GET["action"] ?? "";

// ── REGISTER ──────────────────────────────────────────────────
if ($action === "register") {
    $required = ["firstName","lastName","email","contactNumber","username","password"];
    foreach ($required as $field) {
        if (empty($body[$field])) {
            echo json_encode(["success" => false, "message" => "All fields are required."]);
            exit();
        }
    }
    try {
        $stmt = $pdo->prepare(
            "INSERT INTO users (firstName, lastName, email, contactNumber, username, password, role)
             VALUES (?, ?, ?, ?, ?, ?, 'guest')"
        );
        $stmt->execute([
            trim($body["firstName"]),
            trim($body["lastName"]),
            trim($body["email"]),
            trim($body["contactNumber"]),
            trim($body["username"]),
            $body["password"],   // hash with password_hash() in production
        ]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        if ($e->getCode() === "23000") {
            echo json_encode(["success" => false, "message" => "Username or email already exists."]);
        } else {
            echo json_encode(["success" => false, "message" => "Registration failed."]);
        }
    }
}

// ── LOGIN ─────────────────────────────────────────────────────
if ($action === "login") {
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
    $stmt->execute([$body["username"], $body["password"]]);
    $user = $stmt->fetch();
    if ($user) {
        unset($user["password"]);   // never send password back
        echo json_encode(["success" => true, "user" => $user]);
    } else {
        echo json_encode(["success" => false, "message" => "Incorrect username or password."]);
    }
}

// ── GET ALL USERS (admin) ─────────────────────────────────────
if ($action === "getAll") {
    $stmt = $pdo->query("SELECT id, firstName, lastName, email, contactNumber, username, role, createdAt FROM users WHERE role='guest' ORDER BY createdAt DESC");
    echo json_encode($stmt->fetchAll());
}
?>
