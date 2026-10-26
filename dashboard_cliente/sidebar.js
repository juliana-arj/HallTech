
/* Sidebar compartilhada do Dashboard Haltech.
 * Mantém os links relativos válidos em todas as páginas e define o item ativo
 * a partir da pasta atual, evitando estados ativos copiados de outra página.
 */
(() => {
  'use strict';

  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const currentFolder = window.location.pathname
    .replace(/\/index\.html?$/i, '')
    .replace(/\/+$/, '')
    .split('/')
    .pop()
    .toLowerCase();

  const activeByFolder = {
    'index': 'dashboard',
    'servicos': 'servicos',
    'dominios': 'dominios',
    'renovar-dominio': 'dominios',
    'faturas': 'faturas',
    'backup': 'backup',
    'dashboard-chamados': 'chamados',
    'chamados': 'chamados',
    'novo-chamado': 'chamados',
    'suporte': 'suporte',
    'artigo': 'suporte',
    'perfil': 'perfil',
    'editar-perfil': 'perfil',
    'senha': 'configuracoes',
    'seguranca': 'configuracoes',
    'preferencias': 'configuracoes',
    'excluir-conta': 'configuracoes',
    'notificacoes': 'configuracoes',
    'notificacao': 'configuracoes'
  };

  const activeKey = activeByFolder[currentFolder] || '';

  const icon = {
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',

    servicos: '<path d="M18 10h-1.3A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10Z"/>',

    dominios: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/>',

    faturas: '<path d="M6 2h9l4 4v16l-2-1-2 1-3-1-3 1-3-1-2 1V4a2 2 0 0 1 2-2Z"/><path d="M14 2v5h5M8 11h8M8 15h8"/>',

    backup: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',

    chamados: '<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8A8.5 8.5 0 0 1 8.7 3.9a8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>',

    suporte: '<circle cx="12" cy="12" r="9"/><path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01"/>',

    perfil: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',

    configuracoes: '<circle cx="12" cy="12" r="3"/><path d="m19.4 15 .1.1 1.4 1.1-1.4 2.4-1.7-.6a8 8 0 0 1-1.5.9l-.3 1.8h-2.8l-.3-1.8a8 8 0 0 1-1.5-.9l-1.7.6-1.4-2.4 1.4-1.1a7 7 0 0 1 0-1.8l-1.4-1.1 1.4-2.4 1.7.6a8 8 0 0 1 1.5-.9l.3-1.8h2.8l.3 1.8a8 8 0 0 1 1.5.9l1.7-.6 1.4 2.4-1.4 1.1a7 7 0 0 1 0 1.8Z"/>'
  };

  const items = [
    {
      group: 'Visão Geral',
      key: 'dashboard',
      label: 'Dashboard',
      href: '../index/index.html'
    },
    {
      group: 'Serviços',
      key: 'servicos',
      label: 'Meus Serviços',
      href: '../servicos/index.html'
    },
    {
      group: 'Serviços',
      key: 'dominios',
      label: 'Domínios',
      href: '../dominios/index.html'
    },
    {
      group: 'Serviços',
      key: 'faturas',
      label: 'Faturas',
      href: '../faturas/index.html'
    },
    {
      group: 'Serviços',
      key: 'backup',
      label: 'Backups',
      href: '../backup/index.html'
    },
    {
      group: 'Atendimento',
      key: 'chamados',
      label: 'Chamados',
      href: '../dashboard-chamados/index.html'
    },
    {
      group: 'Atendimento',
      key: 'suporte',
      label: 'Central de Ajuda',
      href: '../suporte/index.html'
    },
    {
      group: 'Conta',
      key: 'perfil',
      label: 'Perfil',
      href: '../perfil/index.html'
    },
    {
      group: 'Conta',
      key: 'configuracoes',
      label: 'Configurações',
      href: '../preferencias/index.html'
    }
  ];

  const grouped = [];

  items.forEach(item => {
    let group = grouped.find(entry => entry.name === item.group);

    if (!group) {
      group = {
        name: item.group,
        items: []
      };

      grouped.push(group);
    }

    group.items.push(item);
  });

  const isDashboardIndex = currentFolder === 'index' &&
    /\/index\/index\.html?$/i.test(window.location.pathname);

  sidebar.innerHTML = `
    <div class="sidebar-logo">
      <img
        src="../images/logo.png"
        alt="Haltech Web Hosting"
      >

      <button
        class="sidebar-close"
        id="sidebarClose"
        type="button"
        aria-label="Fechar menu"
      >×</button>
    </div>

    <nav class="sidebar-nav" aria-label="Navegação principal">
      ${grouped.map(group => `
        <div class="sidebar-group">
          <span class="sidebar-group-title">${group.name}</span>

          ${group.items.map(item => {
    const active = item.key === activeKey;

    return `
              <a
                class="sidebar-link${active ? ' active' : ''}"
                href="${item.href}"
                ${active ? 'aria-current="page"' : ''}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >${icon[item.key]}</svg>

                <span>${item.label}</span>
              </a>
            `;
  }).join('')}
        </div>
      `).join('')}

      <div class="sidebar-footer">
        <a href="../../landing/landingPage/index.html" class="sidebar-logout">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
          </svg>

          <span>Sair</span>
        </a>
      </div>
    </nav>
  `;

  const closeButton = sidebar.querySelector('#sidebarClose');
  const overlay = document.getElementById('sidebarOverlay');
  const toggle = document.getElementById('sidebarToggle');

  const closeSidebar = () => {
    sidebar.classList.remove('open');
    overlay?.classList.remove('open');
    toggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  closeButton?.addEventListener('click', closeSidebar);
  overlay?.addEventListener('click', closeSidebar);

  sidebar.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', closeSidebar);
  });
})();
