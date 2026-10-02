<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('buyer');

$active_page = 'katalog';
$page_title = 'Katalog Produk';

$cat_filter = $_GET['kategori'] ?? '';
$search = trim($_GET['q'] ?? '');

$sql = "SELECT p.*, u.nama as nama_seller, sp.asal_pesisir, c.nama as kategori_nama
        FROM products p
        JOIN users u ON p.seller_id = u.id
        LEFT JOIN seller_profiles sp ON sp.user_id = u.id
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.status = 'aktif'";
$params = [];

if ($cat_filter !== '') {
    $sql .= " AND c.nama = ?";
    $params[] = $cat_filter;
}
if ($search !== '') {
    $sql .= " AND p.nama LIKE ?";
    $params[] = "%$search%";
}
$sql .= " ORDER BY p.dibuat_pada DESC";

$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$products = $stmt->fetchAll();

$categories = $pdo->query("SELECT nama FROM categories ORDER BY nama")->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Katalog — Kaharu</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
<style>
  .page-container { max-width: 1280px; margin: 0 auto; padding: 32px; }
  .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 22px; gap: 16px; flex-wrap: wrap; }
  .search-bar { display:flex; align-items:center; gap:10px; background:white; border:1.5px solid var(--slate-300); border-radius: 100px; padding: 10px 18px; flex:1; max-width: 340px; }
  .search-bar input { border: none; outline: none; font-size: 14px; width: 100%; font-family: var(--font-body); }
  .cat-strip { display: flex; gap: 10px; overflow-x: auto; margin-bottom: 24px; }
</style>
</head>
<body>

<?php include __DIR__ . '/../includes/header.php'; ?>

<div class="page-container">
    <form class="toolbar" method="GET">
        <div class="search-bar">
            🔍 <input type="text" name="q" value="<?= htmlspecialchars($search) ?>" placeholder="Cari produk kerang...">
        </div>
        <div><strong><?= count($products) ?></strong> <span class="muted">produk ditemukan</span></div>
    </form>

    <div class="cat-strip">
        <a href="katalog.php" class="tag <?= $cat_filter === '' ? 'active' : '' ?>">Semua</a>
        <?php foreach ($categories as $c): ?>
            <a href="katalog.php?kategori=<?= urlencode($c['nama']) ?>" class="tag <?= $cat_filter === $c['nama'] ? 'active' : '' ?>"><?= htmlspecialchars($c['nama']) ?></a>
        <?php endforeach; ?>
    </div>

    <?php if (empty($products)): ?>
        <div class="empty-state">
            <div class="icon">🐚</div>
            <p>Belum ada produk yang cocok. Coba kata kunci atau kategori lain.</p>
        </div>
    <?php else: ?>
        <div class="grid grid-4">
            <?php foreach ($products as $p): ?>
                <a href="detail_produk.php?id=<?= $p['id'] ?>" class="product-card">
                    <div class="product-img">🐚</div>
                    <div class="product-body">
                        <div class="product-origin"><?= htmlspecialchars($p['asal_pesisir'] ?? '-') ?></div>
                        <div class="product-name"><?= htmlspecialchars($p['nama']) ?></div>
                        <div class="product-price">Rp<?= number_format($p['harga'], 0, ',', '.') ?></div>
                        <span class="impact-chip">🌊 <?= $p['berat_limbah_kg'] ?> kg limbah</span>
                    </div>
                </a>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>
</div>

</body>
</html>
