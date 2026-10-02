<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('admin');

$active_page = 'transaksi';
$page_title = 'Monitoring Transaksi';

$filter = $_GET['filter'] ?? 'semua';
$sql = "SELECT o.*, ub.nama as nama_buyer, us.nama as nama_seller
        FROM orders o
        JOIN users ub ON o.buyer_id = ub.id
        JOIN users us ON o.seller_id = us.id";
$params = [];
if ($filter !== 'semua') {
    $sql .= " WHERE o.status = ?";
    $params[] = $filter;
}
$sql .= " ORDER BY o.dibuat_pada DESC LIMIT 100";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$orders = $stmt->fetchAll();

$status_class = [
    'baru' => 'status-pending',
    'diproses' => 'status-progress',
    'dikirim' => 'status-progress',
    'selesai' => 'status-done',
    'dibatalkan' => 'status-danger',
];
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Transaksi — Kaharu Admin</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/../includes/sidebar.php'; ?>

    <div class="main">
        <?php include __DIR__ . '/../includes/header.php'; ?>

        <div class="page-pad">
            <div class="section-head">
                <div style="display:flex; gap:10px;">
                    <a href="?filter=semua" class="tag <?= $filter==='semua'?'active':'' ?>">Semua</a>
                    <a href="?filter=baru" class="tag <?= $filter==='baru'?'active':'' ?>">Baru</a>
                    <a href="?filter=diproses" class="tag <?= $filter==='diproses'?'active':'' ?>">Diproses</a>
                    <a href="?filter=selesai" class="tag <?= $filter==='selesai'?'active':'' ?>">Selesai</a>
                    <a href="?filter=dibatalkan" class="tag <?= $filter==='dibatalkan'?'active':'' ?>">Dibatalkan</a>
                </div>
            </div>

            <div class="card" style="padding:0;">
                <?php if (empty($orders)): ?>
                    <div class="empty-state"><p>Belum ada transaksi.</p></div>
                <?php else: ?>
                <table>
                    <tr><th>ID Pesanan</th><th>Pembeli</th><th>Pengrajin</th><th>Nilai</th><th>Tanggal</th><th>Status</th></tr>
                    <?php foreach ($orders as $o): ?>
                    <tr>
                        <td>#<?= htmlspecialchars($o['kode_pesanan']) ?></td>
                        <td><?= htmlspecialchars($o['nama_buyer']) ?></td>
                        <td><?= htmlspecialchars($o['nama_seller']) ?></td>
                        <td>Rp<?= number_format($o['total_harga'],0,',','.') ?></td>
                        <td><?= date('d M Y', strtotime($o['dibuat_pada'])) ?></td>
                        <td><span class="status-pill <?= $status_class[$o['status']] ?>"><?= ucfirst($o['status']) ?></span></td>
                    </tr>
                    <?php endforeach; ?>
                </table>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

</body>
</html>
