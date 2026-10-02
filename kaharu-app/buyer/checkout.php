<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('buyer');

$active_page = 'katalog';
$page_title = 'Checkout';
$buyer_id = $_SESSION['user_id'];

// Ambil data buyer untuk alamat default
$buyer_stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$buyer_stmt->execute([$buyer_id]);
$buyer = $buyer_stmt->fetch();

// Ambil isi keranjang, dikelompokkan per seller
$stmt = $pdo->prepare("SELECT ci.*, p.nama as nama_produk, p.harga, p.seller_id,
                        u.nama as nama_seller, u.no_whatsapp, sp.asal_pesisir
                        FROM cart_items ci
                        JOIN products p ON ci.product_id = p.id
                        JOIN users u ON p.seller_id = u.id
                        LEFT JOIN seller_profiles sp ON sp.user_id = u.id
                        WHERE ci.buyer_id = ?");
$stmt->execute([$buyer_id]);
$items = $stmt->fetchAll();

if (empty($items)) {
    header("Location: keranjang.php");
    exit;
}

// Kelompokkan per seller
$by_seller = [];
foreach ($items as $it) {
    $by_seller[$it['seller_id']]['nama_seller'] = $it['nama_seller'];
    $by_seller[$it['seller_id']]['no_whatsapp'] = $it['no_whatsapp'];
    $by_seller[$it['seller_id']]['asal_pesisir'] = $it['asal_pesisir'];
    $by_seller[$it['seller_id']]['items'][] = $it;
}

$alamat_input = $buyer['alamat'] ?? '';

// Proses submit -> buat order per seller + generate link WA
$orders_created = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $alamat_final = trim($_POST['alamat']) ?: $alamat_input;

    foreach ($by_seller as $seller_id => $data) {
        $total_seller = 0;
        foreach ($data['items'] as $it) {
            $total_seller += ($it['harga'] + $it['biaya_tambahan_opsi']) * $it['jumlah'];
        }

        $kode = 'KHR-' . strtoupper(substr(uniqid(), -6));

        $ins = $pdo->prepare("INSERT INTO orders (kode_pesanan, buyer_id, seller_id, alamat_kirim, total_harga, status) VALUES (?, ?, ?, ?, ?, 'baru')");
        $ins->execute([$kode, $buyer_id, $seller_id, $alamat_final, $total_seller]);
        $order_id = $pdo->lastInsertId();

        $pesan = "Halo {$data['nama_seller']}, saya {$buyer['nama']} dari Kaharu ingin memesan:\n\n";
        foreach ($data['items'] as $it) {
            $pesan .= "📦 {$it['nama_produk']}\n";
            if ($it['opsi_dipilih']) $pesan .= "• {$it['opsi_dipilih']}\n";
            $pesan .= "• Jumlah: {$it['jumlah']} pcs\n";
            $pesan .= "💰 Rp" . number_format(($it['harga'] + $it['biaya_tambahan_opsi']) * $it['jumlah'], 0, ',', '.') . "\n\n";

            $item_ins = $pdo->prepare("INSERT INTO order_items (order_id, product_id, opsi_dipilih, jumlah, harga_satuan, subtotal) VALUES (?, ?, ?, ?, ?, ?)");
            $item_ins->execute([$order_id, $it['product_id'], $it['opsi_dipilih'], $it['jumlah'], $it['harga'], ($it['harga'] + $it['biaya_tambahan_opsi']) * $it['jumlah']]);
        }
        $pesan .= "📍 Alamat kirim:\n{$alamat_final}\n\n";
        $pesan .= "Mohon info metode pembayaran dan estimasi waktu produksinya ya. Terima kasih! 🙏";

        $no_wa_clean = preg_replace('/[^0-9]/', '', $data['no_whatsapp']);
        $link_wa = "https://wa.me/{$no_wa_clean}?text=" . urlencode($pesan);

        // notifikasi ke seller
        $notif = $pdo->prepare("INSERT INTO notifications (user_id, pesan) VALUES (?, ?)");
        $notif->execute([$seller_id, "Pesanan baru #{$kode} dari {$buyer['nama']}"]);

        $orders_created[] = ['kode' => $kode, 'nama_seller' => $data['nama_seller'], 'link_wa' => $link_wa, 'total' => $total_seller];
    }

    // Kosongkan keranjang
    $pdo->prepare("DELETE FROM cart_items WHERE buyer_id = ?")->execute([$buyer_id]);
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Checkout — Kaharu</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
<style>
  .layout { max-width: 900px; margin: 0 auto; padding: 32px; }
  .seller-block { background: var(--white); border: 1px solid var(--slate-100); border-radius: var(--radius-lg); margin-bottom: 20px; overflow: hidden; box-shadow: var(--shadow-sm); }
  .seller-head { display: flex; align-items: center; gap: 12px; padding: 16px 20px; background: var(--slate-100); }
  .seller-items { padding: 16px 20px; }
  .mini-item { display: flex; justify-content: space-between; font-size: 13.5px; padding: 6px 0; color: var(--slate-700); }
  .info-banner { display: flex; gap: 12px; align-items: flex-start; background: var(--info-bg); border-radius: 10px; padding: 16px 18px; margin-bottom: 24px; }
  .success-order-card { background:white; border:1px solid var(--slate-100); border-radius: var(--radius-lg); padding:20px; margin-bottom:16px; box-shadow: var(--shadow-sm); }
</style>
</head>
<body>

<?php include __DIR__ . '/../includes/header.php'; ?>

<div class="layout">

<?php if (!empty($orders_created)): ?>
    <!-- Setelah order dibuat -->
    <div class="steps">
        <div class="step done">1. Keranjang</div>
        <div class="step done">2. Konfirmasi</div>
        <div class="step current">3. Kirim ke Pengrajin</div>
    </div>
    <h2 style="margin-bottom:10px;">Pesanan Berhasil Dibuat 🎉</h2>
    <p class="muted" style="margin-bottom:24px;">Klik tombol di bawah untuk mengirim pesan pemesanan ke tiap pengrajin via WhatsApp.</p>

    <?php foreach ($orders_created as $o): ?>
        <div class="success-order-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong style="font-size:15px;">Pesanan <?= $o['kode'] ?></strong>
                    <div class="muted" style="font-size:13px;">ke <?= htmlspecialchars($o['nama_seller']) ?> · Rp<?= number_format($o['total'],0,',','.') ?></div>
                </div>
                <a href="<?= $o['link_wa'] ?>" target="_blank" class="btn btn-whatsapp">💬 Kirim via WhatsApp</a>
            </div>
        </div>
    <?php endforeach; ?>

    <a href="riwayat.php" class="btn btn-outline" style="margin-top:10px;">Lihat Semua Pesanan Saya</a>

<?php else: ?>
    <!-- Form konfirmasi sebelum submit -->
    <div class="steps">
        <div class="step done">1. Keranjang</div>
        <div class="step current">2. Konfirmasi Pesanan</div>
        <div class="step">3. Kirim ke Pengrajin</div>
    </div>

    <h2 style="margin-bottom:6px;">Konfirmasi Pesanan</h2>
    <p class="muted" style="margin-bottom:24px;">Pembayaran dilakukan langsung dengan pengrajin melalui WhatsApp. Kaharu menyiapkan pesan otomatis berdasarkan pesananmu.</p>

    <div class="info-banner">
        <span style="font-size:18px;">🔒</span>
        <div>
            <strong style="font-size:14px;">Bagaimana alur pembayarannya?</strong>
            <p class="muted" style="font-size:13px; margin-top:4px; line-height:1.6;">Kaharu tidak memproses pembayaran. Setelah pesanan dibuat, kamu akan diarahkan ke WhatsApp pengrajin dengan pesan yang sudah terisi otomatis.</p>
        </div>
    </div>

    <form method="POST">
        <div class="field">
            <label>Alamat Pengiriman</label>
            <textarea name="alamat" rows="2" required><?= htmlspecialchars($alamat_input) ?></textarea>
        </div>

        <h3 style="font-size:16px; margin: 24px 0 14px;">Rincian per Pengrajin</h3>

        <?php foreach ($by_seller as $seller_id => $data): ?>
            <div class="seller-block">
                <div class="seller-head">
                    <div style="width:36px;height:36px;border-radius:50%;background:var(--navy);color:white;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;"><?= initial_name($data['nama_seller']) ?></div>
                    <div>
                        <strong style="font-size:14px;"><?= htmlspecialchars($data['nama_seller']) ?></strong>
                        <div class="muted" style="font-size:12px;"><?= htmlspecialchars($data['asal_pesisir'] ?? '') ?></div>
                    </div>
                </div>
                <div class="seller-items">
                    <?php foreach ($data['items'] as $it): ?>
                        <div class="mini-item">
                            <span><?= htmlspecialchars($it['nama_produk']) ?> <?= $it['opsi_dipilih'] ? '('.htmlspecialchars($it['opsi_dipilih']).')' : '' ?> x<?= $it['jumlah'] ?></span>
                            <strong>Rp<?= number_format(($it['harga']+$it['biaya_tambahan_opsi'])*$it['jumlah'],0,',','.') ?></strong>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endforeach; ?>

        <button type="submit" class="btn btn-primary btn-block" style="margin-top:10px;">Buat Pesanan & Siapkan Pesan WhatsApp</button>
    </form>
<?php endif; ?>

</div>

</body>
</html>
