<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('buyer');

$active_page = 'katalog';
$page_title = 'Detail Produk';
$id = (int)($_GET['id'] ?? 0);

$stmt = $pdo->prepare("SELECT p.*, u.nama as nama_seller, u.id as seller_id, sp.asal_pesisir, sp.cerita, sp.nama_toko
                        FROM products p
                        JOIN users u ON p.seller_id = u.id
                        LEFT JOIN seller_profiles sp ON sp.user_id = u.id
                        WHERE p.id = ? AND p.status = 'aktif'");
$stmt->execute([$id]);
$produk = $stmt->fetch();

if (!$produk) {
    header("Location: katalog.php");
    exit;
}

$opt_stmt = $pdo->prepare("SELECT * FROM product_options WHERE product_id = ?");
$opt_stmt->execute([$id]);
$options = $opt_stmt->fetchAll();

$msg = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jumlah = max(1, (int)($_POST['jumlah'] ?? 1));
    $opsi_terpilih = [];
    $biaya_tambahan = 0;

    foreach ($options as $opt) {
        $key = 'opsi_' . $opt['id'];
        if (!empty($_POST[$key])) {
            $opsi_terpilih[] = $opt['nama_opsi'] . ': ' . $_POST[$key];
            if ((float)$opt['biaya_tambahan'] > 0) {
                $biaya_tambahan += (float)$opt['biaya_tambahan'];
            }
        }
    }
    $opsi_str = implode(', ', $opsi_terpilih);

    $ins = $pdo->prepare("INSERT INTO cart_items (buyer_id, product_id, opsi_dipilih, biaya_tambahan_opsi, jumlah) VALUES (?, ?, ?, ?, ?)");
    $ins->execute([$_SESSION['user_id'], $id, $opsi_str, $biaya_tambahan, $jumlah]);

    header("Location: keranjang.php?added=1");
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= htmlspecialchars($produk['nama']) ?> — Kaharu</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
<style>
  .detail-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; max-width: 1280px; margin: 0 auto; padding: 24px 32px 64px; }
  .gallery-main { aspect-ratio: 1; background: linear-gradient(135deg, var(--slate-100), var(--silver-light) 140%); border-radius: var(--radius-lg); display:flex; align-items:center; justify-content:center; font-size: 110px; margin-bottom: 14px; }
  .price-big { font-family: var(--font-display); font-size: 32px; color: var(--navy); font-weight: 700; }
  .option-group { margin: 22px 0; }
  .option-group h4 { font-size: 13.5px; margin-bottom: 10px; font-weight:600; }
  .impact-box { background: var(--success-bg); border-radius: 10px; padding: 16px 18px; margin-top: 18px; display: flex; gap: 12px; align-items: flex-start; }
  .story-card { display: flex; gap: 14px; align-items: center; background: var(--slate-100); border-radius: 12px; padding: 16px; margin-top: 20px; }
</style>
</head>
<body>

<?php include __DIR__ . '/../includes/header.php'; ?>

<div class="detail-layout">
    <div>
        <div class="gallery-main">🐚</div>
    </div>

    <div>
        <div class="product-origin"><?= htmlspecialchars($produk['asal_pesisir'] ?? '') ?> · DIBUAT OLEH <?= htmlspecialchars($produk['nama_seller']) ?></div>
        <h1 style="font-size: 28px; margin: 10px 0 8px;"><?= htmlspecialchars($produk['nama']) ?></h1>
        <p class="muted"><?= htmlspecialchars($produk['deskripsi']) ?></p>

        <div class="price-big" style="margin-top:14px;">Rp<?= number_format($produk['harga'], 0, ',', '.') ?></div>

        <form method="POST">
            <?php foreach ($options as $opt): ?>
                <div class="option-group">
                    <h4><?= htmlspecialchars($opt['nama_opsi']) ?><?php if ($opt['biaya_tambahan'] > 0): ?> <span class="muted">(+Rp<?= number_format($opt['biaya_tambahan'],0,',','.') ?>)</span><?php endif; ?></h4>
                    <select name="opsi_<?= $opt['id'] ?>" style="width:100%; padding:10px 12px; border:1.5px solid var(--slate-300); border-radius:8px;">
                        <?php foreach (explode(',', $opt['pilihan']) as $pilihan): ?>
                            <option value="<?= htmlspecialchars(trim($pilihan)) ?>"><?= htmlspecialchars(trim($pilihan)) ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            <?php endforeach; ?>

            <div class="field" style="max-width:140px;">
                <label>Jumlah</label>
                <input type="number" name="jumlah" value="1" min="1" max="<?= $produk['stok'] ?>">
            </div>
            <p class="muted" style="font-size:12.5px; margin:-10px 0 18px;">Stok tersedia: <?= $produk['stok'] ?></p>

            <button type="submit" class="btn btn-primary btn-block">Tambah ke Keranjang</button>
        </form>

        <div class="impact-box">
            <span style="font-size:20px;">🌊</span>
            <div>
                <strong style="font-size:14px;"><?= $produk['berat_limbah_kg'] ?> kg limbah kerang terserap</strong>
                <p class="muted" style="font-size:13px; margin-top:2px;">Pembelian ini turut mendanai pengumpulan limbah kerang di <?= htmlspecialchars($produk['asal_pesisir'] ?? 'pesisir') ?>.</p>
            </div>
        </div>

        <?php if ($produk['cerita']): ?>
        <div class="story-card">
            <div style="width:48px;height:48px;border-radius:50%;background:var(--navy);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;">👩‍🎨</div>
            <div>
                <strong style="font-size:14px;"><?= htmlspecialchars($produk['nama_toko']) ?></strong>
                <p class="muted" style="font-size:13px; margin-top:2px;"><?= htmlspecialchars($produk['cerita']) ?></p>
            </div>
        </div>
        <?php endif; ?>
    </div>
</div>

</body>
</html>
