// Product-specific image overrides for the demo catalog.
// Image sources: Wikimedia Commons (Logitech) and the manufacturers' product pages.
// Unknown or placeholder URLs fall back to the category icon instead of showing a fake thumbnail.
const productImageOverrides = {
    1: 'https://cdn.uniquephoto.com/resources/uniquephoto/images/products/processed/SYCD3506.detail.a.png',
    2: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Logitech_MX_Master_3S_HS03.jpg/500px-Logitech_MX_Master_3S_HS03.jpg',
    3: 'https://www.pic.bg/data/vali/636630-601af89304cf83a265a1675e7f559a7e.jpg',
    4: 'https://smcinternational.in/extra/gaming-accessories-gallery/61689153198in-990pro-nvme-m2-ssd-mz-v9p1t0bw-534630671.png',
    5: 'https://www.lg.com/content/dam/channelbtb/lgcom/de/business/images/isp/27up850-w_aeu_eedg_de_c/450x450-isp-27up850-w.jpg',
    8: 'https://assets.pcfactory.cl/public/foto/47024/1_1000.jpg?t=1718446720712',
    9: 'https://www.atk.store/cdn/shop/files/ATK_Blazing_Sky_F1_Black.jpg?v=1756979076&width=800',
    10: 'https://www.hobbydynamics.ph/cdn/shop/files/wlmouse-beast-x-mini-wireless-gaming-mouse-640950_1080x.jpg?v=1732699415',
    11: 'https://lamzu.com/cdn/shop/files/Maya_X_8K_800X800_1-797429.jpg?v=1729079319',
    12: 'https://pantheonkeys.com/cdn/shop/files/pantheonwooting60he.webp?v=1752733882',
    13: 'https://www.awd-it.co.uk/media/catalog/product/r/o/rog_azoth-uka_01.png',
    14: 'https://cdn.shopify.com/s/files/1/0551/0548/6979/files/kf-5-hyperx-alloy-origins-65.jpg',
    15: 'https://media.johnlewiscontent.com/i/JohnLewis/113211766?%24background-off-white%24=&fmt=auto',
    16: 'https://dlcdnwebimgs.asus.com/files/media/fd6185a0-5c7a-4502-af0f-6a29f1b0b264/PG27AQDP.png',
    24: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/DualSense_Edge_Controller.jpg',
    25: 'https://assets.xboxservices.com/assets/52/2f/522f2ec1-14ad-42a0-8378-c2b8312aaddb.png?n=XBX_HMC_D_Results1_Controller.png',
    26: 'https://down-ph.img.susercontent.com/file/sg-11134201-7rdx8-lyujq91quu2ff4',
    27: 'https://multimedia.bbycastatic.ca/multimedia/products/1500x1500/171/17170/17170910.jpg',
    28: 'https://majorhifi.com/wp-content/uploads/JBL-Tune-770NC-Upright-500x495.jpg',
    29: 'https://savvybadger.co.nz/cdn/shop/files/hyperx_cloud_iii_wireless_black_77z45aa_angle_2.png?v=1742026084&width=1445',
    32: 'https://notebookspec.com/storage/pc-ram/1507-ram_1249_20211104-165200_1.png',
    34: 'https://http2.mlstatic.com/D_Q_NP_2X_892384-MLB71064911113_082023-E.webp',
    35: 'https://www.pulsar.gg/cdn/shop/products/X2V2gamingmouse_mini_Black_Top_12b44160-e168-42e6-8ccc-d3d59fd72186-677459.png?v=1718795896',
    36: 'https://medias-p1.phoenix.razer.com/sys-master-phoenix-images-container/h08/h61/9765618188318/viper-v3-pro-black-500x500.png',
    37: 'https://ecommerce.datablitz.com.ph/cdn/shop/files/dbf_ad41f18f-0c76-4d57-8ffc-d8d0db31df90_800x.jpg?v=1710039072',
    38: 'https://images.ctfassets.net/w5r1fvmogo3f/1UYqh9WPKkOgGzvD5fEd63/6d49e94d72614e70f60169f25bb76827/aerox_3_wl_black_img_buy_01.png?w=1200&h=600&fit=fill&fm=jpg&q=85',
    39: 'https://down-th.img.susercontent.com/file/th-11134207-7ras9-m7j79my8eusjad',
    40: 'https://ecommerce.datablitz.com.ph/cdn/shop/files/cheetah_6be556ad-554b-4a77-963b-cc1718d1d220_1024x.jpg?v=1713414617',
    41: 'https://www.gloriousgaming.com/cdn/shop/files/GLO-MS-OV2-MB_Web_Gallery_Front_287511ee-b7e9-49d3-b280-5496812bb0a0.webp?v=1714643614&width=926',
    42: 'https://reformdlab.co/cdn/shop/files/Wooting_80HE_Ghost.jpg?v=1737363209&width=1920',
    43: 'https://epomaker.kr/cdn/shop/files/IMG_6026_08f5b21c-8a79-4807-92bb-f91ad4df8f99.jpg?v=1755590715',
    44: 'https://mechanicalkeyboards.com/cdn/shop/files/3955-5NHI9-VA87M-CMPYO.jpg?v=1787772378&width=1200',
    45: 'https://static.wixstatic.com/media/131a7a_9e83b10e23e34563aef8b5fe80d72a67~mv2.png/v1/fill/w_1000%2Ch_606%2Cal_c%2Cq_90%2Cusm_0.66_1.00_0.01%2Cenc_avif%2Cquality_auto/131a7a_9e83b10e23e34563aef8b5fe80d72a67~mv2.png',
    46: 'https://assets.corsair.com/image/upload/f_auto%2Cq_auto/v1719525924/products/revival-series/CH-9109414-NA-RV/K70_RGB_PRO_PBT_13.png',
    47: 'https://allegro.stati.pl/AllegroIMG/PRODUCENCI/Glorious-PC-Gaming-Race/GLO-GMMK-P75-RGB-B/klawiatura-glorious-GLO-GMMK-P75-RGB-B-01.jpg',
    48: 'https://media.steelseriescdn.com/thumbs/catalog/items/61527/e7f0c9edc5d549c9a3720215c3fb05a9.png.1200x627_q100_crop-fit_optimize.png',
    49: 'https://assets2.razerzone.com/images/pnx.assets/0de78efe3441114d8a92590145fff4c8/razer-blackshark-v2-pro-2023_ogimage-1200x630.jpg',
    50: 'https://files.pccasegear.com/images/CA-9011373-WW-add2.jpg',
    51: 'https://images.samsung.com/is/image/samsung/p6pim/ae_ar/ls49cg934smxue/gallery/ae-ar-odyssey-oled-g9-g93sc-ls49cg934smxue-538421129',
    52: 'https://www.lg.com/content/dam/channel/wcms/se/content/product-pictures/mnt/gp1-infill-uppdate/27gr95qe/02---gallery/mnt-ultragear-27gr95qe-gallery-01.jpg',
    53: 'https://res.cloudinary.com/scuf-pwa/image/upload/%2Cw_1100%2Ch_1100%2Cq_85/q_auto%2Cf_auto/v1753907395/products/PDPs/Reflex/reflex_pro_steel_grey_threequarters_playstation_controller_750x750_mdacvs.png',
    54: 'https://down-sg.img.susercontent.com/file/sg-11134207-824hj-mf7zlngbo2z267',
    55: 'https://www.hobbydynamics.ph/cdn/shop/files/artisan-fx-zero-mousepad-xl-619191.jpg?v=1732699297',
    56: 'https://wallhack.com/cdn/shop/files/2048x2048_WEB_PRODUCT-IMG-GlassPad-SP-004A-Black-Image1_07fa1331-504f-4869-8e47-8974d9727206.webp?v=1761662572&width=2048',
    57: 'https://scyrox.com/cdn/shop/files/Scyrox_800X800_1.jpg?v=1737104584&width=800',
    58: 'https://static-01.daraz.com.bd/p/33eaf5ad57ef6df09f5cdd8cc30b5272.jpg',
    59: 'https://media.pichau.com.br/media/catalog/product/cache/2f958555330323e505eba7ce930bdf27/9/4/943-0001171.jpg',
    60: 'https://cdn2.electronicscrazy.sg/Productimage/2022-10-0401-48-0814.webp',
    61: 'https://cdn1.technopark.ru/technopark/photos_resized/product/1000_1000/679022/3_679022.jpg',
    62: 'https://www.andaseat.com/cdn/shop/files/AndaSeat_Kaiser_3_Series_Gaming_Chair_Carbon_Black_b.webp?v=1769064578&width=720',
    63: 'https://images.hermanmiller.group/asset/16f47081-371a-44e3-98a7-2c39f8c976b2/W/200210_HM_Embody_Gaming_Chair_063_F3_V3_transparent.png',
    64: 'https://down-id.img.susercontent.com/file/id-11134208-7rasg-m0ppqc3cy44c39',
    65: 'https://www.dreiztgamer.com/cdn/shop/files/soporte-audifonos-gamer-dreizt-rgb-pro_064630f3-a01b-4c1f-81e0-c3015782d63c.jpg?v=1752099658&width=3840',
    66: 'https://media.adeo.com/mkp/1bb89a5f0ba81710c4547df8f8773727/media.jpeg?fit=bounds&format=jpg&height=3000&quality=80&width=3000',
    67: 'https://thepihut.com/cdn/shop/products/8bitdo-ultimate-bluetooth-2-4g-controller-with-charging-dock-white-8bitdo-105326-40014339014851_900x.jpg?v=1672403559',
    69: 'https://media.s-bol.com/5g6rgxYxKQZv/EDgYgk/1188x1200.jpg',
    68: 'https://m.media-amazon.com/images/S/aplus-media-library-service-media/bfa03cad-bae2-4b2c-ab29-7fe1af7f2027.__CR0%2C0%2C970%2C600_PT0_SX970_V1___.jpg',
    70: 'https://www.maxgaming.no/bilder/artiklar/zoom/37969_1.jpg?m=1768316377',
    71: 'https://media.kingston.com/kingston/product/ktc-product-ssd-snv2s-1000g-1-zm-lg.jpg',
    72: 'https://media.spdigital.cl/thumbnails/products/bxw1w3_q_a2886a0b_thumbnail_4096.jpg',
    73: 'https://gameone.ph/media/catalog/product/mpiowebpcache/d378a0f20f83637cdb1392af8dc032a2/c/o/corsair-rm850x-850w-cybenetics-gold-power-supply-_cp-9020270-na_-cover.webp'
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
    return `${imageUrl ? `<img src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(product.name)}" decoding="async" onerror="this.hidden=true; this.nextElementSibling.hidden=false">` : ''}
        <span class="photo-unavailable" ${imageUrl ? 'hidden' : ''} role="img" aria-label="Фото товара недоступно">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 5-5 4 4 4-6 5 7"/></svg>
        </span>`;
}
