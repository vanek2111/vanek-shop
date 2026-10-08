// ========== ПОДКЛЮЧЕНИЕ К SUPABASE ==========
const SUPABASE_URL = 'https://ytqxfykqiekphcpjrvon.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zOXsiffHOAy8S693kYoL6g_CivX9ffr';

const { createClient } = supabase;
var db = createClient(SUPABASE_URL, SUPABASE_KEY);

window.db = db;  // ← глобальный db для всех модулей

// ========== ИКОНКИ ПО КАТЕГОРИЯМ ==========
const categoryIcons = {
    'Аудио': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>',
    'Мышки': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="6"></rect><line x1="12" y1="8" x2="12" y2="11"></line></svg>',
    'Клавиатуры': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><line x1="6" y1="10" x2="6.01" y2="10"></line><line x1="10" y1="10" x2="10.01" y2="10"></line><line x1="14" y1="10" x2="14.01" y2="10"></line><line x1="18" y1="10" x2="18.01" y2="10"></line><line x1="7" y1="14" x2="17" y2="14"></line></svg>',
    'Наушники': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"></path><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path></svg>',
    'Мониторы': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>',
    'Геймпады': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="12" x2="10" y2="12"></line><line x1="8" y1="10" x2="8" y2="14"></line><line x1="15" y1="13" x2="15.01" y2="13"></line><line x1="18" y1="11" x2="18.01" y2="11"></line><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"></path></svg>',
    'Коврики': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="1"></rect><path d="M6 10h12M6 14h12"></path></svg>',
    'Игровые кресла': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 10V7a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v3"></path><path d="M3 10h18v6a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3v-6z"></path><line x1="7" y1="19" x2="7" y2="22"></line><line x1="17" y1="19" x2="17" y2="22"></line></svg>',
    'Аксессуары': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2v6M15 2v6M6 8h12v4a6 6 0 0 1-12 0z"></path><path d="M12 18v4"></path></svg>',
    'Комплектующие': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line></svg>'
};

function getIcon(product) {
    const category = product.category;
    const name = (product.name || '').toLowerCase();

    if (name.includes('мышь') || name.includes('mouse')) {
        return categoryIcons['Мышки'];
    }
    if (name.includes('клавиатура') || name.includes('keyboard')) {
        return categoryIcons['Клавиатуры'];
    }
    if (name.includes('наушник') || name.includes('headphone') || name.includes('airpods')) {
        return categoryIcons['Наушники'];
    }
    if (name.includes('монитор') || name.includes('monitor')) {
        return categoryIcons['Мониторы'];
    }
    if (name.includes('геймпад') || name.includes('dualsense') || name.includes('xbox')) {
        return categoryIcons['Геймпады'];
    }
    if (name.includes('коврик')) {
        return categoryIcons['Коврики'];
    }
    if (name.includes('кресло') || name.includes('стул')) {
        return categoryIcons['Игровые кресла'];
    }

    return categoryIcons[category] || '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>';
}

// ========== ЗАГРУЗКА ==========
async function loadProducts() {
    const { data, error } = await db.from('products').select('*');
    if (error) {
        console.error('Ошибка:', error);
        return;
    }
    renderHitsAndNew(data);
}

// ========== ХИТЫ И НОВИНКИ ==========
function renderHitsAndNew(data) {
    const hits = [...data].sort((a, b) => b.price - a.price).slice(0, 8);
    const newItems = [...data].sort((a, b) => b.id - a.id).slice(0, 8);

    document.getElementById('hits-grid').innerHTML = hits.map(p => renderCard(p, 'ХИТ')).join('');
    document.getElementById('new-grid').innerHTML = newItems.map(p => renderCard(p, 'NEW')).join('');
}

function renderCard(product, badge) {
    const imageUrl = getProductImage(product);
    const image = imageUrl ? `
        <img class="product-image" src="${imageUrl}" alt="${product.name}" loading="lazy" decoding="async"
             onerror="this.hidden=true; this.parentElement.querySelector('.product-image-fallback').hidden=false">
    ` : '';
    return `
        <a href="product.html?id=${product.id}" class="product-card">
            <div class="product-image-wrap">
                ${image}
                <div class="product-image-fallback" ${imageUrl ? 'hidden' : ''}>${getIcon(product)}</div>
                ${badge ? `<div class="product-badge">${badge}</div>` : ''}
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
if (document.getElementById('hits-grid')) {
    loadProducts();
}
updateCartCount();

// ========== МОДАЛКА ОТЗЫВА ==========
const openReviewBtn = document.getElementById('open-review-modal');
const reviewModal = document.getElementById('review-modal');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const reviewForm = document.getElementById('review-form');

if (openReviewBtn && reviewModal) {
    // Открыть
    openReviewBtn.addEventListener('click', () => {
        reviewModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    // Закрыть
    function closeModal() {
        reviewModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    modalClose?.addEventListener('click', closeModal);
    modalOverlay?.addEventListener('click', closeModal);

    // Esc закрывает
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && reviewModal.classList.contains('open')) {
            closeModal();
        }
    });
}

// ========== ЗВЁЗДЫ В ФОРМЕ ==========
const ratingStars = document.querySelectorAll('#rating-input span');
const ratingInput = document.getElementById('review-rating');

if (ratingStars.length > 0) {
    ratingStars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.rating);
            ratingInput.value = rating;

            ratingStars.forEach((s, i) => {
                if (i < rating) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });

        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating);
            ratingStars.forEach((s, i) => {
                s.style.color = i < rating ? '#fbbf24' : '';
            });
        });
    });

    // При уходе — возвращаем как было
    const ratingContainer = document.getElementById('rating-input');
    ratingContainer?.addEventListener('mouseleave', () => {
        const currentRating = parseInt(ratingInput.value);
        ratingStars.forEach((s, i) => {
            s.style.color = '';
            if (i < currentRating) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
    });

    // По умолчанию — 5 звёзд
    ratingStars.forEach(s => s.classList.add('active'));
}

// ========== ОТПРАВКА ОТЗЫВА ==========
if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('review-name').value.trim();
        const rating = parseInt(document.getElementById('review-rating').value);
        const text = document.getElementById('review-text').value.trim();
        const message = document.getElementById('review-message');
        const submitBtn = document.getElementById('review-submit');

        if (name.length < 2) {
            message.textContent = 'Введите имя';
            message.className = 'form-message error';
            return;
        }

        if (text.length < 10) {
            message.textContent = 'Отзыв должен быть не менее 10 символов';
            message.className = 'form-message error';
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправляем...';

        const { error } = await db.from('reviews').insert({
            name: name,
            rating: rating,
            text: text,
            status: 'new'
        });

        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить отзыв';

        if (error) {
            console.error('Ошибка:', error);
            message.textContent = 'Ошибка отправки. Попробуйте позже';
            message.className = 'form-message error';
            return;
        }

        message.textContent = '✓ Спасибо! Отзыв появится после проверки';
        message.className = 'form-message success';

        reviewForm.reset();
        ratingInput.value = 5;
        ratingStars.forEach(s => s.classList.add('active'));

        setTimeout(() => {
            message.className = 'form-message';
            closeModal?.();
        }, 2500);
    });
}
