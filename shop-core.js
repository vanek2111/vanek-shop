(() => {
  const money = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 });
  const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[char]));
  const products = new Map();
  function readCart() {
    try {
      const raw = JSON.parse(localStorage.getItem('cart') || '[]');
      if (!Array.isArray(raw)) return [];
      const items = new Map();
      raw.forEach(entry => {
        const id = Number(typeof entry === 'number' ? entry : entry?.id);
        const qty = Number(typeof entry === 'number' ? 1 : entry?.qty);
        if (!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(qty) || qty <= 0) return;
        items.set(id, Math.min(99, (items.get(id) || 0) + qty));
      });
      return [...items].map(([id, qty]) => ({ id, qty }));
    } catch { return []; }
  }
  function updateBadge() {
    const count = readCart().reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById('cart-count');
    if (badge) badge.textContent = count;
    document.querySelectorAll('.cart-btn').forEach(link => link.setAttribute('aria-label', `Корзина: ${count} шт.`));
  }
  function saveCart(items) {
    try {
      localStorage.setItem('cart', JSON.stringify(items));
      updateBadge();
      window.dispatchEvent(new Event('exo-cart-updated'));
      return true;
    } catch {
      window.showToast?.('Не удалось сохранить корзину. Проверьте настройки браузера.');
      return false;
    }
  }
  function add(id) {
    const product = products.get(Number(id));
    if (!product || !product.in_stock) { window.showToast?.('Этого товара сейчас нет в наличии'); return; }
    const cart = readCart();
    const existing = cart.find(item => item.id === Number(id));
    if (existing && existing.qty >= 99) { window.showToast?.('Максимум 99 единиц одного товара'); return; }
    if (existing) existing.qty += 1; else cart.push({ id:Number(id), qty:1 });
    if (saveCart(cart)) window.showToast?.('Добавлено в корзину');
  }
  function card(product) {
    const stock = Boolean(product.in_stock);
    const specs = Object.entries(product.specs || {}).slice(0, 2);
    const id = Number(product.id);
    return `<article class="product-card${stock ? '' : ' is-unavailable'}" data-product-id="${id}">
      <a class="product-image-wrap" href="product.html?id=${id}" aria-label="${escape(product.name)}">${renderProductPhoto(product)}</a>
      <div class="product-body">
        <span class="product-brand">${escape(product.brand)}</span>
        <h3 class="product-name"><a href="product.html?id=${id}">${escape(product.name)}</a></h3>
        <div class="product-quick-specs">${specs.map(([key,value]) => `<span>${escape(key)}: ${escape(value)}</span>`).join('')}</div>
        <span class="product-stock ${stock ? 'available' : ''}">${stock ? 'В наличии' : 'Нет в наличии'}</span>
        <div class="product-buy"><span class="product-price">${money.format(Number(product.price))}</span>
        <button type="button" class="product-btn" data-add-product="${id}" aria-label="Добавить ${escape(product.name)} в корзину" ${stock ? '' : 'disabled'}>${stock ? 'В корзину' : 'Недоступно'}</button></div>
      </div></article>`;
  }
  window.ExoStore = { escape, price: value => money.format(Number(value) || 0), setProducts: data => { products.clear(); data.forEach(p => products.set(Number(p.id),p)); }, get: id => products.get(Number(id)), card, add };
  window.ExoCart = { get: readCart, save: saveCart, update: updateBadge };
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-add-product]');
    if (button && !button.disabled) add(Number(button.dataset.addProduct));
  });
  document.addEventListener('DOMContentLoaded', updateBadge);
  window.addEventListener('storage', event => { if (event.key === 'cart') updateBadge(); });
})();
