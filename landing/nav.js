/* =========================================================
   Navbar unificada HallTech
   - Base visual: página Domínios
   - Carrinho e notificações em painéis laterais + menu de perfil (da landing logada)
   - Montada em TODAS as páginas por este arquivo (substitui o <header> de cada uma)
========================================================= */
(() => {
  const currentScript = document.currentScript;
  if (!currentScript) return;
  const root = new URL('.', currentScript.src);
  const R = (p) => new URL(p, root).href;

  const CART_KEY = 'halltech_cart';
  const ROUTES = {
    home: R('landingPage/index.html'),
    suporte: R('landingPage/index.html#suporte'),
    dominios: R('dominios/index.html'),
    hospedagem: R('hospedagem/index.html'),
    blog: R('blog/blog-lista.html'),
    login: R('../login/index.html'),
    carrinho: R('carrinho/carrinho.html'),
    dashboard: R('../dashboard_cliente/index/index.html'),
    perfil: R('../dashboard_cliente/perfil/index.html'),
    preferencias: R('../dashboard_cliente/preferencias/index.html'),
    notificacoes: R('../dashboard_cliente/notificacoes/index.html')
  };

  const ICON = {
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>',
    cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    server: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="7" rx="1.5"></rect><rect x="3" y="14" width="18" height="7" rx="1.5"></rect><path d="M7 6.5h.01M7 17.5h.01M11 6.5h6M11 17.5h6"></path></svg>',
    globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"></path></svg>'
  };

  const TEMPLATE = `
<header class="ht-header" data-auth="loading">
  <div class="ht-header-container">
    <a href="${ROUTES.home}" class="ht-logo" aria-label="HallTech — início">
      <img src="${R('landingPage/images/logo.png')}" alt="HallTech Web Hosting">
    </a>

    <nav class="ht-main-nav" id="ht-main-nav" aria-label="Navegação principal">
      <a href="${ROUTES.home}" class="ht-nav-link" data-nav="home">Início</a>
      <a href="${ROUTES.dominios}" class="ht-nav-link" data-nav="dominios">Domínios</a>
      <a href="${ROUTES.hospedagem}" class="ht-nav-link" data-nav="hospedagem">Hospedagem</a>
      <a href="${ROUTES.blog}" class="ht-nav-link" data-nav="blog">Blog</a>
      <a href="${ROUTES.login}" class="ht-nav-link ht-nav-link--mobile-only" data-nav="login">Entrar</a>
    </nav>

    <a href="${ROUTES.login}" class="ht-login-button" id="ht-auth-button">
      <img src="${R('landingPage/images/User.png')}" class="ht-login-icon" alt="" aria-hidden="true">
      <span>Login</span>
    </a>

    <div class="ht-actions" id="ht-actions">
      <button type="button" class="ht-header-icon-btn ht-header-icon-btn--with-badge" id="ht-notifications-button"
        aria-label="Notificações" aria-haspopup="dialog" aria-controls="ht-notifications-drawer" aria-expanded="false">
        ${ICON.bell}
        <span class="ht-header-badge" id="ht-notifications-badge" aria-label="3 notificações não lidas">3</span>
      </button>

      <button type="button" class="ht-header-icon-btn ht-header-icon-btn--with-badge" id="ht-cart-button"
        aria-label="Abrir carrinho" aria-haspopup="dialog" aria-controls="ht-cart-drawer" aria-expanded="false">
        ${ICON.cart}
        <span class="ht-header-badge" id="ht-cart-badge" hidden>0</span>
      </button>

      <div class="ht-profile-wrapper">
        <button type="button" class="ht-header-icon-btn" id="ht-profile-button" aria-label="Abrir menu do perfil"
          aria-haspopup="true" aria-controls="ht-profile-menu" aria-expanded="false">
          ${ICON.user}
        </button>
        <div class="ht-profile-menu" id="ht-profile-menu" role="menu" aria-label="Menu do perfil" hidden>
          <div class="ht-profile-menu__identity">
            <span class="ht-profile-menu__avatar" id="ht-profile-avatar" aria-hidden="true">HT</span>
            <div>
              <strong id="ht-profile-name">Minha conta</strong>
              <small id="ht-profile-email">Cliente HallTech</small>
            </div>
          </div>
          <a href="${ROUTES.dashboard}" class="ht-profile-menu__item ht-profile-menu__item--primary" role="menuitem"><span aria-hidden="true">▦</span> Acessar dashboard</a>
          <a href="${ROUTES.perfil}" class="ht-profile-menu__item" role="menuitem"><span aria-hidden="true">♙</span> Minha conta</a>
          <a href="${ROUTES.preferencias}" class="ht-profile-menu__item" role="menuitem"><span aria-hidden="true">⚙</span> Preferências</a>
          <div class="ht-profile-menu__divider"></div>
          <button type="button" class="ht-profile-menu__item ht-profile-menu__item--logout" id="ht-logout-button" role="menuitem"><span aria-hidden="true">↪</span> Sair da conta</button>
        </div>
      </div>
    </div>

    <button class="ht-menu-toggle" id="ht-menu-toggle" type="button" aria-label="Abrir menu" aria-expanded="false" aria-controls="ht-main-nav">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<div class="ht-interaction-backdrop" id="ht-backdrop" hidden></div>

<aside class="ht-cart-drawer" id="ht-cart-drawer" role="dialog" aria-modal="true" aria-labelledby="ht-cart-title" hidden>
  <div class="ht-drawer-header">
    <div>
      <span class="ht-drawer-eyebrow">SEU PEDIDO</span>
      <h2 id="ht-cart-title">Carrinho <span class="ht-drawer-count" id="ht-cart-count">0 itens</span></h2>
    </div>
    <button type="button" class="ht-drawer-close" data-ht-close aria-label="Fechar carrinho">&times;</button>
  </div>
  <div class="ht-drawer-content" id="ht-cart-items"></div>
  <div class="ht-drawer-summary">
    <div class="ht-drawer-summary-row"><span>Subtotal</span><strong id="ht-cart-subtotal">R$ 0,00</strong></div>
    <div class="ht-drawer-summary-row ht-drawer-discount" id="ht-cart-discount-row"><span>Desconto PROMO10</span><strong id="ht-cart-discount">− R$ 0,00</strong></div>
    <div class="ht-drawer-summary-row ht-drawer-total"><span>Total estimado</span><strong id="ht-cart-total">R$ 0,00</strong></div>
    <p>Os valores finais são confirmados no checkout.</p>
    <a class="ht-drawer-checkout-button" href="${ROUTES.carrinho}">Ver carrinho e continuar <span aria-hidden="true">→</span></a>
  </div>
</aside>

<aside class="ht-notifications-drawer" id="ht-notifications-drawer" role="dialog" aria-modal="true" aria-labelledby="ht-notifications-title" hidden>
  <div class="ht-drawer-header ht-notifications-drawer__header">
    <div>
      <span class="ht-drawer-eyebrow">CENTRAL DE AVISOS</span>
      <h2 id="ht-notifications-title">Notificações <span class="ht-notification-count" id="ht-notifications-count">3 novas</span></h2>
    </div>
    <button type="button" class="ht-drawer-close" data-ht-close aria-label="Fechar notificações">&times;</button>
  </div>
  <div class="ht-drawer-content ht-notifications-list">
    <article class="ht-notification-item ht-notification-item--unread">
      <span class="ht-notification-item__icon ht-notification-item__icon--blue" aria-hidden="true">✓</span>
      <div><div class="ht-notification-item__title">Boas-vindas à HallTech! <span class="ht-notification-unread-dot"></span></div><p>Seu espaço para conhecer nossas soluções em nuvem está pronto.</p><time>Hoje</time></div>
    </article>
    <article class="ht-notification-item ht-notification-item--unread">
      <span class="ht-notification-item__icon ht-notification-item__icon--purple" aria-hidden="true">✦</span>
      <div><div class="ht-notification-item__title">Conheça nossos planos <span class="ht-notification-unread-dot"></span></div><p>Compare as opções de hospedagem e encontre a ideal para seu projeto.</p><time>Esta semana</time></div>
    </article>
    <article class="ht-notification-item ht-notification-item--unread">
      <span class="ht-notification-item__icon ht-notification-item__icon--orange" aria-hidden="true">▤</span>
      <div><div class="ht-notification-item__title">Tem conteúdo novo no blog <span class="ht-notification-unread-dot"></span></div><p>Confira dicas e novidades sobre hospedagem, segurança e tecnologia.</p><time>Esta semana</time></div>
    </article>
  </div>
  <div class="ht-notifications-drawer__footer">
    <button type="button" class="ht-notifications-mark-read" id="ht-mark-read">Marcar todas como lidas</button>
    <a href="${ROUTES.notificacoes}">Ver central de notificações <span aria-hidden="true">→</span></a>
  </div>
</aside>`;

  /* ---------- helpers ---------- */
  const $ = (id) => document.getElementById(id);
  const money = (v) => 'R$ ' + Number(v || 0).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src; s.onload = resolve; s.onerror = () => reject(new Error('Falha ao carregar ' + src));
      document.head.appendChild(s);
    });
  }

  // Garante o cliente Supabase sem duplicar scripts que a página já tenha carregado.
  async function getSupabase() {
    try {
      if (typeof supabaseClient !== 'undefined' && supabaseClient && supabaseClient.auth) return supabaseClient;
    } catch (e) { /* ignora */ }
    try {
      const already = [...document.scripts].some((s) => /supabase\.js(\?|$)/.test(s.src) && !/supabase-js/.test(s.src));
      if (!window.supabase) await loadScript('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2');
      if (!already) await loadScript(R('js/supabase.js'));
      if (typeof supabaseClient !== 'undefined' && supabaseClient && supabaseClient.auth) return supabaseClient;
    } catch (e) { console.warn('[navbar] Supabase indisponível:', e.message); }
    return null;
  }

  /* ---------- montagem ---------- */
  function mount() {
    let slot = document.getElementById('site-navbar');
    if (!slot) {
      slot = document.createElement('div');
      slot.id = 'site-navbar';
      const old = document.querySelector('header.header');
      if (old) old.replaceWith(slot); else document.body.insertBefore(slot, document.body.firstChild);
    }
    slot.classList.add('ht-navbar-slot');
    slot.innerHTML = TEMPLATE.trim();
    slot.setAttribute('data-ready', '');
    init(slot);
  }

  function init(slot) {
    const header = slot.querySelector('.ht-header');
    const nav = $('ht-main-nav');
    const menuToggle = $('ht-menu-toggle');
    const backdrop = $('ht-backdrop');
    const cartBtn = $('ht-cart-button'), cartDrawer = $('ht-cart-drawer');
    const notifBtn = $('ht-notifications-button'), notifDrawer = $('ht-notifications-drawer');
    const profileBtn = $('ht-profile-button'), profileMenu = $('ht-profile-menu');

    /* link ativo conforme a página atual */
    function setActive() {
      const path = location.pathname.toLowerCase();
      let key = null;
      if (path.includes('/dominios/')) key = 'dominios';
      else if (path.includes('/hospedagem/')) key = 'hospedagem';
      else if (path.includes('/blog/')) key = 'blog';
      else if (path.includes('/landingpage/')) key = location.hash === '#suporte' ? 'suporte' : 'home';
      nav.querySelectorAll('.ht-nav-link').forEach((a) => {
        const on = a.dataset.nav === key;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
      });
    }
    setActive();
    window.addEventListener('hashchange', setActive);

    /* menu mobile */
    function closeNav() {
      nav.classList.remove('nav-open');
      menuToggle.classList.remove('is-active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
    }
    menuToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('nav-open');
      menuToggle.classList.toggle('is-active', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      if (open) { closeOverlay(); closeProfile(); }
    });
    nav.querySelectorAll('.ht-nav-link').forEach((a) => a.addEventListener('click', closeNav));

    /* painéis laterais */
    function closeOverlay() {
      cartDrawer.hidden = true; notifDrawer.hidden = true; backdrop.hidden = true;
      cartBtn.setAttribute('aria-expanded', 'false'); notifBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('ht-overlay-open');
    }
    function openOverlay(kind) {
      closeProfile(); closeOverlay(); closeNav();
      backdrop.hidden = false;
      document.body.classList.add('ht-overlay-open');
      const [drawer, btn] = kind === 'cart' ? [cartDrawer, cartBtn] : [notifDrawer, notifBtn];
      if (kind === 'cart') renderCart();
      drawer.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
      const close = drawer.querySelector('[data-ht-close]');
      if (close) close.focus();
    }
    cartBtn.addEventListener('click', () => (cartDrawer.hidden ? openOverlay('cart') : closeOverlay()));
    notifBtn.addEventListener('click', () => (notifDrawer.hidden ? openOverlay('notifications') : closeOverlay()));
    slot.querySelectorAll('[data-ht-close]').forEach((b) => b.addEventListener('click', closeOverlay));
    backdrop.addEventListener('click', () => { closeOverlay(); closeProfile(); });

    /* menu de perfil: dropdown logo abaixo do ícone (mesmo comportamento da landing) */
    function closeProfile() {
      profileMenu.hidden = true;
      profileBtn.setAttribute('aria-expanded', 'false');
    }
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation(); closeOverlay(); closeNav();
      const willOpen = profileMenu.hidden;
      profileMenu.hidden = !willOpen;
      profileBtn.setAttribute('aria-expanded', String(willOpen));
    });
    profileMenu.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', (e) => { if (!profileMenu.hidden && !e.target.closest('.ht-profile-wrapper')) closeProfile(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeOverlay(); closeProfile(); closeNav(); } });

    /* notificações (demonstrativas) */
    const markRead = $('ht-mark-read');
    markRead.addEventListener('click', () => {
      slot.querySelectorAll('.ht-notification-item').forEach((i) => { i.classList.remove('ht-notification-item--unread'); i.classList.add('is-read'); });
      $('ht-notifications-badge').hidden = true;
      const c = $('ht-notifications-count');
      c.textContent = 'lidas'; c.style.background = '#e8f8f0'; c.style.color = '#168454';
      markRead.textContent = 'Todas as notificações foram lidas';
      markRead.disabled = true;
    });

    /* carrinho: lê os domínios salvos em localStorage (halltech_cart); sem itens, mostra o exemplo da landing */
    function readCart() {
      try {
        const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

        if (!Array.isArray(cart)) {
          return { items: [] };
        }

        return {
          items: cart.map((i) => {
            if (i.type === 'hospedagem') {
              return {
                icon: 'server',
                type: 'hospedagem',
                title: i.name || 'Plano de hospedagem',
                desc: 'Hospedagem Cloud',
                note: i.period === 'anual' ? 'Plano anual' : 'Plano trimestral',
                price: Number(i.total) || 0,
                unit: ''
              };
            }

            return {
              icon: 'globe',
              type: 'dominio',
              title: i.domain,
              desc: 'Registro de domínio',
              note: 'Registro por ' + i.years + (i.years === 1 ? ' ano' : ' anos'),
              price: Number(i.total) || 0,
              unit: ''
            };
          }).map((item) => ({
            ...item,
            total: item.price
          }))
        };
      } catch (error) {
        return { items: [] };
      }
    }
    function removeCartItem(index) {
      try {
        const cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

        if (!Array.isArray(cart) || index < 0 || index >= cart.length) {
          return;
        }

        cart.splice(index, 1);
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        renderCart();
        window.dispatchEvent(new Event('halltech:cart-changed'));
      } catch (error) {
        console.error('Erro ao remover item do carrinho:', error);
      }
    }


    function renderCart() {
      const { items } = readCart();
      const sub = items.reduce((sum, item) => sum + item.total, 0);

      $('ht-cart-count').textContent = items.length + (items.length === 1 ? ' item' : ' itens');

      $('ht-cart-items').innerHTML = items.length
        ? items.map((i, index) => `
        <article class="ht-cart-drawer-item">
          <div class="ht-drawer-item-icon ${i.type === 'hospedagem' ? 'ht-drawer-item-icon--hosting' : 'ht-drawer-item-icon--domain'}" aria-hidden="true">${i.type === 'hospedagem' ? ICON.server : ICON.globe}</div>
          <div class="ht-drawer-item-info">
            <strong>${esc(i.title || 'Domínio')}</strong>
            <span>${esc(i.desc)}</span>
            <small>${esc(i.note)}</small>
            <b>${money(i.price)}<span>${esc(i.unit)}</span></b>
          </div>
          <button type="button" class="ht-cart-remove" data-cart-remove="${index}" aria-label="Remover ${esc(i.title || 'domínio')}" title="Remover item">&times;</button>
        </article>
      `).join('')
        : '<p class="ht-cart-empty">Seu carrinho está vazio.</p>';

      $('ht-cart-subtotal').textContent = money(sub);
      $('ht-cart-discount-row').hidden = true;
      $('ht-cart-discount').textContent = '− ' + money(0);
      $('ht-cart-total').textContent = money(sub);

      const badge = $('ht-cart-badge');
      badge.textContent = items.length;
      badge.hidden = items.length === 0;

      cartBtn.setAttribute(
        'aria-label',
        items.length ? `Abrir carrinho (${items.length} ${items.length === 1 ? 'item' : 'itens'})` : 'Abrir carrinho'
      );

      $('ht-cart-items').querySelectorAll('[data-cart-remove]').forEach((button) => {
        button.addEventListener('click', () => {
          removeCartItem(Number(button.dataset.cartRemove));
        });
      });
    }

    renderCart();
    window.addEventListener('storage', (e) => { if (e.key === CART_KEY) renderCart(); });
    window.addEventListener('halltech:cart-changed', renderCart);

    /* sessão */
    function applySession(session) {
      const loggedIn = Boolean(session);
      header.dataset.auth = loggedIn ? 'in' : 'out';
      document.body.classList.toggle('logged-in', loggedIn);
      const user = session && session.user;
      const email = (user && user.email) || '';
      const meta = (user && user.user_metadata) || {};
      const full = (meta.full_name || meta.name || meta.nome || '').trim();
      const first = full ? full.split(/\s+/)[0] : (email ? email.split('@')[0] : 'Minha conta');
      $('ht-profile-name').textContent = first || 'Minha conta';
      $('ht-profile-email').textContent = email || 'Cliente HallTech';
      $('ht-profile-avatar').textContent = (first || 'HT').slice(0, 2).toUpperCase();
      if (!loggedIn) { closeOverlay(); closeProfile(); }
    }
    let client = null;
    getSupabase().then(async (c) => {
      client = c;
      if (!c) { // sem Supabase: usa o marcador de demonstração do blog, se existir
        applySession(localStorage.getItem('halltechLoggedIn') === 'true' ? { user: {} } : null);
        return;
      }
      try {
        const { data, error } = await c.auth.getSession();
        if (error) throw error;
        applySession(data && data.session);
      } catch (err) { console.error('[navbar] Erro ao verificar sessão:', err); applySession(null); }
      if (c.auth.onAuthStateChange) c.auth.onAuthStateChange((_ev, session) => applySession(session));
    });

    $('ht-logout-button').addEventListener('click', async () => {
      try { localStorage.removeItem('halltechLoggedIn'); } catch (e) { /* ignora */ }
      if (client) {
        const { error } = await client.auth.signOut();
        if (error) { alert('Não foi possível sair da conta. Tente novamente.'); return; }
      }
      window.location.href = ROUTES.login;
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once: true });
  else mount();
})();
