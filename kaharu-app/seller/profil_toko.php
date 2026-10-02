<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('seller');

$active_page = 'toko';
$page_title = 'Profil Toko';
$seller_id = $_SESSION['user_id'];
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama_toko = trim($_POST['nama_toko']);
    $asal_pesisir = trim($_POST['asal_pesisir']);
    $sejak = (int)$_POST['sejak_tahun'];
    $cerita = trim($_POST['cerita']);
    $no_wa = trim($_POST['no_whatsapp']);

    $pdo->prepare("UPDATE users SET no_whatsapp = ? WHERE id = ?")->execute([$no_wa, $seller_id]);

    $check = $pdo->prepare("SELECT id FROM seller_profiles WHERE user_id = ?");
    $check->execute([$seller_id]);
    if ($check->fetch()) {
        $stmt = $pdo->prepare("UPDATE seller_profiles SET nama_toko=?, asal_pesisir=?, sejak_tahun=?, cerita=? WHERE user_id=?");
        $stmt->execute([$nama_toko, $asal_pesisir, $sejak, $cerita, $seller_id]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO seller_profiles (user_id, nama_toko, asal_pesisir, sejak_tahun, cerita) VALUES (?,?,?,?,?)");
        $stmt->execute([$seller_id, $nama_toko, $asal_pesisir, $sejak, $cerita]);
    }
    $msg = 'Profil toko berhasil diperbarui.';
}

$user_stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$user_stmt->execute([$seller_id]);
$user = $user_stmt->fetch();

$profile_stmt = $pdo->prepare("SELECT * FROM seller_profiles WHERE user_id = ?");
$profile_stmt->execute([$seller_id]);
$profile = $profile_stmt->fetch();
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Profil Toko — Kaharu</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/../includes/sidebar.php'; ?>

    <div class="main">
        <?php include __DIR__ . '/../includes/header.php'; ?>

        <div class="page-pad" style="max-width: 720px;">
            <?php if ($msg): ?><div class="success-msg"><?= $msg ?></div><?php endif; ?>

            <form method="POST">
                <div class="card">
                    <h3 style="font-size:16px; margin-bottom:18px;">Identitas Pengrajin</h3>
                    <div class="field"><label>Nama Toko</label><input name="nama_toko" required value="<?= htmlspecialchars($profile['nama_toko'] ?? '') ?>"></div>
                    <div class="field"><label>Asal Pesisir</label><input name="asal_pesisir" value="<?= htmlspecialchars($profile['asal_pesisir'] ?? '') ?>"></div>
                    <div class="field"><label>Nomor WhatsApp Aktif</label><input name="no_whatsapp" value="<?= htmlspecialchars($user['no_whatsapp']) ?>"></div>
                    <div class="field-hint" style="margin-top:-10px;">Nomor ini akan menerima pesan draf pemesanan dari pembeli.</div>
                </div>

                <div class="card" style="margin-top:18px;">
                    <h3 style="font-size:16px; margin-bottom:18px;">Cerita Toko</h3>
                    <div class="field"><label>Sejak kapan berkarya?</label><input type="number" name="sejak_tahun" value="<?= $profile['sejak_tahun'] ?? '' ?>"></div>
                    <div class="field"><label>Ceritakan proses & perjalananmu</label><textarea name="cerita" rows="5"><?= htmlspecialchars($profile['cerita'] ?? '') ?></textarea></div>
                </div>

                <?php if ($profile): ?>
                <div class="card" style="margin-top:18px;">
                    <h3 style="font-size:16px; margin-bottom:14px;">Statistik Toko</h3>
                    <div class="grid grid-2">
                        <div><div class="stat-value" style="font-size:22px;"><?= $profile['rating'] ?>★</div><div class="stat-label">Rating</div></div>
                        <div><div class="stat-value" style="font-size:22px;"><?= $profile['total_terjual'] ?></div><div class="stat-label">Total Terjual</div></div>
                    </div>
                </div>
                <?php endif; ?>

                <button type="submit" class="btn btn-primary" style="margin-top:20px;">Simpan Perubahan</button>
            </form>
        </div>
    </div>
</div>

</body>
</html>
