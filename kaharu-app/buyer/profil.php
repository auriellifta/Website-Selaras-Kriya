<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('buyer');

$active_page = 'profil';
$page_title = 'Profil';
$buyer_id = $_SESSION['user_id'];
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama = trim($_POST['nama']);
    $no_wa = trim($_POST['no_whatsapp']);
    $alamat = trim($_POST['alamat']);

    $stmt = $pdo->prepare("UPDATE users SET nama = ?, no_whatsapp = ?, alamat = ? WHERE id = ?");
    $stmt->execute([$nama, $no_wa, $alamat, $buyer_id]);
    $_SESSION['nama'] = $nama;
    $msg = 'Perubahan berhasil disimpan.';
}

$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$buyer_id]);
$user = $stmt->fetch();

// Hitung dampak nyata dari order yang pernah dibuat
$impact = $pdo->prepare("SELECT COUNT(DISTINCT o.id) as total_pesanan, COUNT(DISTINCT o.seller_id) as total_seller,
                          COALESCE(SUM(oi.jumlah * p.berat_limbah_kg), 0) as total_limbah
                          FROM orders o
                          JOIN order_items oi ON oi.order_id = o.id
                          JOIN products p ON oi.product_id = p.id
                          WHERE o.buyer_id = ?");
$impact->execute([$buyer_id]);
$stat = $impact->fetch();
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Profil — Kaharu</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
<style>
  .layout { max-width: 900px; margin: 0 auto; padding: 32px; display: grid; grid-template-columns: 260px 1fr; gap: 28px; }
  .profile-card { text-align: center; padding: 32px 20px; }
  .profile-avatar-big { width: 84px; height: 84px; border-radius: 50%; background: var(--navy); color: white; display:flex; align-items:center; justify-content:center; font-size: 32px; font-weight:600; margin: 0 auto 16px; font-family: var(--font-display); }
  .impact-personal { background: linear-gradient(160deg, var(--navy), var(--navy-light)); color: white; border-radius: var(--radius-lg); padding: 28px; margin-bottom: 24px; }
  .impact-personal .num { font-family: var(--font-display); font-size: 36px; color: var(--silver-light); }
</style>
</head>
<body>

<?php include __DIR__ . '/../includes/header.php'; ?>

<div class="layout">
    <div>
        <div class="card profile-card">
            <div class="profile-avatar-big"><?= initial_name($user['nama']) ?></div>
            <strong style="font-size:16px;"><?= htmlspecialchars($user['nama']) ?></strong>
            <p class="muted" style="font-size:13px; margin-top:4px;">Bergabung sejak <?= date('M Y', strtotime($user['dibuat_pada'])) ?></p>
        </div>
        <a href="/kaharu-app/auth/logout.php" class="btn btn-outline btn-block" style="margin-top:14px;">Keluar</a>
    </div>

    <div>
        <div class="impact-personal">
            <div style="font-size:13px; opacity:0.85; margin-bottom:8px;">🌊 DAMPAK KONTRIBUSIMU</div>
            <div class="num"><?= number_format($stat['total_limbah'],1) ?> kg</div>
            <div style="font-size:14px; opacity:0.9;">limbah kerang terserap dari <?= $stat['total_pesanan'] ?> pesanan</div>
            <div style="display:flex; gap:24px; margin-top:20px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.2);">
                <div><div style="font-size:20px; font-weight:600;"><?= $stat['total_pesanan'] ?></div><div style="font-size:12px; opacity:0.8;">Pesanan</div></div>
                <div><div style="font-size:20px; font-weight:600;"><?= $stat['total_seller'] ?></div><div style="font-size:12px; opacity:0.8;">Pengrajin didukung</div></div>
            </div>
        </div>

        <div class="card">
            <h3 style="font-size:16px; margin-bottom:18px;">Data Diri</h3>
            <?php if ($msg): ?><div class="success-msg"><?= $msg ?></div><?php endif; ?>
            <form method="POST">
                <div class="field"><label>Nama Lengkap</label><input name="nama" value="<?= htmlspecialchars($user['nama']) ?>"></div>
                <div class="field"><label>Email</label><input value="<?= htmlspecialchars($user['email']) ?>" disabled style="background:var(--slate-100);"></div>
                <div class="field"><label>Nomor WhatsApp</label><input name="no_whatsapp" value="<?= htmlspecialchars($user['no_whatsapp']) ?>"></div>
                <div class="field"><label>Alamat Pengiriman Utama</label><textarea name="alamat" rows="2"><?= htmlspecialchars($user['alamat']) ?></textarea></div>
                <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
            </form>
        </div>
    </div>
</div>

</body>
</html>
