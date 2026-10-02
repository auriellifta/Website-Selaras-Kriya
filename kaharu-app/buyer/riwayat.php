<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('buyer');

$active_page = 'riwayat';
$page_title = 'Riwayat Pesanan';
$buyer_id = $_SESSION['user_id'];

$stmt = $pdo->prepare("SELECT o.*, u.nama as nama_seller, u.no_whatsapp, sp.asal_pesisir
                        FROM orders o
                        JOIN users u ON o.seller_id = u.id
                        LEFT JOIN seller_profiles sp ON sp.user_id = u.id
                        WHERE o.buyer_id = ?
                        ORDER BY o.dibuat_pada DESC");
$stmt->execute([$buyer_id]);
$orders = $stmt->fetchAll();

// Ambil item per order
$items_by_order = [];
if ($orders) {
    $order_ids = array_column($orders, 'id');
    $in = implode(',', array_fill(0, count($order_ids), '?'));
    $item_stmt = $pdo->prepare("SELECT oi.*, p.nama as nama_produk FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id IN ($in)");
    $item_stmt->execute($order_ids);
    foreach ($item_stmt->fetchAll() as $it) {
        $items_by_order[$it['order_id']][] = $it;
    }
}

$status_label = [
    'baru' => ['Menunggu Konfirmasi', 'status-pending'],
    'diproses' => ['Sedang Diproduksi', 'status-progress'],
    'dikirim' => ['Dikirim', 'status-progress'],
    'selesai' => ['Selesai', 'status-done'],
    'dibatalkan' => ['Dibatalkan', 'status-danger'],
];
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Riwayat Pesanan — Kaharu</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
<style>
  .layout { max-width: 900px; margin: 0 auto; padding: 32px; }
  .order-card { background: white; border: 1px solid var(--slate-100); border-radius: var(--radius-lg); margin-bottom: 16px; overflow: hidden; box-shadow: var(--shadow-sm); }
  .order-head { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: var(--slate-100); }
  .order-body { padding: 16px 20px; }
  .item-line { display:flex; justify-content:space-between; font-size:13.5px; padding: 4px 0; color: var(--slate-700); }
  .order-footer { padding: 14px 20px; border-top: 1px solid var(--pearl-white-deep); display: flex; justify-content: space-between; align-items: center; }
</style>
</head>
<body>

<?php include __DIR__ . '/../includes/header.php'; ?>

<div class="layout">
    <h2 style="margin-bottom: 22px; font-size:24px;">Riwayat Pesanan</h2>

    <?php if (empty($orders)): ?>
        <div class="card empty-state">
            <div class="icon">📦</div>
            <p>Belum ada pesanan.</p>
            <a href="katalog.php" class="btn btn-primary" style="margin-top:16px;">Mulai Belanja</a>
        </div>
    <?php else: ?>
        <?php foreach ($orders as $o): 
            [$label, $class] = $status_label[$o['status']];
            $pesan_ulang = "Halo, saya ingin menanyakan status pesanan #{$o['kode_pesanan']}.";
            $no_wa_clean = preg_replace('/[^0-9]/', '', $o['no_whatsapp']);
            $link_wa = "https://wa.me/{$no_wa_clean}?text=" . urlencode($pesan_ulang);
        ?>
        <div class="order-card">
            <div class="order-head">
                <div>
                    <strong style="font-size:14px;">Pesanan #<?= htmlspecialchars($o['kode_pesanan']) ?></strong>
                    <div class="muted" style="font-size:12.5px;"><?= htmlspecialchars($o['nama_seller']) ?> · <?= htmlspecialchars($o['asal_pesisir'] ?? '') ?> · <?= date('d M Y', strtotime($o['dibuat_pada'])) ?></div>
                </div>
                <span class="status-pill <?= $class ?>"><?= $label ?></span>
            </div>
            <div class="order-body">
                <?php foreach (($items_by_order[$o['id']] ?? []) as $it): ?>
                    <div class="item-line">
                        <span><?= htmlspecialchars($it['nama_produk']) ?> <?= $it['opsi_dipilih'] ? '('.htmlspecialchars($it['opsi_dipilih']).')' : '' ?> x<?= $it['jumlah'] ?></span>
                        <strong>Rp<?= number_format($it['subtotal'],0,',','.') ?></strong>
                    </div>
                <?php endforeach; ?>
            </div>
            <div class="order-footer">
                <span class="muted" style="font-size:12.5px;">Total: <strong style="color:var(--navy);">Rp<?= number_format($o['total_harga'],0,',','.') ?></strong></span>
                <a href="<?= $link_wa ?>" target="_blank" class="btn btn-whatsapp btn-sm">💬 Chat Pengrajin</a>
            </div>
        </div>
        <?php endforeach; ?>
    <?php endif; ?>
</div>

</body>
</html>
