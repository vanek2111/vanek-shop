// ========== ПОДКЛЮЧЕНИЕ К SUPABASE ==========
if (typeof window.db === 'undefined') {
    window.db = supabase.createClient(
        'https://ytqxfykqiekphcpjrvon.supabase.co',
        'sb_publishable_zOXsiffHOAy8S693kYoL6g_CivX9ffr'
    );
}
const db = window.db;

// ========== ID ИЗ URL ==========
function getIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

// ========== ЗАГРУЗКА ==========
async function loadProduct() {
    const container = document.getElementById('product-content');
    const id = getIdFromUrl();

    if (!id) {
        container.innerHTML = `
            <div class="product-error">
                <h1>Товар не найден</h1>
                <p>В ссылке нет ID товара</p>
                <a href="index.html#catalog" class="btn btn-primary">В каталог</a>
            </div>
        `;
        return;
    }

    const { data, error } = await db
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        console.error('Ошибка:', error);
        container.innerHTML = `
            <div class="product-error">
                <h1>Товар не найден</h1>
                <p>Возможно, он был удалён или ссылка устарела</p>
                <a href="index.html#catalog" class="btn btn-primary">В каталог</a>
            </div>
        `;
        return;
    }

    document.title = `${data.name} — ExoTech`;
    renderProduct(data);
}

// ========== ОТРИСОВКА ==========
function renderProduct(p) {
    const container = document.getElementById('product-content');

    // Характеристики — если есть
    let specsHtml = '';
    if (p.specs && typeof p.specs === 'object' && Object.keys(p.specs).length > 0) {
        specsHtml = `
            <div class="product-detail-specs">
                <h2>Характеристики</h2>
                <dl class="specs-list">
                    ${Object.entries(p.specs).map(([key, value]) => `
                        <div class="specs-row">
                            <dt>${key}</dt>
                            <dd>${value}</dd>
                        </div>
                    `).join('')}
                </dl>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <img src="${p.image}" alt="${p.name}">
            </div>

            <div class="product-detail-info">
                <div class="product-detail-brand">${p.brand}</div>
                <h1 class="product-detail-name">${p.name}</h1>
                <div class="product-detail-category">${p.category}</div>

                <p class="product-detail-description">
                    ${p.description || 'Описание появится позже.'}
                </p>

                <div class="product-detail-price">
                    ${p.price.toLocaleString()} <span>₽</span>
                </div>

                <div class="product-detail-status ${p.in_stock ? 'in-stock' : 'out-of-stock'}">
                    ${p.in_stock ? '● В наличии' : '● Нет в наличии'}
                </div>

                <div class="product-detail-actions">
                    <button class="btn btn-primary product-detail-btn" 
                            onclick="addToCart(${p.id})"
                            ${!p.in_stock ? 'disabled' : ''}>
                        ${p.in_stock ? 'Добавить в корзину' : 'Нет в наличии'}
                    </button>
                    <a href="cart.html" class="btn btn-ghost">Перейти в корзину</a>
                </div>
            </div>
        </div>

        ${specsHtml}
    `;
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
loadProduct();
updateCartCount();
