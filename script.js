let cart = [];

function addToCart(productName, price, image) {
    cart.push({ name: productName, price: price, image: image });
    updateCartCount();
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Product added to cart!');
}

function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

function displayCart() {
    const cartItems = document.querySelector('.cart-items');
    const cartSummary = document.querySelector('.cart-summary');
    
    if (cartItems && cartSummary) {
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="price">${item.price}BD</p>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
            `;
            cartItems.appendChild(cartItem);
            total += parseFloat(item.price);
        });

        cartSummary.innerHTML = `
            <h2>Order Summary</h2>
            <div class="summary-item">
                <span>Subtotal:</span>
                <span>${total.toFixed(3)}BD</span>
            </div>
            <div class="summary-item">
                <span>Shipping:</span>
                <span>Free</span>
            </div>
            <div class="summary-item total">
                <span>Total:</span>
                <span>${total.toFixed(3)}BD</span>
            </div>
            <button class="checkout-btn" onclick="proceedToCheckout()">Proceed to Checkout</button>
        `;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Please add items before proceeding to checkout.');
    } else {
        window.location.href = 'checkout.html';
    }
}

function detectCardType(number) {
    const visaRegex = /^4/;
    const mastercardRegex = /^5[1-5]|^2[2-7]/;

    if (visaRegex.test(number)) {
        return 'visa';
    } else if (mastercardRegex.test(number)) {
        return 'mastercard';
    }

    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    displayCart();

    const cardNumberInput = document.getElementById('card-number');
    const cardTypeIcon = document.getElementById('card-type-icon');

    if (cardNumberInput && cardTypeIcon) {
        cardNumberInput.addEventListener('input', (e) => {
            const cardNumber = e.target.value.replace(/\s+/g, '');
            if (cardNumber.length >= 4) {
                const cardType = detectCardType(cardNumber);
                if (cardType) {
                    cardTypeIcon.src = `${cardType}.png`;
                    cardTypeIcon.style.display = 'block';
                } else {
                    cardTypeIcon.style.display = 'none';
                }
            } else {
                cardTypeIcon.style.display = 'none';
            }

            // Format the card number
            e.target.value = cardNumber.replace(/(\d{4})/g, '$1 ').trim();
        });
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (cart.length === 0) {
                alert('Your cart is empty. Please add items before placing an order.');
            } else {
                alert('Order placed successfully!');
                // Here you would typically send the order to a server
                cart = [];
                localStorage.removeItem('cart');
                updateCartCount();
                window.location.href = 'index.html';
            }
        });
    }
});

