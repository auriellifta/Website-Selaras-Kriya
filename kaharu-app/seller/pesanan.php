<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('seller');

$active_page = 'pesanan';
$page_title = 'Pesanan Masuk';
$seller_id = $_SESSION['user_id'];

// Update status
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['order_id'])) {
    $status_baru = $_POST['status'];
    $allowed = ['baru','diproses','dikirim','selesai','dibatalkan'];
    if (in_array($status_baru, $allowed)) {
        $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ? AND seller_id = ?");
        $stmt->execute([$status_baru, (int)$_POST['order_id'], $seller_id]);
    }
    header("Location: pesanan.php?filter=" . ($_GET['filter'] ?? 'baru'));
    exit;
}

$filter = $_GET['filter'] ?? 'baru';
$sql = "SELECT o.*, u.nama as nama_buyer, u.no_whatsapp as wa_buyer FROM orders o JOIN users u ON o.buyer_id = u.id WHERE o.seller_id = ?";
$params = [$seller_id];
if ($filter !== 'semua') {
    $sql .= " AND o.status = ?";
    $params[] = $filter;
}
$sql .= " ORDER BY o.dibuat_pada DESC";
$stmt = $pdo->prepare($sql);
$stmt->execute($params);
$orders = $stmt->fetchAll();

// Hitung jumlah per status untuk tab
$counts = [];
foreach (['baru','diproses','dikirim','selesai'] as $s) {
    $c = $pdo->prepare("SELECT COUNT(*) as t FROM orders WHERE seller_id = ? AND status = ?");
    $c->execute([$seller_id, $s]);
    $counts[$s] = $c->fetch()['t'];
}

// Item per order
$items_by_order = [];
if ($orders) {
    $ids = array_column($orders, 'id');
    $in = implode(',', array_fill(0, count($ids), '?'));
    $item_stmt = $pdo->prepare("SELECT oi.*, p.nama as nama_produk FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id IN ($in)");
    $item_stmt->execute($ids);
    foreach ($item_stmt->fetchAll() as $it) {
        $items_by_order[$it['order_id']][] = $it;
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pesanan Masuk — Kaharu</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
<style>
  .order-card { background:white; border:1px solid var(--slate-100); border-radius: var(--radius-lg); margin-bottom:16px; padding:20px; box-shadow: var(--shadow-sm); }
  .item-line { display:flex; justify-content:space-between; font-size:13.5px; padding:4px 0; color:var(--slate-700); }
</style>
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/../includes/sidebar.php'; ?>

    <div class="main">
        <?php include __DIR__ . '/../includes/header.php'; ?>

        <div class="page-pad">
            <div style="display:flex; gap:10px; margin-bottom:20px;">
                <a href="?filter=baru" class="tag <?= $filter==='baru'?'active':'' ?>">Baru (<?= $counts['baru'] ?>)</a>
                <a href="?filter=diproses" class="tag <?= $filter==='diproses'?'active':'' ?>">Diproses (<?= $counts['diproses'] ?>)</a>
                <a href="?filter=dikirim" class="tag <?= $filter==='dikirim'?'active':'' ?>">Dikirim (<?= $counts['dikirim'] ?>)</a>
                <a href="?filter=selesai" class="tag <?= $filter==='selesai'?'active':'' ?>">Selesai (<?= $counts['selesai'] ?>)</a>
                <a href="?filter=semua" class="tag <?= $filter==='semua'?'active':'' ?>">Semua</a>
            </div>

            <?php if (empty($orders)): ?>
                <div class="card empty-state">
                    <div class="icon">📦</div>
                    <p>Tidak ada pesanan pada filter ini.</p>
                </div>
            <?php else: foreach ($orders as $o): 
                $no_wa_clean = preg_replace('/[^0-9]/', '', $o['wa_buyer']);
                $link_wa = "https://wa.me/{$no_wa_clean}";
            ?>
                <div class="order-card">
                    <div class="section-head" style="margin-bottom:14px;">
                        <div>
                            <strong style="font-size:15px;">Pesanan #<?= htmlspecialchars($o['kode_pesanan']) ?></strong>
                            <div class="muted" style="font-size:12.5px;">dari <?= htmlspecialchars($o['nama_buyer']) ?> · <?= date('d M Y, H:i', strtotime($o['dibuat_pada'])) ?></div>
                        </div>
                        <span class="status-pill status-<?= $o['status']==='baru'?'pending':($o['status']==='selesai'?'done':'progress') ?>"><?= ucfirst($o['status']) ?></span>
                    </div>

                    <?php foreach (($items_by_order[$o['id']] ?? []) as $it): ?>
                        <div class="item-line">
                            <span><?= htmlspecialchars($it['nama_produk']) ?> <?= $it['opsi_dipilih'] ? '('.htmlspecialchars($it['opsi_dipilih']).')' : '' ?> x<?= $it['jumlah'] ?></span>
                            <strong>Rp<?= number_format($it['subtotal'],0,',','.') ?></strong>
                        </div>
                    <?php endforeach; ?>

                    <div style="font-size:13.5px; margin:12px 0; padding-top:12px; border-top:1px solid var(--pearl-white-deep);">
                        <strong>Alamat:</strong> <?= htmlspecialchars($o['alamat_kirim']) ?>
                    </div>

                    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; flex-wrap:wrap;">
                        <a href="<?= $link_wa ?>" target="_blank" class="btn btn-whatsapp btn-sm">💬 Chat Pembeli</a>
                        <form method="POST" style="display:flex; gap:8px;">
                            <input type="hidden" name="order_id" value="<?= $o['id'] ?>">
                            <select name="status" style="padding:8px 12px; border:1.5px solid var(--slate-300); border-radius:8px; font-size:13px;">
                                <option value="baru" <?= $o['status']==='baru'?'selected':'' ?>>Baru</option>
                                <option value="diproses" <?= $o['status']==='diproses'?'selected':'' ?>>Diproses</option>
                                <option value="dikirim" <?= $o['status']==='dikirim'?'selected':'' ?>>Dikirim</option>
                                <option value="selesai" <?= $o['status']==='selesai'?'selected':'' ?>>Selesai</option>
                                <option value="dibatalkan" <?= $o['status']==='dibatalkan'?'selected':'' ?>>Dibatalkan</option>
                            </select>
                            <button type="submit" class="btn btn-outline btn-sm">Perbarui</button>
                        </form>
                    </div>
                </div>
            <?php endforeach; endif; ?>
        </div>
    </div>
</div>

</body>
</html>
