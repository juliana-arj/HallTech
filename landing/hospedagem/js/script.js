/* =========================================================
   MENU MOBILE
========================================================= */

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('nav-open');
        menuToggle.classList.toggle('is-active');
    });
}


/* =========================================================
   TOGGLE TRIMESTRAL / ANUAL
========================================================= */

const billingOptions = document.querySelectorAll('.billing-option');
const planCards = document.querySelectorAll('.plan-card');

function formatPrice(value) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function updatePlanPrices(period) {
    planCards.forEach((card) => {
        const priceEl = card.querySelector('.plan-price-value');
        const billedEl = card.querySelector('.plan-billed-as');

        if (period === 'anual') {
            const monthly = parseFloat(card.dataset.annualMonthly);
            const billed = parseFloat(card.dataset.annualBilled);
            priceEl.textContent = `R$ ${formatPrice(monthly)}`;
            billedEl.textContent = `Cobrado anualmente R$ ${formatPrice(billed)}`;
        } else {
            const monthly = parseFloat(card.dataset.monthly);
            const billed = parseFloat(card.dataset.quarterlyBilled);
            priceEl.textContent = `R$ ${formatPrice(monthly)}`;
            billedEl.textContent = `Cobrado trimestralmente R$ ${formatPrice(billed)}`;
        }
    });
}

billingOptions.forEach((option) => {
    option.addEventListener('click', () => {
        billingOptions.forEach((o) => o.classList.remove('active'));
        option.classList.add('active');
        updatePlanPrices(option.dataset.period);
    });
});

const CART_KEY = 'halltech_cart';

document.querySelectorAll('.plan-card .plan-btn').forEach((button) => {
    button.addEventListener('click', () => {
        const card = button.closest('.plan-card');
        const billingOption = document.querySelector('.billing-option.active');
        const period = billingOption?.dataset.period || 'trimestral';

        const plan = {
            name: card.querySelector('.plan-name').textContent.trim(),
            period,
            price: parseFloat(
                period === 'anual'
                    ? card.dataset.annualBilled
                    : card.dataset.quarterlyBilled
            ),
            monthlyPrice: parseFloat(
                period === 'anual'
                    ? card.dataset.annualMonthly
                    : card.dataset.monthly
            )
        };

        let cart = [];

        try {
            const savedCart = JSON.parse(localStorage.getItem(CART_KEY));
            if (Array.isArray(savedCart)) {
                cart = savedCart;
            }
        } catch {
            cart = [];
        }

        const existingIndex = cart.findIndex(
            item => item.type === 'hospedagem' && item.name === plan.name
        );

        const cartItem = {
            type: 'hospedagem',
            name: plan.name,
            period: plan.period,
            total: plan.price,
            monthlyPrice: plan.monthlyPrice,
            quantity: 1
        };

        if (existingIndex >= 0) {
            cart[existingIndex] = cartItem;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        window.dispatchEvent(new Event('halltech:cart-changed'));

        window.location.href = '../carrinho/carrinho.html';
    });
});
