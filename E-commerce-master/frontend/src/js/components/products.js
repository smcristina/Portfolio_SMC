// Array dei prodotti con le categorie
const products = [
    {
        id: 1,
        name: "Vaso in Ceramica",
        artisan: "Studio Ceramica",
        price: 79.99,
        category: "ceramica",
        image: "../assets/images/vaso.jpg"
    },
    {
        id: 2,
        name: "Collana Artigianale",
        artisan: "Gioielli d'Arte",
        price: 129.99,
        category: "gioielli",
        image: "../assets/images/collana.jpg"
    },
    {
        id: 3,
        name: "Sciarpa in Seta",
        artisan: "Tessuti d'Autore",
        price: 89.99,
        category: "tessuti",
        image: "../assets/images/sciarpa.jpg"
    },
    {
        id: 4,
        name: "Lampada in Legno",
        artisan: "WoodCraft",
        price: 159.99,
        category: "legno",
        image: "../assets/images/lampada.jpg"
    }
];

// Funzione per ottenere un prodotto tramite l'ID
function getProductById(productId) {
    return products.find(product => product.id === Number(productId));
}

// Funzione per creare una card prodotto
function createProductCard(product) {
    return `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-artisan">${product.artisan}</p>
                <p class="product-price">€${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <button class="btn-add-cart" onclick="window.cart.addItem(${product.id})">
                        Aggiungi al carrello
                    </button>
                </div>
            </div>
        </div>
    `;
}


// Funzione per renderizzare i prodotti
function renderProducts(productsToRender = products) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = productsToRender
        .map(product => createProductCard(product))
        .join('');
}

// Funzione per filtrare e ordinare i prodotti
function filterProducts() {
    const categoryValue = document.getElementById('categoryFilter').value;
    const priceValue = document.getElementById('priceFilter').value;
    const searchValue = document.getElementById('searchFilter').value.toLowerCase();

    let filteredProducts = [...products];

    // Filtra per categoria
    if (categoryValue) {
        filteredProducts = filteredProducts.filter(product => 
            product.category === categoryValue
        );
    }

    // Filtra per ricerca
    if (searchValue) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchValue) ||
            product.artisan.toLowerCase().includes(searchValue)
        );
    }

    // Ordina per prezzo
    if (priceValue) {
        filteredProducts.sort((a, b) => {
            if (priceValue === 'asc') {
                return a.price - b.price;
            } else {
                return b.price - a.price;
            }
        });
    }

    // Aggiungiamo una transizione smooth
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.style.opacity = '0';
    
    setTimeout(() => {
        renderProducts(filteredProducts);
        productsGrid.style.opacity = '1';
    }, 300);

    // Aggiorna il contatore dei risultati
    updateResultsCount(filteredProducts.length);
}

// Funzione per aggiornare il contatore dei risultati
function updateResultsCount(count) {
    const resultsCounter = document.querySelector('.results-counter');
    if (resultsCounter) {
        resultsCounter.textContent = `${count} prodotti trovati`;
    }
}

// Funzione di debounce per ottimizzare la ricerca
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Inizializzazione quando il DOM è caricato
document.addEventListener('DOMContentLoaded', () => {
    // Renderizza i prodotti
    renderProducts();

    // Setup dei filtri
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const searchFilter = document.getElementById('searchFilter');

    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
    if (priceFilter) priceFilter.addEventListener('change', filterProducts);
    if (searchFilter) searchFilter.addEventListener('input', debounce(filterProducts, 300));
});

// Rendi le funzioni disponibili globalmente
window.getProductById = getProductById;
window.filterProducts = filterProducts;
window.renderProducts = renderProducts;
