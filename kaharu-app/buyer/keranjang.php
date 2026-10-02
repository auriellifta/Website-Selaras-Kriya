<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('buyer');

$active_page = 'katalog';
$page_title = 'Keranjang';
$buyer_id = $_SESSION['user_id'];

// Hapus item
if (isset($_GET['hapus'])) {
    $stmt = $pdo->prepare("DELETE FROM cart_items WHERE id = ? AND buyer_id = ?");
    $stmt->execute([(int)$_GET['hapus'], $buyer_id]);
    header("Location: keranjang.php");
    exit;
}

// Update jumlah
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_qty'])) {
    foreach ($_POST['qty'] as $cart_id => $qty) {
        $qty = max(1, (int)$qty);
        $stmt = $pdo->prepare("UPDATE cart_items SET jumlah = ? WHERE id = ? AND buyer_id = ?");
        $stmt->execute([$qty, (int)$cart_id, $buyer_id]);
    }
    header("Location: keranjang.php");
    exit;
}

$stmt = $pdo->prepare("SELECT ci.*, p.nama, p.harga, p.seller_id, u.nama as nama_seller, sp.asal_pesisir
                        FROM cart_items ci
                        JOIN products p ON ci.product_id = p.id
                        JOIN users u ON p.seller_id = u.id
                        LEFT JOIN seller_profiles sp ON sp.user_id = u.id
                        WHERE ci.buyer_id = ?
                        ORDER BY ci.ditambahkan_pada DESC");
$stmt->execute([$buyer_id]);
$items = $stmt->fetchAll();

$total = 0;
$sellers_involved = [];
foreach ($items as $it) {
    $subtotal = ($it['harga'] + $it['biaya_tambahan_opsi']) * $it['jumlah'];
    $total += $subtotal;
    $sellers_involved[$it['seller_id']] = true;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Keranjang — Kaharu</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
<style>
  .layout { display: grid; grid-template-columns: 1fr 360px; gap: 32px; max-width: 1100px; margin: 0 auto; padding: 40px 32px; }
  .cart-item { display: flex; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--pearl-white-deep); align-items: center; }
  .cart-item:last-child { border-bottom: none; }
  .cart-thumb { width: 76px; height: 76px; border-radius: 12px; background: linear-gradient(135deg, var(--slate-100), var(--silver-light) 140%); display:flex; align-items:center; justify-content:center; font-size: 30px; flex-shrink: 0; }
  .summary-row { display: flex; justify-content: space-between; font-size: 14px; padding: 8px 0; }
  .summary-row.total { font-weight: 700; font-size: 17px; border-top: 1px solid var(--slate-100); padding-top: 14px; margin-top: 6px; }
  .qty-input { width: 55px; padding: 6px 8px; border:1.5px solid var(--slate-300); border-radius: 6px; text-align:center; }
</style>
</head>
<body>

<?php include __DIR__ . '/../includes/header.php'; ?>

<?php if (isset($_GET['added'])): ?>
<div style="max-width:1100px; margin: 20px auto 0; padding: 0 32px;">
    <div class="success-msg">✓ Produk berhasil ditambahkan ke keranjang.</div>
</div>
<?php endif; ?>

<div class="layout">
    <div>
        <h2 style="margin-bottom: 20px; font-size:24px;">Keranjang Belanja (<?= count($items) ?>)</h2>

        <?php if (empty($items)): ?>
            <div class="card empty-state">
                <div class="icon">🛍️</div>
                <p>Keranjangmu masih kosong.</p>
                <a href="katalog.php" class="btn btn-primary" style="margin-top:16px;">Mulai Belanja</a>
            </div>
        <?php else: ?>
        <form method="POST">
            <div class="card">
                <?php foreach ($items as $it): ?>
                    <div class="cart-item">
                        <div class="cart-thumb">🐚</div>
                        <div style="flex:1;">
                            <div style="font-weight:600; font-size:15px;"><?= htmlspecialchars($it['nama']) ?></div>
                            <?php if ($it['opsi_dipilih']): ?><div class="muted" style="font-size:12.5px;"><?= htmlspecialchars($it['opsi_dipilih']) ?></div><?php endif; ?>
                            <div class="muted" style="font-size:12.5px; color:var(--info); font-weight:600; margin-top:4px;"><?= htmlspecialchars($it['nama_seller']) ?> · <?= htmlspecialchars($it['asal_pesisir'] ?? '') ?></div>
                        </div>
                        <input type="number" class="qty-input" name="qty[<?= $it['id'] ?>]" value="<?= $it['jumlah'] ?>" min="1">
                        <div style="font-family:var(--font-display); font-weight:700; color:var(--navy); min-width:110px; text-align:right;">
                            Rp<?= number_format(($it['harga'] + $it['biaya_tambahan_opsi']) * $it['jumlah'], 0, ',', '.') ?>
                        </div>
                        <a href="?hapus=<?= $it['id'] ?>" class="btn btn-ghost btn-sm" onclick="return confirm('Hapus item ini?')">✕</a>
                    </div>
                <?php endforeach; ?>
            </div>
            <button type="submit" name="update_qty" class="btn btn-outline btn-sm" style="margin-top:14px;">Perbarui Jumlah</button>
        </form>

        <?php if (count($sellers_involved) > 1): ?>
        <div class="field-hint" style="margin-top:14px; padding: 14px; background: var(--warning-bg); border-radius: 10px; color: var(--warning);">
            ⚠️ Produk berasal dari <?= count($sellers_involved) ?> pengrajin berbeda. Pesananmu akan dipecah menjadi <?= count($sellers_involved) ?> percakapan WhatsApp terpisah.
        </div>
        <?php endif; ?>
        <?php endif; ?>
    </div>

    <div>
        <div class="card">
            <h3 style="font-size:16px; margin-bottom:16px;">Ringkasan Pesanan</h3>
            <div class="summary-row"><span>Subtotal (<?= count($items) ?> barang)</span><span>Rp<?= number_format($total,0,',','.') ?></span></div>
            <div class="summary-row"><span>Ongkir & pembayaran</span><span class="muted">Disepakati via WhatsApp</span></div>
            <div class="summary-row total"><span>Total</span><span>Rp<?= number_format($total,0,',','.') ?></span></div>
            <?php if (!empty($items)): ?>
            <a href="checkout.php" class="btn btn-primary btn-block" style="margin-top:18px;">Lanjut ke Checkout</a>
            <?php endif; ?>
            <a href="katalog.php" class="btn btn-ghost btn-block" style="margin-top:6px;">Lanjut Belanja</a>
        </div>
    </div>
</div>

</body>
</html>
