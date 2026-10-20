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
    const grids = ['hits-grid', 'new-grid'].map(id => document.getElementById(id)).filter(Boolean);
    grids.forEach(grid => { grid.setAttribute('aria-busy', 'true'); grid.innerHTML = '<p class="loading" role="status">Загружаем каталог…</p>'; });
    try {
        const { data, error } = await db.from('products').select('*');
        if (error || !Array.isArray(data)) throw error || new Error('Empty response');
        ExoStore.setProducts(data);
        renderHitsAndNew(data);
    } catch (error) {
        console.error('Каталог недоступен:', error);
        grids.forEach(grid => { grid.innerHTML = '<div class="load-error"><p>Не удалось загрузить товары. Проверьте соединение и попробуйте ещё раз.</p><button class="btn btn-ghost" type="button" data-retry-products>Повторить загрузку</button></div>'; });
    } finally { grids.forEach(grid => grid.setAttribute('aria-busy', 'false')); }
}

// ========== ХИТЫ И НОВИНКИ ==========
function renderHitsAndNew(data) {
    function select(ids) { return ids.map(id => data.find(p => p.id === id)).filter(Boolean); }
    const picks = select([36, 42, 29, 35]);
    const extras = select([55, 67, 13, 24]);
    document.getElementById('hits-grid').innerHTML = picks.map(p => ExoStore.card(p)).join('');
    document.getElementById('new-grid').innerHTML = extras.map(p => ExoStore.card(p)).join('');
}

function renderCard(product) { return ExoStore.card(product); }

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

document.addEventListener("click", event => { if (event.target.closest("[data-retry-products]")) loadProducts(); });
