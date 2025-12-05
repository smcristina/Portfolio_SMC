class Cart {
    constructor() {
        this.items = this.loadCart();
        this.updateCartCount(); // Aggiorna il contatore all'inizializzazione
    }

    loadCart() {
        const savedCart = localStorage.getItem('cart');
        return savedCart ? JSON.parse(savedCart) : [];
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartCount(); // Aggiorna il contatore dopo ogni salvataggio
    }

    addItem(productId, quantity = 1) {
        const product = getProductById(productId);
        if (!product) {
            console.error(`Prodotto con ID ${productId} non trovato!`);
            return;
        }

        const existingItem = this.items.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                productId,
                quantity,
                name: product.name,
                price: product.price,
                image: product.image
            });
        }

        this.saveCart();
        this.showNotification('Prodotto aggiunto al carrello!');
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.productId !== productId);
        this.saveCart();
    }

    updateCartCount() {
        // Calcola il totale degli elementi nel carrello
        const totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
        
        // Aggiorna tutti gli elementi con classe cart-count
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            
            // Aggiungi una piccola animazione
            element.style.transform = 'scale(1.2)';
            setTimeout(() => {
                element.style.transition = 'transform 0.3s ease';
                element.style.transform = 'scale(1)';
            }, 50);
        });
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.textContent = message;
        
        // Stili per la notifica
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#4CAF50';
        notification.style.color = 'white';
        notification.style.padding = '15px';
        notification.style.borderRadius = '4px';
        notification.style.zIndex = '1000';
        notification.style.transition = 'opacity 0.3s ease';
        
        document.body.appendChild(notification);
        
        // Aggiungi una transizione di fade-out
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 2700);
    }

    getTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
}

// Crea l'istanza del carrello e rendila globale
const cart = new Cart();
window.cart = cart;

// Aggiorna il contatore del carrello quando la pagina viene caricata
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartCount();
});
