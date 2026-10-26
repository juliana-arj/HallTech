/* =========================================================
   MENU MOBILE (mesmo padrão da landingPage)
========================================================= */

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {

    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('nav-open');
        menuToggle.classList.toggle('is-active');
    });

    mainNav.querySelectorAll('.nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('nav-open');
            menuToggle.classList.remove('is-active');
        });
    });

}


/* =========================================================
   DADOS (sem backend por enquanto)
   - TLDS: extensões e preço anual
   - A disponibilidade é simulada: nomes famosos já estão
     registrados e, para os demais, ~1 em cada 8 combinações.
     Teste a tela de "indisponível" pesquisando por "halltech".
========================================================= */

const TLDS = [
    { ext: '.com.br', price: 40, tag: 'Mais popular', use: 'Ideal para o Brasil' },
    { ext: '.com', price: 55, use: 'Padrão mundial' },
    { ext: '.net', price: 60, use: 'Tecnologia e redes' },
    { ext: '.org', price: 65, use: 'Organizações' },
    { ext: '.net.br', price: 40, use: 'Provedores e redes' },
    { ext: '.online', price: 35, tag: 'Promoção', use: 'Presença digital' },
    { ext: '.dev', price: 65, use: 'Desenvolvedores' },
    { ext: '.tech', price: 70, use: 'Startups e tecnologia' },
    { ext: '.store', price: 50, use: 'Lojas virtuais' },
    { ext: '.app', price: 75, use: 'Aplicativos' }
];

const TAKEN_NAMES = ['halltech', 'google', 'facebook', 'instagram', 'globo', 'uol', 'amazon', 'netflix', 'youtube'];
const TAKEN_EXTS = ['.com.br', '.com', '.net', '.org', '.net.br'];
const DISCOUNT = { 1: 0, 2: 0.10, 3: 0.15 };

const money = (value) => 'R$ ' + value.toFixed(2).replace('.', ',');
const esc = (text) => String(text).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function verificarSessao() {
    const authButton = document.querySelector('#ht-auth-button');
    const headerActions = document.querySelector('#ht-actions');
    const header = document.querySelector('header');

    if (!authButton || !headerActions || !header) return;

    const client = await getSupabase();

    if (!client) {
        applySession(null);
        return;
    }

    try {
        const { data, error } = await client.auth.getSession();

        if (error) throw error;

        applySession(data.session);

        client.auth.onAuthStateChange((_event, session) => {
            requestAnimationFrame(() => applySession(session));
        });
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        applySession(null);
    }
}

function applySession(session) {
    const authButton = document.querySelector('#ht-auth-button');
    const headerActions = document.querySelector('#ht-actions');
    const header = document.querySelector('header');

    if (!header) return;

    const loggedIn = Boolean(session);
    const user = session?.user;
    const email = user?.email || '';
    const metadata = user?.user_metadata || {};
    const fullName = (metadata.full_name || metadata.name || metadata.nome || '').trim();
    const firstName = fullName ? fullName.split(/\s+/)[0] : (email ? email.split('@')[0] : 'Minha conta');

    header.dataset.auth = loggedIn ? 'in' : 'out';
    document.body.classList.toggle('logged-in', loggedIn);

    if (authButton) {
        authButton.hidden = loggedIn;
        authButton.style.display = loggedIn ? 'none' : 'flex';
    }

    if (headerActions) {
        headerActions.hidden = !loggedIn;
        headerActions.style.display = loggedIn ? 'flex' : 'none';
    }

    const profileName = document.querySelector('#ht-profile-name');
    const profileEmail = document.querySelector('#ht-profile-email');
    const profileAvatar = document.querySelector('#ht-profile-avatar');

    if (profileName) profileName.textContent = firstName;
    if (profileEmail) profileEmail.textContent = email || 'Cliente HallTech';
    if (profileAvatar) profileAvatar.textContent = (firstName || 'HT').slice(0, 2).toUpperCase();
}

document.addEventListener('DOMContentLoaded', verificarSessao);

const logoutButton = document.querySelector('#ht-logout-button');

if (logoutButton) {
    logoutButton.addEventListener('click', async () => {
        const client = await getSupabase();

        try {
            localStorage.removeItem('halltechLoggedIn');

            if (client) {
                const { error } = await client.auth.signOut();
                if (error) throw error;
            }

            window.location.href = '../../login/index.html';
        } catch (error) {
            console.error('Erro ao encerrar sessão:', error);
            alert('Não foi possível sair da conta.');
        }
    });
}

function hash(text) {
    let h = 0;
    for (let i = 0; i < text.length; i++) { h = (h * 31 + text.charCodeAt(i)) >>> 0; }
    return h;
}

function isAvailable(name, ext) {
    if (TAKEN_NAMES.indexOf(name) !== -1) { return TAKEN_EXTS.indexOf(ext) === -1; }
    return hash(name + ext) % 8 !== 0;
}

function tldInfo(ext) {
    return TLDS.find((t) => t.ext === ext) || TLDS[0];
}

function priceFor(ext, years) {
    const base = tldInfo(ext).price;
    return Math.round(base * years * (1 - DISCOUNT[years]) * 100) / 100;
}


/* =========================================================
   TRATAMENTO DO TEXTO PESQUISADO
   "https://www.MeuSite.com.br/" -> { name: "meusite", ext: ".com.br" }
========================================================= */

function parseDomain(rawName, rawExt) {
    let name = String(rawName || '').toLowerCase().trim()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

    let ext = TLDS.some((t) => t.ext === rawExt) ? rawExt : '.com.br';

    // se a pessoa já digitou a extensão (meusite.com), ela vale mais que o select
    const typed = TLDS.map((t) => t.ext).sort((a, b) => b.length - a.length).find((e) => name.length > e.length && name.endsWith(e));
    if (typed) {
        ext = typed;
        name = name.slice(0, name.length - typed.length);
    }

    name = name.replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '');
    return { name: name, ext: ext, valid: name.length >= 2 && name.length <= 63 };
}


/* =========================================================
   CARRINHO (guardado no navegador)
========================================================= */

const CART_KEY = 'halltech_cart';

function loadCart() {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; } catch (e) { return []; }
}

function saveCart() {
    try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) { /* sem storage: segue só em memória */ }
    window.dispatchEvent(new Event('halltech:cart-changed')); // atualiza o carrinho lateral da navbar
}

let cart = loadCart();

const cartBar = document.getElementById('cartBar');
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
}

function renderCartBar() {
    const total = cart.reduce((sum, item) => sum + item.total, 0);
    cartBar.hidden = cart.length === 0;
    document.body.classList.toggle('has-cart', cart.length > 0);
    document.getElementById('cartCount').textContent = cart.length + (cart.length === 1 ? ' domínio no carrinho' : ' domínios no carrinho');
    document.getElementById('cartItems').textContent = cart.map((i) => i.domain).join(', ');
    document.getElementById('cartTotal').textContent = money(total);
}

function addToCart(name, ext, years) {
    const domain = name + ext;
    cart = cart.filter((i) => i.domain !== domain);
    cart.push({ domain: domain, years: years, total: priceFor(ext, years) });
    saveCart();
    renderCartBar();
    renderResults();
    showToast(domain + ' adicionado ao carrinho');
}

function removeFromCart(domain) {
    cart = cart.filter((i) => i.domain !== domain);
    saveCart();
    renderCartBar();
    renderResults();
}

document.getElementById('cartClear').addEventListener('click', () => {
    cart = [];
    saveCart();
    renderCartBar();
    renderResults();
});


/* =========================================================
   ESTADO DA PÁGINA
   Sem ?dominio=  -> escolha de extensões (acesso pela navbar)
   Com ?dominio=  -> resultado da pesquisa (veio da landing)
========================================================= */

const params = new URLSearchParams(window.location.search);
const searched = params.get('dominio') ? parseDomain(params.get('dominio'), params.get('ext')) : null;
const state = { years: 1 };

const domainForm = document.getElementById('domainForm');
const domainInput = document.getElementById('domainInput');
const domainExtension = document.getElementById('domainExtension');
const domainHint = document.getElementById('domainHint');
const resultState = document.getElementById('resultState');
const searchState = document.getElementById('searchState');

const ICON_OK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>';
const ICON_NO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

function extRow(name, ext, label) {
    const domain = name + ext;
    const available = isAvailable(name, ext);
    const inCart = cart.some((i) => i.domain === domain);
    const price = tldInfo(ext).price;
    const pill = available
        ? '<span class="status-pill is-available">Disponível</span>'
        : '<span class="status-pill is-unavailable">Indisponível</span>';

    let button;
    if (!available) {
        button = '<button type="button" class="btn-add" disabled>Indisponível</button>';
    } else if (inCart) {
        button = '<button type="button" class="btn-add is-added" data-remove="' + esc(domain) + '">✓ No carrinho</button>';
    } else {
        button = '<button type="button" class="btn-add" data-add="' + esc(name) + '" data-ext="' + esc(ext) + '">Adicionar</button>';
    }

    return '<li class="ext-item">'
        + '<div class="ext-item-info"><span class="ext-item-name">' + esc(domain) + (label ? '<small>' + label + '</small>' : '') + '</span>' + pill + '</div>'
        + '<div class="ext-item-buy"><span class="ext-item-price">' + money(price) + ' <span>/ano</span></span>' + button + '</div>'
        + '</li>';
}

function renderResults() {
    if (!searched || !searched.valid) { return; }

    const name = searched.name;
    const ext = searched.ext;
    const domain = name + ext;
    const available = isAvailable(name, ext);
    const inCart = cart.some((i) => i.domain === domain);
    const total = priceFor(ext, state.years);

    document.getElementById('resultName').textContent = domain;
    document.getElementById('baseName').textContent = name;

    const options = [1, 2, 3].map((y) => {
        const off = DISCOUNT[y] ? ' (-' + Math.round(DISCOUNT[y] * 100) + '%)' : '';
        return '<option value="' + y + '"' + (y === state.years ? ' selected' : '') + '>' + y + (y === 1 ? ' ano' : ' anos') + ' — ' + money(priceFor(ext, y)) + off + '</option>';
    }).join('');

    let main;
    if (available) {
        const action = inCart
            ? '<button type="button" class="btn btn-outline" data-remove="' + esc(domain) + '">Remover do carrinho</button>'
            : '<button type="button" class="btn btn-primary" id="addMain"><span>Adicionar ao carrinho</span><span class="arrow">→</span></button>';
        main = '<article class="result-card is-available">'
            + '<div class="result-main"><div class="result-status-icon">' + ICON_OK + '</div>'
            + '<div><h3 class="result-domain">' + esc(domain) + '</h3><p class="result-message">Parabéns! Esse domínio está livre para registro.</p><span class="status-pill is-available">Disponível</span></div></div>'
            + '<div class="result-buy"><div class="result-price"><strong id="mainPrice">' + money(total) + '</strong><span>no período escolhido</span></div>'
            + '<select class="period-select" id="periodSelect" aria-label="Período de registro">' + options + '</select>' + action + '</div>'
            + '</article>';
    } else {
        main = '<article class="result-card is-unavailable">'
            + '<div class="result-main"><div class="result-status-icon">' + ICON_NO + '</div>'
            + '<div><h3 class="result-domain">' + esc(domain) + '</h3><p class="result-message">Esse domínio já está registrado. Veja outras extensões e sugestões abaixo.</p><span class="status-pill is-unavailable">Indisponível</span></div></div>'
            + '<div class="result-actions"><button type="button" class="btn btn-outline btn-sm" id="searchAnother">Pesquisar outro nome</button></div>'
            + '</article>';
    }
    document.getElementById('mainResult').innerHTML = main;

    // outras extensões para o mesmo nome (a pesquisada fica de fora)
    document.getElementById('extList').innerHTML = TLDS
        .filter((t) => t.ext !== ext)
        .map((t) => extRow(name, t.ext, t.tag || ''))
        .join('');

    // sugestões de nomes parecidos
    const base = name.replace(/-/g, '');
    const prefix = base.indexOf('meu') === 0 ? 'seu' : 'meu';
    const suggestions = [[prefix + base, ext], [base + 'online', ext], [base + 'web', '.com.br'], [base + 'br', '.com']];
    document.getElementById('suggestList').innerHTML = suggestions
        .filter((s) => s[0].length <= 63)
        .map((s) => extRow(s[0], s[1], 'Sugestão'))
        .join('');
}

function renderTldGrid() {
    document.getElementById('tldGrid').innerHTML = TLDS.map((t) =>
        '<button type="button" class="tld-card" data-tld="' + t.ext + '">'
        + (t.tag ? '<span class="tld-tag">' + t.tag + '</span>' : '')
        + '<span class="tld-ext">' + t.ext + '</span>'
        + '<span class="tld-price">' + money(t.price) + ' <span>/ano</span></span>'
        + '<span class="tld-use">' + t.use + '</span>'
        + '</button>'
    ).join('');
}


/* =========================================================
   EVENTOS
========================================================= */

domainForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const parsed = parseDomain(domainInput.value, domainExtension.value);

    if (!parsed.valid) {
        domainHint.textContent = 'Digite um nome válido (2 a 63 caracteres, só letras, números e hífen).';
        domainHint.classList.add('is-error');
        domainInput.focus();
        return;
    }

    window.location.search = '?dominio=' + encodeURIComponent(parsed.name) + '&ext=' + encodeURIComponent(parsed.ext);
});

document.addEventListener('click', (event) => {
    const addBtn = event.target.closest('[data-add]');
    if (addBtn) {
        addToCart(addBtn.dataset.add, addBtn.dataset.ext, 1);
        return;
    }

    const removeBtn = event.target.closest('[data-remove]');
    if (removeBtn) {
        removeFromCart(removeBtn.dataset.remove);
        return;
    }

    if (event.target.closest('#addMain')) {
        addToCart(searched.name, searched.ext, state.years);
        return;
    }

    const tldBtn = event.target.closest('[data-tld]');
    if (tldBtn) {
        domainExtension.value = tldBtn.dataset.tld;
        domainHint.textContent = 'Extensão ' + tldBtn.dataset.tld + ' selecionada. Agora digite o nome do seu domínio.';
        domainHint.classList.remove('is-error');
        domainInput.focus();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    if (event.target.closest('#searchAnother') || event.target.closest('#newSearch')) {
        domainInput.focus();
        domainInput.select();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

document.addEventListener('change', (event) => {
    if (event.target.id === 'periodSelect') {
        state.years = Number(event.target.value);
        renderResults();
    }
});


/* =========================================================
   INICIALIZAÇÃO
========================================================= */

renderCartBar();

if (searched) {
    domainInput.value = searched.name;
    domainExtension.value = searched.ext;

    if (searched.valid) {
        document.title = searched.name + searched.ext + ' | Domínios | HallTech Web Hosting';
        domainHint.textContent = 'Resultado para ' + searched.name + searched.ext + '. Você pode pesquisar outro nome quando quiser.';
        resultState.hidden = false;
        searchState.hidden = true;
        renderResults();
    } else {
        domainHint.textContent = 'Não conseguimos entender esse nome. Use de 2 a 63 caracteres, só letras, números e hífen.';
        domainHint.classList.add('is-error');
        renderTldGrid();
    }
} else {
    renderTldGrid();
}
