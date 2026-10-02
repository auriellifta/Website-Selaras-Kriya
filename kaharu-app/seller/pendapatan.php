<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('seller');

$active_page = 'pendapatan';
$page_title = 'Pendapatan';
$seller_id = $_SESSION['user_id'];
$FEE_PERSEN = 8;

$bulan_ini = $pdo->prepare("SELECT COALESCE(SUM(total_harga),0) as t FROM orders WHERE seller_id = ? AND status = 'selesai' AND MONTH(dibuat_pada)=MONTH(CURDATE()) AND YEAR(dibuat_pada)=YEAR(CURDATE())");
$bulan_ini->execute([$seller_id]);
$total_bulan = $bulan_ini->fetch()['t'];
$fee = $total_bulan * ($FEE_PERSEN / 100);
$bersih = $total_bulan - $fee;

$riwayat = $pdo->prepare("SELECT o.*, GROUP_CONCAT(p.nama SEPARATOR ', ') as produk_list
                           FROM orders o
                           JOIN order_items oi ON oi.order_id = o.id
                           JOIN products p ON oi.product_id = p.id
                           WHERE o.seller_id = ? AND o.status = 'selesai'
                           GROUP BY o.id
                           ORDER BY o.dibuat_pada DESC
                           LIMIT 20");
$riwayat->execute([$seller_id]);
$transaksi = $riwayat->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pendapatan — Kaharu</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/../includes/sidebar.php'; ?>

    <div class="main">
        <?php include __DIR__ . '/../includes/header.php'; ?>

        <div class="page-pad">
            <div class="grid grid-3" style="margin-bottom:24px;">
                <div class="stat-card"><div class="stat-label">Total Bulan Ini</div><div class="stat-value">Rp<?= number_format($total_bulan,0,',','.') ?></div></div>
                <div class="stat-card"><div class="stat-label">Fee Platform (<?= $FEE_PERSEN ?>%)</div><div class="stat-value">Rp<?= number_format($fee,0,',','.') ?></div></div>
                <div class="stat-card"><div class="stat-label">Pendapatan Bersih</div><div class="stat-value">Rp<?= number_format($bersih,0,',','.') ?></div></div>
            </div>

            <div class="card" style="padding:0;">
                <div class="section-head" style="padding:20px 24px 0;"><h2 style="font-size:17px;">Riwayat Transaksi Selesai</h2></div>
                <?php if (empty($transaksi)): ?>
                    <div class="empty-state"><p>Belum ada transaksi selesai.</p></div>
                <?php else: ?>
                <table>
                    <tr><th>Tanggal</th><th>Pesanan</th><th>Produk</th><th>Jumlah</th><th>Fee</th><th>Bersih</th></tr>
                    <?php foreach ($transaksi as $t): $f = $t['total_harga'] * ($FEE_PERSEN/100); ?>
                    <tr>
                        <td><?= date('d M Y', strtotime($t['dibuat_pada'])) ?></td>
                        <td>#<?= htmlspecialchars($t['kode_pesanan']) ?></td>
                        <td><?= htmlspecialchars($t['produk_list']) ?></td>
                        <td>Rp<?= number_format($t['total_harga'],0,',','.') ?></td>
                        <td>Rp<?= number_format($f,0,',','.') ?></td>
                        <td>Rp<?= number_format($t['total_harga']-$f,0,',','.') ?></td>
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
