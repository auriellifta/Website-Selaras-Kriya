<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('admin');

$active_page = 'umkm';
$page_title = 'Manajemen UMKM';

if (isset($_GET['aksi'], $_GET['id'])) {
    $status = $_GET['aksi'] === 'setuju' ? 'disetujui' : 'ditolak';
    $stmt = $pdo->prepare("UPDATE seller_profiles SET status_verifikasi = ?, terverifikasi = ? WHERE id = ?");
    $stmt->execute([$status, $status === 'disetujui' ? 1 : 0, (int)$_GET['id']]);
    header("Location: umkm.php");
    exit;
}

$pending = $pdo->query("SELECT sp.*, u.nama, u.no_whatsapp, u.dibuat_pada FROM seller_profiles sp JOIN users u ON sp.user_id = u.id WHERE sp.status_verifikasi = 'menunggu' ORDER BY u.dibuat_pada DESC")->fetchAll();

$aktif = $pdo->query("SELECT sp.*, u.nama,
                       (SELECT COUNT(*) FROM products p WHERE p.seller_id = u.id AND p.status='aktif') as produk_aktif
                       FROM seller_profiles sp JOIN users u ON sp.user_id = u.id
                       WHERE sp.status_verifikasi = 'disetujui' ORDER BY sp.total_terjual DESC")->fetchAll();
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Manajemen UMKM — Kaharu Admin</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/../includes/sidebar.php'; ?>

    <div class="main">
        <?php include __DIR__ . '/../includes/header.php'; ?>

        <div class="page-pad">
            <?php if (!empty($pending)): ?>
            <div class="card" style="margin-bottom:24px; background:var(--warning-bg); border-color:#EAD9AE;">
                <div class="section-head" style="margin-bottom:14px;"><h3 style="font-size:15px; color:var(--warning);">Menunggu Verifikasi (<?= count($pending) ?>)</h3></div>
                <table>
                    <tr><th>Nama</th><th>Toko</th><th>WhatsApp</th><th>Tgl Daftar</th><th></th></tr>
                    <?php foreach ($pending as $p): ?>
                    <tr>
                        <td><?= htmlspecialchars($p['nama']) ?></td>
                        <td><?= htmlspecialchars($p['nama_toko']) ?></td>
                        <td><?= htmlspecialchars($p['no_whatsapp']) ?></td>
                        <td><?= date('d M Y', strtotime($p['dibuat_pada'])) ?></td>
                        <td>
                            <a href="?aksi=setuju&id=<?= $p['id'] ?>" class="btn btn-primary btn-sm">Verifikasi</a>
                            <a href="?aksi=tolak&id=<?= $p['id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Tolak pendaftaran ini?')">Tolak</a>
                        </td>
                    </tr>
                    <?php endforeach; ?>
                </table>
            </div>
            <?php endif; ?>

            <div class="card" style="padding:0;">
                <div class="section-head" style="padding:20px 24px 0;"><h3 style="font-size:16px;">UMKM Aktif (<?= count($aktif) ?>)</h3></div>
                <?php if (empty($aktif)): ?>
                    <div class="empty-state"><p>Belum ada UMKM aktif.</p></div>
                <?php else: ?>
                <table>
                    <tr><th>Nama Pengrajin</th><th>Toko</th><th>Wilayah</th><th>Produk Aktif</th><th>Total Terjual</th><th>Rating</th></tr>
                    <?php foreach ($aktif as $a): ?>
                    <tr>
                        <td><?= htmlspecialchars($a['nama']) ?></td>
                        <td><?= htmlspecialchars($a['nama_toko']) ?></td>
                        <td><?= htmlspecialchars($a['asal_pesisir'] ?? '-') ?></td>
                        <td><?= $a['produk_aktif'] ?></td>
                        <td><?= $a['total_terjual'] ?></td>
                        <td><?= $a['rating'] ?>★</td>
                    </tr>
                    <?php endforeach; ?>
                </table>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>

</body>
</html>
