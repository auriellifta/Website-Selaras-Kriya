# Kaharu — Panduan Instalasi (WAMPP)

Aplikasi ini adalah **PHP native + MySQL**, dirancang untuk jalan langsung di WAMPP tanpa install apa pun lagi (tidak butuh Composer/npm).

## Langkah Instalasi

### 1. Salin folder project
Salin folder `kaharu-app` ke dalam folder `www` milik WAMPP.

Lokasi default WAMPP:
```
C:\wamp64\www\kaharu-app
```

Jadi strukturnya harus jadi:
```
C:\wamp64\www\kaharu-app\index.php
C:\wamp64\www\kaharu-app\config\...
C:\wamp64\www\kaharu-app\buyer\...
(dst)
```

### 2. Nyalakan WAMPP
Klik ikon WAMPP sampai berwarna **hijau** (artinya Apache & MySQL sudah jalan).

### 3. Buat database via phpMyAdmin
1. Buka browser, ke `http://localhost/phpmyadmin`
2. Klik tab **Import**
3. Pilih file `database/kaharu.sql` dari folder project
4. Klik **Go** / **Kirim**

Ini akan otomatis membuat database `kaharu_db` beserta semua tabel dan data contoh (akun demo, produk contoh, dll).

### 4. Cek koneksi database
Buka file `config/database.php`. Defaultnya sudah cocok untuk WAMPP:
```php
$DB_HOST = 'localhost';
$DB_NAME = 'kaharu_db';
$DB_USER = 'root';
$DB_PASS = '';
```
Kalau MySQL WAMPP kamu pakai password custom, ubah `$DB_PASS` sesuai itu.

### 5. Buka aplikasinya
Di browser, akses:
```
http://localhost/kaharu-app/
```

Akan otomatis diarahkan ke halaman login.

## Akun Demo (Password sama semua: `password123`)

| Role | Email |
|---|---|
| Admin | admin@kaharu.id |
| Seller (Bu Marlina) | marlina@kaharu.id |
| Seller (Pak Rudi) | rudi@kaharu.id |
| Buyer | auriel@kaharu.id |

## Alur yang Bisa Langsung Dicoba

1. **Login sebagai Buyer** (auriel@kaharu.id) → Katalog → klik produk → tambah opsi & ke keranjang → Checkout → klik "Kirim via WhatsApp" (akan membuka wa.me dengan pesan otomatis)
2. **Login sebagai Seller** (marlina@kaharu.id) → lihat Dashboard, Pesanan Masuk, tambah produk baru
3. **Login sebagai Admin** (admin@kaharu.id) → moderasi produk baru yang diajukan seller, verifikasi UMKM baru

## Struktur Folder

```
kaharu-app/
├── config/database.php       ← koneksi ke MySQL
├── database/kaharu.sql       ← import ini ke phpMyAdmin
├── includes/
│   ├── auth.php               ← session & proteksi role
│   ├── header.php              ← topbar dinamis
│   └── sidebar.php             ← sidebar dinamis (seller/admin)
├── assets/css/style.css       ← desain "Sea Pearl Elegant"
├── auth/                      ← login, register, logout
├── buyer/                     ← 7 halaman fungsional
├── seller/                    ← 6 halaman fungsional
└── admin/                     ← 4 halaman fungsional
```

## Catatan Penting

- **Nomor WhatsApp seller di database masih nomor contoh** (dummy). Kalau ingin fitur WA benar-benar terkirim, edit nomor WhatsApp di `Profil Toko` (untuk seller) dengan nomor asli berformat `62xxxxxxxxxx`.
- Semua fitur CRUD (produk, pesanan, verifikasi, moderasi) tersimpan langsung ke MySQL — coba refresh halaman, datanya akan tetap ada.
- Tidak ada JavaScript framework — murni PHP + form submit biasa, supaya paling gampang dijalankan di WAMPP tanpa build tool tambahan.
