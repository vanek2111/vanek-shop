// ========== ПОДКЛЮЧЕНИЕ К SUPABASE ==========
if (typeof window.db === 'undefined') {
    window.db = supabase.createClient(
        'https://ytqxfykqiekphcpjrvon.supabase.co',
        'sb_publishable_zOXsiffHOAy8S693kYoL6g_CivX9ffr'
    );
}
var db = window.db;

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

// ========== ОБНОВИТЬ ШАПКУ ==========
async function updateHeaderAuth() {
    const { data: { session } } = await db.auth.getSession();
    const authBtn = document.getElementById('auth-btn');
    const authBtnMobile = document.getElementById('auth-btn-mobile');

    if (!authBtn) return;

    const iconSvg = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
        </svg>
    `;

    if (session && session.user) {
        // Залогинен — берём имя из profiles
        let fullName = session.user.user_metadata?.full_name
            || session.user.email.split('@')[0];

        try {
            const { data: profile } = await db
                .from('profiles')
                .select('full_name')
                .eq('id', session.user.id)
                .single();

            if (profile && profile.full_name) {
                fullName = profile.full_name;
            }
        } catch (e) {
            console.warn('Не удалось загрузить профиль:', e);
        }

        const firstName = fullName.split(' ')[0];

        if (authBtn) {
            authBtn.href = 'account.html';
            authBtn.innerHTML = `${iconSvg}<span>${firstName}</span>`;
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
            authBtn.innerHTML = `${iconSvg}<span>Войти</span>`;
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

    if (name.length < 2) return showMessage('Введите имя и фамилию');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMessage('Введите корректный email');
    if (password.length < 8) return showMessage('Пароль должен быть не менее 8 символов');
    if (password !== password2) return showMessage('Пароли не совпадают');

    setLoading(btn, true);

    const { data, error } = await db.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } }
    });

    if (error) {
        setLoading(btn, false);
        showMessage(error.message === 'User already registered'
            ? 'Пользователь с таким email уже существует'
            : error.message);
        return;
    }

    if (data.user) {
        try {
            await db.from('profiles').upsert({
                id: data.user.id,
                full_name: name
            });
        } catch (e) {
            console.warn('Профиль не обновился:', e);
        }
    }

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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showMessage('Введите корректный email');

    setLoading(btn, true);

    const { data, error } = await db.auth.signInWithPassword({ email, password });

    if (error) {
        setLoading(btn, false);
        showMessage('Неверный email или пароль');
        return;
    }

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

// ========== РЕДИРЕКТ ЕСЛИ ЗАЛОГИНЕН ==========
async function redirectIfLoggedIn() {
    const { data: { session } } = await db.auth.getSession();
    if (session) {
        window.location.href = 'account.html';
    }
}

// ========== ПОДПИСКА НА ИЗМЕНЕНИЕ АВТОРИЗАЦИИ ==========
db.auth.onAuthStateChange((event, session) => {
    updateHeaderAuth();
});

// ========== СТАРТ ==========
document.addEventListener('DOMContentLoaded', () => {
    updateHeaderAuth();
});
