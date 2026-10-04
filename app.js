// ========== ПОДКЛЮЧЕНИЕ К SUPABASE ==========
const SUPABASE_URL = 'https://ytqxfykqiekphcpjrvon.supabase.co';  // ТВОЙ URL
const SUPABASE_KEY = 'sb_publishable_zOXsiffHOAy8S693kYoL6g_CivX9ffr';              // ТВОЙ КЛЮЧ

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

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
    
    grid.innerHTML = data.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-body">
                <div class="product-name">${product.name}</div>
                <div class="product-brand">${product.brand}</div>
                <div class="product-price">${product.price.toLocaleString()} </div>
                <button class="product-btn" onclick="addToCart(${product.id})">
                    В корзину
                </button>
            </div>
        </div>
    `).join('');
}

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
