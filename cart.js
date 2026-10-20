// ========== ПОДКЛЮЧЕНИЕ К SUPABASE ==========
if (typeof window.db === 'undefined') {
    window.db = supabase.createClient(
        'https://ytqxfykqiekphcpjrvon.supabase.co',
        'sb_publishable_zOXsiffHOAy8S693kYoL6g_CivX9ffr'
    );
}
var db = window.db;

let allProducts = [];
let cartReady = false;
function getCart() { return ExoCart.get(); }
function saveCart(cart) { return ExoCart.save(cart); }
function updateCartCount() { ExoCart.update(); }
async function initCart() {
    if (!getCart().length) { cartReady = true; renderCart(); return; }
    document.getElementById('cart-content').innerHTML = '<p class="loading" role="status">Загружаем корзину…</p>';
    try {
        const { data, error } = await db.from('products').select('*');
        if (error || !Array.isArray(data)) throw error || new Error('No catalogue');
        allProducts = data;
        ExoStore.setProducts(data);
        cartReady = true;
        renderCart();
    } catch(error) {
        document.getElementById('cart-content').innerHTML = '<div class="load-error"><p>Не удалось загрузить товары. Корзина сохранена в браузере.</p><button type="button" class="btn btn-ghost" data-retry-cart>Повторить загрузку</button></div>';
    }
    updateCartCount();
}
function changeQty(productId, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    const product = ExoStore.get(productId);
    if (!item || (delta > 0 && (!product?.in_stock || item.qty >= 99))) return;
    item.qty += delta;
    saveCart(cart.filter(i => i.qty > 0));
}
function removeFromCart(productId) { saveCart(getCart().filter(i => i.id !== productId)); }
function renderCart() {
    const container = document.getElementById('cart-content');
    const cart = getCart();
    if (!cart.length) {
        container.innerHTML = '<div class="cart-empty"><h2>Здесь будет твой сетап</h2><p>Добавь товары из каталога. Корзина сохранится в этом браузере.</p><a href="catalog.html" class="btn btn-primary">Выбрать товары</a></div>';
        return;
    }
    const items = cart.map(item => { const product = ExoStore.get(item.id); return product ? {...product, qty:item.qty} : {id:item.id,qty:item.qty,name:'Товар больше не доступен',brand:'',price:0,in_stock:false,missing:true}; });
    const unavailable = items.some(item => !item.in_stock);
    const total = items.reduce((sum,item) => sum + Number(item.price)*item.qty,0);
    const totalCount = items.reduce((sum,item) => sum+item.qty,0);
    container.innerHTML = `${unavailable ? '<div class="cart-notice" role="status">Некоторые товары больше не доступны. Удалите их, чтобы продолжить. <button class="btn btn-ghost" type="button" data-remove-unavailable>Убрать недоступные товары</button></div>' : ''}
    <div class="cart-layout"><div class="cart-items">${items.map(item => `
      <article class="cart-item">
        <a class="cart-item-image" ${item.missing ? '' : `href="product.html?id=${item.id}"`} aria-label="${ExoStore.escape(item.name)}">${item.missing ? '<span aria-hidden="true">—</span>' : renderProductPhoto(item)}</a>
        <div class="cart-item-info"><div class="cart-item-name">${item.missing ? ExoStore.escape(item.name) : `<a href="product.html?id=${item.id}">${ExoStore.escape(item.name)}</a>`}</div><div class="cart-item-brand">${ExoStore.escape(item.brand)}</div>${!item.in_stock ? '<span class="product-stock">Нет в наличии</span>' : ''}</div>
        <div class="cart-item-qty"><button type="button" data-qty-id="${item.id}" data-delta="-1" aria-label="Уменьшить количество: ${ExoStore.escape(item.name)}">−</button><span aria-label="Количество">${item.qty}</span><button type="button" data-qty-id="${item.id}" data-delta="1" aria-label="Увеличить количество: ${ExoStore.escape(item.name)}" ${!item.in_stock || item.qty>=99 ? 'disabled' : ''}>+</button></div>
        <div class="cart-item-price">${item.missing ? '—' : ExoStore.price(item.price*item.qty)}</div>
        <button type="button" class="cart-item-remove" data-remove-id="${item.id}" aria-label="Удалить ${ExoStore.escape(item.name)}"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>
      </article>`).join('')}</div>
      <aside class="cart-summary"><h2>Твой заказ</h2><div class="cart-summary-row"><span>Товары (${totalCount})</span><span>${ExoStore.price(total)}</span></div><div class="cart-summary-total"><span>Итого</span><strong>${ExoStore.price(total)}</strong></div><button type="button" class="btn btn-primary cart-checkout" data-checkout ${unavailable ? 'disabled' : ''}>Перейти к оформлению</button><p class="cart-summary-note">Учебный проект: реальная оплата и доставка отключены.</p></aside></div>`;
}
document.addEventListener('click', event => {
    const qty=event.target.closest('[data-qty-id]');if(qty) changeQty(Number(qty.dataset.qtyId),Number(qty.dataset.delta));
    const remove=event.target.closest('[data-remove-id]');if(remove) removeFromCart(Number(remove.dataset.removeId));
    if(event.target.closest('[data-retry-cart]')) initCart();
    if(event.target.closest('[data-remove-unavailable]')) saveCart(getCart().filter(item => ExoStore.get(item.id)?.in_stock));
    if(event.target.closest('[data-checkout]') && !getCart().some(item=>!ExoStore.get(item.id)?.in_stock)) location.href='checkout.html';
});
window.addEventListener('exo-cart-updated',()=>{if(cartReady) renderCart();});
window.addEventListener('storage',event=>{if(event.key==='cart') initCart();});
initCart();
updateCartCount();
