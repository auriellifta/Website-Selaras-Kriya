/**
 * SELARAS KRIYA — Logika Interaktif Platform Katalog & Pembayaran Internasional (V3)
 * Berbasis Potensi Maritim & Kerajinan Kerang Kepulauan Riau (2026)
 * Sistem Tombol & Antarmuka Tenang, Bermartabat, dan Aksesibel
 */

// 1. Data Kurs Mata Uang (Base IDR)
const EXCHANGE_RATES = {
  IDR: { rate: 1, symbol: 'Rp', name: 'IDR - Rupiah' },
  USD: { rate: 0.0000625, symbol: '$', name: 'USD - US Dollar' },
  SGD: { rate: 0.0000833, symbol: 'S$', name: 'SGD - Singapore Dollar' },
  EUR: { rate: 0.0000571, symbol: '€', name: 'EUR - Euro' },
  MYR: { rate: 0.0002778, symbol: 'RM', name: 'MYR - Ringgit Malaysia' }
};

let currentCurrency = 'IDR';

// 2. Data Produk Kerajinan Melayu Terkurasi
const PRODUCTS_DATA = [
  {
    id: 1,
    title: 'Liontin Kerang Mutiara Senja',
    category: 'aksesoris',
    categoryLabel: 'Aksesoris Leher',
    priceIdr: 380000,
    origin: 'Pesisir Bintan',
    image: 'assets/images/necklace.jpg',
    artisan: 'Mak Minah',
    material: 'Kerang Simping & Mutiara Air Laut, Rantai Sepuh Emas 24K',
    description: 'Liontin dengan kelopak kerang simping alami bergradasi pelangi pasir gading, dipadukan mutiara air laut Pulau Penyengat dan ukiran filigree Melayu.'
  },
  {
    id: 2,
    title: 'Cincin Songket Melaka Sepuh Emas',
    category: 'aksesoris',
    categoryLabel: 'Aksesoris Jari',
    priceIdr: 450000,
    origin: 'Pulau Penyengat',
    image: 'assets/images/ring.jpg',
    artisan: 'Mak Minah',
    material: 'Mutiara Bahari Pilihan, Kuningan Sepuh Emas Diraja Anti Karat Laut',
    description: 'Cincin mahkota terinspirasi ornamen songket Melayu kuno dengan mutiara gading bulat sempurna, tahan air asin untuk penggunaan sehari-hari.'
  },
  {
    id: 3,
    title: 'Wadah Mosaik Kerang Simping Berkilau',
    category: 'dekorasi',
    categoryLabel: 'Dekorasi Meja',
    priceIdr: 420000,
    origin: 'Teluk Sebong, Bintan',
    image: 'assets/images/bowl.jpg',
    artisan: 'Pak Rudi Bahari',
    material: 'Mosaik Cangkang Kerang Simping Pesisir, Lis Kuningan Tempa Tangan',
    description: 'Mangkuk pajangan mewah berbahan mozaik cangkang kerang kapis alami hasil tangkapan nelayan pesisir Teluk Sebong.'
  },
  {
    id: 4,
    title: 'Bros & Anting Kristal Bahari Diraja',
    category: 'cendera-mata',
    categoryLabel: 'Cendera Mata',
    priceIdr: 190000,
    origin: 'Kota Tanjungpinang',
    image: 'assets/images/earrings.jpg',
    artisan: 'Ibu Marlina',
    material: 'Cangkang Kerang Mini Emas, Kristal Safir Laut Selat Riau',
    description: 'Sepasang anting gantung berdesain kerang laut bersalut emas dengan liontin kristal safir biru melambangkan kedalaman laut Melayu.'
  },
  {
    id: 5,
    title: 'Gelang Selat Malaka Ukir Gelombang',
    category: 'aksesoris',
    categoryLabel: 'Gelang Adat',
    priceIdr: 345000,
    origin: 'Dompak, Kepri',
    image: 'assets/images/bracelet.jpg',
    artisan: 'Pak Rudi Bahari',
    material: 'Kuningan Ukir Ombak, Bertabur Mutiara Pesisir Asli',
    description: 'Gelang manset royal berukir ombak laut Kepulauan Riau yang elegan, disematkan mutiara pesisir asli dengan pengunci ergonomis.'
  },
  {
    id: 6,
    title: 'Bros Kerang Gonggong Songket Diraja',
    category: 'cendera-mata',
    categoryLabel: 'Cendera Mata Khas Kepri',
    priceIdr: 225000,
    origin: 'Natuna & Anambas',
    image: 'assets/images/brooch.jpg',
    artisan: 'Ibu Marlina',
    material: 'Cangkang Siput Gonggong Pilihan, Kawat Emas Songket Halus, Butir Mutiara',
    description: 'Bros khas tanah Segantang Lada menggunakan siput gonggong yang diasah mengkilau seperti gading, dihiasi sulaman kawat emas berpola bunga tanjung.'
  },
  {
    id: 7,
    title: 'Arca Kerang Beremas 3D Artefak Koleksi',
    category: 'dekorasi',
    categoryLabel: 'Artefak Kolektor',
    priceIdr: 1250000,
    origin: 'Museum Bahari Melayu',
    image: 'assets/images/hero_shell_3d.jpg',
    artisan: 'Konsorsium Pengrajin Selaras',
    material: 'Cangkang Keong Laut Raksasa Terpilih, Lapisan Emas Murni 24K',
    description: 'Karya mahakarya 3D yang merepresentasikan arca kriya maritim abad ke-18, menggabungkan ukiran pucuk rebung dan kilau nacre laut dalam.'
  },
  {
    id: 8,
    title: 'Pendant Mutiara Gading Penyengat',
    category: 'fashion',
    categoryLabel: 'Fashion & Wastra',
    priceIdr: 280000,
    origin: 'Pulau Penyengat',
    image: 'assets/images/necklace.jpg',
    artisan: 'Mak Minah',
    material: 'Mutiara Air Asin Pulau Penyengat, Tali Sutra Anyam Songket',
    description: 'Perhiasan leher yang memadukan kelembutan tenun songket dengan kilau mutiara alami dari perairan bersejarah Kesultanan Riau-Lingga.'
  }
];

// 3. State Keranjang Belanja
let cart = [
  { productId: 1, quantity: 1 },
  { productId: 2, quantity: 1 }
];

// Inisialisasi Aplikasi Saat DOM Siap
document.addEventListener('DOMContentLoaded', () => {
  renderCatalog(PRODUCTS_DATA);
  updateCartUI();
  setupCurrencyDropdown();
  setupMobileNav();
  setupCategoryFilters();
  setupSearchInput();
  setupTiltEffect();
  setupCheckoutFlow();
  setupRFQCalculator();
});

// Format Harga Sesuai Kurs Aktif
function formatCurrency(amountIdr) {
  const currency = EXCHANGE_RATES[currentCurrency] || EXCHANGE_RATES.IDR;
  const converted = amountIdr * currency.rate;

  if (currentCurrency === 'IDR') {
    return `${currency.symbol} ${Math.round(converted).toLocaleString('id-ID')}`;
  } else {
    return `${currency.symbol} ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

// Render Katalog Produk
function renderCatalog(products) {
  const grid = document.getElementById('product-grid');
  const countBadge = document.getElementById('product-count');
  
  if (!grid) return;

  if (countBadge) {
    countBadge.textContent = `${products.length} karya ditemukan`;
  }

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--melayu-text-muted);">
        <p style="font-size: 1.05rem; margin-bottom: 12px;">Tidak ditemukan karya kriya yang sesuai pencarian.</p>
        <button class="btn btn--secondary btn--sm" onclick="resetFilters()">Tampilkan semua koleksi</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-media" onclick="openProductModal(${p.id})">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <span class="product-badge-origin">${p.origin}</span>
      </div>
      <div class="product-details">
        <span class="product-category">${p.categoryLabel}</span>
        <h3 class="product-title" onclick="openProductModal(${p.id})" style="cursor: pointer;">${p.title}</h3>
        <p class="product-meta-desc">${p.material}</p>
        <div class="product-footer">
          <div class="product-price-box">
            <span class="product-price-label">Harga Karya</span>
            <span class="product-price" data-price-idr="${p.priceIdr}">${formatCurrency(p.priceIdr)}</span>
          </div>
          <div class="product-actions">
            <button class="btn btn--text btn--sm" onclick="openProductModal(${p.id})" title="Lihat Cerita & Spesifikasi">Detail</button>
            <button class="btn btn--primary btn--icon btn--sm" onclick="addToCart(${p.id})" aria-label="Tambah ${p.title} ke tas">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  `).join('');
}

// Filter Kategori Menggunakan Chip V3
function setupCategoryFilters() {
  const chips = document.querySelectorAll('.category-filter-pills .chip, .category-filter-pills .pill-btn');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => {
        c.classList.remove('is-active', 'active');
        c.setAttribute('aria-pressed', 'false');
      });
      chip.classList.add('is-active', 'active');
      chip.setAttribute('aria-pressed', 'true');
      const cat = chip.getAttribute('data-category');
      
      const searchVal = document.getElementById('search-input')?.value.toLowerCase().trim() || '';
      applyCombinedFilter(cat, searchVal);
    });
  });
}

// Pencarian Real-time
function setupSearchInput() {
  const input = document.getElementById('search-input');
  if (!input) return;

  input.addEventListener('input', (e) => {
    const activeChip = document.querySelector('.category-filter-pills .chip.active, .category-filter-pills .chip.is-active, .category-filter-pills .pill-btn.active');
    const activeCategory = activeChip?.getAttribute('data-category') || 'all';
    applyCombinedFilter(activeCategory, e.target.value.toLowerCase().trim());
  });
}

function applyCombinedFilter(category, keyword) {
  let filtered = PRODUCTS_DATA;
  if (category && category !== 'all') {
    filtered = filtered.filter(p => p.category === category);
  }
  if (keyword) {
    filtered = filtered.filter(p => 
      p.title.toLowerCase().includes(keyword) ||
      p.material.toLowerCase().includes(keyword) ||
      p.origin.toLowerCase().includes(keyword) ||
      p.artisan.toLowerCase().includes(keyword)
    );
  }
  renderCatalog(filtered);
}

function resetFilters() {
  const chips = document.querySelectorAll('.category-filter-pills .chip, .category-filter-pills .pill-btn');
  chips.forEach(c => {
    c.classList.remove('is-active', 'active');
    c.setAttribute('aria-pressed', 'false');
  });
  const allChip = document.querySelector('.category-filter-pills [data-category="all"]');
  if (allChip) {
    allChip.classList.add('is-active', 'active');
    allChip.setAttribute('aria-pressed', 'true');
  }
  const input = document.getElementById('search-input');
  if (input) input.value = '';
  renderCatalog(PRODUCTS_DATA);
}

// Setup Currency Switcher
function setupCurrencyDropdown() {
  const btn = document.getElementById('currency-btn');
  const menu = document.getElementById('currency-menu');
  const items = document.querySelectorAll('.currency-item');

  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const expanded = menu.classList.toggle('show');
    btn.setAttribute('aria-expanded', expanded);
  });

  document.addEventListener('click', () => {
    menu.classList.remove('show');
    btn.setAttribute('aria-expanded', 'false');
  });

  items.forEach(item => {
    item.addEventListener('click', () => {
      const code = item.getAttribute('data-currency');
      if (code && EXCHANGE_RATES[code]) {
        currentCurrency = code;
        const codeSpan = btn.querySelector('.curr-code');
        if (codeSpan) codeSpan.textContent = code;
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        refreshAllPrices();
        updateCartUI();
        showToast(`Mata uang diubah ke ${EXCHANGE_RATES[code].name}`);
      }
    });
  });
}

// Setup Navigasi Mobile Drawer
function setupMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const panel = document.getElementById('mobile-nav-panel');

  if (!toggleBtn || !panel) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = panel.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  panel.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      panel.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== toggleBtn) {
      panel.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

function refreshAllPrices() {
  document.querySelectorAll('[data-price-idr]').forEach(el => {
    const idr = parseFloat(el.getAttribute('data-price-idr'));
    if (!isNaN(idr)) {
      el.textContent = formatCurrency(idr);
    }
  });
}

// Manajemen Keranjang (Cart)
function addToCart(productId) {
  const existing = cart.find(item => item.productId === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ productId, quantity: 1 });
  }
  updateCartUI();
  const product = PRODUCTS_DATA.find(p => p.id === productId);
  showToast(`"${product?.title || 'Karya'}" berhasil ditambahkan ke tas.`);
}

function updateCartQty(productId, change) {
  const idx = cart.findIndex(i => i.productId === productId);
  if (idx !== -1) {
    cart[idx].quantity += change;
    if (cart[idx].quantity <= 0) {
      cart.splice(idx, 1);
    }
  }
  updateCartUI();
}

function removeFromCart(productId) {
  cart = cart.filter(i => i.productId !== productId);
  updateCartUI();
  showToast('Item dihapus dari tas belanja.');
}

function updateCartUI() {
  const countEls = document.querySelectorAll('.cart-count');
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  countEls.forEach(el => el.textContent = totalCount);

  const cartBody = document.getElementById('cart-items-container');
  const cartSubtotalEl = document.getElementById('cart-subtotal-val');
  const cartTotalEl = document.getElementById('cart-total-val');
  const shippingValEl = document.getElementById('cart-shipping-val');

  if (!cartBody) return;

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart-empty-state">
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="var(--melayu-gold)" stroke-width="1.5" style="margin: 0 auto 12px;">
          <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p style="font-size: 0.95rem; color: var(--melayu-text-muted);">Tas kriya Anda masih kosong.</p>
        <button class="btn btn--secondary btn--sm" style="margin-top: 14px;" onclick="closeCartDrawer()">Jelajahi karya</button>
      </div>
    `;
    if (cartSubtotalEl) cartSubtotalEl.textContent = formatCurrency(0);
    if (cartTotalEl) cartTotalEl.textContent = formatCurrency(0);
    return;
  }

  let subtotalIdr = 0;

  cartBody.innerHTML = cart.map(item => {
    const prod = PRODUCTS_DATA.find(p => p.id === item.productId);
    if (!prod) return '';
    const itemTotal = prod.priceIdr * item.quantity;
    subtotalIdr += itemTotal;

    return `
      <div class="cart-item">
        <img class="cart-item-img" src="${prod.image}" alt="${prod.title}">
        <div class="cart-item-info">
          <div class="cart-item-title">${prod.title}</div>
          <div class="cart-item-price">${formatCurrency(prod.priceIdr)}</div>
          <div class="stepper" style="margin-top: 6px;">
            <button type="button" onclick="updateCartQty(${prod.id}, -1)" aria-label="Kurangi jumlah">−</button>
            <output>${item.quantity}</output>
            <button type="button" onclick="updateCartQty(${prod.id}, 1)" aria-label="Tambah jumlah">+</button>
          </div>
        </div>
        <button class="btn btn--text btn--sm is-danger" onclick="removeFromCart(${prod.id})" aria-label="Hapus item">Hapus</button>
      </div>
    `;
  }).join('');

  const isInternational = currentCurrency !== 'IDR';
  const shippingIdr = isInternational ? 250000 : 25000;
  const totalIdr = subtotalIdr + shippingIdr;

  if (cartSubtotalEl) cartSubtotalEl.textContent = formatCurrency(subtotalIdr);
  if (shippingValEl) shippingValEl.textContent = isInternational ? `${formatCurrency(shippingIdr)} (DHL Int'l)` : `${formatCurrency(shippingIdr)} (Pos/JNE)`;
  if (cartTotalEl) cartTotalEl.textContent = formatCurrency(totalIdr);
}

function openCartDrawer() {
  document.getElementById('cart-drawer')?.classList.add('active');
  document.getElementById('drawer-backdrop')?.classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cart-drawer')?.classList.remove('active');
  document.getElementById('drawer-backdrop')?.classList.remove('active');
}

// 4. Modal Detail Produk
function openProductModal(productId) {
  const prod = PRODUCTS_DATA.find(p => p.id === productId);
  if (!prod) return;

  const modal = document.getElementById('product-detail-modal');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-header">
      <h3>${prod.title}</h3>
      <button class="btn btn--icon btn--sm btn--secondary on-dark" onclick="closeProductModal()" aria-label="Tutup">✕</button>
    </div>
    <div class="modal-body" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
      <div style="border-radius: var(--radius-md); overflow: hidden; border: 1.5px solid var(--melayu-border-gold); height: 320px;">
        <img src="${prod.image}" alt="${prod.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div>
        <span class="product-category">${prod.categoryLabel} · ${prod.origin}</span>
        <h2 style="font-family: var(--font-display); font-size: 1.45rem; color: var(--melayu-green); margin: 6px 0 10px;">${prod.title}</h2>
        <div style="font-family: var(--font-mono); font-size: 1.3rem; font-weight: 700; color: var(--melayu-green); margin-bottom: 14px;">
          ${formatCurrency(prod.priceIdr)}
        </div>
        <p style="font-size: 0.86rem; color: var(--melayu-text-muted); line-height: 1.55; margin-bottom: 16px;">${prod.description}</p>
        
        <div style="background: var(--melayu-cream); padding: 12px 14px; border-radius: var(--radius-sm); margin-bottom: 18px;">
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--melayu-green); text-transform: uppercase; margin-bottom: 4px;">Informasi Kriya & Nilai Budaya</div>
          <div style="font-size: 0.78rem; color: var(--melayu-text-main); margin-bottom: 2px;">• Pengrajin: <strong>${prod.artisan}</strong></div>
          <div style="font-size: 0.78rem; color: var(--melayu-text-main); margin-bottom: 2px;">• Material: ${prod.material}</div>
          <div style="font-size: 0.78rem; color: var(--melayu-text-main); margin-bottom: 2px;">• Keaslian: Cangkang Alami & Ukiran Tradisional Melayu</div>
          <div style="font-size: 0.78rem; color: var(--melayu-text-main);">• Standar Mutu: Pelapis Anti-Air Asin 24K</div>
        </div>

        <div>
          <button class="btn btn--primary btn--lg btn--block" onclick="addToCart(${prod.id}); closeProductModal(); openCartDrawer();">
            Tambah ke tas belanja
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.getElementById('modal-backdrop')?.classList.add('active');
}

function closeProductModal() {
  dispose3DScene();
  document.getElementById('product-detail-modal')?.classList.remove('active');
  document.getElementById('modal-backdrop')?.classList.remove('active');
}

// 5. Checkout & Sistem Pembayaran Internasional
let selectedPaymentMethod = 'card';
let initialCheckoutModalContent = null;
let qrisCountdownInterval = null;

function setupCheckoutFlow() {
  const payTabs = document.querySelectorAll('.payment-tabs .chip, .pay-tab-btn');
  payTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      payTabs.forEach(t => {
        t.classList.remove('active', 'is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active', 'is-active');
      tab.setAttribute('aria-selected', 'true');
      selectedPaymentMethod = tab.getAttribute('data-method');
      switchPaymentView(selectedPaymentMethod);
    });
  });

  const countrySelect = document.getElementById('checkout-country-select');
  if (countrySelect && !countrySelect.dataset.hasListener) {
    countrySelect.dataset.hasListener = 'true';
    countrySelect.addEventListener('change', () => {
      updateCheckoutSummary();
    });
  }
}

function setupCardInputListeners() {
  const ccNumInput = document.getElementById('card-number-input');
  const ccHolderInput = document.getElementById('card-holder-input');
  const ccExpInput = document.getElementById('card-expiry-input');

  if (ccNumInput) {
    ccNumInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let matches = v.match(/\d{4,16}/g);
      let match = (matches && matches[0]) || '';
      let parts = [];
      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }
      if (parts.length) {
        e.target.value = parts.join(' ');
      }
      const preview = document.getElementById('preview-cc-num');
      if (preview) preview.textContent = e.target.value || '•••• •••• •••• 4242';
    });
  }

  if (ccHolderInput) {
    ccHolderInput.addEventListener('input', (e) => {
      const preview = document.getElementById('preview-cc-holder');
      if (preview) preview.textContent = (e.target.value || 'NAMA PEMEGANG').toUpperCase();
    });
  }

  if (ccExpInput) {
    ccExpInput.addEventListener('input', (e) => {
      const preview = document.getElementById('preview-cc-exp');
      if (preview) preview.textContent = e.target.value || 'MM/YY';
    });
  }
}

function startQRISTimer() {
  if (qrisCountdownInterval) clearInterval(qrisCountdownInterval);
  let secondsLeft = 15 * 60;
  const timerEl = document.getElementById('qris-timer');
  if (!timerEl) return;

  qrisCountdownInterval = setInterval(() => {
    secondsLeft--;
    if (secondsLeft <= 0) {
      clearInterval(qrisCountdownInterval);
      if (timerEl) timerEl.textContent = '00:00 (Kedaluwarsa)';
      return;
    }
    const mins = Math.floor(secondsLeft / 60);
    const secs = secondsLeft % 60;
    if (timerEl) {
      timerEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
  }, 1000);
}

function switchPaymentView(method) {
  const container = document.getElementById('payment-method-views');
  if (!container) return;

  if (method === 'card') {
    container.innerHTML = `
      <div class="credit-card-preview">
        <div class="cc-chip"></div>
        <div class="cc-number" id="preview-cc-num">•••• •••• •••• 4242</div>
        <div class="cc-footer">
          <div>
            <div style="font-size: 0.6rem; opacity: 0.7;">CARDHOLDER</div>
            <div class="cc-holder-name" id="preview-cc-holder">AURIEL LIFTA EKERIANA</div>
          </div>
          <div>
            <div style="font-size: 0.6rem; opacity: 0.7;">EXPIRES</div>
            <div class="cc-expiry" id="preview-cc-exp">08/29</div>
          </div>
        </div>
      </div>

      <div class="checkout-form-grid" style="margin-top: 12px;">
        <div class="form-group full-width">
          <label class="form-label" for="card-number-input">Nomor Kartu (Visa / Mastercard / JCB / Amex)</label>
          <input type="text" class="form-input" id="card-number-input" placeholder="4242 •••• •••• 4242" maxlength="19">
        </div>
        <div class="form-group full-width">
          <label class="form-label" for="card-holder-input">Nama Pemegang Kartu</label>
          <input type="text" class="form-input" id="card-holder-input" placeholder="Nama sesuai paspor atau kartu fisik" value="AURIEL LIFTA EKERIANA">
        </div>
        <div class="form-group full-width">
          <div class="cc-form-row">
            <div>
              <label class="form-label" for="card-expiry-input">Masa Berlaku</label>
              <input type="text" class="form-input" id="card-expiry-input" placeholder="MM/YY" maxlength="5" value="08/29">
            </div>
            <div>
              <label class="form-label" for="card-cvv-input">Kode CVV</label>
              <input type="password" class="form-input" id="card-cvv-input" placeholder="•••" maxlength="4" value="882">
            </div>
          </div>
        </div>
      </div>
      <div style="font-size: 0.74rem; color: var(--melayu-text-muted); display: flex; align-items: center; gap: 6px; margin-top: 10px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--melayu-green)" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        <span>Tervalidasi 256-Bit SSL Enkripsi Internasional & 3D Secure Protection.</span>
      </div>
    `;
    setupCardInputListeners();
  } else if (method === 'paypal') {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px 16px; background: #ffffff; border-radius: var(--radius-sm); border: 1px solid rgba(201, 151, 56, 0.25);">
        <div style="font-size: 1.4rem; font-weight: 800; color: #003087; margin-bottom: 6px;">PayPal <em>Checkout</em></div>
        <p style="font-size: 0.82rem; color: var(--melayu-text-muted); max-width: 440px; margin: 0 auto 16px; line-height: 1.5;">
          Bayar langsung menggunakan akun PayPal Anda dengan perlindungan Pembeli Internasional. Mendukung konversi kurs otomatis USD, SGD, EUR, MYR, dan 25+ mata uang dunia.
        </p>
        <button class="btn btn--primary btn--md" style="background: #0070ba; color: white;" onclick="simulatePaymentProcess('PayPal Express')">
          Lanjutkan dengan PayPal
        </button>
      </div>
    `;
  } else if (method === 'qris') {
    container.innerHTML = `
      <div class="qris-container">
        <div style="font-weight: 700; color: var(--melayu-green); margin-bottom: 4px; font-size: 0.88rem;">QRIS Interoperable (Indonesia, Singapura SGQR, Malaysia DuitNow)</div>
        <p style="font-size: 0.76rem; color: var(--melayu-text-muted); margin-bottom: 10px;">Pindai dengan GoPay, OVO, Dana, BCA, Livin, PayLah! SG, atau Touch 'n Go MY.</p>
        <div class="qris-code-img">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <rect width="100" height="100" fill="white"/>
            <rect x="10" y="10" width="25" height="25" fill="#0d3b2e"/>
            <rect x="15" y="15" width="15" height="15" fill="white"/>
            <rect x="18" y="18" width="9" height="9" fill="#0d3b2e"/>
            <rect x="65" y="10" width="25" height="25" fill="#0d3b2e"/>
            <rect x="70" y="15" width="15" height="15" fill="white"/>
            <rect x="73" y="18" width="9" height="9" fill="#0d3b2e"/>
            <rect x="10" y="65" width="25" height="25" fill="#0d3b2e"/>
            <rect x="15" y="70" width="15" height="15" fill="white"/>
            <rect x="18" y="73" width="9" height="9" fill="#0d3b2e"/>
            <rect x="42" y="15" width="15" height="6" fill="#0d3b2e"/>
            <rect x="42" y="30" width="8" height="18" fill="#c99738"/>
            <rect x="60" y="45" width="22" height="10" fill="#0d3b2e"/>
            <rect x="45" y="65" width="15" height="15" fill="#0d3b2e"/>
            <rect x="70" y="70" width="18" height="18" fill="#c99738"/>
          </svg>
        </div>
        <div style="font-family: var(--font-mono); font-size: 0.82rem; color: var(--melayu-danger); font-weight: 700; margin-bottom: 10px;">
          Batas Waktu Bayar: <span id="qris-timer">14:59</span>
        </div>
        <button class="btn btn--secondary btn--sm" onclick="simulatePaymentProcess('QRIS Cross-Border')">
          Simulasikan pembayaran berhasil
        </button>
      </div>
    `;
    startQRISTimer();
  } else if (method === 'va') {
    container.innerHTML = `
      <div style="padding: 16px; background: #ffffff; border-radius: var(--radius-sm); border: 1px solid rgba(201, 151, 56, 0.25);">
        <div class="form-group" style="margin-bottom: 12px;">
          <label class="form-label" for="bank-va-select">Pilih Bank Tujuan Transfer</label>
          <select class="form-select" id="bank-va-select">
            <option>Bank Mandiri (VA Selaras Kriya: 8892 0182 3991)</option>
            <option>BCA (VA Selaras Kriya: 3910 2001 8847)</option>
            <option>Bank Riau Kepri Syariah (BRKS: 102 990 4481)</option>
            <option>Bank BNI (VA Selaras Kriya: 9881 2049 1192)</option>
          </select>
        </div>
        <div style="font-size: 0.78rem; color: var(--melayu-text-muted); line-height: 1.5;">
          Nomor Virtual Account akan diverifikasi otomatis tanpa perlu upload bukti transfer. Rekening penampung escrow resmi Selaras Kriya menjamin pesanan diteruskan ke pengrajin setelah pembayaran sah.
        </div>
      </div>
    `;
  }
}

function openCheckoutModal() {
  if (cart.length === 0) {
    showToast('Tas kriya Anda masih kosong. Silakan pilih karya terlebih dahulu.');
    return;
  }
  closeCartDrawer();
  const modal = document.getElementById('checkout-modal');
  if (!modal) return;

  // Cache initial modal body/html if not cached yet
  if (!initialCheckoutModalContent) {
    initialCheckoutModalContent = modal.innerHTML;
  } else {
    // Restore if previously replaced by order success
    if (modal.querySelector('.order-success-box')) {
      modal.innerHTML = initialCheckoutModalContent;
    }
  }

  modal.classList.add('active');
  document.getElementById('modal-backdrop')?.classList.add('active');

  // Render items into #checkout-items-list
  const listEl = document.getElementById('checkout-items-list');
  const badgeEl = document.getElementById('checkout-items-badge');
  if (listEl) {
    listEl.innerHTML = cart.map(item => {
      const prod = PRODUCTS_DATA.find(p => p.id === item.productId);
      if (!prod) return '';
      return `
        <div class="checkout-item-mini">
          <img src="${prod.image}" alt="${prod.title}">
          <div class="checkout-item-mini-info">
            <div class="checkout-item-mini-title">${prod.title}</div>
            <div class="checkout-item-mini-meta">
              <span>${item.quantity} × ${formatCurrency(prod.priceIdr)}</span>
              <strong style="color: var(--melayu-green);">${formatCurrency(prod.priceIdr * item.quantity)}</strong>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (badgeEl) badgeEl.textContent = `${totalCount} item`;

  setupCheckoutFlow();
  switchPaymentView(selectedPaymentMethod);
  updateCheckoutSummary();
}

function closeCheckoutModal() {
  document.getElementById('checkout-modal')?.classList.remove('active');
  document.getElementById('modal-backdrop')?.classList.remove('active');
}

function updateCheckoutSummary() {
  let subtotal = 0;
  cart.forEach(item => {
    const prod = PRODUCTS_DATA.find(p => p.id === item.productId);
    if (prod) subtotal += prod.priceIdr * item.quantity;
  });

  const countrySelect = document.getElementById('checkout-country-select');
  const country = countrySelect ? countrySelect.value : (currentCurrency === 'IDR' ? 'ID' : 'SG');
  const isDomestic = (country === 'ID');

  const shippingIdr = isDomestic ? 25000 : 250000;
  const grandTotal = subtotal + shippingIdr;

  const subtotalEl = document.getElementById('checkout-subtotal-display');
  const shippingEl = document.getElementById('checkout-shipping-display');
  const totalEl = document.getElementById('checkout-total-display');

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (shippingEl) shippingEl.textContent = isDomestic ? `${formatCurrency(shippingIdr)} (Pos/JNE Bebas Bea)` : `${formatCurrency(shippingIdr)} (DHL Int'l Air Freight)`;
  if (totalEl) totalEl.textContent = formatCurrency(grandTotal);
}

function processPaymentSubmission() {
  simulatePaymentProcess(selectedPaymentMethod.toUpperCase());
}

function simulatePaymentProcess(methodName) {
  const modalBody = document.querySelector('#checkout-modal .modal-body');
  const modalHeader = document.querySelector('#checkout-modal .modal-header h3');

  if (!modalBody) return;

  modalBody.innerHTML = `
    <div style="text-align: center; padding: 50px 20px;">
      <div style="width: 44px; height: 44px; border: 3px solid rgba(201, 151, 56, 0.2); border-top-color: var(--melayu-gold); border-radius: 50%; margin: 0 auto 18px; animation: spin 0.8s linear infinite;"></div>
      <h3 style="font-family: var(--font-display); color: var(--melayu-green); margin-bottom: 8px;">Memproses Transaksi...</h3>
      <p style="font-size: 0.85rem; color: var(--melayu-text-muted);">Menghubungkan ke gateway pembayaran ${methodName} dan validasi kepabeanan ekspor.</p>
    </div>
    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
  `;

  setTimeout(() => {
    const randomInv = 'SK-INV-2026-' + Math.floor(1000 + Math.random() * 9000);
    const trackingNum = (currentCurrency === 'IDR' ? 'POS-ID-' : 'DHL-INT-') + Math.floor(10000000 + Math.random() * 90000000);

    if (modalHeader) modalHeader.textContent = 'Transaksi Berhasil Disetujui';

    modalBody.innerHTML = `
      <div class="order-success-box">
        <div class="success-check-icon">✓</div>
        <h2 style="font-family: var(--font-display); font-size: 1.65rem; color: var(--melayu-green); margin-bottom: 8px;">
          Terima Kasih Atas Apresiasi Anda
        </h2>
        <p style="font-size: 0.88rem; color: var(--melayu-text-muted); max-width: 500px; margin: 0 auto 18px; line-height: 1.55;">
          Pesanan kriya maritim Anda telah masuk ke sistem kurasi Selaras Kriya. Pengrajin pesisir di Kepulauan Riau akan menyiapkan karya dengan kemasan standar ekspor tahan laut.
        </p>

        <div style="background: #faf7f2; border: 1.5px solid var(--melayu-border-gold); border-radius: var(--radius-md); padding: 18px; max-width: 460px; margin: 0 auto 22px; text-align: left;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.82rem;">
            <span style="color: var(--melayu-text-muted);">Nomor Faktur:</span>
            <strong style="font-family: var(--font-mono); color: var(--melayu-green);">${randomInv}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.82rem;">
            <span style="color: var(--melayu-text-muted);">Metode Pembayaran:</span>
            <strong style="color: var(--melayu-text-main);">${methodName} Verified</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.82rem;">
            <span style="color: var(--melayu-text-muted);">Nomor Pelacakan:</span>
            <strong style="font-family: var(--font-mono); color: var(--melayu-gold-dark);">${trackingNum}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.82rem;">
            <span style="color: var(--melayu-text-muted);">Klasifikasi Ekspor:</span>
            <span style="font-size: 0.75rem; background: #eaf2ef; color: var(--melayu-green); padding: 2px 6px; border-radius: 4px;">HS Code 9601.90 (Kriya Kerang)</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; border-top: 1px solid var(--melayu-border); padding-top: 8px; margin-top: 8px;">
            <span style="color: var(--melayu-text-muted);">Total Pembayaran:</span>
            <strong style="font-family: var(--font-mono); font-size: 1.05rem; color: var(--melayu-green);">${document.getElementById('checkout-total-display')?.textContent || 'Lunas'}</strong>
          </div>
        </div>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn--primary btn--md" onclick="downloadInvoiceMock('${randomInv}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Unduh faktur PDF
          </button>
          <button class="btn btn--secondary btn--md" onclick="closeCheckoutModal(); resetCartAfterOrder();">
            Kembali ke katalog
          </button>
        </div>
      </div>
    `;

    cart = [];
    updateCartUI();
  }, 1600);
}

function resetCartAfterOrder() {
  cart = [];
  updateCartUI();
}

function downloadInvoiceMock(invId) {
  showToast(`Faktur resmi ${invId} diunduh (Simulasi Dokumen Ekspor).`);
}

// 6. Request for Quotation (RFQ) B2B Calculator
function setupRFQCalculator() {
  const qtyInput = document.getElementById('rfq-qty');
  const discountDisplay = document.getElementById('rfq-tier-discount');
  const totalEstDisplay = document.getElementById('rfq-total-est');

  if (!qtyInput) return;

  function calculateRFQ() {
    const qty = parseInt(qtyInput.value) || 50;
    let discountPct = 0;
    let tierText = 'Harga Grosir Standar';

    if (qty >= 500) {
      discountPct = 30;
      tierText = 'Tier Ekspor / Reseller (-30%)';
    } else if (qty >= 150) {
      discountPct = 20;
      tierText = 'Tier Korporat & Resort (-20%)';
    } else if (qty >= 50) {
      discountPct = 10;
      tierText = 'Tier Acara & Komunitas (-10%)';
    }

    if (discountDisplay) discountDisplay.textContent = tierText;

    const unitBase = 185000;
    const discountedUnit = unitBase * (1 - discountPct / 100);
    const estTotalIdr = discountedUnit * qty;

    if (totalEstDisplay) {
      totalEstDisplay.textContent = formatCurrency(estTotalIdr);
      totalEstDisplay.setAttribute('data-price-idr', estTotalIdr);
    }
  }

  qtyInput.addEventListener('input', calculateRFQ);
  calculateRFQ();
}

function submitRFQForm(e) {
  e.preventDefault();
  const org = document.getElementById('rfq-org')?.value || 'Perusahaan';
  const qty = document.getElementById('rfq-qty')?.value || '100';
  showToast(`Pengajuan RFQ untuk ${org} (${qty} pcs) berhasil diteruskan ke tim kemitraan.`);
  e.target.reset();
  setupRFQCalculator();
}

// 7. Interactive 3D Artefak Exhibition Modal (Three.js WebGL Engine)
let three3dScene = null;
let three3dRenderer = null;
let three3dCamera = null;
let three3dAnimFrame = null;
let three3dRootGroup = null;
let three3dMaterials = {};
let three3dPearlMesh = null;
let is3DAutoRotating = true;
let is3DDragging = false;
let prevPointerPos = { x: 0, y: 0 };
let targetRotX = 0.18;
let targetRotY = -0.38;
let currentRotX = 0.18;
let currentRotY = -0.38;
let current3DMaterialMode = 'gold';

function open3DArtifactModal() {
  const modal = document.getElementById('product-detail-modal');
  if (!modal) return;

  dispose3DScene();

  modal.innerHTML = `
    <div class="modal-header">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="background: var(--melayu-gold); color: var(--melayu-green-dark); font-size: 0.7rem; font-weight: 700; padding: 2px 7px; border-radius: 4px;">WebGL 3D Studio</span>
        <h3 style="font-size: 1.15rem; margin: 0;">Artefak Diraja Melayu: Arca Kerang Beremas</h3>
      </div>
      <button class="btn btn--icon btn--sm btn--secondary on-dark" onclick="closeProductModal()" aria-label="Tutup">✕</button>
    </div>
    <div class="modal-body" style="padding: 16px 20px;">
      <!-- 3D Interactive Canvas Box -->
      <div class="artifact-3d-wrapper" id="artifact-3d-container">
        <canvas id="artifact-3d-canvas" class="artifact-3d-canvas"></canvas>
        
        <!-- Controls Toolbar -->
        <div class="artifact-3d-toolbar">
          <div class="artifact-3d-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display: inline-block; vertical-align: middle; margin-right: 4px;"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>
            <span>Tahan & geser untuk rotasi 360° · Scroll untuk zoom</span>
          </div>

          <div class="artifact-3d-actions">
            <button class="artifact-3d-btn active" id="btn-3d-autorotate" onclick="toggle3DAutoRotate()" title="Jeda / Putar Otomatis">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
              <span id="btn-3d-autorotate-label">Auto Putar</span>
            </button>
            <button class="artifact-3d-btn" onclick="reset3DCamera()" title="Kembalikan ke sudut awal">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>
              <span>Reset</span>
            </button>
            <button class="artifact-3d-btn" onclick="zoom3DCamera(-0.5)" title="Perbesar">＋</button>
            <button class="artifact-3d-btn" onclick="zoom3DCamera(0.5)" title="Perkecil">－</button>
            <button class="artifact-3d-btn active" id="mat-btn-gold" onclick="switch3DMaterial('gold')">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#c99738;"></span>
              <span>Emas 24K</span>
            </button>
            <button class="artifact-3d-btn" id="mat-btn-pearl" onclick="switch3DMaterial('pearl')">
              <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#ffffff;border:1px solid #c99738;"></span>
              <span>Mutiara</span>
            </button>
            <button class="artifact-3d-btn" id="mat-btn-wire" onclick="switch3DMaterial('wireframe')">
              <span>Kawat 3D</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Info & Actions -->
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 260px;">
          <h4 style="font-family: var(--font-display); font-size: 1.15rem; color: var(--melayu-green); margin: 0 0 4px;">
            Arca Kerang Beremas Kesultanan Riau-Lingga
          </h4>
          <p style="font-size: 0.82rem; color: var(--melayu-text-muted); margin: 0; line-height: 1.5;">
            Model 3D geometris presisi yang merekonstruksi mahakarya kriya maritim abad ke-18. Menampilkan cangkang nautilus spiral, kelopak simping emas, dan mutiara air laut Natuna.
          </p>
        </div>
        <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
          <button class="btn btn--primary btn--md" onclick="addToCart(7); closeProductModal(); openCartDrawer();">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            <span>Reservasi karya</span>
          </button>
          <button class="btn btn--secondary btn--md" onclick="closeProductModal()">Tutup</button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.getElementById('modal-backdrop')?.classList.add('active');

  setTimeout(() => {
    init3DArtifactScene();
  }, 60);
}

function init3DArtifactScene() {
  const container = document.getElementById('artifact-3d-container');
  const canvas = document.getElementById('artifact-3d-canvas');
  if (!container || !canvas || typeof THREE === 'undefined') return;

  const width = container.clientWidth || 740;
  const height = container.clientHeight || 400;

  // Scene & Camera
  three3dScene = new THREE.Scene();
  three3dCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  three3dCamera.position.set(0, 0.5, 4.6);
  three3dCamera.lookAt(0, 0, 0);

  // Renderer
  three3dRenderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
  three3dRenderer.setSize(width, height);
  three3dRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xfff6ea, 0.95);
  three3dScene.add(ambientLight);

  const keyLight = new THREE.DirectionalLight(0xffeedd, 1.8);
  keyLight.position.set(5, 7, 5);
  three3dScene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x38a381, 1.2);
  fillLight.position.set(-5, -2, -3);
  three3dScene.add(fillLight);

  const rimLight = new THREE.PointLight(0xffd580, 1.5, 10);
  rimLight.position.set(0, 3, 2);
  three3dScene.add(rimLight);

  // Materials
  three3dMaterials = {
    gold: new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.88,
      roughness: 0.22,
      side: THREE.DoubleSide
    }),
    pearl: new THREE.MeshStandardMaterial({
      color: 0xfbf8f3,
      metalness: 0.15,
      roughness: 0.1,
      side: THREE.DoubleSide
    }),
    wireframe: new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      wireframe: true,
      side: THREE.DoubleSide
    })
  };

  const activeMat = three3dMaterials[current3DMaterialMode] || three3dMaterials.gold;

  // Build the 3D Maritime Artifact Group
  three3dRootGroup = new THREE.Group();

  // 1. Royal Nautilus Shell Body (Spiral Ribs)
  const shellRibsGroup = new THREE.Group();
  for (let i = 0; i < 24; i++) {
    const p = i / 23;
    const theta = i * 0.3;
    const r = 0.22 + Math.pow(p, 1.5) * 1.35;
    const tubeR = r * 0.28;
    const geo = new THREE.TorusGeometry(r, tubeR, 16, 36, Math.PI * 1.35);
    const mesh = new THREE.Mesh(geo, activeMat);
    mesh.position.set(
      Math.cos(theta) * (r * 0.65),
      Math.sin(theta) * (r * 0.65) + 0.2,
      p * 0.8 - 0.4
    );
    mesh.rotation.set(0.2, theta * 0.5, theta * 0.9);
    shellRibsGroup.add(mesh);
  }
  three3dRootGroup.add(shellRibsGroup);

  // 2. Simping Fan Shell Radiance
  const fanGroup = new THREE.Group();
  for (let j = 0; j < 11; j++) {
    const angle = (j - 5) * 0.18;
    const coneGeo = new THREE.ConeGeometry(0.18, 1.9, 8);
    const coneMesh = new THREE.Mesh(coneGeo, activeMat);
    coneMesh.position.set(Math.sin(angle) * 1.1, Math.cos(angle) * 1.1 + 0.1, -0.25);
    coneMesh.rotation.set(0.1, 0, -angle);
    fanGroup.add(coneMesh);
  }
  three3dRootGroup.add(fanGroup);

  // 3. Central Natuna Deep-Sea Pearl
  const pearlGeo = new THREE.SphereGeometry(0.42, 32, 32);
  const pearlMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.15,
    roughness: 0.08
  });
  three3dPearlMesh = new THREE.Mesh(pearlGeo, pearlMat);
  three3dPearlMesh.position.set(0.12, 0.35, 0.25);
  three3dRootGroup.add(three3dPearlMesh);

  // 4. Royal Melayu Tepak Pedestal Base
  const baseGroup = new THREE.Group();
  const base1 = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.7, 0.18, 16), activeMat);
  base1.position.y = -1.4;
  baseGroup.add(base1);

  const base2 = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 1.25, 0.38, 16), activeMat);
  base2.position.y = -1.15;
  baseGroup.add(base2);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.3, 0.07, 12, 32), activeMat);
  ring.position.y = -1.32;
  ring.rotation.x = Math.PI / 2;
  baseGroup.add(ring);

  three3dRootGroup.add(baseGroup);

  // Initial beauty orientation
  targetRotX = 0.15;
  targetRotY = -0.35;
  currentRotX = 0.15;
  currentRotY = -0.35;
  three3dRootGroup.rotation.set(currentRotX, currentRotY, 0);

  three3dScene.add(three3dRootGroup);

  // Setup interaction
  setup3DInteraction(container, canvas);

  window.addEventListener('resize', on3DWindowResize);

  animate3DScene();
}

function setup3DInteraction(container, canvas) {
  is3DDragging = false;

  canvas.addEventListener('pointerdown', (e) => {
    is3DDragging = true;
    prevPointerPos = { x: e.clientX, y: e.clientY };
    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener('pointermove', (e) => {
    if (!is3DDragging) return;
    const deltaX = e.clientX - prevPointerPos.x;
    const deltaY = e.clientY - prevPointerPos.y;
    prevPointerPos = { x: e.clientX, y: e.clientY };

    targetRotY += deltaX * 0.009;
    targetRotX += deltaY * 0.009;
    targetRotX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, targetRotX));
  });

  const stopDrag = (e) => {
    is3DDragging = false;
    try { canvas.releasePointerCapture(e.pointerId); } catch (_) {}
  };
  canvas.addEventListener('pointerup', stopDrag);
  canvas.addEventListener('pointercancel', stopDrag);

  canvas.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (!three3dCamera) return;
    three3dCamera.position.z += e.deltaY * 0.003;
    three3dCamera.position.z = Math.max(2.6, Math.min(7.2, three3dCamera.position.z));
  }, { passive: false });
}

function animate3DScene() {
  three3dAnimFrame = requestAnimationFrame(animate3DScene);

  if (three3dRootGroup) {
    if (is3DAutoRotating && !is3DDragging) {
      targetRotY += 0.006;
    }
    currentRotX += (targetRotX - currentRotX) * 0.1;
    currentRotY += (targetRotY - currentRotY) * 0.1;
    three3dRootGroup.rotation.x = currentRotX;
    three3dRootGroup.rotation.y = currentRotY;

    if (three3dPearlMesh) {
      const s = 1 + Math.sin(Date.now() * 0.003) * 0.03;
      three3dPearlMesh.scale.set(s, s, s);
    }
  }

  if (three3dRenderer && three3dScene && three3dCamera) {
    three3dRenderer.render(three3dScene, three3dCamera);
  }
}

function toggle3DAutoRotate() {
  is3DAutoRotating = !is3DAutoRotating;
  const btn = document.getElementById('btn-3d-autorotate');
  const label = document.getElementById('btn-3d-autorotate-label');
  if (btn) btn.classList.toggle('active', is3DAutoRotating);
  if (label) label.textContent = is3DAutoRotating ? 'Auto Putar' : 'Jeda';
}

function reset3DCamera() {
  targetRotX = 0.15;
  targetRotY = -0.35;
  if (three3dCamera) {
    three3dCamera.position.set(0, 0.5, 4.6);
  }
}

function zoom3DCamera(delta) {
  if (!three3dCamera) return;
  three3dCamera.position.z += delta;
  three3dCamera.position.z = Math.max(2.6, Math.min(7.2, three3dCamera.position.z));
}

function switch3DMaterial(mode) {
  current3DMaterialMode = mode;
  ['gold', 'pearl', 'wire'].forEach(m => {
    const btn = document.getElementById(`mat-btn-${m}`);
    if (btn) btn.classList.toggle('active', (m === mode) || (m === 'wire' && mode === 'wireframe'));
  });

  const selectedMat = three3dMaterials[mode] || three3dMaterials.gold;
  if (three3dRootGroup) {
    three3dRootGroup.traverse(child => {
      if (child.isMesh && child !== three3dPearlMesh) {
        child.material = selectedMat;
      }
    });
  }
}

function on3DWindowResize() {
  const container = document.getElementById('artifact-3d-container');
  if (!container || !three3dRenderer || !three3dCamera) return;
  const w = container.clientWidth;
  const h = container.clientHeight;
  three3dCamera.aspect = w / h;
  three3dCamera.updateProjectionMatrix();
  three3dRenderer.setSize(w, h);
}

function dispose3DScene() {
  if (three3dAnimFrame) {
    cancelAnimationFrame(three3dAnimFrame);
    three3dAnimFrame = null;
  }
  window.removeEventListener('resize', on3DWindowResize);

  if (three3dScene) {
    three3dScene.traverse(child => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });
  }
  if (three3dRenderer) {
    three3dRenderer.dispose();
    three3dRenderer = null;
  }
  three3dScene = null;
  three3dCamera = null;
  three3dRootGroup = null;
  three3dPearlMesh = null;
}

// 8. 3D Tilt Effect on Hero Cards (Calm & Subtle)
function setupTiltEffect() {
  const cards = document.querySelectorAll('.hero-floating-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / rect.height) * 8;
      const rotateY = (x / rect.width) * 8;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// 9. One-Click Copy for Palette & Code with Feedback State
function copyToClipboard(text, btnOrMsg, maybeMsg) {
  let btn = null;
  let msg = 'Berhasil disalin';

  if (btnOrMsg && typeof btnOrMsg === 'object' && btnOrMsg.nodeType) {
    btn = btnOrMsg;
    msg = maybeMsg || 'Berhasil disalin';
  } else if (typeof btnOrMsg === 'string') {
    msg = btnOrMsg;
  }

  navigator.clipboard.writeText(text).then(() => {
    if (btn) {
      const originalHTML = btn.innerHTML;
      btn.classList.add('is-copied');
      btn.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Tersalin`;
      setTimeout(() => {
        btn.classList.remove('is-copied');
        btn.innerHTML = originalHTML;
      }, 1500);
    }
    showToast(msg);
  }).catch(() => {
    showToast(`Berhasil disalin: ${text}`);
  });
}

// Toast Notifikasi
function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--melayu-gold-light)" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${msg}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
    setTimeout(() => toast.remove(), 250);
  }, 2800);
}
