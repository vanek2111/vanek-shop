// ========== ПОДКЛЮЧЕНИЕ К SUPABASE ==========
const SUPABASE_URL = 'https://ytqxfykqiekphcpjrvon.supabase.co';
const SUPABASE_KEY = 'sb_publishable_zOXsiffHOAy8S693kYoL6g_CivX9ffr';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_KEY);

// ========== ХЕЛПЕРЫ ==========
function showMessage(text, type = 'error') {
    const el = document.getElementById('auth-message');
    if (!el) return;
    el.textContent = text;
    el.className = 'auth-message ' + type;
}

function hideMessage() {
    const el = document.getElementById('auth-message');
    if (el) el.className = 'auth-message';
}

function setLoading(btn, loading, text = null) {
    if (!btn) return;
    btn.disabled = loading;
    if (loading) {
        btn.dataset.original = btn.textContent;
        btn.textContent = 'Подождите...';
    } else if (btn.dataset.original) {
        btn.textContent = text || btn.dataset.original;
    }
}

// ========== ОБНОВИТЬ ШАПКУ (кнопка Войти/Аккаунт) ==========
async function updateHeaderAuth() {
    const { data: { session } } = await db.auth.getSession();
    const authBtn = document.getElementById('auth-btn');
    const authBtnMobile = document.getElementById('auth-btn-mobile');

    if (session && session.user) {
        // Залогинен
        const fullName = session.user.user_metadata?.full_name || session.user.email.split('@')[0];
        const firstName = fullName.split(' ')[0];

        if (authBtn) {
            authBtn.href = 'account.html';
            authBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>${firstName}</span>
            `;
            authBtn.classList.add('auth-logged');
        }
        if (authBtnMobile) {
            authBtnMobile.href = 'account.html';
            authBtnMobile.textContent = firstName;
        }
    } else {
        // Не залогинен
        if (authBtn) {
            authBtn.href = 'login.html';
            authBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Войти</span>
            `;
            authBtn.classList.remove('auth-logged');
        }
        if (authBtnMobile) {
            authBtnMobile.href = 'login.html';
            authBtnMobile.textContent = 'Войти';
        }
    }
}

// ========== РЕГИСТРАЦИЯ ==========
async function handleRegister(e) {
    e.preventDefault();
    hideMessage();

    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const password2 = document.getElementById('reg-password2').value;
    const btn = document.getElementById('reg-submit');

    // Валидация
    if (name.length < 2) return showMessage('Введите имя и фамилию');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMessage('Введите корректный email');
    if (password.length < 8) return showMessage('Пароль должен быть не менее 8 символов');
    if (password !== password2) return showMessage('Пароли не совпадают');

    setLoading(btn, true);

    const { data, error } = await db.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name
            }
        }
    });

    if (error) {
        setLoading(btn, false);
        showMessage(error.message === 'User already registered'
            ? 'Пользователь с таким email уже существует'
            : error.message);
        return;
    }

    // Успех
    showMessage('Аккаунт создан! Перенаправляем...', 'success');
    setTimeout(() => {
        window.location.href = 'account.html';
    }, 1000);
}

// ========== ВХОД ==========
async function handleLogin(e) {
    e.preventDefault();
    hideMessage();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const btn = document.getElementById('login-submit');

    if (!email || !password) return showMessage('Заполните все поля');

    setLoading(btn, true);

    const { data, error } = await db.auth.signInWithPassword({ email, password });

    if (error) {
        setLoading(btn, false);
        showMessage('Неверный email или пароль');
        return;
    }

    // Успех
    window.location.href = 'account.html';
}

// ========== ВЫХОД ==========
async function handleLogout() {
    await db.auth.signOut();
    window.location.href = 'index.html';
}

// ========== ЗАЩИТА ЛК ==========
async function requireAuth() {
    const { data: { session } } = await db.auth.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return null;
    }
    return session;
}

// ========== ЕСЛИ УЖЕ ЗАЛОГИНЕН — РЕДИРЕКТ ==========
async function redirectIfLoggedIn() {
    const { data: { session } } = await db.auth.getSession();
    if (session) {
        window.location.href = 'account.html';
    }
}

// ========== СТАРТ ==========
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderAuth();
});
