/**
 * SELARAS KRIYA — Logika Interaktif Platform Katalog & Pembayaran Internasional
 * Berbasis Potensi Maritim & Kerajinan Kerang Kepulauan Riau (2026)
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
    ecoWeight: '0.3 kg limbah lestari',
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
    ecoWeight: '0.2 kg limbah lestari',
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
    ecoWeight: '1.2 kg limbah lestari',
    image: 'assets/images/bowl.jpg',
    artisan: 'Pak Rudi Bahari',
    material: 'Mosaik Cangkang Kerang Simping Pesisir, Lis Kuningan Tempa Tangan',
    description: 'Mangkuk pajangan mewah berbahan mozaik cangkang kerang kapis alami hasil upcycling tangkapan nelayan pesisir Teluk Sebong.'
  },
  {
    id: 4,
    title: 'Bros & Anting Kristal Bahari Diraja',
    category: 'cendera-mata',
    categoryLabel: 'Cendera Mata',
    priceIdr: 190000,
    origin: 'Kota Tanjungpinang',
    ecoWeight: '0.15 kg limbah lestari',
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
    ecoWeight: '0.4 kg limbah lestari',
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
    ecoWeight: '0.35 kg limbah lestari',
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
    ecoWeight: '2.5 kg limbah lestari',
    image: 'assets/images/hero_shell_3d.jpg',
    artisan: 'Konsorsium Pengrajin Selaras',
    material: 'Cangkang Keong Laut Raksasa Upcycled, Lapisan Emas Murni 24K',
    description: 'Karya mahakarya 3D yang merepresentasikan arca kriya maritim abad ke-18, menggabungkan ukiran pucuk rebung dan kilau nacre laut dalam.'
  },
  {
    id: 8,
    title: 'Pendant Mutiara Gading Penyengat',
    category: 'fashion',
    categoryLabel: 'Fashion & Wastra',
    priceIdr: 280000,
    origin: 'Pulau Penyengat',
    ecoWeight: '0.25 kg limbah lestari',
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
  setupCategoryFilters();
  setupSearchInput();
  setupTiltEffect();
  setupCodeCopy();
  setupCheckoutFlow();
  setupRFQCalculator();
});

// Format Harga Sesuai Kurs Aktif
function formatCurrency(amountIdr) {
  const currency = EXCHANGE_RATES[currentCurrency];
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
    countBadge.textContent = `${products.length} produk ditemukan`;
  }

  if (products.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; color: var(--melayu-text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 8px;">Tidak ditemukan produk kriya yang cocok.</p>
        <button class="btn-outline-gold" onclick="resetFilters()">Tampilkan Semua Koleksi</button>
      </div>
    `;
    return;
  }

  grid.innerHTML = products.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-media" onclick="openProductModal(${p.id})">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
        <span class="product-badge-origin">${p.origin}</span>
        <span class="product-eco-tag">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          ${p.ecoWeight}
        </span>
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
            <button class="btn-quick-view" onclick="openProductModal(${p.id})" title="Lihat Cerita & Spesifikasi">Detail</button>
            <button class="btn-add-cart" onclick="addToCart(${p.id})" title="Tambah ke Keranjang">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
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

// Filter Kategori
function setupCategoryFilters() {
  const pills = document.querySelectorAll('.pill-btn');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.getAttribute('data-category');
      
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
    const activeCategory = document.querySelector('.pill-btn.active')?.getAttribute('data-category') || 'all';
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
  const pills = document.querySelectorAll('.pill-btn');
  pills.forEach(p => p.classList.remove('active'));
  document.querySelector('.pill-btn[data-category="all"]')?.classList.add('active');
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
    menu.classList.toggle('show');
  });

  document.addEventListener('click', () => {
    menu.classList.remove('show');
  });

  items.forEach(item => {
    item.addEventListener('click', () => {
      const code = item.getAttribute('data-currency');
      if (code && EXCHANGE_RATES[code]) {
        currentCurrency = code;
        btn.querySelector('.curr-code').textContent = code;
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        
        // Re-render prices
        refreshAllPrices();
        updateCartUI();
        showToast(`Mata uang diubah ke ${EXCHANGE_RATES[code].name}`);
      }
    });
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
  showToast(`"${product?.title || 'Produk'}" berhasil ditambahkan ke tas.`);
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
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c99738" stroke-width="1.5" style="margin: 0 auto 12px;">
          <circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p>Tas kriya Anda masih kosong.</p>
        <button class="btn-outline-gold" style="margin-top: 14px;" onclick="closeCartDrawer()">Jelajahi Karya</button>
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
          <div class="cart-qty-ctrl">
            <button class="btn-qty" onclick="updateCartQty(${prod.id}, -1)">−</button>
            <span style="font-size: 0.85rem; font-weight: 700; min-width: 20px; text-align: center;">${item.quantity}</span>
            <button class="btn-qty" onclick="updateCartQty(${prod.id}, 1)">+</button>
          </div>
        </div>
        <button class="btn-remove-item" onclick="removeFromCart(${prod.id})" title="Hapus">✕</button>
      </div>
    `;
  }).join('');

  // Shipping simulation (flat standard or international depending on currency)
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
      <button class="btn-close-drawer" onclick="closeProductModal()">✕</button>
    </div>
    <div class="modal-body" style="display: grid; grid-template-columns: 1fr 1fr; gap: 28px;">
      <div style="border-radius: var(--radius-md); overflow: hidden; border: 1.5px solid var(--melayu-border-gold); height: 320px;">
        <img src="${prod.image}" alt="${prod.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div>
        <span class="product-category">${prod.categoryLabel} · ${prod.origin}</span>
        <h2 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--melayu-green); margin: 8px 0 12px;">${prod.title}</h2>
        <div style="font-family: var(--font-mono); font-size: 1.35rem; font-weight: 700; color: var(--melayu-green); margin-bottom: 16px;">
          ${formatCurrency(prod.priceIdr)}
        </div>
        <p style="font-size: 0.88rem; color: var(--melayu-text-muted); line-height: 1.6; margin-bottom: 16px;">${prod.description}</p>
        
        <div style="background: var(--melayu-cream); padding: 12px 16px; border-radius: var(--radius-sm); margin-bottom: 20px;">
          <div style="font-size: 0.75rem; font-weight: 700; color: var(--melayu-green); text-transform: uppercase; margin-bottom: 4px;">Informasi Kriya & Dampak</div>
          <div style="font-size: 0.8rem; color: var(--melayu-text-main);">• Pengrajin: <strong>${prod.artisan}</strong></div>
          <div style="font-size: 0.8rem; color: var(--melayu-text-main);">• Material: ${prod.material}</div>
          <div style="font-size: 0.8rem; color: var(--melayu-text-main);">• Nilai Sirkular: Menyerap ${prod.ecoWeight}</div>
          <div style="font-size: 0.8rem; color: var(--melayu-text-main);">• Standar Mutu: Pelapis Anti-Air Asin 24K</div>
        </div>

        <div style="display: flex; gap: 12px;">
          <button class="btn-gold" style="flex: 1; justify-content: center;" onclick="addToCart(${prod.id}); closeProductModal(); openCartDrawer();">
            Beli Sekarang / Tambah ke Tas
          </button>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.getElementById('modal-backdrop')?.classList.add('active');
}

function closeProductModal() {
  document.getElementById('product-detail-modal')?.classList.remove('active');
  document.getElementById('modal-backdrop')?.classList.remove('active');
}

// 5. Checkout & Sistem Pembayaran Internasional
let selectedPaymentMethod = 'card';

function setupCheckoutFlow() {
  // Tab pembayaran
  const payTabs = document.querySelectorAll('.pay-tab-btn');
  payTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      payTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      selectedPaymentMethod = tab.getAttribute('data-method');
      switchPaymentView(selectedPaymentMethod);
    });
  });

  // Credit Card Realtime Formatter
  const ccNumInput = document.getElementById('card-number-input');
  const ccHolderInput = document.getElementById('card-holder-input');
  const ccExpInput = document.getElementById('card-expiry-input');

  if (ccNumInput) {
    ccNumInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
      let matches = v.match(/\d{4,16}/g);
      let match = matches && matches[0] || '';
      let parts = [];
      for (let i = 0, len = match.length; i < len; i += 4) {
        parts.push(match.substring(i, i + 4));
      }
      if (parts.length) {
        e.target.value = parts.join(' ');
      }
      document.getElementById('preview-cc-num').textContent = e.target.value || '•••• •••• •••• 4242';
    });
  }

  if (ccHolderInput) {
    ccHolderInput.addEventListener('input', (e) => {
      document.getElementById('preview-cc-holder').textContent = (e.target.value || 'NAMA PEMEGANG').toUpperCase();
    });
  }

  if (ccExpInput) {
    ccExpInput.addEventListener('input', (e) => {
      document.getElementById('preview-cc-exp').textContent = e.target.value || 'MM/YY';
    });
  }
}

function switchPaymentView(method) {
  const container = document.getElementById('payment-method-views');
  if (!container) return;

  const isIntl = currentCurrency !== 'IDR';

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

      <div class="form-grid">
        <div class="form-group full-width">
          <label class="form-label">Nomor Kartu (Visa / Mastercard / Amex)</label>
          <input type="text" class="form-input" id="card-number-input" placeholder="4242 •••• •••• ••••" maxlength="19">
        </div>
        <div class="form-group">
          <label class="form-label">Nama Pemegang Kartu</label>
          <input type="text" class="form-input" id="card-holder-input" placeholder="Nama sesuai paspor / kartu">
        </div>
        <div class="form-group" style="display: flex; gap: 8px;">
          <div style="flex: 1;">
            <label class="form-label">Masa Berlaku</label>
            <input type="text" class="form-input" id="card-expiry-input" placeholder="MM/YY" maxlength="5">
          </div>
          <div style="width: 80px;">
            <label class="form-label">CVV</label>
            <input type="password" class="form-input" placeholder="•••" maxlength="4">
          </div>
        </div>
      </div>
      <div style="font-size: 0.75rem; color: var(--melayu-text-muted); display: flex; align-items: center; gap: 6px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#27ae60" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        Tervalidasi 256-Bit SSL Enkripsi Internasional & 3D Secure Protection.
      </div>
    `;
    setupCheckoutFlow();
  } else if (method === 'paypal') {
    container.innerHTML = `
      <div style="text-align: center; padding: 36px 20px; background: #fbf9f4; border-radius: var(--radius-md); border: 1px solid var(--melayu-border);">
        <div style="font-size: 1.8rem; font-weight: 800; color: #003087; margin-bottom: 8px;">PayPal <em>Checkout</em></div>
        <p style="font-size: 0.85rem; color: var(--melayu-text-muted); max-width: 440px; margin: 0 auto 20px;">
          Bayar langsung menggunakan akun PayPal Anda dengan perlindungan Pembeli Internasional. Mendukung konversi kurs otomatis USD, SGD, EUR, MYR, dan 25+ mata uang dunia.
        </p>
        <button class="btn-gold" style="background: #0070ba; color: white; border: none; padding: 12px 28px;" onclick="simulatePaymentProcess('PayPal Express')">
          Lanjutkan dengan PayPal
        </button>
      </div>
    `;
  } else if (method === 'qris') {
    container.innerHTML = `
      <div class="qris-container">
        <div style="font-weight: 700; color: var(--melayu-green); margin-bottom: 6px;">QRIS Interoperable (Indonesia, Singapura SGQR, Malaysia DuitNow)</div>
        <p style="font-size: 0.78rem; color: var(--melayu-text-muted); margin-bottom: 12px;">Pindai dengan GoPay, OVO, Dana, BCA, Livin, PayLah! SG, atau Touch 'n Go MY.</p>
        <div class="qris-code-img">
          <svg viewBox="0 0 100 100" width="100%" height="100%">
            <!-- Simbol Mock QR -->
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
        <div style="font-family: var(--font-mono); font-size: 0.85rem; color: #b33939; font-weight: 700; margin-bottom: 10px;">
          Batas Waktu Bayar: <span id="qris-timer">14:59</span>
        </div>
        <button class="btn-outline-gold" style="font-size: 0.78rem;" onclick="simulatePaymentProcess('QRIS Cross-Border')">
          Simulasikan Notifikasi Pembayaran Berhasil
        </button>
      </div>
    `;
  } else if (method === 'va') {
    container.innerHTML = `
      <div style="padding: 20px; background: #faf7f2; border-radius: var(--radius-sm); border: 1px solid var(--melayu-border);">
        <div class="form-group" style="margin-bottom: 14px;">
          <label class="form-label">Pilih Bank Tujuan Transfer</label>
          <select class="form-select" id="bank-va-select">
            <option>Bank Mandiri (VA Selaras Kriya: 8892 0182 3991)</option>
            <option>BCA (VA Selaras Kriya: 3910 2001 8847)</option>
            <option>Bank Riau Kepri Syariah (BRKS: 102 990 4481)</option>
            <option>Bank BNI (VA Selaras Kriya: 9881 2049 1192)</option>
          </select>
        </div>
        <div style="font-size: 0.8rem; color: var(--melayu-text-muted); line-height: 1.5;">
          Nomor Virtual Account akan diverifikasi otomatis tanpa perlu upload bukti transfer. Rekening penampung escrow resmi Selaras Kriya menjamin pesanan diteruskan ke pengrajin setelah pembayaran sah.
        </div>
      </div>
    `;
  }
}

function openCheckoutModal() {
  if (cart.length === 0) {
    showToast('Tas kriya Anda masih kosong. Silakan pilih produk terlebih dahulu.');
    return;
  }
  closeCartDrawer();
  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.add('active');
    document.getElementById('modal-backdrop')?.classList.add('active');
    switchPaymentView(selectedPaymentMethod);
    updateCheckoutSummary();
  }
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

  const isIntl = currentCurrency !== 'IDR';
  const shippingIdr = isIntl ? 250000 : 25000;
  const total = subtotal + shippingIdr;

  const summaryEl = document.getElementById('checkout-total-display');
  if (summaryEl) {
    summaryEl.textContent = formatCurrency(total);
  }
}

function processPaymentSubmission() {
  simulatePaymentProcess(selectedPaymentMethod.toUpperCase());
}

function simulatePaymentProcess(methodName) {
  const modalBody = document.querySelector('#checkout-modal .modal-body');
  const modalHeader = document.querySelector('#checkout-modal .modal-header h3');

  if (!modalBody) return;

  modalBody.innerHTML = `
    <div style="text-align: center; padding: 60px 20px;">
      <div style="width: 50px; height: 50px; border: 3px solid rgba(201, 151, 56, 0.2); border-top-color: var(--melayu-gold); border-radius: 50%; margin: 0 auto 20px; animation: spin 0.8s linear infinite;"></div>
      <h3 style="font-family: var(--font-display); color: var(--melayu-green); margin-bottom: 8px;">Memproses Transaksi Global...</h3>
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
        <h2 style="font-family: var(--font-display); font-size: 1.8rem; color: var(--melayu-green); margin-bottom: 8px;">
          Terima Kasih Atas Apresiasi Anda!
        </h2>
        <p style="font-size: 0.9rem; color: var(--melayu-text-muted); max-width: 520px; margin: 0 auto 20px;">
          Pesanan kerajinan maritim Anda telah masuk ke sistem kurasi Selaras Kriya. Pengrajin pesisir di Kepulauan Riau akan menyiapkan karya dengan kemasan standar ekspor tahan laut.
        </p>

        <div style="background: #faf7f2; border: 1.5px solid var(--melayu-border-gold); border-radius: var(--radius-md); padding: 20px; max-width: 480px; margin: 0 auto 24px; text-align: left;">
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
            <span style="font-size: 0.75rem; background: #eaf2ef; color: var(--melayu-green); padding: 2px 6px; border-radius: 4px;">HS Code 9601.90 (Kerajinan Kerang)</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; border-top: 1px solid var(--melayu-border); padding-top: 8px; margin-top: 8px;">
            <span style="color: var(--melayu-text-muted);">Total Pembayaran:</span>
            <strong style="font-family: var(--font-mono); font-size: 1.05rem; color: var(--melayu-green);">${document.getElementById('checkout-total-display')?.textContent || 'Lunas'}</strong>
          </div>
        </div>

        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button class="btn-gold" onclick="downloadInvoiceMock('${randomInv}')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Unduh Faktur PDF
          </button>
          <button class="btn-outline-gold" onclick="closeCheckoutModal(); resetCartAfterOrder();">
            Kembali ke Katalog
          </button>
        </div>
      </div>
    `;

    cart = [];
    updateCartUI();
  }, 1800);
}

function resetCartAfterOrder() {
  cart = [];
  updateCartUI();
}

function downloadInvoiceMock(invId) {
  showToast(`Faktur resmi ${invId} diunduh (Simulasi Dokumen Ekspor).`);
}

// 6. Request for Quotation (RFQ) B2B Calculator (From Proposal)
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
      tierText = 'Tier Ekspor / Reseller Global (-30%)';
    } else if (qty >= 150) {
      discountPct = 20;
      tierText = 'Tier Korporat & Hotel/Resort (-20%)';
    } else if (qty >= 50) {
      discountPct = 10;
      tierText = 'Tier Acara & Komunitas (-10%)';
    }

    if (discountDisplay) discountDisplay.textContent = `${tierText}`;

    // Estimated unit base: 185,000 IDR
    const unitBase = 185000;
    const discountedUnit = unitBase * (1 - discountPct / 100);
    const estTotalIdr = discountedUnit * qty;

    if (totalEstDisplay) {
      totalEstDisplay.textContent = formatCurrency(estTotalIdr);
    }
  }

  qtyInput.addEventListener('input', calculateRFQ);
  calculateRFQ();
}

function submitRFQForm(e) {
  e.preventDefault();
  const org = document.getElementById('rfq-org')?.value || 'Perusahaan';
  const qty = document.getElementById('rfq-qty')?.value || '100';
  showToast(`Pengajuan RFQ untuk ${org} (${qty} pcs) berhasil diteruskan ke tim kemitraan!`);
  e.target.reset();
  setupRFQCalculator();
}

// 7. Interactive 3D Artefak Exhibition Modal
function open3DArtifactModal() {
  const modal = document.getElementById('product-detail-modal');
  if (!modal) return;

  modal.innerHTML = `
    <div class="modal-header">
      <h3>Artefak Diraja Melayu: Arca Kerang Beremas</h3>
      <button class="btn-close-drawer" onclick="closeProductModal()">✕</button>
    </div>
    <div class="modal-body" style="text-align: center;">
      <div style="position: relative; border-radius: var(--radius-lg); overflow: hidden; max-height: 480px; margin-bottom: 20px; border: 2px solid var(--melayu-gold);">
        <img src="assets/images/hero_shell_3d.jpg" alt="3D Shell Artifact" style="width: 100%; height: 100%; object-fit: contain; background: #07221a;">
      </div>
      <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: var(--melayu-green); margin-bottom: 8px;">
        Arca Kerang Beremas Simbol Ketamadunan Bahari
      </h3>
      <p style="font-size: 0.9rem; color: var(--melayu-text-muted); max-width: 600px; margin: 0 auto 20px; line-height: 1.6;">
        Direkonstruksi dari naskah kriya Kesultanan Riau-Lingga abad ke-18. Menyatukan cangkang gonggong dan kerang simping laut dalam dengan ornamen awan larat bersepuh emas murni 24 karat.
      </p>
      <div style="display: flex; gap: 14px; justify-content: center;">
        <button class="btn-gold" onclick="addToCart(7); closeProductModal(); openCartDrawer();">
          Reservasi Karya Kolektor
        </button>
        <button class="btn-outline-gold" onclick="closeProductModal()">
          Tutup Tinjauan
        </button>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.getElementById('modal-backdrop')?.classList.add('active');
}

// 8. 3D Tilt Effect on Hero Cards
function setupTiltEffect() {
  const cards = document.querySelectorAll('.hero-floating-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotateX = -(y / rect.height) * 16;
      const rotateY = (x / rect.width) * 16;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// 9. One-Click Copy for Palette & Code
function setupCodeCopy() {
  // Handlers attached inline or dynamically
}

function copyToClipboard(text, message) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(message || `Kode berhasil disalin: ${text}`);
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dfb257" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
    <span>${msg}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
