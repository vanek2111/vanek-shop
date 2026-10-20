// ========== ПОДКЛЮЧЕНИЕ К SUPABASE ==========
if (typeof window.db === 'undefined') {
    window.db = supabase.createClient(
        'https://ytqxfykqiekphcpjrvon.supabase.co',
        'sb_publishable_zOXsiffHOAy8S693kYoL6g_CivX9ffr'
    );
}
var db = window.db;

// ========== СОСТОЯНИЕ ==========
const state = {
    allProducts: [],
    filteredProducts: [],
    search: '',
    category: 'all',
    brand: 'all',
    priceMin: null,
    priceMax: null,
    sort: 'default',
    onlyStock: false
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
    grid.setAttribute('aria-busy','true');
    grid.innerHTML = '<p class="loading" role="status">Загружаем товары…</p>';
    try {
        const { data, error } = await db.from('products').select('*');
        if (error || !Array.isArray(data)) throw error || new Error('Empty response');
        state.allProducts = data;
        ExoStore.setProducts(data);
        readFiltersFromUrl();
        renderCategories();
        renderBrands();
        syncFilterControls();
        applyFilters();
    } catch(error) {
        console.error('Каталог недоступен:', error);
        document.getElementById('catalog-count').textContent = 'Каталог временно недоступен';
        grid.innerHTML = '<div class="load-error"><p>Не удалось получить товары. Попробуйте ещё раз.</p><button class="btn btn-ghost" type="button" data-retry-products>Повторить загрузку</button></div>';
    } finally { grid.setAttribute('aria-busy','false'); }
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

    if (state.onlyStock) result = result.filter(p => p.in_stock);
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

    if (state.priceMin !== null && state.priceMax !== null && state.priceMin > state.priceMax) result = [];
    if (state.sort === 'default') result.sort((a,b) => Number(b.in_stock) - Number(a.in_stock) || a.id - b.id);
    state.filteredProducts = result;
    renderProducts();
    updateCount();
    updateSubtitle();
    syncFilterControls();
    renderFilterTags();
    writeFiltersToUrl();
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
    el.textContent = `${n} ${word}`;
    const apply = document.getElementById('filters-apply-btn');
    if (apply) apply.textContent = `Показать: ${n} ${word}`;
}

// ========== ОТРИСОВКА ==========
function renderProducts() {
    const grid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');
    noResults.style.display = state.filteredProducts.length ? 'none' : 'block';
    grid.innerHTML = state.filteredProducts.map(product => ExoStore.card(product)).join('');
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
        state.priceMin = parsePrice(e.target.value);
        applyFilters();
    });

    priceMax.addEventListener('input', (e) => {
        state.priceMax = parsePrice(e.target.value);
        applyFilters();
    });

    const resetAll = () => {
        state.search = '';
        state.category = 'all';
        state.brand = 'all';
        state.priceMin = null;
        state.priceMax = null;
        state.sort = 'default';
        state.onlyStock = false;
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
function getCart() { return ExoCart.get(); }

function saveCart(cart) { return ExoCart.save(cart); }

function addToCart(productId) { ExoStore.add(productId); }

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
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
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

function readFiltersFromUrl() {
    const params = new URLSearchParams(location.search);
    state.category = params.get('cat') || 'all';
    state.search = params.get('search') || '';
    state.brand = params.get('brand') || 'all';
    state.sort = ['default','price-asc','price-desc','name-asc'].includes(params.get('sort')) ? params.get('sort') : 'default';
    state.priceMin = parsePrice(params.get('min'));
    state.priceMax = parsePrice(params.get('max'));
    state.onlyStock = params.get('stock') === '1';
}
function parsePrice(value) { const n = Number(value); return value !== null && value !== '' && Number.isFinite(n) && n >= 0 ? n : null; }
function writeFiltersToUrl() {
    const params = new URLSearchParams();
    if (state.category !== 'all') params.set('cat',state.category);
    if (state.search.trim()) params.set('search',state.search.trim());
    if (state.brand !== 'all') params.set('brand',state.brand);
    if (state.sort !== 'default') params.set('sort',state.sort);
    if (state.priceMin !== null) params.set('min',state.priceMin);
    if (state.priceMax !== null) params.set('max',state.priceMax);
    if (state.onlyStock) params.set('stock','1');
    const next = location.pathname + (params.size ? '?' + params.toString() : '');
    history.replaceState(null,'',next);
}
function syncFilterControls() {
    document.getElementById('search-input').value = state.search;
    document.getElementById('sort-select').value = state.sort;
    document.getElementById('price-min').value = state.priceMin ?? '';
    document.getElementById('price-max').value = state.priceMax ?? '';
    document.getElementById('stock-only').checked = state.onlyStock;
    document.querySelectorAll('[data-category]').forEach(button => { const on = button.dataset.category === state.category;button.classList.toggle('active',on);button.setAttribute('aria-pressed',String(on)); });
    document.querySelectorAll('[data-brand]').forEach(button => { const on = button.dataset.brand === state.brand;button.classList.toggle('active',on);button.setAttribute('aria-pressed',String(on)); });
    const error = document.getElementById('price-error');
    error.hidden = !(state.priceMin !== null && state.priceMax !== null && state.priceMin > state.priceMax);
    const count = [state.category!=='all',state.brand!=='all',Boolean(state.search.trim()),state.priceMin!==null,state.priceMax!==null,state.onlyStock].filter(Boolean).length;
    const badge = document.getElementById('filters-count');badge.textContent = count || '';badge.style.display = count ? 'inline-flex' : 'none';
}
function renderFilterTags() {
    const tags=[];
    if(state.category!=='all') tags.push(['category',state.category]);
    if(state.brand!=='all') tags.push(['brand',state.brand]);
    if(state.search.trim()) tags.push(['search',`Поиск: ${state.search}`]);
    if(state.priceMin!==null) tags.push(['priceMin',`От ${ExoStore.price(state.priceMin)}`]);
    if(state.priceMax!==null) tags.push(['priceMax',`До ${ExoStore.price(state.priceMax)}`]);
    if(state.onlyStock) tags.push(['onlyStock','В наличии']);
    document.getElementById('active-filter-tags').innerHTML=tags.map(([key,label])=>`<button type="button" data-clear-filter="${key}" aria-label="Убрать фильтр: ${ExoStore.escape(label)}">${ExoStore.escape(label)} <span aria-hidden="true">×</span></button>`).join('');
}
document.addEventListener('click',event=>{
    if(event.target.closest('[data-retry-products]')) loadProducts();
    const clear=event.target.closest('[data-clear-filter]');
    if(clear){const key=clear.dataset.clearFilter;state[key]=['category','brand'].includes(key)?'all':key==='search'?'':key==='onlyStock'?false:null;applyFilters();}
});
document.getElementById('stock-only').addEventListener('change',event=>{state.onlyStock=event.target.checked;applyFilters();});
window.addEventListener('popstate',()=>{readFiltersFromUrl();syncFilterControls();applyFilters();});
