# DESIGN.md — Selaras Kriya (V3: Sistem Tombol Dirapikan)

> Platform digital pemasaran kerajinan kerang Kepulauan Riau.
> Dokumen ini menggantikan "Sistem Desain Warisan Bahari Melayu V2" dan berfokus pada satu hal: **tombol yang konsisten, jelas hierarkinya, dan tidak terasa seperti template AI.**
> Palet, tipografi, dan nuansa Melayu tetap dipertahankan. Yang berubah adalah cara tombol dibentuk dan dipakai.

---

## 1. Hasil audit V2: kenapa tombol terasa berantakan

Temuan dari `selaras-theme.css`, `index.html`, dan `selaras-app.js`:

| # | Masalah di V2 | Dampak |
|---|---|---|
| 1 | **Bentuk campur aduk.** Ada pill (`9999px`), lingkaran (`50%`), dan kotak `4px` untuk fungsi yang sama (`.btn-gold` pill, `.btn-add-cart` lingkaran, `.btn-qty` & `.btn-copy-code` radius 4px) | Pengguna tidak bisa menebak mana tombol aksi, mana filter |
| 2 | **Gradien + glow emas** di `.btn-gold` (`linear-gradient(135deg, #d8a542, #b88628)` + `box-shadow` emas) | Ciri khas "AI slop": mengilap, murahan, tidak sesuai kesan kriya yang tenang |
| 3 | **Hover selalu `translateY(-2px)`/`scale(1.1)`** di hampir semua tombol | Semua tombol melompat, tidak ada yang terasa penting |
| 4 | **`transition: all 0.3s`** (`--transition-smooth`) | Boros dan bisa menganimasikan properti yang tidak perlu |
| 5 | **UPPERCASE + letter-spacing lebar** di `.btn-gold` dan `.btn-checkout` | Terbaca berteriak, apalagi untuk label panjang |
| 6 | **Label terlalu panjang**: "Simulasi Gateway Pembayaran Internasional", "Jelajahi Koleksi Bahari" | Tombol melebar, tidak rapi di mobile |
| 7 | **Dua tombol primer sejajar di hero**: emas solid + outline emas, serta satu lagi emas di navbar | Tidak jelas aksi utamanya |
| 8 | **`outline: none` global** pada `button, input, select, textarea` | Navigasi keyboard tidak punya indikator fokus (masalah aksesibilitas) |
| 9 | **Tombol icon-only 38px/40px/24px**, ukurannya berbeda-beda | Area sentuh di bawah 44px di mobile; `.btn-qty` hanya 24px |
| 10 | **Kontras teks tombol teks kecil**: `--melayu-gold-dark #996f21` di atas krem hanya **3,91:1** (`.btn-copy-swatch`, `.btn-copy-code`) | Gagal WCAG AA (minimal 4,5:1) |
| 11 | **Gaya inline di tombol**: `style="width:100%; justify-content:center"`, `style="padding:12px 28px"` | Ukuran tombol tidak bisa dikontrol dari satu tempat |
| 12 | **Badge keranjang merah `#c0392b`** | Warna di luar palet 60/30/10 |
| 13 | **Tombol bantu developer (Salin Hex, Salin CSS)** tampil setara dengan tombol belanja | Tombol internal dokumentasi bercampur dengan tombol toko |

**Intinya:** V2 punya satu gaya "tampil mewah" yang diterapkan ke semua tombol. V3 memberi setiap tombol **peran**, lalu bentuknya mengikuti perannya.

---

## 2. Prinsip tombol

1. **Bentuk menandakan fungsi.**
   - Persegi bersudut halus (radius 10px) → **aksi** (beli, kirim, bayar).
   - Pill → **filter / pilihan** (kategori, mata uang). Hanya itu.
   - Ikon → persegi 44×44 yang sama radiusnya dengan tombol aksi. Tidak ada lagi tombol lingkaran.
2. **Satu tombol primer per area.** Navbar, hero, kartu, drawer, dan modal masing-masing punya maksimal satu.
3. **Datar dan tegas.** Warna solid, tanpa gradien, tanpa glow. Kedalaman cukup dari border dan perubahan warna.
4. **Hover itu tenang.** Ganti warna saja. Tidak ada tombol yang melompat. Efek tekan (`:active`) turun 1px.
5. **Label pendek, kata kerja di depan.** Maksimal 3 kata. Sentence case, bukan UPPERCASE.
6. **Emas adalah sinyal, bukan hiasan.** Di atas permukaan gelap, emas = aksi utama. Di atas permukaan terang, aksi utama = hijau zamrud. Emas tidak dipakai sebagai warna teks di atas putih (kontras 2,64:1).
7. **Fokus selalu terlihat.** Cincin fokus emas 2px dengan jarak 2px.
8. **Satu ukuran, satu tempat.** Semua dimensi tombol datang dari token, bukan gaya inline.

---

## 3. Token

### 3.1 Warna (tetap 60 / 30 / 10)

```css
:root {
  /* Hijau zamrud — 60% */
  --melayu-green:        #0d3b2e;
  --melayu-green-dark:   #07221a;
  --melayu-green-light:  #165342;

  /* Krem pasir gading — 30% */
  --melayu-cream:        #f6eedb;
  --melayu-cream-light:  #fbf7ee;
  --melayu-cream-dark:   #e8dbbe;
  --melayu-white:        #ffffff;

  /* Emas songket — 10% */
  --melayu-gold:         #c99738;
  --melayu-gold-light:   #dfb257;
  --melayu-gold-dark:    #a87a26;
  --melayu-gold-text:    #7a5718;   /* BARU: emas untuk teks di atas terang */

  /* Teks */
  --melayu-text-main:    #14221c;
  --melayu-text-muted:   #53645b;
  --melayu-text-on-dark: #fbf7ee;

  /* Status: tetap selaras palet */
  --melayu-danger:       #9b2f26;   /* BARU: pengganti #c0392b / #b33939 */
}
```

Kontras yang sudah dihitung:

| Pasangan | Rasio | Keterangan |
|---|---|---|
| `#07221a` di atas `#c99738` | **6,36:1** | Teks tombol primer emas ✔ |
| `#07221a` di atas `#dfb257` | **8,50:1** | Hover primer emas ✔ |
| `#ffffff` di atas `#0d3b2e` | **12,48:1** | Tombol primer hijau ✔ |
| `#7a5718` di atas `#ffffff` | **6,55:1** | Tombol teks emas di terang ✔ |
| `#7a5718` di atas `#f6eedb` | **5,67:1** | Tombol teks emas di krem ✔ |
| `#fbf7ee` di atas `#9b2f26` | **6,94:1** | Tombol bahaya ✔ |
| `#c99738` di atas `#0d3b2e` | **4,74:1** | Emas sebagai teks/ikon di hijau ✔ |
| `#c99738` di atas `#ffffff` | 2,64:1 | ✘ Dilarang untuk teks |
| `#996f21` di atas `#f6eedb` (V2) | 3,91:1 | ✘ Penyebab perubahan ke `--melayu-gold-text` |

### 3.2 Bentuk, ukuran, gerak

```css
:root {
  /* Radius */
  --radius-btn:  10px;     /* semua tombol aksi + tombol ikon */
  --radius-chip: 9999px;   /* khusus filter & pilihan */
  --radius-sm:   8px;
  --radius-md:   14px;
  --radius-lg:   20px;

  /* Tinggi tombol */
  --btn-h-sm: 36px;        /* di dalam kartu, baris keranjang */
  --btn-h-md: 44px;        /* default, target sentuh minimum */
  --btn-h-lg: 52px;        /* CTA hero, checkout */

  /* Padding horizontal */
  --btn-px-sm: 14px;
  --btn-px-md: 20px;
  --btn-px-lg: 28px;

  /* Gerak: sebutkan properti, jangan pakai "all" */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --t-btn: background-color .18s var(--ease-out),
           border-color .18s var(--ease-out),
           color .18s var(--ease-out),
           transform .08s var(--ease-out);

  /* Fokus */
  --focus-ring: 0 0 0 2px var(--melayu-white), 0 0 0 4px var(--melayu-gold);
}
```

### 3.3 Tipografi tombol

| Properti | Nilai |
|---|---|
| Font | Plus Jakarta Sans |
| Bobot | 600 (sm: 600, lg: 700) |
| Ukuran | sm 0.8125rem · md 0.9rem · lg 1rem |
| Case | Sentence case, **tanpa** `text-transform: uppercase` |
| Letter-spacing | `0.01em` |
| Line-height | 1 (tinggi diatur oleh `--btn-h-*`) |

Playfair Display tetap untuk judul. Cinzel dan JetBrains Mono tidak dipakai di tombol toko. Mono hanya untuk blok kode dokumentasi.

---

## 4. Anatomi tombol

```
┌──────────────────────────────┐
│  [ikon 18px]  8px  Label     │   tinggi: 36 / 44 / 52
└──────────────────────────────┘
   padding-x: 14 / 20 / 28        radius: 10px
```

- Ikon di **kiri** untuk aksi (keranjang, unduh), di **kanan** hanya untuk panah navigasi ("Lihat koleksi →").
- Ikon: stroke 1.75–2, ujung garis membulat, ukuran 18px (lg: 20px). Warna ikut `currentColor`.
- Lebar tombol mengikuti isi. `.btn--block` (lebar penuh) hanya di drawer, modal, dan form di layar kecil.

---

## 5. Varian

### 5.1 Primary — satu aksi utama

| | Permukaan terang (krem/putih) | Permukaan gelap (hero, navbar, RFQ) |
|---|---|---|
| Latar | `--melayu-green` | `--melayu-gold` |
| Teks | `#ffffff` | `--melayu-green-dark` |
| Hover | `--melayu-green-light` | `--melayu-gold-light` |
| Active | `--melayu-green-dark` | `--melayu-gold-dark` |

Tanpa gradien, tanpa bayangan, tanpa border tambahan.

### 5.2 Secondary — aksi pendamping

Transparan dengan border 1.5px.

| | Terang | Gelap |
|---|---|---|
| Border | `--melayu-green` | `rgba(251,247,238,.45)` |
| Teks | `--melayu-green` | `--melayu-cream-light` |
| Hover | latar `rgba(13,59,46,.06)` | latar `rgba(251,247,238,.10)` |

### 5.3 Tertiary — tombol teks

Tanpa latar dan border. Dipakai untuk "Detail", "Lihat semua", "Hapus". Tinggi tetap `--btn-h-sm` agar mudah disentuh. Hover memunculkan garis bawah (`text-underline-offset: 3px`).

- Terang: teks `--melayu-green`; versi emas memakai `--melayu-gold-text`.
- Gelap: teks `--melayu-gold-light`.

### 5.4 Icon button

Persegi 44×44 (kecil: 36×36), radius `--radius-btn`, border 1px, ikon 18px. **Wajib** punya `aria-label`.

- Tambah ke keranjang di kartu produk: gaya primary-hijau berukuran 36×36 → pada kartu, ukuran 44 di mobile.
- Keranjang di navbar dan tutup drawer: gaya secondary gelap/terang.

### 5.5 Chip (filter & pilihan)

Satu-satunya tempat pill dipakai.

- Default: latar `#f4ede0`, teks `--melayu-text-main`, border transparan.
- Hover: latar `--melayu-cream-dark`.
- Terpilih (`aria-pressed="true"` / `aria-selected="true"`): latar `--melayu-green`, teks putih. **Tanpa** bayangan dan border emas.
- Tinggi 36px, padding 16px.

Dipakai untuk: kategori katalog, pilihan mata uang, metode pembayaran.

### 5.6 Danger

Hanya untuk aksi yang menghapus: "Kosongkan keranjang", "Hapus". Gaya tertiary dengan teks `--melayu-danger`. Latar merah solid hanya untuk konfirmasi destruktif di modal.

### 5.7 Quantity stepper

Satu kontrol terpadu: `[−] 2 [+]`, tinggi 36px, border 1px, radius 10px. Tombol − dan + berukuran 36×36, angkanya di tengah dengan lebar tetap. Bukan tiga kotak kecil 24px yang terpisah.

### 5.8 Tombol dokumentasi (Salin Hex / Salin CSS)

Bukan bagian dari toko. Pisahkan ke class `.btn-doc`: tinggi 32px, border 1px, teks `--melayu-gold-text`, ikon salin 14px. Setelah klik, label berubah menjadi "Tersalin" selama 1,5 detik.

---

## 6. State

| State | Perilaku |
|---|---|
| Default | Sesuai varian |
| Hover | Hanya warna latar/border/teks berubah. Tidak ada `translateY` atau `scale` |
| Focus-visible | `box-shadow: var(--focus-ring)`. Berlaku di semua varian. **Jangan** pernah `outline: none` tanpa pengganti |
| Active | `transform: translateY(1px)` dan latar satu tingkat lebih gelap |
| Disabled | Opasitas 0,45, `cursor: not-allowed`, tanpa hover |
| Loading | Label diganti "Memproses…", spinner 16px di kiri, `aria-busy="true"`, klik dinonaktifkan |
| Berhasil (sesaat) | "Ditambahkan" dengan ikon centang selama 1,2 detik, lalu kembali normal |

Hormati `prefers-reduced-motion`: matikan `transform` dan transisi.

---

## 7. Penempatan: siapa primer di tiap area

| Area | Primary | Secondary / Tertiary |
|---|---|---|
| Navbar | *(tidak ada)* | Ikon keranjang (secondary gelap), pemilih mata uang (chip gelap), "Lihat karya" → **dijadikan tautan teks** |
| Hero | **Jelajahi koleksi** (emas) | **Lihat pengrajin** (secondary gelap). Tombol "Simulasi Gateway" dipindahkan keluar dari hero |
| Katalog | *(tidak ada)* | Chip kategori |
| Kartu produk | Ikon keranjang (hijau, 36px) | **Detail** (tertiary) |
| Modal produk | **Tambah ke keranjang** (hijau, lg) | **Tutup** (ikon) |
| Drawer keranjang | **Lanjut ke pembayaran** (hijau, block, lg) | Hapus (tertiary danger), stepper |
| Modal pembayaran | **Bayar sekarang** (hijau, lg) | Batal (tertiary), tab metode (chip) |
| RFQ B2B | **Kirim permintaan** (emas, block di mobile) | — |
| Dokumentasi warna | — | Salin (`.btn-doc`) |

Alasan memindahkan "Simulasi Gateway Pembayaran Internasional": itu fitur demo, bukan ajakan untuk pembeli. Taruh sebagai tautan kecil di footer atau di halaman internal.

---

## 8. Salinan label (UX writing)

| Sebelum (V2) | Sesudah (V3) |
|---|---|
| LIHAT KARYA → | Lihat karya |
| Jelajahi Koleksi Bahari | Jelajahi koleksi |
| Simulasi Gateway Pembayaran Internasional | *(pindah dari hero)*, atau "Coba pembayaran" |
| Detail | Detail |
| LANJUT KE CHECKOUT | Lanjut ke pembayaran |
| Kirim / Submit | Kirim permintaan |
| Salin | Salin hex → "Tersalin" |

Aturan: kata kerja di depan, maksimal 3 kata, tanpa tanda seru, tanpa kata "Premium/Eksklusif/Mewah" di tombol.

---

## 9. CSS pengganti (siap tempel)

Letakkan di akhir `selaras-theme.css`, lalu hapus `.btn-gold`, `.btn-outline-gold`, `.btn-add-cart`, `.btn-checkout`, `.btn-qty`, `.btn-copy-swatch`, `.btn-copy-code`, `.pill-btn`, `.currency-btn`, `.cart-trigger`, dan `.btn-quick-view` yang lama.

```css
/* ===== Reset tombol: jangan buang fokus ===== */
button, input, select, textarea { font: inherit; border: 0; }
button { cursor: pointer; background: none; color: inherit; }

:where(button, a, input, select, textarea):focus-visible {
  outline: none;
  box-shadow: var(--focus-ring);
}
.on-dark :where(button, a):focus-visible {
  box-shadow: 0 0 0 2px var(--melayu-green-dark), 0 0 0 4px var(--melayu-gold-light);
}

/* ===== Dasar ===== */
.btn {
  --_bg: var(--melayu-green);
  --_fg: #fff;
  --_bd: transparent;
  --_bg-hover: var(--melayu-green-light);
  --_bg-active: var(--melayu-green-dark);

  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: var(--btn-h-md); padding: 0 var(--btn-px-md);
  border: 1.5px solid var(--_bd); border-radius: var(--radius-btn);
  background: var(--_bg); color: var(--_fg);
  font-size: .9rem; font-weight: 600; line-height: 1; letter-spacing: .01em;
  white-space: nowrap; text-decoration: none; user-select: none;
  transition: var(--t-btn);
}
.btn:hover  { background: var(--_bg-hover); }
.btn:active { background: var(--_bg-active); transform: translateY(1px); }
.btn svg    { width: 18px; height: 18px; flex: none; }
.btn[disabled], .btn[aria-disabled="true"] {
  opacity: .45; cursor: not-allowed; pointer-events: none;
}
.btn[aria-busy="true"] { pointer-events: none; }

/* ===== Ukuran ===== */
.btn--sm { height: var(--btn-h-sm); padding: 0 var(--btn-px-sm); font-size: .8125rem; }
.btn--lg { height: var(--btn-h-lg); padding: 0 var(--btn-px-lg); font-size: 1rem; font-weight: 700; }
.btn--block { width: 100%; }

/* ===== Primary di permukaan gelap = emas ===== */
.on-dark .btn--primary {
  --_bg: var(--melayu-gold); --_fg: var(--melayu-green-dark);
  --_bg-hover: var(--melayu-gold-light); --_bg-active: var(--melayu-gold-dark);
}

/* ===== Secondary ===== */
.btn--secondary {
  --_bg: transparent; --_fg: var(--melayu-green); --_bd: var(--melayu-green);
  --_bg-hover: rgba(13, 59, 46, .06); --_bg-active: rgba(13, 59, 46, .12);
}
.on-dark .btn--secondary {
  --_fg: var(--melayu-cream-light); --_bd: rgba(251, 247, 238, .45);
  --_bg-hover: rgba(251, 247, 238, .10); --_bg-active: rgba(251, 247, 238, .16);
}

/* ===== Tertiary (teks) ===== */
.btn--text {
  --_bg: transparent; --_fg: var(--melayu-green);
  --_bg-hover: transparent; --_bg-active: transparent;
  height: var(--btn-h-sm); padding: 0 8px;
}
.btn--text:hover { text-decoration: underline; text-underline-offset: 3px; }
.btn--text.is-gold { --_fg: var(--melayu-gold-text); }
.on-dark .btn--text { --_fg: var(--melayu-gold-light); }
.btn--text.is-danger { --_fg: var(--melayu-danger); }

/* ===== Icon button ===== */
.btn--icon { width: var(--btn-h-md); padding: 0; }
.btn--icon.btn--sm { width: var(--btn-h-sm); }
.btn--icon.btn--secondary { --_bd: rgba(13, 59, 46, .25); }
.on-dark .btn--icon.btn--secondary { --_bd: rgba(251, 247, 238, .30); --_fg: var(--melayu-gold-light); }

/* ===== Chip: filter & pilihan ===== */
.chip {
  height: 36px; padding: 0 16px; border-radius: var(--radius-chip);
  background: #f4ede0; color: var(--melayu-text-main);
  font-size: .8125rem; font-weight: 600; border: 1px solid transparent;
  transition: var(--t-btn);
}
.chip:hover { background: var(--melayu-cream-dark); }
.chip[aria-pressed="true"], .chip[aria-selected="true"], .chip.is-active {
  background: var(--melayu-green); color: #fff;
}
.on-dark .chip {
  background: rgba(251, 247, 238, .08); color: var(--melayu-cream-light);
  border-color: rgba(251, 247, 238, .25);
}
.on-dark .chip:hover { background: rgba(251, 247, 238, .14); }

/* ===== Stepper jumlah ===== */
.stepper {
  display: inline-flex; align-items: center; height: var(--btn-h-sm);
  border: 1px solid var(--melayu-border); border-radius: var(--radius-btn);
  overflow: hidden; background: #fff;
}
.stepper button {
  width: var(--btn-h-sm); height: 100%;
  color: var(--melayu-green); font-weight: 700;
  transition: var(--t-btn);
}
.stepper button:hover { background: rgba(13, 59, 46, .06); }
.stepper output { min-width: 32px; text-align: center; font-weight: 600; font-size: .85rem; }

/* ===== Tombol dokumentasi ===== */
.btn-doc {
  display: inline-flex; align-items: center; gap: 6px;
  height: 32px; padding: 0 12px;
  border: 1px solid rgba(122, 87, 24, .35); border-radius: var(--radius-btn);
  color: var(--melayu-gold-text); font-size: .75rem; font-weight: 600;
  transition: var(--t-btn);
}
.btn-doc:hover { background: rgba(201, 151, 56, .12); }

/* ===== Badge keranjang ===== */
.cart-count {
  position: absolute; top: -6px; right: -6px;
  min-width: 18px; height: 18px; padding: 0 5px; border-radius: 9px;
  background: var(--melayu-gold); color: var(--melayu-green-dark);
  font-size: .68rem; font-weight: 700; display: grid; place-items: center;
  border: 2px solid var(--melayu-green);
}

/* ===== Gerak dikurangi ===== */
@media (prefers-reduced-motion: reduce) {
  .btn, .chip, .stepper button, .btn-doc { transition: none; }
  .btn:active { transform: none; }
}

/* ===== Layar sentuh: target 44px ===== */
@media (pointer: coarse) {
  .btn--sm.btn--icon { width: 44px; height: 44px; }
  .chip { height: 40px; }
}
```

---

## 10. Peta migrasi (class lama → class baru)

| Elemen | Class lama | Class baru |
|---|---|---|
| CTA hero utama | `btn-gold` | `btn btn--primary btn--lg` (induk `.on-dark`) |
| CTA hero kedua | `btn-outline-gold` | `btn btn--secondary btn--lg` |
| "Lihat Karya" di navbar | `btn-gold` | `btn btn--text` |
| Keranjang navbar | `cart-trigger` | `btn btn--icon btn--secondary` |
| Pemilih mata uang | `currency-btn` | `chip` (dalam `.on-dark`) |
| Filter kategori | `pill-btn` | `chip` + `aria-pressed` |
| Tambah ke keranjang (kartu) | `btn-add-cart` | `btn btn--primary btn--icon btn--sm` |
| Detail (kartu) | `btn-quick-view` | `btn btn--text btn--sm` |
| Tombol − / + | `btn-qty` | `.stepper` |
| Hapus item | `btn-remove-item` | `btn btn--text btn--sm is-danger` |
| Checkout | `btn-checkout` | `btn btn--primary btn--lg btn--block` |
| Tab metode bayar | `pay-tab-btn` | `chip` dengan ikon |
| Bayar sekarang | `btn-gold` + inline style | `btn btn--primary btn--lg` |
| Kirim RFQ | `btn-gold` + inline style | `btn btn--primary btn--lg btn--block` (induk `.on-dark`) |
| Salin hex / CSS | `btn-copy-swatch`, `btn-copy-code` | `btn-doc` |
| Tutup drawer / modal | `btn-close-drawer` | `btn btn--icon btn--sm btn--secondary` + `aria-label="Tutup"` |

Setelah migrasi, **hapus semua `style="..."` pada tombol**. Lebar penuh lewat `.btn--block`, ukuran lewat `.btn--sm/.btn--lg`.

---

## 11. Aturan Do & Don't

**Do**
- Beri tiap tombol peran: primary, secondary, teks, ikon, atau chip.
- Pakai hijau untuk primer di area terang, emas untuk primer di area gelap.
- Beri `aria-label` pada semua tombol ikon.
- Pakai `aria-pressed` pada chip filter.
- Cek tampilan 360px: label tidak boleh terpotong atau membungkus.

**Don't**
- Jangan pakai `linear-gradient`, glow, atau `box-shadow` berwarna pada tombol.
- Jangan `transition: all`.
- Jangan `transform: scale()` / `translateY(-2px)` saat hover.
- Jangan UPPERCASE + letter-spacing lebar.
- Jangan teks emas `#c99738` di atas putih atau krem.
- Jangan dua tombol primer dalam satu area.
- Jangan tombol lingkaran. Ikon pakai persegi radius 10px.
- Jangan gaya inline di tombol.
- Jangan emoji sebagai ikon tombol.

---

## 12. Daftar periksa sebelum rilis

- [ ] Hanya ada satu varian primer yang terlihat di tiap area (navbar, hero, drawer, modal).
- [ ] Semua tombol aksi berradius 10px; hanya chip yang pill.
- [ ] Tab dengan keyboard: setiap tombol punya cincin fokus emas yang terlihat.
- [ ] Semua target sentuh ≥ 44px di perangkat `pointer: coarse`.
- [ ] Kontras teks tombol ≥ 4,5:1 (lihat tabel 3.1).
- [ ] Tidak ada `style=` pada elemen `<button>` atau `.btn`.
- [ ] Tidak ada `transition: all` pada tombol.
- [ ] Label tombol ≤ 3 kata dan sentence case.
- [ ] `prefers-reduced-motion` dihormati.
- [ ] Warna badge dan status hanya memakai token palet.

---

## 13. Bagian lain dari sistem desain (tidak berubah)

- **Palet:** Hijau Zamrud 60% · Krem Pasir 30% · Emas Songket 10% (lihat bagian 3.1 untuk token terbaru).
- **Tipografi:** Playfair Display untuk judul, Plus Jakarta Sans untuk isi, JetBrains Mono hanya untuk blok kode.
- **Bayangan kartu:** `--shadow-subtle` dan `--shadow-medium` tetap untuk kartu, bukan untuk tombol.
- **Fotografi:** gambar produk di `assets/images/` (kalung, cincin, gelang, anting, bros, mangkuk) tetap jadi fokus visual. Tombol tidak boleh menutupi subjek foto.
- **Nuansa:** tenang, hangat, bernilai kriya. Detail Melayu hadir lewat warna, tipografi, dan foto, bukan lewat dekorasi di tombol.
