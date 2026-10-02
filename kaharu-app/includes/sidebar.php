<?php
// includes/sidebar.php
// Butuh $active_page diset di halaman pemanggil, contoh: $active_page = 'dashboard';
$user = current_user();

$seller_menu = [
    'dashboard'   => ['icon' => '📊', 'label' => 'Dashboard',      'url' => '/kaharu-app/seller/dashboard.php'],
    'produk'      => ['icon' => '🐚', 'label' => 'Produk Saya',    'url' => '/kaharu-app/seller/produk.php'],
    'tambah'      => ['icon' => '➕', 'label' => 'Tambah Produk',  'url' => '/kaharu-app/seller/tambah_produk.php'],
    'pesanan'     => ['icon' => '📦', 'label' => 'Pesanan Masuk',  'url' => '/kaharu-app/seller/pesanan.php'],
    'pendapatan'  => ['icon' => '💰', 'label' => 'Pendapatan',     'url' => '/kaharu-app/seller/pendapatan.php'],
    'toko'        => ['icon' => '🏪', 'label' => 'Profil Toko',    'url' => '/kaharu-app/seller/profil_toko.php'],
];

$admin_menu = [
    'dashboard'  => ['icon' => '📊', 'label' => 'Dashboard',        'url' => '/kaharu-app/admin/dashboard.php'],
    'umkm'       => ['icon' => '🏪', 'label' => 'Manajemen UMKM',   'url' => '/kaharu-app/admin/umkm.php'],
    'produk'     => ['icon' => '🐚', 'label' => 'Moderasi Produk',  'url' => '/kaharu-app/admin/moderasi_produk.php'],
    'transaksi'  => ['icon' => '📦', 'label' => 'Transaksi',        'url' => '/kaharu-app/admin/transaksi.php'],
];

$menu = $user['role'] === 'seller' ? $seller_menu : $admin_menu;
$section_label = $user['role'] === 'seller' ? 'MENU PENGRAJIN' : 'MENU ADMIN';
?>
<div class="sidebar">
    <div class="logo"><span class="mark"></span>Kaharu <?php if ($user['role'] === 'admin'): ?><span style="font-size:11px; opacity:0.6; font-family:var(--font-body);">Admin</span><?php endif; ?></div>
    <div class="side-section-label"><?= $section_label ?></div>
    <?php foreach ($menu as $key => $item): ?>
        <a href="<?= $item['url'] ?>" class="side-link <?= ($active_page ?? '') === $key ? 'active' : '' ?>" style="color:inherit;">
            <span class="side-icon"><?= $item['icon'] ?></span> <?= $item['label'] ?>
        </a>
    <?php endforeach; ?>
</div>
