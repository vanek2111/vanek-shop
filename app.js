// ========== ПОДКЛЮЧЕНИЕ К SUPABASE ==========
const SUPABASE_URL = 'https://ytqxfykqiekphcpjrvon.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zOXsiffHOAy8S693kYoL6g_CivX9ffr';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ========== СОСТОЯНИЕ ==========
const state = {
    allProducts: [],
    filteredProducts: [],
    search: '',
    category: 'all',
    sort: 'default'
};

// ========== ЗАГРУЗКА ТОВАРОВ ==========
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
    renderCategories();
    applyFilters();
}

// ========== КАТЕГОРИИ ==========
function renderCategories() {
    const container = document.getElementById('category-filters');
    const categories = ['all', ...new Set(state.allProducts.map(p => p.category))];
    const labels = { 'all': 'Все товары' };

    container.innerHTML = categories.map(cat => `
        <button class="category-btn ${cat === 'all' ? 'active' : ''}" data-category="${cat}">
            ${labels[cat] || cat}
        </button>
    `).join('');

    container.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.category = btn.dataset.category;
            applyFilters();
        });
    });
}

// ========== ФИЛЬТРАЦИЯ ==========
function applyFilters() {
    let result = [...state.allProducts];

    if (state.category !== 'all') {
        result = result.filter(p => p.category === state.category);
    }

    if (state.search.trim()) {
        const q = state.search.toLowerCase().trim();
        result = result.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q)
        );
    }

    if (state.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (state.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (state.sort === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name, 'ru'));

    state.filteredProducts = result;
    renderProducts();
}

// ========== ОТРИСОВКА ТОВАРОВ ==========
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
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
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

// ========== ФИЛЬТРЫ ==========
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const resetBtn = document.getElementById('reset-filters');

    if (searchInput) {
        let t;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(t);
            t = setTimeout(() => {
                state.search = e.target.value;
                applyFilters();
            }, 200);
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            state.sort = e.target.value;
            applyFilters();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            state.search = '';
            state.category = 'all';
            state.sort = 'default';
            searchInput.value = '';
            sortSelect.value = 'default';
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            document.querySelector('.category-btn[data-category="all"]')?.classList.add('active');
            applyFilters();
        });
    }
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

    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ id: productId, qty: 1 });
    }

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
if (document.getElementById('products-grid')) {
    loadProducts();
}
updateCartCount();
