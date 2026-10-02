<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('seller');

$active_page = 'produk';
$page_title = 'Produk Saya';
$seller_id = $_SESSION['user_id'];

// Nonaktifkan / aktifkan produk
if (isset($_GET['toggle'])) {
    $pid = (int)$_GET['toggle'];
    $check = $pdo->prepare("SELECT status FROM products WHERE id = ? AND seller_id = ?");
    $check->execute([$pid, $seller_id]);
    $row = $check->fetch();
    if ($row) {
        $new_status = $row['status'] === 'aktif' ? 'nonaktif' : 'aktif';
        $pdo->prepare("UPDATE products SET status = ? WHERE id = ? AND seller_id = ?")->execute([$new_status, $pid, $seller_id]);
    }
    header("Location: produk.php");
    exit;
}

// Hapus produk
if (isset($_GET['hapus'])) {
    $pdo->prepare("DELETE FROM products WHERE id = ? AND seller_id = ?")->execute([(int)$_GET['hapus'], $seller_id]);
    header("Location: produk.php");
    exit;
}

$stmt = $pdo->prepare("SELECT p.*, c.nama as kategori_nama,
                        (SELECT COUNT(*) FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE oi.product_id = p.id AND o.status = 'selesai') as terjual
                        FROM products p
                        LEFT JOIN categories c ON p.category_id = c.id
                        WHERE p.seller_id = ?
                        ORDER BY p.dibuat_pada DESC");
$stmt->execute([$seller_id]);
$products = $stmt->fetchAll();

$status_label = [
    'aktif' => ['Aktif', 'status-done'],
    'menunggu' => ['Menunggu Review Admin', 'status-review'],
    'ditolak' => ['Ditolak', 'status-danger'],
    'nonaktif' => ['Nonaktif', 'status-pending'],
    'draft' => ['Draf', 'status-pending'],
];
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Produk Saya — Kaharu</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/../includes/sidebar.php'; ?>

    <div class="main">
        <?php include __DIR__ . '/../includes/header.php'; ?>

        <div class="page-pad">
            <div class="section-head">
                <div><strong style="font-size:15px;">Total: <?= count($products) ?> produk</strong></div>
                <a href="tambah_produk.php" class="btn btn-primary btn-sm">+ Tambah Produk</a>
            </div>

            <?php if (empty($products)): ?>
                <div class="card empty-state">
                    <div class="icon">🐚</div>
                    <p>Belum ada produk. Yuk tambahkan produk pertamamu.</p>
                    <a href="tambah_produk.php" class="btn btn-primary" style="margin-top:16px;">+ Tambah Produk</a>
                </div>
            <?php else: ?>
            <div class="card" style="padding:0;">
                <table>
                    <tr><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Status</th><th>Terjual</th><th></th></tr>
                    <?php foreach ($products as $p): [$label, $class] = $status_label[$p['status']]; ?>
                    <tr>
                        <td><?= htmlspecialchars($p['nama']) ?></td>
                        <td><?= htmlspecialchars($p['kategori_nama'] ?? '-') ?></td>
                        <td>Rp<?= number_format($p['harga'],0,',','.') ?></td>
                        <td><?= $p['stok'] ?></td>
                        <td><span class="status-pill <?= $class ?>"><?= $label ?></span></td>
                        <td><?= $p['terjual'] ?></td>
                        <td style="white-space:nowrap;">
                            <a href="tambah_produk.php?id=<?= $p['id'] ?>" class="btn btn-ghost btn-sm">Edit</a>
                            <?php if (in_array($p['status'], ['aktif','nonaktif'])): ?>
                            <a href="?toggle=<?= $p['id'] ?>" class="btn btn-ghost btn-sm"><?= $p['status'] === 'aktif' ? 'Nonaktifkan' : 'Aktifkan' ?></a>
                            <?php endif; ?>
                            <a href="?hapus=<?= $p['id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Hapus produk ini?')">Hapus</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </table>
            </div>
            <?php endif; ?>
        </div>
    </div>
</div>

</body>
</html>
