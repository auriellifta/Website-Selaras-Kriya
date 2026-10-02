<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('seller');

$active_page = 'dashboard';
$page_title = 'Dashboard';
$seller_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("SELECT * FROM seller_profiles WHERE user_id = ?");
$stmt->execute([$seller_id]);
$profile = $stmt->fetch();

// Statistik
$pesanan_baru = $pdo->prepare("SELECT COUNT(*) as t FROM orders WHERE seller_id = ? AND status = 'baru'");
$pesanan_baru->execute([$seller_id]);
$n_baru = $pesanan_baru->fetch()['t'];

$pendapatan_bulan = $pdo->prepare("SELECT COALESCE(SUM(total_harga),0) as t FROM orders WHERE seller_id = ? AND status != 'dibatalkan' AND MONTH(dibuat_pada) = MONTH(CURDATE()) AND YEAR(dibuat_pada) = YEAR(CURDATE())");
$pendapatan_bulan->execute([$seller_id]);
$total_pendapatan = $pendapatan_bulan->fetch()['t'];

$produk_aktif = $pdo->prepare("SELECT COUNT(*) as t FROM products WHERE seller_id = ? AND status = 'aktif'");
$produk_aktif->execute([$seller_id]);
$n_produk = $produk_aktif->fetch()['t'];

$limbah_total = $pdo->prepare("SELECT COALESCE(SUM(oi.jumlah * p.berat_limbah_kg),0) as t
                                FROM order_items oi
                                JOIN products p ON oi.product_id = p.id
                                JOIN orders o ON oi.order_id = o.id
                                WHERE o.seller_id = ? AND o.status != 'dibatalkan'");
$limbah_total->execute([$seller_id]);
$n_limbah = $limbah_total->fetch()['t'];

// Pesanan terbaru yang perlu direspons
$recent = $pdo->prepare("SELECT o.*, u.nama as nama_buyer FROM orders o JOIN users u ON o.buyer_id = u.id WHERE o.seller_id = ? AND o.status = 'baru' ORDER BY o.dibuat_pada DESC LIMIT 5");
$recent->execute([$seller_id]);
$recent_orders = $recent->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Dashboard Pengrajin — Kaharu</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
<style>
  .order-row { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid var(--pearl-white-deep); }
  .order-row:last-child { border-bottom: none; }
  .mini-thumb { width: 44px; height: 44px; border-radius: 10px; background: linear-gradient(135deg, var(--slate-100), var(--silver-light) 140%); display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
</style>
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/../includes/sidebar.php'; ?>

    <div class="main">
        <?php include __DIR__ . '/../includes/header.php'; ?>

        <div class="page-pad">
            <p class="muted" style="margin-bottom:20px; font-size:15px;">Selamat datang, <strong style="color:var(--navy);"><?= htmlspecialchars($profile['nama_toko'] ?? $_SESSION['nama']) ?></strong> 👋</p>

            <div class="grid grid-4" style="margin-bottom: 28px;">
                <div class="stat-card">
                    <div class="stat-label">Pesanan Baru</div>
                    <div class="stat-value"><?= $n_baru ?></div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Pendapatan Bulan Ini</div>
                    <div class="stat-value">Rp<?= number_format($total_pendapatan,0,',','.') ?></div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Produk Aktif</div>
                    <div class="stat-value"><?= $n_produk ?></div>
                </div>
                <div class="stat-card">
                    <div class="stat-label">Limbah Terserap</div>
                    <div class="stat-value"><?= number_format($n_limbah,1) ?> kg</div>
                </div>
            </div>

            <div class="card">
                <div class="section-head"><h2 style="font-size:17px;">Pesanan Perlu Direspons</h2><span class="muted" style="font-size:13px;"><?= $n_baru ?> baru</span></div>
                <?php if (empty($recent_orders)): ?>
                    <div class="empty-state"><p>Tidak ada pesanan baru saat ini.</p></div>
                <?php else: foreach ($recent_orders as $o): ?>
                    <div class="order-row">
                        <div class="mini-thumb">📦</div>
                        <div style="flex:1;">
                            <div style="font-weight:600; font-size:14px;"><?= htmlspecialchars($o['nama_buyer']) ?> — #<?= htmlspecialchars($o['kode_pesanan']) ?></div>
                            <div class="muted" style="font-size:12.5px;">Rp<?= number_format($o['total_harga'],0,',','.') ?> · <?= date('d M, H:i', strtotime($o['dibuat_pada'])) ?></div>
                        </div>
                        <a href="pesanan.php" class="btn btn-outline btn-sm">Lihat</a>
                    </div>
                <?php endforeach; endif; ?>
            </div>
        </div>
    </div>
</div>

</body>
</html>
