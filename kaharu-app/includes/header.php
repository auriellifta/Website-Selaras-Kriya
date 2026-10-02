<?php
// includes/header.php
// Dipanggil setelah $pdo dan require_role() dipanggil di halaman pemanggil.
// Variabel $active_page bisa diset di halaman pemanggil untuk highlight nav.

$user = current_user();
$notif_count = get_notif_count($pdo, $user['id']);
?>
<div class="topbar">
    <?php if ($user['role'] === 'buyer'): ?>
        <div class="logo"><span class="mark"></span>Kaharu</div>
        <div class="nav-links">
            <a href="/kaharu-app/buyer/katalog.php" class="<?= ($active_page ?? '') === 'katalog' ? 'active' : '' ?>">Belanja</a>
            <a href="/kaharu-app/buyer/riwayat.php" class="<?= ($active_page ?? '') === 'riwayat' ? 'active' : '' ?>">Pesanan Saya</a>
        </div>
        <div class="topbar-actions">
            <a href="/kaharu-app/buyer/keranjang.php" class="icon-btn">🛍️</a>
            <a href="/kaharu-app/buyer/profil.php" class="avatar" title="Profil"><?= initial_name($user['nama']) ?></a>
        </div>
    <?php else: ?>
        <div><strong style="font-size:15px; color:var(--slate-900);"><?= htmlspecialchars($page_title ?? 'Dashboard') ?></strong></div>
        <div class="topbar-actions">
            <div class="icon-btn">🔔<?php if ($notif_count > 0): ?><span class="badge"><?= $notif_count ?></span><?php endif; ?></div>
            <a href="/kaharu-app/auth/logout.php" class="avatar" title="Keluar (<?= htmlspecialchars($user['nama']) ?>)"><?= initial_name($user['nama']) ?></a>
        </div>
    <?php endif; ?>
</div>
