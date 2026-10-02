-- ============================================
-- KAHARU - Database Schema
-- Platform Kerajinan Limbah Kerang Pesisir
-- Import file ini via phpMyAdmin (WAMPP)
-- ============================================

CREATE DATABASE IF NOT EXISTS kaharu_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE kaharu_db;

-- ============================================
-- TABEL: users (semua role: buyer, seller, admin)
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('buyer','seller','admin') NOT NULL DEFAULT 'buyer',
    no_whatsapp VARCHAR(20),
    alamat TEXT,
    foto_profil VARCHAR(255) DEFAULT NULL,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ============================================
-- TABEL: seller_profiles (detail tambahan untuk role seller)
-- ============================================
CREATE TABLE seller_profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    nama_toko VARCHAR(150) NOT NULL,
    asal_pesisir VARCHAR(100),
    cerita TEXT,
    sejak_tahun YEAR,
    rating DECIMAL(2,1) DEFAULT 0.0,
    total_terjual INT DEFAULT 0,
    terverifikasi TINYINT(1) DEFAULT 0,
    status_verifikasi ENUM('menunggu','disetujui','ditolak') DEFAULT 'menunggu',
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- TABEL: categories
-- ============================================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(50) NOT NULL
) ENGINE=InnoDB;

INSERT INTO categories (nama) VALUES
('Aksesoris'), ('Fashion'), ('Dekorasi Rumah'), ('Seni'), ('Cendera Mata');

-- ============================================
-- TABEL: products
-- ============================================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    seller_id INT NOT NULL,
    category_id INT,
    nama VARCHAR(150) NOT NULL,
    deskripsi TEXT,
    harga DECIMAL(12,2) NOT NULL,
    stok INT DEFAULT 0,
    estimasi_produksi VARCHAR(50),
    berat_limbah_kg DECIMAL(5,2) DEFAULT 0,
    gambar_utama VARCHAR(255) DEFAULT NULL,
    status ENUM('draft','menunggu','aktif','ditolak','nonaktif') DEFAULT 'menunggu',
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ============================================
-- TABEL: product_options (mis. warna, ukuran)
-- ============================================
CREATE TABLE product_options (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    nama_opsi VARCHAR(100) NOT NULL,
    pilihan VARCHAR(255) NOT NULL COMMENT 'dipisah koma, mis: Hitam,Coklat,Pink',
    biaya_tambahan DECIMAL(10,2) DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- TABEL: product_images (galeri produk)
-- ============================================
CREATE TABLE product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    url_gambar VARCHAR(255) NOT NULL,
    urutan INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- TABEL: orders
-- ============================================
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kode_pesanan VARCHAR(20) NOT NULL UNIQUE,
    buyer_id INT NOT NULL,
    seller_id INT NOT NULL,
    alamat_kirim TEXT NOT NULL,
    catatan TEXT,
    total_harga DECIMAL(12,2) NOT NULL,
    status ENUM('baru','diproses','dikirim','selesai','dibatalkan') DEFAULT 'baru',
    pesan_wa_terkirim TINYINT(1) DEFAULT 0,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- ============================================
-- TABEL: order_items
-- ============================================
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    opsi_dipilih VARCHAR(255) DEFAULT NULL COMMENT 'ringkasan opsi yang dipilih',
    jumlah INT NOT NULL DEFAULT 1,
    harga_satuan DECIMAL(12,2) NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
) ENGINE=InnoDB;

-- ============================================
-- TABEL: cart (keranjang sementara per buyer)
-- ============================================
CREATE TABLE cart_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_id INT NOT NULL,
    product_id INT NOT NULL,
    opsi_dipilih VARCHAR(255) DEFAULT NULL,
    biaya_tambahan_opsi DECIMAL(10,2) DEFAULT 0,
    jumlah INT NOT NULL DEFAULT 1,
    ditambahkan_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buyer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- TABEL: notifications (untuk badge lonceng di topbar)
-- ============================================
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    pesan VARCHAR(255) NOT NULL,
    dibaca TINYINT(1) DEFAULT 0,
    dibuat_pada TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ============================================
-- DATA CONTOH (SEED) — supaya langsung bisa didemokan
-- ============================================

-- Password untuk semua akun contoh: "password123"
-- Hash dibuat dengan bcrypt (kompatibel dengan password_verify() PHP)
INSERT INTO users (nama, email, password, role, no_whatsapp, alamat) VALUES
('Admin Kaharu', 'admin@kaharu.id', '$2b$10$GB3ze1HjzOSsQMQyEIPuPuGGtXHoSfbn7Z3rGvLNKYxwQCBjhb4Fq', 'admin', '628110000000', NULL),
('Bu Marlina', 'marlina@kaharu.id', '$2b$10$GB3ze1HjzOSsQMQyEIPuPuGGtXHoSfbn7Z3rGvLNKYxwQCBjhb4Fq', 'seller', '6281300001111', 'Pesisir Bintan'),
('Pak Rudi', 'rudi@kaharu.id', '$2b$10$GB3ze1HjzOSsQMQyEIPuPuGGtXHoSfbn7Z3rGvLNKYxwQCBjhb4Fq', 'seller', '6281300002222', 'Pesisir Lampung'),
('Auriel', 'auriel@kaharu.id', '$2b$10$GB3ze1HjzOSsQMQyEIPuPuGGtXHoSfbn7Z3rGvLNKYxwQCBjhb4Fq', 'buyer', '628120000001', 'Jl. Merdeka No. 12, Batam, Kepulauan Riau, 29432');

INSERT INTO seller_profiles (user_id, nama_toko, asal_pesisir, cerita, sejak_tahun, rating, total_terjual, terverifikasi, status_verifikasi) VALUES
(2, 'Marlina Craft', 'Pesisir Bintan, Kepulauan Riau', 'Dulu kerang ini sampah di pantai kami. Sekarang, bersama 12 pengrajin lain, kami mengubahnya jadi kalung, vas, dan hiasan yang dikirim sampai ke Jerman dan Jepang.', 2019, 4.8, 123, 1, 'disetujui'),
(3, 'Rudi Shell Decor', 'Pesisir Lampung', 'Mengubah limbah kerang pantai Lampung menjadi dekorasi rumah bernilai jual tinggi.', 2020, 4.6, 87, 1, 'disetujui');

INSERT INTO products (seller_id, category_id, nama, deskripsi, harga, stok, estimasi_produksi, berat_limbah_kg, status) VALUES
(2, 1, 'Kalung Kerang Mutiara Senja', 'Dibuat dari serpihan kerang mutiara pesisir yang dipilah tangan, dirangkai dengan tali katun alami.', 185000, 8, '3-5 hari', 0.3, 'aktif'),
(2, 1, 'Cincin Serpih Kerang', 'Cincin minimalis dari serpihan kerang pilihan.', 95000, 15, '2-3 hari', 0.1, 'aktif'),
(3, 3, 'Vas Dekor Ombak Kerang', 'Vas dekoratif motif ombak dari cangkang kerang pesisir Lampung.', 320000, 5, '5-7 hari', 1.2, 'aktif');

INSERT INTO product_options (product_id, nama_opsi, pilihan, biaya_tambahan) VALUES
(1, 'Warna Tali', 'Hitam,Coklat,Pink,Teal', 0),
(1, 'Panjang', '40cm,45cm,50cm', 0),
(3, 'Ukuran', 'Kecil,Sedang,Besar', 50000);
