// ========== ПОДКЛЮЧЕНИЕ К SUPABASE ==========
if (typeof window.db === 'undefined') {
    window.db = supabase.createClient(
        'https://ytqxfykqiekphcpjrvon.supabase.co',
        'sb_publishable_zOXsiffHOAy8S693kYoL6g_CivX9ffr'
    );
}
var db = window.db;

let allProducts = [];

// ========== КОРЗИНА ==========
function getCart() { return ExoCart.get(); }

function updateCartCount() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const el = document.getElementById('cart-count');
    if (el) el.textContent = totalCount;
}

// ========== МАСКА ТЕЛЕФОНА ==========
function initPhoneMask() {
    const phoneInput = document.getElementById('customer-phone');
    if (!phoneInput) return;

    // При фокусе — подставляем +7 (
    phoneInput.addEventListener('focus', () => {
        if (!phoneInput.value) {
            phoneInput.value = '+7 (';
        }
    });

    // При blur — если только +7 ( — очищаем
    phoneInput.addEventListener('blur', () => {
        if (phoneInput.value === '+7 (' || phoneInput.value === '+7') {
            phoneInput.value = '';
        }
    });

    // Обработка ввода
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, ''); // только цифры

        // Если начинается с 8 — меняем на 7
        if (value.startsWith('8')) {
            value = '7' + value.slice(1);
        }

        // Если не начинается с 7 — добавляем
        if (value && !value.startsWith('7')) {
            value = '7' + value;
        }

        // Максимум 11 цифр (7 + 10)
        value = value.slice(0, 11);

        // Форматируем
        let formatted = '';
        if (value.length > 0) {
            formatted = '+7';
        }
        if (value.length > 1) {
            formatted += ' (' + value.slice(1, 4);
        }
        if (value.length >= 5) {
            formatted += ') ' + value.slice(4, 7);
        }
        if (value.length >= 8) {
            formatted += '-' + value.slice(7, 9);
        }
        if (value.length >= 10) {
            formatted += '-' + value.slice(9, 11);
        }

        e.target.value = formatted;
    });

    // Запрещаем всё, кроме цифр и служебных клавиш
    phoneInput.addEventListener('keypress', (e) => {
        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
        }
    });
}

// ========== ЗАГРУЗКА ТОВАРОВ ==========
async function initCheckout() {
    const cart = getCart();

    if (cart.length === 0) {
        window.location.href = 'catalog.html';
        return;
    }

    const summary = document.getElementById('checkout-items');
    summary.innerHTML = '<p role="status">Проверяем товары…</p>';
    let data;
    try {
        const result = await db.from('products').select('*');
        if (result.error) throw result.error;
        data = result.data || [];
    } catch (error) {
        summary.innerHTML = '<p role="alert">Не удалось загрузить заказ. Проверь подключение и повтори попытку.</p><button class="btn btn-primary" id="checkout-retry" type="button">Повторить</button>';
        document.getElementById('checkout-retry').addEventListener('click', initCheckout);
        return;
    }

    allProducts = data;
    ExoStore.setProducts(data);
    if (cart.some(item => !ExoStore.get(item.id)?.in_stock)) { location.href = 'cart.html'; return; }
    renderSummary();
    await prefillForm();
}

// ========== АВТОЗАПОЛНЕНИЕ ==========
async function prefillForm() {
    const { data: { session } } = await db.auth.getSession();
    if (!session) return;

    const { data: profile } = await db
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

    const nameEl = document.getElementById('customer-name');
    const emailEl = document.getElementById('customer-email');
    const phoneEl = document.getElementById('customer-phone');
    const cityEl = document.getElementById('customer-city');
    const addressEl = document.getElementById('customer-address');

    if (nameEl && !nameEl.value) {
        nameEl.value = profile?.full_name || session.user.user_metadata?.full_name || '';
    }
    if (emailEl && !emailEl.value) {
        emailEl.value = session.user.email || '';
    }
    if (phoneEl && !phoneEl.value && profile?.phone) {
        // Форматируем телефон из профиля
        let digits = profile.phone.replace(/\D/g, '');
        if (digits.startsWith('8')) digits = '7' + digits.slice(1);
        if (!digits.startsWith('7')) digits = '7' + digits;
        digits = digits.slice(0, 11);

        let formatted = '';
        if (digits.length > 0) formatted = '+7';
        if (digits.length > 1) formatted += ' (' + digits.slice(1, 4);
        if (digits.length >= 5) formatted += ') ' + digits.slice(4, 7);
        if (digits.length >= 8) formatted += '-' + digits.slice(7, 9);
        if (digits.length >= 10) formatted += '-' + digits.slice(9, 11);

        phoneEl.value = formatted;
    }
    if (cityEl && !cityEl.value && profile?.city) cityEl.value = profile.city;
    if (addressEl && !addressEl.value && profile?.address) addressEl.value = profile.address;
}

// ========== ИТОГО ==========
function renderSummary() {
    const cart = getCart();
    const container = document.getElementById('checkout-items');

    const items = cart.map(item => {
        const product = allProducts.find(p => p.id === item.id);
        return product ? { ...product, qty: item.qty } : null;
    }).filter(Boolean);

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const totalCount = items.reduce((sum, item) => sum + item.qty, 0);

    container.innerHTML = `
        <div class="checkout-items-list">
            ${items.map(item => `
                <div class="checkout-item">
                    <div class="checkout-item-info">
                        <span class="checkout-item-name">${ExoStore.escape(item.name)}</span>
                        <span class="checkout-item-qty">× ${item.qty}</span>
                    </div>
                    <span class="checkout-item-price">${(item.price * item.qty).toLocaleString()} ₽</span>
                </div>
            `).join('')}
        </div>

        <div class="checkout-summary-row">
            <span>Товары (${totalCount})</span>
            <span>${total.toLocaleString()} ₽</span>
        </div>
        <div class="checkout-summary-row">
            <span>Доставка</span>
            <span>Не выполняется</span>
        </div>
        <div class="checkout-total">
            <span>К оплате</span>
            <strong>${ExoStore.price(total)}</strong>
        </div>

        <button type="button" class="btn btn-primary checkout-submit" id="checkout-submit">
            Оформить заказ
        </button>
    `;

    document.getElementById('checkout-submit').addEventListener('click', submitOrder);
}

// ========== ВАЛИДАЦИЯ ==========
function showError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const error = document.getElementById('error-' + fieldId.replace('customer-', ''));
    input.classList.add('input-error');
    if (error) error.textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.input-error').forEach(el => el.classList.remove('input-error'));
    document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}

function validateForm() {
    clearErrors();
    let valid = true;

    const name = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('customer-phone').value.trim();
    const email = document.getElementById('customer-email').value.trim();
    const city = document.getElementById('customer-city').value.trim();
    const address = document.getElementById('customer-address').value.trim();

    if (name.length < 2) {
        showError('customer-name', 'Введите имя и фамилию');
        valid = false;
    }

    // Телефон: строго 11 цифр, начинается с 7
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length !== 11 || !phoneDigits.startsWith('7')) {
        showError('customer-phone', 'Формат: +7 (999) 123-45-67');
        valid = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError('customer-email', 'Введите корректный email');
        valid = false;
    }

    if (city.length < 2) {
        showError('customer-city', 'Введите город');
        valid = false;
    }

    if (address.length < 5) {
        showError('customer-address', 'Введите полный адрес');
        valid = false;
    }

    return valid;
}

// ========== ОТПРАВКА ЗАКАЗА ==========
async function submitOrder() {
    if (!validateForm()) {
        const firstError = document.querySelector('.input-error');
        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }

    const btn = document.getElementById('checkout-submit');
    btn.disabled = true;
    btn.textContent = 'Отправляем...';

    const cart = getCart();
    if (!cart.length || cart.some(item => !ExoStore.get(item.id)?.in_stock)) { location.href = 'cart.html'; return; }
    const items = cart.map(item => {
        const product = allProducts.find(p => p.id === item.id);
        return product ? {
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            qty: item.qty
        } : null;
    }).filter(Boolean);

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

    const { data: { session } } = await db.auth.getSession();
    const userId = session?.user?.id || null;

    const order = {
        customer_name: document.getElementById('customer-name').value.trim(),
        customer_phone: document.getElementById('customer-phone').value.trim(),
        customer_email: document.getElementById('customer-email').value.trim(),
        city: document.getElementById('customer-city').value.trim(),
        address: document.getElementById('customer-address').value.trim(),
        comment: document.getElementById('customer-comment').value.trim() || null,
        payment_method: document.querySelector('input[name="payment"]:checked').value,
        items: items,
        total: total,
        user_id: userId
    };

    const { data, error } = await db.from('orders').insert(order).select().single();

    if (error) {
        console.error('Ошибка:', error);
        btn.disabled = false;
        btn.textContent = 'Оформить заказ';
        alert('Не удалось отправить заказ. Попробуйте ещё раз.');
        return;
    }

    ExoCart.save([]);
    updateCartCount();
    showSuccess(data.id);
}

// ========== ЭКРАН "СПАСИБО" ==========
function showSuccess(orderId) {
    document.querySelector('.checkout-page .container').innerHTML = `
        <div class="checkout-success">
            <div class="checkout-success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
            </div>
            <h1>Спасибо за заказ!</h1>
            <p class="checkout-success-number">Заказ №${orderId} принят</p>
            <p class="checkout-success-text">
                Это учебный заказ.
                Заказ сохранён в учебном проекте; реальная оплата и доставка не выполняются.
            </p>
            <div class="checkout-success-actions">
                <a href="catalog.html" class="btn btn-primary">Вернуться в каталог</a>
                <a href="account.html" class="btn btn-ghost">Личный кабинет</a>
            </div>
        </div>
    `;
    window.scrollTo(0, 0);
}

// ========== СТАРТ ==========
initCheckout();
updateCartCount();
initPhoneMask();
