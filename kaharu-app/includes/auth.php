<?php
// ============================================
// KAHARU - Auth Helper
// ============================================
session_start();

function require_login() {
    if (!isset($_SESSION['user_id'])) {
        header("Location: /kaharu-app/auth/login.php");
        exit;
    }
}

function require_role($role) {
    require_login();
    if ($_SESSION['role'] !== $role) {
        header("Location: /kaharu-app/auth/login.php?error=akses_ditolak");
        exit;
    }
}

function current_user() {
    return [
        'id'    => $_SESSION['user_id'] ?? null,
        'nama'  => $_SESSION['nama'] ?? null,
        'role'  => $_SESSION['role'] ?? null,
        'email' => $_SESSION['email'] ?? null,
    ];
}

function is_logged_in() {
    return isset($_SESSION['user_id']);
}

function get_notif_count($pdo, $user_id) {
    $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM notifications WHERE user_id = ? AND dibaca = 0");
    $stmt->execute([$user_id]);
    return $stmt->fetch()['total'] ?? 0;
}

function initial_name($nama) {
    return strtoupper(substr(trim($nama), 0, 1));
}
