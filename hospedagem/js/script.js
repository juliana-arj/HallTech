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
