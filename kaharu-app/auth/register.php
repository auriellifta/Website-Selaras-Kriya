<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nama = trim($_POST['nama'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $role = $_POST['role'] ?? 'buyer';
    $no_wa = trim($_POST['no_whatsapp'] ?? '');

    if ($nama === '' || $email === '' || $password === '') {
        $error = 'Semua field wajib diisi.';
    } elseif (strlen($password) < 6) {
        $error = 'Password minimal 6 karakter.';
    } elseif (!in_array($role, ['buyer', 'seller'])) {
        $error = 'Role tidak valid.';
    } else {
        $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
        $check->execute([$email]);
        if ($check->fetch()) {
            $error = 'Email sudah terdaftar.';
        } else {
            $hash = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $pdo->prepare("INSERT INTO users (nama, email, password, role, no_whatsapp) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$nama, $email, $hash, $role, $no_wa]);
            $new_id = $pdo->lastInsertId();

            if ($role === 'seller') {
                $stmt2 = $pdo->prepare("INSERT INTO seller_profiles (user_id, nama_toko, status_verifikasi) VALUES (?, ?, 'menunggu')");
                $stmt2->execute([$new_id, $nama . " Craft"]);
            }

            $_SESSION['user_id'] = $new_id;
            $_SESSION['nama'] = $nama;
            $_SESSION['role'] = $role;
            $_SESSION['email'] = $email;

            header("Location: " . ($role === 'seller' ? '/kaharu-app/seller/dashboard.php' : '/kaharu-app/buyer/katalog.php'));
            exit;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Daftar — Kaharu</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
<style>
  body { display:flex; align-items:center; justify-content:center; min-height:100vh; background: linear-gradient(160deg, var(--pearl-white) 0%, var(--slate-100) 100%); padding: 20px; }
  .auth-card { width: 100%; max-width: 420px; background:white; border-radius: var(--radius-lg); padding: 40px; box-shadow: var(--shadow-lg); }
  .role-choice { display:flex; gap:10px; margin-bottom: 18px; }
  .role-opt { flex:1; border: 1.5px solid var(--slate-300); border-radius: 8px; padding: 12px; text-align:center; cursor:pointer; font-size:13.5px; font-weight:600; color:var(--slate-500); }
  .role-opt input { display:none; }
  .role-opt:has(input:checked) { border-color: var(--navy); background: var(--slate-100); color: var(--navy); }
</style>
</head>
<body>
<div class="auth-card">
    <div style="text-align:center; margin-bottom:24px;">
        <div class="logo" style="justify-content:center; font-size:26px;"><span class="mark"></span>Kaharu</div>
    </div>

    <?php if ($error): ?><div class="error-msg"><?= htmlspecialchars($error) ?></div><?php endif; ?>

    <form method="POST">
        <div class="field">
            <label>Daftar sebagai</label>
            <div class="role-choice">
                <label class="role-opt"><input type="radio" name="role" value="buyer" checked> 🛍️ Pembeli</label>
                <label class="role-opt"><input type="radio" name="role" value="seller"> 🐚 Pengrajin</label>
            </div>
        </div>
        <div class="field">
            <label>Nama Lengkap</label>
            <input type="text" name="nama" required>
        </div>
        <div class="field">
            <label>Email</label>
            <input type="email" name="email" required>
        </div>
        <div class="field">
            <label>Nomor WhatsApp</label>
            <input type="text" name="no_whatsapp" placeholder="628xxxxxxxxxx" required>
        </div>
        <div class="field">
            <label>Password</label>
            <input type="password" name="password" required minlength="6">
        </div>
        <button type="submit" class="btn btn-primary btn-block">Daftar</button>
    </form>

    <p class="muted" style="text-align:center; font-size:13px; margin-top:18px;">
        Sudah punya akun? <a href="login.php" style="color:var(--navy); font-weight:600;">Masuk</a>
    </p>
</div>
</body>
</html>
