// ========== ПОДКЛЮЧЕНИЕ К SUPABASE ==========
const SUPABASE_URL = 'https://ytqxfykqiekphcpjrvon.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zOXsiffHOAy8S693kYoL6g_CivX9ffr';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ========== СОСТОЯНИЕ ==========
const state = {
    allProducts: [],      // все товары из базы
    filteredProducts: [], // отфильтрованные
    search: '',
    category: 'all',
    sort: 'default'
};

// ========== ЗАГРУЗКА ТОВАРОВ ==========
async function loadProducts() {
    const grid = document.getElementById('products-grid');

    const { data, error } = await db
        .from('products')
        .select('*');

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

// ========== ОТРИСОВКА КАТЕГОРИЙ ==========
function renderCategories() {
    const container = document.getElementById('category-filters');

    // Собираем уникальные категории из товаров
    const categories = ['all', ...new Set(state.allProducts.map(p => p.category))];

    const labels = {
        'all': 'Все товары'
    };

    container.innerHTML = categories.map(cat => `
        <button class="category-btn ${cat === 'all' ? 'active' : ''}" data-category="${cat}">
            ${labels[cat] || cat}
        </button>
    `).join('');

    // Вешаем обработчики
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

    // 1. Фильтр по категории
    if (state.category !== 'all') {
        result = result.filter(p => p.category === state.category);
    }

    // 2. Поиск
    if (state.search.trim()) {
        const q = state.search.toLowerCase().trim();
        result = result.filter(p =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q)
        );
    }

    // 3. Сортировка
    if (state.sort === 'price-asc') {
        result.sort((a, b) => a.price - b.price);
    } else if (state.sort === 'price-desc') {
        result.sort((a, b) => b.price - a.price);
    } else if (state.sort === 'name-asc') {
        result.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    }

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
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-body">
                <div class="product-name">${product.name}</div>
                <div class="product-brand">${product.brand}</div>
                <div class="product-price">${product.price.toLocaleString()}</div>
                <button class="product-btn" onclick="addToCart(${product.id})">
                    В корзину
                </button>
            </div>
        </div>
    `).join('');
}

// ========== ОБРАБОТЧИКИ ФИЛЬТРОВ ==========
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const resetBtn = document.getElementById('reset-filters');

    // Поиск — с задержкой (чтобы не дёргать на каждую букву)
    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            state.search = e.target.value;
            applyFilters();
        }, 200);
    });

    // Сортировка
    sortSelect.addEventListener('change', (e) => {
        state.sort = e.target.value;
        applyFilters();
    });

    // Сброс фильтров
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
});

// ========== КОРЗИНА ==========
function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(productId) {
    const cart = getCart();
    if (!cart.includes(productId)) {
        cart.push(productId);
        saveCart(cart);
        alert('Товар добавлен в корзину!');
    } else {
        alert('Товар уже в корзине');
    }
}

function updateCartCount() {
    const cart = getCart();
    document.getElementById('cart-count').textContent = cart.length;
}

// ========== СТАРТ ==========
loadProducts();
updateCartCount();
