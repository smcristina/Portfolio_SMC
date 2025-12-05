import { cart } from '../components/cart.js';

class CartPage {
    constructor() {
        this.init();
    }

    init() {
        this.renderCart();
        this.setupEventListeners();
    }

    renderCart() {
        const cartItemsList = document.getElementById('cartItemsList');
        const emptyCart = document.getElementById('emptyCart');
        const cartSummary = document.getElementById('cartSummary');

        if (cart.items.length === 0) {
            cartItemsList.innerHTML = '';
            emptyCart.style.display = 'block';
            cartSummary.style.display = 'none';
            return;
        }

        emptyCart.style.display = 'none';
        cartSummary.style.display = 'block';

        cartItemsList.innerHTML = cart.items.map(item => `
            <div class="cart-item" data-id="${item.productId}">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <h3 class="item-name">${item.name}</h3>
                    <p class="item-price">€${(item.price * item.quantity).toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button onclick="cartPage.updateQuantity(${item.productId}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="cartPage.updateQuantity(${item.productId}, ${item.quantity + 1})">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="cartPage.removeItem(${item.productId})">×</button>
            </div>
        `).join('');

        this.updateSummary();
    }

    updateSummary() {
        const subtotal = cart.getTotal();
        const shipping = subtotal > 0 ? 7.99 : 0;
        const tax = subtotal * 0.22;
        const total = subtotal + shipping + tax;

        document.getElementById('subtotal').textContent = `€${subtotal.toFixed(2)}`;
        document.getElementById('shipping').textContent = `€${shipping.toFixed(2)}`;
        document.getElementById('tax').textContent = `€${tax.toFixed(2)}`;
        document.getElementById('totalAmount').textContent = `€${total.toFixed(2)}`;
    }

    updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) return;
        cart.items.map(item => {
            if (item.productId === productId) {
                item.quantity = newQuantity;
            }
            return item;
        });
        cart.saveCart();
        this.renderCart();
    }

    removeItem(productId) {
        if (confirm('Sei sicuro di voler rimuovere questo prodotto dal carrello?')) {
            cart.removeItem(productId);
            this.renderCart();
        }
    }

    setupEventListeners() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                alert('Procedi al checkout...');
                // Logica del checkout
            });
        }
    }
}

window.cartPage = new CartPage();
