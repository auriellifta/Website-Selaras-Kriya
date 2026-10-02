<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('admin');

$active_page = 'dashboard';
$page_title = 'Dashboard Admin';

$total_transaksi = $pdo->query("SELECT COUNT(*) as t FROM orders")->fetch()['t'];
$umkm_aktif = $pdo->query("SELECT COUNT(*) as t FROM seller_profiles WHERE status_verifikasi = 'disetujui'")->fetch()['t'];
$gmv_bulan = $pdo->query("SELECT COALESCE(SUM(total_harga),0) as t FROM orders WHERE MONTH(dibuat_pada)=MONTH(CURDATE()) AND YEAR(dibuat_pada)=YEAR(CURDATE())")->fetch()['t'];
$limbah_total = $pdo->query("SELECT COALESCE(SUM(oi.jumlah * p.berat_limbah_kg),0) as t FROM order_items oi JOIN products p ON oi.product_id = p.id")->fetch()['t'];

$menunggu_produk = $pdo->query("SELECT COUNT(*) as t FROM products WHERE status = 'menunggu'")->fetch()['t'];
$menunggu_umkm = $pdo->query("SELECT COUNT(*) as t FROM seller_profiles WHERE status_verifikasi = 'menunggu'")->fetch()['t'];

$sebaran = $pdo->query("SELECT asal_pesisir, COUNT(*) as jumlah FROM seller_profiles WHERE asal_pesisir IS NOT NULL GROUP BY asal_pesisir ORDER BY jumlah DESC")->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dashboard Admin — Kaharu</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
<style>
  .region-row { display: flex; justify-content: space-between; align-items:center; padding: 10px 0; border-bottom: 1px solid var(--pearl-white-deep); font-size: 14px; }
  .region-row:last-child { border-bottom: none; }
</style>
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/../includes/sidebar.php'; ?>

    <div class="main">
        <?php include __DIR__ . '/../includes/header.php'; ?>

        <div class="page-pad">
            <div class="grid grid-4" style="margin-bottom:24px;">
                <div class="stat-card"><div class="stat-label">Total Transaksi</div><div class="stat-value"><?= $total_transaksi ?></div></div>
                <div class="stat-card"><div class="stat-label">UMKM Aktif</div><div class="stat-value"><?= $umkm_aktif ?></div></div>
                <div class="stat-card"><div class="stat-label">GMV Bulan Ini</div><div class="stat-value">Rp<?= number_format($gmv_bulan,0,',','.') ?></div></div>
                <div class="stat-card"><div class="stat-label">Limbah Terserap</div><div class="stat-value"><?= number_format($limbah_total,1) ?> kg</div></div>
            </div>

            <div class="grid grid-2" style="margin-bottom:24px;">
                <div class="card">
                    <div class="section-head"><h2 style="font-size:17px;">Sebaran Pengrajin per Wilayah</h2></div>
                    <?php if (empty($sebaran)): ?>
                        <div class="empty-state"><p>Belum ada data.</p></div>
                    <?php else: foreach ($sebaran as $s): ?>
                        <div class="region-row"><span><?= htmlspecialchars($s['asal_pesisir']) ?></span><strong><?= $s['jumlah'] ?> pengrajin</strong></div>
                    <?php endforeach; endif; ?>
                </div>

                <div class="card">
                    <div class="section-head"><h2 style="font-size:17px;">Perlu Perhatian</h2></div>
                    <div class="region-row">
                        <span>🐚 <?= $menunggu_produk ?> produk baru menunggu moderasi</span>
                        <a href="moderasi_produk.php" class="btn btn-outline btn-sm">Tinjau</a>
                    </div>
                    <div class="region-row">
                        <span>🏪 <?= $menunggu_umkm ?> pendaftaran UMKM menunggu verifikasi</span>
                        <a href="umkm.php" class="btn btn-outline btn-sm">Tinjau</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
</html>
