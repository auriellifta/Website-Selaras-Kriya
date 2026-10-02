<?php
// ============================================
// KAHARU - Koneksi Database (WAMPP / MySQL)
// ============================================

$DB_HOST = 'localhost';
$DB_NAME = 'kaharu_db';
$DB_USER = 'root';       // default WAMPP
$DB_PASS = '';           // default WAMPP kosong

try {
    $pdo = new PDO(
        "mysql:host=$DB_HOST;dbname=$DB_NAME;charset=utf8mb4",
        $DB_USER,
        $DB_PASS,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]
    );
} catch (PDOException $e) {
    die("Koneksi database gagal: " . $e->getMessage() . "<br><br>Pastikan: 
        <ul>
        <li>WAMPP sudah menyala (ikon hijau)</li>
        <li>Database 'kaharu_db' sudah diimport lewat phpMyAdmin</li>
        <li>Nama database, user, password di config/database.php sudah sesuai</li>
        </ul>");
}
