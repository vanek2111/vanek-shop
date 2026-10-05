// ========== ПОДКЛЮЧЕНИЕ К SUPABASE ==========
const SUPABASE_URL = 'https://ytqxfykqiekphcpjrvon.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zOXsiffHOAy8S693kYoL6g_CivX9ffr';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

let allProducts = [];

// ========== ИНИЦИАЛИЗАЦИЯ ==========
async function initCart() {
    const { data, error } = await db.from('products').select('*');

    if (error) {
        console.error('Ошибка:', error);
        document.getElementById('cart-content').innerHTML = '<p>Не удалось загрузить товары</p>';
        return;
    }

    allProducts = data;
    renderCart();
    updateCartCount();
}

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

function updateCartCount() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const el = document.getElementById('cart-count');
    if (el) el.textContent = totalCount;
}

function changeQty(productId, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart(cart);
    renderCart();
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== productId);
    saveCart(cart);
    renderCart();
}

// ========== ОТРИСОВКА ==========
function renderCart() {
    const container = document.getElementById('cart-content');
    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <div class="cart-empty-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                </div>
                <h2>Корзина пуста</h2>
                <p>Добавьте товары из каталога, чтобы оформить заказ</p>
                <a href="index.html#catalog" class="btn btn-primary">Перейти в каталог</a>
            </div>
        `;
        return;
    }

    const items = cart.map(item => {
        const product = allProducts.find(p => p.id === item.id);
        return product ? { ...product, qty: item.qty } : null;
    }).filter(Boolean);

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalCount = items.reduce((sum, item) => sum + item.qty, 0);

    container.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items">
                ${items.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-brand">${item.brand}</div>
                        </div>
                        <div class="cart-item-qty">
                            <button onclick="changeQty(${item.id}, -1)">−</button>
                            <span>${item.qty}</span>
                            <button onclick="changeQty(${item.id}, 1)">+</button>
                        </div>
                        <div class="cart-item-price">${(item.price * item.qty).toLocaleString()} ₽</div>
                        <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                            </svg>
                        </button>
                    </div>
                `).join('')}
            </div>

            <aside class="cart-summary">
                <h2>Итого</h2>
                <div class="cart-summary-row">
                    <span>Товары (${totalCount})</span>
                    <span>${total.toLocaleString()} ₽</span>
                </div>
                <div class="cart-summary-row">
                    <span>Доставка</span>
                    <span>Бесплатно</span>
                </div>
                <div class="cart-summary-total">
                    <span>К оплате</span>
                    <strong>${total.toLocaleString()}</strong>
                </div>
                <button class="btn btn-primary cart-checkout" onclick="checkout()">
                    Оформить заказ
                </button>
            </aside>
        </div>
    `;
}

function checkout() {
    window.location.href = 'checkout.html';
}

// ========== СТАРТ ==========
initCart();
