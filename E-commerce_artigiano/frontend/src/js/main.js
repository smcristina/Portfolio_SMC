document.addEventListener('DOMContentLoaded', () => {
    // Assicurati che il carrello sia inizializzato
    if (window.cart) {
        cart.updateCartCount();
    }
    

// Funzione per inizializzare l'applicazione
function initApp() {
    // Inizializzazione componenti
    initNavbar();       // Gestione della barra di navigazione
    renderProducts();   // Rende i prodotti iniziali nella griglia
    initEventListeners();  // Inizializza gli event listeners
}

// Gestione navbar responsive
function initNavbar() {
    const menuButton = document.querySelector('.menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
        });
    }
}

// Inizializzazione degli event listeners
function initEventListeners() {
    // Filtri prodotti
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const searchFilter = document.getElementById('searchFilter');

    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
    if (priceFilter) priceFilter.addEventListener('change', filterProducts);
    if (searchFilter) searchFilter.addEventListener('input', debounce(filterProducts, 300));
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
});


// Esegui all'avvio
document.addEventListener('DOMContentLoaded', initApp);


// Importazione del rendering dei prodotti
import { renderProducts } from './components/products.js';

// Assicurati che i prodotti siano renderizzati alla fine del caricamento del DOM
document.addEventListener('DOMContentLoaded', () => {
    renderProducts(); // Renderizza i prodotti nella griglia
});
