<?php
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/auth.php';

if (is_logged_in()) {
    $role = $_SESSION['role'];
    if ($role === 'admin') header("Location: /kaharu-app/admin/dashboard.php");
    elseif ($role === 'seller') header("Location: /kaharu-app/seller/dashboard.php");
    else header("Location: /kaharu-app/buyer/katalog.php");
} else {
    header("Location: ../index.php");
}
exit;
