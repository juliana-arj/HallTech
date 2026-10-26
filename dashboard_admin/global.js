
document.addEventListener('DOMContentLoaded', async () => {
    const userName = document.querySelector('#userName');
    const userAvatar = document.querySelector('#userAvatar');
    const sidebarLogout = document.querySelector('#sidebarLogout');

    const loginUrl = '../../login/index.html';
    const clientUrl = '../../landing/landingPage/index.html';

    try {
        const { data: sessionData, error: sessionError } =
            await supabaseClient.auth.getSession();

        if (sessionError || !sessionData.session) {
            window.location.replace(loginUrl);
            return;
        }

        const user = sessionData.session.user;

        const { data: usuario, error: usuarioError } = await supabaseClient
            .from('usuarios')
            .select('nome_completo, id_perfil')
            .eq('id_usuario', user.id)
            .single();

        if (usuarioError || !usuario) {
            console.error('Erro ao consultar usuário:', usuarioError);
            window.location.replace(loginUrl);
            return;
        }

        const { data: perfil, error: perfilError } = await supabaseClient
            .from('perfis')
            .select('nome')
            .eq('id_perfil', usuario.id_perfil)
            .single();

        if (perfilError || !perfil) {
            console.error('Erro ao consultar perfil:', perfilError);
            window.location.replace(loginUrl);
            return;
        }

        if (perfil.nome !== 'Administrador') {
            window.location.replace(clientUrl);
            return;
        }

        const nome = usuario.nome_completo || user.email || 'Administrador';

        const iniciais = nome
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map(parte => parte.charAt(0).toUpperCase())
            .join('');

        if (userName) {
            userName.textContent = nome;
        }

        if (userAvatar) {
            userAvatar.textContent = iniciais || 'AD';
        }

        if (sidebarLogout) {
            sidebarLogout.addEventListener('click', async event => {
                event.preventDefault();

                const { error } = await supabaseClient.auth.signOut();

                if (error) {
                    console.error('Erro ao sair:', error);
                    alert('Não foi possível encerrar a sessão.');
                    return;
                }

                window.location.replace(loginUrl);
            });
        }
    } catch (error) {
        console.error('Erro ao validar acesso administrativo:', error);
        window.location.replace(loginUrl);
    }
});


/* =========================================================
   SIDEBAR MOBILE (drawer + overlay)
   Usado em todas as páginas do painel admin (Dashboard,
   Clientes, Serviços, Domínios, Faturamento, Chamados, Blog,
   Configurações). Quando o JS for compartilhado, este bloco
   sai daqui e vira um único js/dashboard.js global.
========================================================= */

const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');

function openSidebar() {
    sidebar.classList.add('sidebar-open');
    sidebarOverlay.classList.add('is-visible');
}

function closeSidebar() {
    sidebar.classList.remove('sidebar-open');
    sidebarOverlay.classList.remove('is-visible');
}

if (sidebarToggle) {
    sidebarToggle.addEventListener('click', openSidebar);
}

if (sidebarClose) {
    sidebarClose.addEventListener('click', closeSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

// Fecha a sidebar ao navegar para outro link (mobile)
document.querySelectorAll('.sidebar-link').forEach((link) => {
    link.addEventListener('click', closeSidebar);
});


/* =========================================================
   FILTER TABS (Clientes, Serviços, Domínios, Faturamento, Chamados, Blog)
   Alterna a classe "active" entre as abas de filtro. A
   filtragem real da tabela fica para quando o backend
   existir — aqui é só o estado visual.
========================================================= */

document.querySelectorAll('.filter-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
    });
});


/* =========================================================
   TOGGLE SWITCHES (Configurações)
========================================================= */

document.querySelectorAll('.toggle-switch').forEach((toggle) => {
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('is-on');
    });
});


/* =========================================================
   ZONA DE RISCO (Configurações) — confirmação inline,
   sem precisar de uma página separada de confirmação.
========================================================= */

const dangerConfirmInput = document.getElementById('dangerConfirmInput');
const dangerConfirmBtn = document.getElementById('dangerConfirmBtn');

if (dangerConfirmInput && dangerConfirmBtn) {
    dangerConfirmInput.addEventListener('input', () => {
        dangerConfirmBtn.disabled = dangerConfirmInput.value.trim().toUpperCase() !== 'EXCLUIR';
    });
}


/* =========================================================
   BACKUPS — criar / restaurar (sem backend por enquanto)
========================================================= */

const createBackupBtn = document.getElementById('createBackupBtn');

if (createBackupBtn) {
    createBackupBtn.addEventListener('click', () => {
        alert('Backup iniciado! Você será notificado quando ele for concluído.');
    });
}

document.querySelectorAll('.backup-restore-btn').forEach((btn) => {
    if (btn.disabled) return;
    btn.addEventListener('click', () => {
        const date = btn.dataset.backup || '';
        const confirmed = confirm(`Restaurar o backup de ${date}? Os dados atuais serão substituídos.`);
        if (confirmed) {
            alert('Restauração iniciada. Isso pode levar alguns minutos.');
        }
    });
});


/* =========================================================
   FORMULÁRIOS (Perfil / Senha) — feedback simples, sem
   backend por enquanto.
========================================================= */

const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Dados atualizados com sucesso!');
    });
}

const passwordForm = document.getElementById('passwordForm');
if (passwordForm) {
    passwordForm.addEventListener('submit', (event) => {
        event.preventDefault();
        alert('Senha atualizada com sucesso!');
        passwordForm.reset();
    });
}


/* =========================================================
   MODAIS, FORMULÁRIOS, FILTROS E BUSCA (atualização)
   Contas de hospedagem, Pacotes, Novo cliente, Responder
   chamado e Publicar artigo. Ainda sem backend: as ações
   mostram apenas um aviso na tela.
========================================================= */

(() => {
    const toast = (message) => {
        document.querySelector('.app-toast')?.remove();
        const el = document.createElement('div'); el.className = 'app-toast'; el.setAttribute('role', 'status'); el.textContent = message;
        document.body.appendChild(el); window.setTimeout(() => el.remove(), 4200);
    };
    const esc = (str = '') => String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const modalConfigs = {
        'account.create': { title: 'Criar uma nova conta', desc: 'Configure uma nova conta de hospedagem para um cliente.', fields: [['Usuário da conta', 'text', 'username', 'Ex.: marinaxavier'], ['Domínio principal', 'text', 'domain', 'exemplo.com.br'], ['E-mail do cliente', 'email', 'email', 'cliente@empresa.com.br'], ['Pacote', 'select', 'package', ['Cloud Essencial', 'Cloud Intermediário', 'Cloud Pro']], ['Cota de disco (GB)', 'number', 'quota', '50'], ['Largura de banda mensal (GB)', 'number', 'bandwidth', '500']] },
        'account.force-password': { title: 'Forçar alteração de senha', desc: 'A conta deverá criar uma nova senha no próximo acesso.', fields: [['Conta', 'text', 'account', 'Usuário ou domínio'], ['Exigir alteração no próximo acesso', 'select', 'force', ['Sim', 'Não']]] },
        'account.bandwidth': { title: 'Limitar uso da largura de banda', desc: 'Defina o limite mensal de transferência da conta selecionada.', fields: [['Conta', 'text', 'account', 'Usuário ou domínio'], ['Limite mensal (GB)', 'number', 'bandwidth', '500'], ['Avisar quando atingir (%)', 'number', 'warning', '80']] },
        'account.suspension': { title: 'Gerenciar suspensão de conta', desc: 'Altere o estado de acesso da conta selecionada.', fields: [['Conta', 'text', 'account', 'Usuário ou domínio'], ['Ação', 'select', 'status', ['Manter suspensa', 'Suspender conta', 'Reativar conta']], ['Motivo / observação', 'text', 'reason', 'Ex.: pagamento pendente']] },
        'account.edit': { title: 'Modificar uma conta', desc: 'Atualize as informações principais da conta de hospedagem.', fields: [['Usuário ou domínio', 'text', 'account', 'Usuário ou domínio'], ['E-mail de contato', 'email', 'email', 'cliente@empresa.com.br'], ['Pacote', 'select', 'package', ['Cloud Essencial', 'Cloud Intermediário', 'Cloud Pro']], ['Status', 'select', 'status', ['Ativa', 'Suspensa', 'Aguardando pagamento']]] },
        'account.password': { title: 'Modificação de senha', desc: 'Defina uma nova senha para a conta selecionada (demonstração).', fields: [['Conta', 'text', 'account', 'Usuário ou domínio'], ['Nova senha', 'password', 'password', 'Mínimo de 8 caracteres'], ['Confirmar nova senha', 'password', 'confirm', 'Repita a nova senha']] },
        'account.quota': { title: 'Modificação de cota', desc: 'Ajuste o espaço em disco permitido para uma conta.', fields: [['Conta', 'text', 'account', 'Usuário ou domínio'], ['Nova cota de disco (GB)', 'number', 'quota', '100']] },
        'account.upgrade': { title: 'Upgrade / downgrade de uma conta', desc: 'Escolha o pacote para alterar a capacidade da hospedagem.', fields: [['Conta', 'text', 'account', 'Usuário ou domínio'], ['Novo pacote', 'select', 'package', ['Cloud Essencial', 'Cloud Intermediário', 'Cloud Pro']], ['Aplicar a partir de', 'select', 'when', ['Imediatamente', 'Próximo ciclo de cobrança']]] },
        'account.web-template': { title: 'Editor do modelo da Web', desc: 'Edite o texto da página padrão exibida para uma conta recém-criada.', fields: [['Nome do modelo', 'text', 'templateName', 'Página padrão HallTech'], ['Título da página', 'text', 'pageTitle', 'Site em construção'], ['Mensagem', 'textarea', 'message', 'Este domínio está configurado. Em breve teremos novidades.']] },
        'account.terminate': { title: 'Terminate Accounts', desc: 'Encerramento permanente é uma ação de risco. No protótipo, nada será removido de verdade.', fields: [['Conta a encerrar', 'text', 'account', 'Usuário ou domínio'], ['Confirmar encerramento', 'select', 'confirm', ['Não encerrar', 'Confirmo que desejo encerrar']]] },
        'package.add': { title: 'Adicionar um pacote', desc: 'Crie um pacote de hospedagem com limites de recursos.', fields: [['Nome do pacote', 'text', 'name', 'Ex.: Cloud Business'], ['Preço mensal (R$)', 'number', 'price', '129.90'], ['Espaço em disco (GB)', 'number', 'disk', '100'], ['Largura de banda (GB)', 'number', 'bandwidth', '1000'], ['Contas de e-mail', 'text', 'emails', 'Ilimitadas'], ['Bancos de dados', 'number', 'databases', '50']] },
        'package.edit': { title: 'Editar um pacote', desc: 'Ajuste o nome, preço e os limites do pacote selecionado.', fields: [['Pacote', 'text', 'package', 'Nome do pacote'], ['Preço mensal (R$)', 'number', 'price', '59.90'], ['Espaço em disco (GB)', 'number', 'disk', '50'], ['Largura de banda (GB)', 'number', 'bandwidth', '500'], ['Contas de e-mail', 'text', 'emails', '30']] },
        'package.delete': { title: 'Excluir pacote', desc: 'Confirme se deseja marcar o pacote selecionado para exclusão no protótipo.', fields: [['Pacote', 'text', 'package', 'Nome do pacote'], ['Confirmar exclusão', 'select', 'confirm', ['Não excluir', 'Sim, excluir pacote']]] },
        'package.resources': { title: 'Gerenciador de recursos', desc: 'Edite os limites gerais disponibilizados para os pacotes.', fields: [['Espaço máximo por conta (GB)', 'number', 'disk', '500'], ['Largura de banda máxima (GB)', 'number', 'bandwidth', '5000'], ['Máximo de bancos de dados', 'number', 'databases', '100'], ['Máximo de domínios adicionais', 'number', 'domains', '50'], ['Ativar recursos extras', 'select', 'extras', ['Sim', 'Não']]] },
        'ticket.internal-note': { title: 'Adicionar nota interna', desc: 'A nota fica disponível apenas para a equipe (simulação).', fields: [['Nota interna', 'textarea', 'note', 'Escreva uma observação para a equipe...']] },
        'ticket.mark-resolved': { title: 'Marcar chamado como resolvido', desc: 'Confirme a atualização visual do status deste chamado.', fields: [['Confirmação', 'select', 'confirm', ['Voltar', 'Marcar como resolvido']]] },
        'blog.preview': { title: 'Prévia do artigo', desc: 'A prévia é aberta a partir do formulário de publicação.', special: 'preview' }
    };
    function openModal(action, trigger) {
        const cfg = modalConfigs[action]; if (!cfg) return;
        if (action === 'blog.preview') {
            const title = document.getElementById('postTitle')?.value.trim();
            const excerpt = document.getElementById('postExcerpt')?.value.trim();
            const preview = document.getElementById('blogPreview');
            if (!title || !excerpt) { toast('Preencha o título e o resumo para visualizar a prévia.'); return; }
            document.getElementById('previewTitle').textContent = title;
            document.getElementById('previewExcerpt').textContent = excerpt;
            preview.hidden = false; preview.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); toast('Prévia atualizada.'); return;
        }
        const value = trigger?.dataset.account || trigger?.dataset.package || '';
        const fields = cfg.fields.map(([label, type, name, placeholder]) => {
            let field;
            if (type === 'select') field = `<select class="form-select" name="${name}" ${name === 'confirm' ? 'required' : ''}>${placeholder.map(v => `<option>${esc(v)}</option>`).join('')}</select>`;
            else if (type === 'textarea') field = `<textarea class="form-input textarea-input" rows="3" name="${name}" placeholder="${esc(placeholder)}" ${name === 'note' ? 'required' : ''}></textarea>`;
            else field = `<input class="form-input" name="${name}" type="${type}" placeholder="${esc(placeholder)}" value="${['account', 'package'].includes(name) && value ? esc(value) : ''}" ${['account', 'username', 'domain', 'name'].includes(name) ? 'required' : ''} ${type === 'number' ? 'min="0"' : ''}>`;
            return `<div class="form-group"><label>${esc(label)}</label>${field}</div>`;
        }).join('');
        const backdrop = document.createElement('div'); backdrop.className = 'app-modal-backdrop';
        backdrop.innerHTML = `<section class="app-modal" role="dialog" aria-modal="true" aria-label="${esc(cfg.title)}"><div class="app-modal-head"><div><h2>${esc(cfg.title)}</h2><p>${esc(cfg.desc)}</p></div><button type="button" class="modal-close" aria-label="Fechar">×</button></div><form class="modal-form">${fields}<div class="app-modal-actions"><button type="button" class="btn btn-outline modal-cancel">Cancelar</button><button type="submit" class="btn btn-primary">Salvar alterações</button></div></form></section>`;
        document.body.appendChild(backdrop);
        const close = () => backdrop.remove(); backdrop.querySelector('.modal-close').addEventListener('click', close); backdrop.querySelector('.modal-cancel').addEventListener('click', close);
        backdrop.addEventListener('click', e => { if (e.target === backdrop) close(); });
        backdrop.querySelector('form').addEventListener('submit', e => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.currentTarget).entries());
            if (data.password && data.confirm && data.password !== data.confirm) { toast('As senhas não coincidem.'); return; }
            if (action === 'account.terminate' && data.confirm !== 'Confirmo que desejo encerrar') { toast('Encerramento cancelado.'); close(); return; }
            if (action === 'package.delete' && data.confirm !== 'Sim, excluir pacote') { toast('Exclusão cancelada.'); close(); return; }
            if (action === 'ticket.mark-resolved' && data.confirm !== 'Marcar como resolvido') { close(); return; }
            let msg = 'Ação concluída no protótipo. Nenhuma alteração foi enviada ao servidor.';
            if (action === 'account.terminate') msg = 'Solicitação de encerramento demonstrada. Nenhuma conta foi removida de verdade.';
            else if (action === 'package.delete') msg = 'Pacote marcado para exclusão no protótipo. Nada foi removido de verdade.';
            else if (action === 'ticket.mark-resolved') msg = 'Chamado marcado como resolvido visualmente. Nenhum backend foi atualizado.';
            else if (action === 'package.add') msg = 'Pacote criado na demonstração. Para persistir, falta conectar o backend.';
            else if (action === 'account.create') msg = 'Conta de hospedagem criada na demonstração. Para persistir, falta conectar o backend.';
            else if (action === 'ticket.internal-note') msg = 'Nota interna registrada na demonstração.';
            close(); toast(msg);
        });
    }

    document.addEventListener('click', event => {
        const button = event.target.closest('[data-action]');
        if (button) { event.preventDefault(); openModal(button.dataset.action, button); }
    });

    document.querySelectorAll('.demo-form').forEach(form => form.addEventListener('submit', event => {
        event.preventDefault();
        if (form.id === 'replyForm' || form.classList.contains('reply-form')) {
            const ticketStatus = document.getElementById('replyStatus')?.value || 'Em andamento';
            toast(`Resposta registrada no protótipo. Status selecionado: ${ticketStatus}. Nenhuma mensagem foi enviada.`);
            form.reset(); return;
        }
        toast(form.dataset.success || 'Formulário concluído no protótipo.');
        if (form.id === 'publishForm') {
            const status = document.getElementById('postStatus')?.value;
            if (status === 'Salvar como rascunho') toast('Artigo salvo como rascunho no protótipo. Nenhum conteúdo foi publicado de verdade.');
        }
        form.reset();
    }));

    const accountSearch = document.querySelector('[data-global-search]');
    const applyAccountFilters = () => {
        const table = document.getElementById('accountsTable'); if (!table) return;
        const kind = document.querySelector('[data-filter].active')?.dataset.filter || 'all';
        const q = (accountSearch?.value || '').trim().toLocaleLowerCase('pt-BR');
        table.querySelectorAll('tbody tr').forEach(row => {
            const matchesKind = kind === 'all' || row.dataset.kind === kind;
            const matchesSearch = !q || row.innerText.toLocaleLowerCase('pt-BR').includes(q);
            row.hidden = !(matchesKind && matchesSearch);
        });
    };
    document.querySelectorAll('[data-filter]').forEach(tab => tab.addEventListener('click', () => {
        const group = tab.closest('.filter-tabs'); group?.querySelectorAll('[data-filter]').forEach(t => t.classList.remove('active')); tab.classList.add('active');
        applyAccountFilters();
    }));

    if (accountSearch) accountSearch.addEventListener('input', () => {
        if (document.getElementById('accountsTable')) { applyAccountFilters(); return; }
        const q = accountSearch.value.trim().toLocaleLowerCase('pt-BR');
        document.querySelectorAll('.tickets-table tbody tr').forEach(row => { row.hidden = !!q && !row.innerText.toLocaleLowerCase('pt-BR').includes(q); });
    });

    // Read the ticket id from the query string to keep ticket actions linked to the selected row.
    if (location.pathname.includes('/responder-chamado/')) {
        const id = new URLSearchParams(location.search).get('id');
        if (id && /^\d+$/.test(id)) { const label = document.getElementById('ticketIdLabel'); if (label) label.textContent = `Chamado #${id}`; }
    }
})();
