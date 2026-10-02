<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('admin');

$active_page = 'produk';
$page_title = 'Moderasi Produk';

if (isset($_GET['aksi'], $_GET['id'])) {
    $status = $_GET['aksi'] === 'setuju' ? 'aktif' : 'ditolak';
    $stmt = $pdo->prepare("UPDATE products SET status = ? WHERE id = ?");
    $stmt->execute([$status, (int)$_GET['id']]);

    // Kirim notifikasi ke seller
    $p = $pdo->prepare("SELECT seller_id, nama FROM products WHERE id = ?");
    $p->execute([(int)$_GET['id']]);
    $prod = $p->fetch();
    if ($prod) {
        $pesan = $status === 'aktif' ? "Produk '{$prod['nama']}' disetujui dan sudah tayang!" : "Produk '{$prod['nama']}' ditolak admin.";
        $pdo->prepare("INSERT INTO notifications (user_id, pesan) VALUES (?, ?)")->execute([$prod['seller_id'], $pesan]);
    }
    header("Location: moderasi_produk.php");
    exit;
}

$filter = $_GET['filter'] ?? 'menunggu';
$stmt = $pdo->prepare("SELECT p.*, u.nama as nama_seller, sp.asal_pesisir, c.nama as kategori
                        FROM products p
                        JOIN users u ON p.seller_id = u.id
                        LEFT JOIN seller_profiles sp ON sp.user_id = u.id
                        LEFT JOIN categories c ON p.category_id = c.id
                        WHERE p.status = ?
                        ORDER BY p.dibuat_pada DESC");
$stmt->execute([$filter]);
$products = $stmt->fetchAll();

$n_menunggu = $pdo->query("SELECT COUNT(*) as t FROM products WHERE status='menunggu'")->fetch()['t'];
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Moderasi Produk — Kaharu Admin</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
<style>
  .review-card { display: grid; grid-template-columns: 1fr auto; gap: 18px; align-items: center; padding: 18px 0; border-bottom: 1px solid var(--pearl-white-deep); }
  .review-card:last-child { border-bottom: none; }
</style>
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/../includes/sidebar.php'; ?>

    <div class="main">
        <?php include __DIR__ . '/../includes/header.php'; ?>

        <div class="page-pad">
            <div class="section-head">
                <div style="display:flex; gap:10px;">
                    <a href="?filter=menunggu" class="tag <?= $filter==='menunggu'?'active':'' ?>">Menunggu Tinjauan (<?= $n_menunggu ?>)</a>
                    <a href="?filter=aktif" class="tag <?= $filter==='aktif'?'active':'' ?>">Disetujui</a>
                    <a href="?filter=ditolak" class="tag <?= $filter==='ditolak'?'active':'' ?>">Ditolak</a>
                </div>
            </div>

            <div class="card">
                <?php if (empty($products)): ?>
                    <div class="empty-state"><div class="icon">🐚</div><p>Tidak ada produk pada kategori ini.</p></div>
                <?php else: foreach ($products as $p): ?>
                    <div class="review-card">
                        <div>
                            <strong style="font-size:14.5px;"><?= htmlspecialchars($p['nama']) ?></strong>
                            <div class="muted" style="font-size:13px; margin: 3px 0;"><?= htmlspecialchars($p['nama_seller']) ?> · <?= htmlspecialchars($p['asal_pesisir'] ?? '-') ?> · <?= htmlspecialchars($p['kategori'] ?? '-') ?></div>
                            <div class="muted" style="font-size:13px;">Rp<?= number_format($p['harga'],0,',','.') ?> · Diajukan <?= date('d M Y', strtotime($p['dibuat_pada'])) ?></div>
                        </div>
                        <?php if ($p['status'] === 'menunggu'): ?>
                        <div style="display:flex; gap:8px;">
                            <a href="?aksi=setuju&id=<?= $p['id'] ?>" class="btn btn-primary btn-sm">Setujui</a>
                            <a href="?aksi=tolak&id=<?= $p['id'] ?>" class="btn btn-danger btn-sm">Tolak</a>
                        </div>
                        <?php else: ?>
                        <span class="status-pill <?= $p['status']==='aktif'?'status-done':'status-danger' ?>"><?= ucfirst($p['status']) ?></span>
                        <?php endif; ?>
                    </div>
                <?php endforeach; endif; ?>
            </div>
        </div>
    </div>
</div>

</body>
</html>
