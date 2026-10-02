<?php
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';

$error = '';

if (isset($_GET['error']) && $_GET['error'] === 'akses_ditolak') {
    $error = 'Akun kamu tidak punya akses ke halaman tersebut.';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    if ($email === '' || $password === '') {
        $error = 'Email dan password wajib diisi.';
    } else {
        $stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $u = $stmt->fetch();

        if ($u && password_verify($password, $u['password'])) {
            $_SESSION['user_id'] = $u['id'];
            $_SESSION['nama']    = $u['nama'];
            $_SESSION['role']    = $u['role'];
            $_SESSION['email']   = $u['email'];

            if ($u['role'] === 'admin')  header("Location: /kaharu-app/admin/dashboard.php");
            elseif ($u['role'] === 'seller') header("Location: /kaharu-app/seller/dashboard.php");
            else header("Location: /kaharu-app/buyer/katalog.php");
            exit;
        } else {
            $error = 'Email atau password salah.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Masuk — Kaharu</title>
<link rel="stylesheet" href="/kaharu-app/assets/css/style.css">
<style>
  body { display:flex; align-items:center; justify-content:center; min-height:100vh; background: linear-gradient(160deg, var(--pearl-white) 0%, var(--slate-100) 100%); }
  .auth-card { width: 100%; max-width: 400px; background:white; border-radius: var(--radius-lg); padding: 40px; box-shadow: var(--shadow-lg); }
  .auth-logo { text-align:center; margin-bottom: 28px; }
  .demo-hint { background: var(--info-bg); border-radius: 8px; padding: 12px 14px; font-size: 12px; color: var(--slate-700); margin-top: 20px; line-height:1.7; }
</style>
</head>
<body>
<div class="auth-card">
    <div class="auth-logo">
        <div class="logo" style="justify-content:center; font-size:28px;"><span class="mark"></span>Kaharu</div>
        <p class="muted" style="font-size:13px; margin-top:6px;">Maritim Berkarya, Ekonomi Berdaya</p>
    </div>

    <?php if ($error): ?><div class="error-msg"><?= htmlspecialchars($error) ?></div><?php endif; ?>

    <form method="POST">
        <div class="field">
            <label>Email</label>
            <input type="email" name="email" required placeholder="nama@email.com">
        </div>
        <div class="field">
            <label>Password</label>
            <input type="password" name="password" required placeholder="••••••••">
        </div>
        <button type="submit" class="btn btn-primary btn-block">Masuk</button>
    </form>

    <p class="muted" style="text-align:center; font-size:13px; margin-top:18px;">
        Belum punya akun? <a href="register.php" style="color:var(--navy); font-weight:600;">Daftar</a>
    </p>

    <div class="demo-hint">
        <strong>Akun demo</strong> (password: <code>password123</code>)<br>
        Buyer: auriel@kaharu.id<br>
        Seller: marlina@kaharu.id<br>
        Admin: admin@kaharu.id
    </div>
</div>
</body>
</html>
