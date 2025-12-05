// Simulazione dati prodotto (in realtà verrebbero dal backend)
const productDetails = {
    id: 1,
    name: "Vaso in Ceramica",
    artisan: "Studio Ceramica",
    price: 79.99,
    description: "Vaso fatto a mano con tecniche tradizionali...",
    images: [
        "../assets/images/vaso-1.jpg",
        "../assets/images/vaso-2.jpg",
        "../assets/images/vaso-3.jpg"
    ],
    specs: [
        "Materiale: Ceramica",
        "Altezza: 30cm",
        "Diametro: 15cm",
        "Peso: 2kg"
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    // Popola i dettagli del prodotto
    const productId = new URLSearchParams(window.location.search).get('id');
    loadProductDetails(productId);

    // Event listeners per la quantità
    setupQuantityControls();
});

function loadProductDetails(productId) {
    // In realtà qui faresti una chiamata API
    // Per ora usiamo i dati simulati
    
    document.getElementById('productName').textContent = productDetails.name;
    document.getElementById('artisanName').textContent = productDetails.artisan;
    document.getElementById('productPrice').textContent = `€${productDetails.price}`;
    document.getElementById('productDescription').textContent = productDetails.description;
    
    // Carica immagine principale
    const mainImage = document.getElementById('mainImage');
    mainImage.src = productDetails.images[0];
    mainImage.alt = productDetails.name;

    // Carica thumbnails
    const thumbnailList = document.getElementById('thumbnailList');
    productDetails.images.forEach((img, index) => {
        const thumbnail = document.createElement('img');
        thumbnail.src = img;
        thumbnail.alt = `${productDetails.name} - View ${index + 1}`;
        thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
        thumbnail.onclick = () => updateMainImage(img);
        thumbnailList.appendChild(thumbnail);
    });

    // Carica specifiche
    const specsList = document.getElementById('productSpecs');
    productDetails.specs.forEach(spec => {
        const li = document.createElement('li');
        li.textContent = spec;
        specsList.appendChild(li);
    });
}

function updateMainImage(imgSrc) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = imgSrc;
    
    // Aggiorna classe active delle thumbnails
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.toggle('active', thumb.src === imgSrc);
    });
}

function setupQuantityControls() {
    const quantity = document.getElementById('quantity');
    const decrease = document.getElementById('decreaseQty');
    const increase = document.getElementById('increaseQty');

    decrease.onclick = () => {
        const current = parseInt(quantity.value);
        if (current > 1) quantity.value = current - 1;
    };

    increase.onclick = () => {
        const current = parseInt(quantity.value);
        quantity.value = current + 1;
    };

    // Aggiungi al carrello
    document.getElementById('addToCartBtn').onclick = () => {
        const qty = parseInt(quantity.value);
        addToCart(productDetails.id, qty);
    };
}
