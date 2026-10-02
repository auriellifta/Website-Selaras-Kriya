<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_role('seller');

$active_page = 'tambah';
$seller_id = $_SESSION['user_id'];
$edit_id = (int)($_GET['id'] ?? 0);
$page_title = $edit_id ? 'Edit Produk' : 'Tambah Produk';

$produk = null;
$existing_options = [];
if ($edit_id) {
    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ? AND seller_id = ?");
    $stmt->execute([$edit_id, $seller_id]);
    $produk = $stmt->fetch();
    if (!$produk) { header("Location: produk.php"); exit; }

    $opt_stmt = $pdo->prepare("SELECT * FROM product_options WHERE product_id = ?");
    $opt_stmt->execute([$edit_id]);
    $existing_options = $opt_stmt->fetchAll();
}

$categories = $pdo->query("SELECT * FROM categories ORDER BY nama")->fetchAll();
$msg = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama = trim($_POST['nama']);
    $category_id = (int)$_POST['category_id'];
    $harga = (float)$_POST['harga'];
    $deskripsi = trim($_POST['deskripsi']);
    $stok = (int)$_POST['stok'];
    $estimasi = trim($_POST['estimasi_produksi']);
    $berat_limbah = (float)$_POST['berat_limbah_kg'];

    if ($edit_id) {
        $stmt = $pdo->prepare("UPDATE products SET nama=?, category_id=?, harga=?, deskripsi=?, stok=?, estimasi_produksi=?, berat_limbah_kg=? WHERE id=? AND seller_id=?");
        $stmt->execute([$nama, $category_id, $harga, $deskripsi, $stok, $estimasi, $berat_limbah, $edit_id, $seller_id]);
        $product_id = $edit_id;
        // hapus opsi lama, tulis ulang
        $pdo->prepare("DELETE FROM product_options WHERE product_id = ?")->execute([$product_id]);
        $msg = 'Produk berhasil diperbarui.';
    } else {
        $stmt = $pdo->prepare("INSERT INTO products (seller_id, category_id, nama, deskripsi, harga, stok, estimasi_produksi, berat_limbah_kg, status) VALUES (?,?,?,?,?,?,?,?, 'menunggu')");
        $stmt->execute([$seller_id, $category_id, $nama, $deskripsi, $harga, $stok, $estimasi, $berat_limbah]);
        $product_id = $pdo->lastInsertId();
        $msg = 'Produk berhasil diajukan dan menunggu review admin.';
    }

    // Simpan opsi kustomisasi (dinamis, bisa lebih dari satu)
    if (!empty($_POST['opsi_nama'])) {
        foreach ($_POST['opsi_nama'] as $i => $nama_opsi) {
            $nama_opsi = trim($nama_opsi);
            $pilihan = trim($_POST['opsi_pilihan'][$i] ?? '');
            $biaya = (float)($_POST['opsi_biaya'][$i] ?? 0);
            if ($nama_opsi !== '' && $pilihan !== '') {
                $pdo->prepare("INSERT INTO product_options (product_id, nama_opsi, pilihan, biaya_tambahan) VALUES (?,?,?,?)")
                    ->execute([$product_id, $nama_opsi, $pilihan, $biaya]);
            }
        }
    }

    header("Location: produk.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= $page_title ?> — Kaharu</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
<style>
  .form-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .opt-row { display: flex; gap: 10px; margin-bottom: 10px; align-items:center; }
  .opt-row input { flex: 1; }
</style>
</head>
<body>

<div class="app-shell">
    <?php include __DIR__ . '/../includes/sidebar.php'; ?>

    <div class="main">
        <?php include __DIR__ . '/../includes/header.php'; ?>

        <div class="page-pad" style="max-width: 760px;">
            <?php if (!$edit_id): ?>
            <div style="background:var(--info-bg); border-radius:10px; padding:12px 16px; margin-bottom:20px; font-size:13px; color:var(--slate-700);">
                ℹ️ Produk baru akan ditinjau admin dalam 1x24 jam sebelum tayang di katalog.
            </div>
            <?php endif; ?>

            <form method="POST">
                <div class="card">
                    <h3 style="font-size:16px; margin-bottom:18px;">Informasi Dasar</h3>
                    <div class="field"><label>Nama Produk</label><input name="nama" required value="<?= htmlspecialchars($produk['nama'] ?? '') ?>"></div>
                    <div class="form-2col">
                        <div class="field"><label>Kategori</label>
                            <select name="category_id">
                                <?php foreach ($categories as $c): ?>
                                    <option value="<?= $c['id'] ?>" <?= ($produk['category_id'] ?? null) == $c['id'] ? 'selected' : '' ?>><?= htmlspecialchars($c['nama']) ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                        <div class="field"><label>Harga Dasar (Rp)</label><input type="number" name="harga" required value="<?= $produk['harga'] ?? '' ?>"></div>
                    </div>
                    <div class="field"><label>Deskripsi</label><textarea name="deskripsi" rows="4"><?= htmlspecialchars($produk['deskripsi'] ?? '') ?></textarea></div>
                    <div class="form-2col">
                        <div class="field"><label>Stok Tersedia</label><input type="number" name="stok" required value="<?= $produk['stok'] ?? '' ?>"></div>
                        <div class="field"><label>Estimasi Waktu Produksi</label><input name="estimasi_produksi" placeholder="3-5 hari" value="<?= htmlspecialchars($produk['estimasi_produksi'] ?? '') ?>"></div>
                    </div>
                </div>

                <div class="card" style="margin-top:18px;">
                    <div class="section-head" style="margin-bottom:14px;">
                        <h3 style="font-size:16px;">Opsi Kustomisasi</h3>
                        <span class="muted" style="font-size:12.5px;">Opsional</span>
                    </div>
                    <div id="opsi-container">
                        <?php if ($existing_options): foreach ($existing_options as $opt): ?>
                        <div class="opt-row">
                            <input name="opsi_nama[]" placeholder="Nama opsi" value="<?= htmlspecialchars($opt['nama_opsi']) ?>">
                            <input name="opsi_pilihan[]" placeholder="Pilihan (pisah koma)" value="<?= htmlspecialchars($opt['pilihan']) ?>">
                            <input name="opsi_biaya[]" type="number" placeholder="Biaya +" value="<?= $opt['biaya_tambahan'] ?>" style="max-width:110px;">
                        </div>
                        <?php endforeach; else: ?>
                        <div class="opt-row">
                            <input name="opsi_nama[]" placeholder="Nama opsi (contoh: Warna Tali)">
                            <input name="opsi_pilihan[]" placeholder="Pilihan (pisah koma: Hitam,Coklat)">
                            <input name="opsi_biaya[]" type="number" placeholder="Biaya +" style="max-width:110px;">
                        </div>
                        <?php endif; ?>
                    </div>
                    <button type="button" onclick="tambahOpsi()" class="btn btn-ghost btn-sm">+ Tambah Opsi Lain</button>
                </div>

                <div class="card" style="margin-top:18px;">
                    <h3 style="font-size:16px; margin-bottom:14px;">Estimasi Dampak Lingkungan</h3>
                    <div class="field"><label>Berat limbah kerang terpakai per produk (kg)</label><input type="number" step="0.1" name="berat_limbah_kg" value="<?= $produk['berat_limbah_kg'] ?? '' ?>"></div>
                </div>

                <button type="submit" class="btn btn-primary" style="margin-top:20px;"><?= $edit_id ? 'Simpan Perubahan' : 'Ajukan untuk Ditinjau' ?></button>
            </form>
        </div>
    </div>
</div>

<script>
function tambahOpsi() {
    const container = document.getElementById('opsi-container');
    const row = document.createElement('div');
    row.className = 'opt-row';
    row.innerHTML = `<input name="opsi_nama[]" placeholder="Nama opsi">
                      <input name="opsi_pilihan[]" placeholder="Pilihan (pisah koma)">
                      <input name="opsi_biaya[]" type="number" placeholder="Biaya +" style="max-width:110px;">`;
    container.appendChild(row);
}
</script>

</body>
</html>
