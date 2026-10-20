// Product-specific image overrides for the demo catalog.
// Image sources: Wikimedia Commons (Logitech) and the manufacturers' product pages.
// Unknown or placeholder URLs fall back to the category icon instead of showing a fake thumbnail.
const productImageOverrides = {
    1: 'assets/products/1.png',
    2: 'assets/products/2.jpg',
    3: 'assets/products/3.jpg',
    4: 'assets/products/4.png',
    5: 'https://www.lg.com/content/dam/channelbtb/lgcom/de/business/images/isp/27up850-w_aeu_eedg_de_c/450x450-isp-27up850-w.jpg',
    8: 'assets/products/8.jpg',
    9: 'assets/products/9.jpg',
    10: 'assets/products/10.jpg',
    11: 'assets/products/11.jpg',
    12: 'assets/products/12.jpg',
    13: 'assets/products/13.png',
    14: 'assets/products/14.jpg',
    15: 'assets/products/15.jpg',
    16: 'assets/products/16.png',
    24: 'assets/products/24.jpg',
    25: 'assets/products/25.png',
    26: 'assets/products/26.jpg',
    27: 'assets/products/27.jpg',
    28: 'assets/products/28.jpg',
    29: 'assets/products/29.png',
    32: 'assets/products/32.png',
    34: 'assets/products/34.webp',
    35: 'assets/products/35.png',
    36: 'assets/products/36.png',
    37: 'assets/products/37.jpg',
    38: 'assets/products/38.jpg',
    39: 'assets/products/39.jpg',
    40: 'assets/products/40.jpg',
    41: 'assets/products/41.jpg',
    42: 'assets/products/42.jpg',
    43: 'assets/products/43.jpg',
    44: 'assets/products/44.jpg',
    45: 'assets/products/45.png',
    46: 'assets/products/46.png',
    47: 'assets/products/47.jpg',
    48: 'assets/products/48.png',
    49: 'assets/products/49.jpg',
    50: 'assets/products/50.jpg',
    51: 'assets/products/51.png',
    52: 'https://www.lg.com/content/dam/channel/wcms/se/content/product-pictures/mnt/gp1-infill-uppdate/27gr95qe/02---gallery/mnt-ultragear-27gr95qe-gallery-01.jpg',
    53: 'assets/products/53.png',
    54: 'assets/products/54.jpg',
    55: 'assets/products/55.jpg',
    56: 'assets/products/56.png',
    57: 'assets/products/57.jpg',
    58: 'assets/products/58.jpg',
    59: 'assets/products/59.jpg',
    60: 'assets/products/60.webp',
    61: 'assets/products/61.jpg',
    62: 'assets/products/62.jpg',
    63: 'assets/products/63.png',
    64: 'assets/products/64.jpg',
    65: 'assets/products/65.jpg',
    66: 'assets/products/66.jpg',
    67: 'assets/products/67.jpg',
    69: 'assets/products/69.jpg',
    68: 'assets/products/68.jpg',
    70: 'assets/products/70.jpg',
    71: 'assets/products/71.jpg',
    72: 'assets/products/72.jpg',
    73: 'assets/products/73.webp'
};

function getProductImage(product) {
    if (productImageOverrides[product.id]) return productImageOverrides[product.id];
    if (!product.image || /via\.placeholder\.com/i.test(product.image)) return '';
    return product.image;
}

// Shared detail/cart renderer: the same photo source as the catalog.
function renderProductPhoto(product) {
    const escapeAttribute = value => String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
    const imageUrl = getProductImage(product);
    return `${imageUrl ? `<img src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(product.name)}" decoding="async" loading="lazy" onerror="this.hidden=true; this.nextElementSibling.hidden=false">` : ''}
        <span class="photo-unavailable" ${imageUrl ? 'hidden' : ''} role="img" aria-label="Фото товара недоступно">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/></svg>
        </span>`;
}
