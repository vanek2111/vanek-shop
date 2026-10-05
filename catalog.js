// ========== ПОДКЛЮЧЕНИЕ К SUPABASE ==========
if (typeof window.db === 'undefined') {
    window.db = supabase.createClient(
        'https://ytqxfykqiekphcpjrvon.supabase.co',
        'sb_publishable_zOXsiffHOAy8S693kYoL6g_CivX9ffr'
    );
}
const db = window.db;

// ========== СОСТОЯНИЕ ==========
const state = {
    allProducts: [],
    filteredProducts: [],
    search: '',
    category: 'all',
    brand: 'all',
    priceMin: null,
    priceMax: null,
    sort: 'default'
};

// ========== ИКОНКИ ПО КАТЕГОРИЯМ (дефолт) ==========
const categoryIcons = {
    'Аудио': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>',
    'Периферия': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><line x1="6" y1="10" x2="6" y2="14"></line><line x1="10" y1="10" x2="10" y2="14"></line></svg>',
    'Мониторы': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
    'Смартфоны': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"></rect><line x1="12" y1="18" x2="12" y2="18"></line></svg>',
    'Планшеты': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="12" y1="18" x2="12" y2="18"></line></svg>',
    'Часы': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline></svg>',
    'Гейминг': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"></path></svg>',
    'Сети': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>',
    'Аксессуары': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0z"></path><path d="M12 18v4"></path></svg>',
    'Комплектующие': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line></svg>'
};

// ========== ИКОНКА ПО НАЗВАНИЮ ==========
function getIcon(product) {
    const category = product.category;
    const name = (product.name || '').toLowerCase();

    if (name.includes('мышь') || name.includes('mouse')) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="6"></rect><line x1="12" y1="8" x2="12" y2="11"></line></svg>';
    }
    if (name.includes('клавиатура') || name.includes('keyboard')) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><line x1="6" y1="10" x2="6.01" y2="10"></line><line x1="10" y1="10" x2="10.01" y2="10"></line><line x1="14" y1="10" x2="14.01" y2="10"></line><line x1="18" y1="10" x2="18.01" y2="10"></line><line x1="7" y1="14" x2="17" y2="14"></line></svg>';
    }
    if (name.includes('наушник') || name.includes('headphone') || name.includes('airpods') || name.includes('jbl') || name.includes('hyperx cloud')) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>';
    }
    if (name.includes('ssd') || name.includes('память') || name.includes('ram') || name.includes('ddr')) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><rect x="6" y="10" width="3" height="4"></rect><rect x="11" y="10" width="3" height="4"></rect><rect x="16" y="10" width="3" height="4"></rect></svg>';
    }
    if (name.includes('монитор') || name.includes('monitor') || name.includes('odyssey') || name.includes('rog swift')) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>';
    }
    if (name.includes('роутер') || name.includes('router') || name.includes('tp-link') || name.includes('rt-ax')) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="12" width="16" height="8" rx="2"></rect><line x1="12" y1="12" x2="12" y2="4"></line><line x1="8" y1="4" x2="16" y2="4"></line><circle cx="8" cy="16" r="0.5"></circle><circle cx="12" cy="16" r="0.5"></circle><circle cx="16" cy="16" r="0.5"></circle></svg>';
    }
    if (name.includes('iphone') || name.includes('galaxy s') || name.includes('xiaomi 15') || name.includes('смартфон')) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2"></rect><line x1="12" y1="18" x2="12" y2="18"></line></svg>';
    }
    if (name.includes('ipad') || name.includes('планшет') || name.includes('pad 7')) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"></rect><line x1="12" y1="18" x2="12" y2="18"></line></svg>';
    }
    if (name.includes('watch') || name.includes('часы')) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"></circle><polyline points="12 9 12 12 13.5 13.5"></polyline></svg>';
    }
    if (name.includes('геймпад') || name.includes('dualsense') || name.includes('xbox') || name.includes('8bitdo')) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><circle cx="15" cy="13" r="0.5"></circle><circle cx="18" cy="11" r="0.5"></circle><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59C2.6 9.42 2 14.46 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258A4 4 0 0 0 17.32 5z"></path></svg>';
    }
    if (name.includes('powerbank') || name.includes('power bank') || name.includes('anker 737')) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="6" width="16" height="14" rx="2"></rect><line x1="9" y1="10" x2="15" y2="10"></line><line x1="9" y1="14" x2="15" y2="14"></line></svg>';
    }
    if (name.includes('кабель') || name.includes('cable') || name.includes('ugreen')) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0z"></path><path d="M12 18v4"></path></svg>';
    }
    if (name.includes('блок питания') || name.includes('psu') || name.includes('be quiet')) {
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="3"></circle></svg>';
    }

    return categoryIcons[category] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>';
}

// ========== ЗАГРУЗКА ==========
async function loadProducts() {
    const grid = document.getElementById('products-grid');
    const { data, error } = await db.from('products').select('*');

    if (error) {
        console.error('Ошибка:', error);
        grid.innerHTML = '<p>Не удалось загрузить товары</p>';
        return;
    }

    state.allProducts = data;
    state.filteredProducts = [...data];

    const params = new URLSearchParams(window.location.search);
    const catFromUrl = params.get('cat');
    const searchFromUrl = params.get('search');

    if (catFromUrl) state.category = catFromUrl;
    if (searchFromUrl) {
        state.search = searchFromUrl;
        document.getElementById('search-input').value = searchFromUrl;
    }

    renderCategories();
    renderBrands();
    applyFilters();
}

// ========== КАТЕГОРИИ ==========
function renderCategories() {
    const container = document.getElementById('category-filters');
    const categories = ['all', ...new Set(state.allProducts.map(p => p.category))];
    const labels = { 'all': 'Все категории' };

    container.innerHTML = categories.map(cat => `
        <button class="sidebar-category ${cat === state.category ? 'active' : ''}" data-category="${cat}">
            ${labels[cat] || cat}
        </button>
    `).join('');

    container.querySelectorAll('.sidebar-category').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.sidebar-category').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.category = btn.dataset.category;
            applyFilters();
        });
    });
}

// ========== БРЕНДЫ ==========
function renderBrands() {
    const container = document.getElementById('brand-filters');
    const brands = [...new Set(state.allProducts.map(p => p.brand))].sort();

    container.innerHTML = `
        <button class="sidebar-brand ${state.brand === 'all' ? 'active' : ''}" data-brand="all">Все бренды</button>
        ${brands.map(b => `
            <button class="sidebar-brand ${b === state.brand ? 'active' : ''}" data-brand="${b}">${b}</button>
        `).join('')}
    `;

    container.querySelectorAll('.sidebar-brand').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.sidebar-brand').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.brand = btn.dataset.brand;
            applyFilters();
        });
    });
}

// ========== ФИЛЬТРАЦИЯ ==========
function applyFilters() {
    let result = [...state.allProducts];

    if (state.category !== 'all') result = result.filter(p => p.category === state.category);
    if (state.brand !== 'all') result = result.filter(p => p.brand === state.brand);

    if (state.search.trim()) {
        const q = state.search.toLowerCase().trim();
        result = result.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q)
        );
    }

    if (state.priceMin !== null) result = result.filter(p => p.price >= state.priceMin);
    if (state.priceMax !== null) result = result.filter(p => p.price <= state.priceMax);

    if (state.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (state.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (state.sort === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    state.filteredProducts = result;
    renderProducts();
    updateCount();
    updateSubtitle();
}

function updateSubtitle() {
    const sub = document.getElementById('catalog-subtitle');
    if (state.category !== 'all') {
        sub.textContent = `Категория: ${state.category}`;
    } else {
        sub.textContent = 'Все товары магазина ExoTech';
    }
}

function updateCount() {
    const el = document.getElementById('catalog-count');
    const n = state.filteredProducts.length;
    const word = n % 10 === 1 && n % 100 !== 11 ? 'товар' :
                 (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? 'товара' : 'товаров';
    el.textContent = `Найдено: ${n} ${word}`;
}

// ========== ОТРИСОВКА ==========
function renderProducts() {
    const grid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');

    if (state.filteredProducts.length === 0) {
        grid.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }

    noResults.style.display = 'none';
    grid.innerHTML = state.filteredProducts.map(product => `
        <a href="product.html?id=${product.id}" class="product-card">
            <div class="product-image-wrap">
                ${getIcon(product)}
            </div>
            <div class="product-body">
                <div class="product-name">${product.name}</div>
                <div class="product-brand">${product.brand}</div>
                <div class="product-price">${product.price.toLocaleString()}</div>
                <button class="product-btn" onclick="event.preventDefault(); addToCart(${product.id})">
                    В корзину
                </button>
            </div>
        </a>
    `).join('');
}

// ========== СЛУШАТЕЛИ ==========
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const resetBtn = document.getElementById('reset-filters');
    const resetBtn2 = document.getElementById('reset-filters-2');
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');

    let t;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(t);
        t = setTimeout(() => {
            state.search = e.target.value;
            applyFilters();
        }, 200);
    });

    sortSelect.addEventListener('change', (e) => {
        state.sort = e.target.value;
        applyFilters();
    });

    priceMin.addEventListener('input', (e) => {
        state.priceMin = e.target.value ? parseInt(e.target.value) : null;
        applyFilters();
    });

    priceMax.addEventListener('input', (e) => {
        state.priceMax = e.target.value ? parseInt(e.target.value) : null;
        applyFilters();
    });

    const resetAll = () => {
        state.search = '';
        state.category = 'all';
        state.brand = 'all';
        state.priceMin = null;
        state.priceMax = null;
        state.sort = 'default';
        searchInput.value = '';
        sortSelect.value = 'default';
        priceMin.value = '';
        priceMax.value = '';
        document.querySelectorAll('.sidebar-category').forEach(b => b.classList.remove('active'));
        document.querySelector('.sidebar-category[data-category="all"]')?.classList.add('active');
        document.querySelectorAll('.sidebar-brand').forEach(b => b.classList.remove('active'));
        document.querySelector('.sidebar-brand[data-brand="all"]')?.classList.add('active');
        applyFilters();
    };

    resetBtn?.addEventListener('click', resetAll);
    resetBtn2?.addEventListener('click', resetAll);
});

// ========== КОРЗИНА ==========
function getCart() {
    try {
        const raw = JSON.parse(localStorage.getItem('cart') || '[]');
        if (raw.length > 0 && typeof raw[0] === 'number') {
            const converted = raw.map(id => ({ id, qty: 1 }));
            localStorage.setItem('cart', JSON.stringify(converted));
            return converted;
        }
        return raw;
    } catch (e) {
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    const cart = getCart();
    const existing = cart.find(item => item.id === productId);
    if (existing) existing.qty += 1;
    else cart.push({ id: productId, qty: 1 });
    saveCart(cart);
    showToast('Товар добавлен в корзину');
}

function updateCartCount() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const el = document.getElementById('cart-count');
    if (el) el.textContent = totalCount;
}

// ========== ТОСТ ==========
function showToast(message) {
    const oldToast = document.querySelector('.toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('toast-show'));

    setTimeout(() => {
        toast.classList.remove('toast-show');
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ========== СТАРТ ==========
loadProducts();
updateCartCount();
