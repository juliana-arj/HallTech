async function verificarAutenticacao() {
    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error('Erro ao verificar sessão:', error);
        window.location.href = '../login/index.html';
        return null;
    }

    if (!data.session) {
        window.location.href = '../login/index.html';
        return null;
    }

    return data.session.user;
}

async function carregarPerfil(usuario) {
    const { data, error } = await supabaseClient
        .from('usuarios')
        .select(`
            nome_completo,
            email,
            telefone,
            cpf_cnpj,
            data_cadastro
        `)
        .eq('id_usuario', usuario.id)
        .single();

    if (error) {
        console.error('Erro ao carregar perfil:', error);
        return;
    }

    const nomeCompleto = data.nome_completo || '';
    const partesNome = nomeCompleto.trim().split(/\s+/);

    let nomeExibicao = nomeCompleto;
    let iniciais = partesNome[0]?.charAt(0) || '';

    if (partesNome.length > 1) {
        nomeExibicao =
            `${partesNome[0]} ${partesNome[partesNome.length - 1]}`;

        iniciais =
            `${partesNome[0].charAt(0)}${partesNome[partesNome.length - 1].charAt(0)}`;
    }

    iniciais = iniciais.toUpperCase();

    const dataCadastro = new Date(data.data_cadastro);

    const mes = dataCadastro.toLocaleDateString('pt-BR', {
        month: 'short'
    }).replace('.', '');

    const mesAbreviado =
        mes.charAt(0).toUpperCase() + mes.slice(1);

    const ano = dataCadastro.getFullYear();

    document.getElementById('profileAvatar').textContent =
        iniciais;

    document.getElementById('profileName').textContent =
        nomeExibicao;

    document.getElementById('profileSince').textContent =
        `Cliente desde ${mesAbreviado}/${ano}`;

    document.getElementById('profileFullName').textContent =
        nomeCompleto;

    document.getElementById('profileEmail').textContent =
        data.email || 'Não informado';

    document.getElementById('profilePhone').textContent =
        data.telefone || 'Não informado';

    document.getElementById('profileCpfCnpj').textContent =
        data.cpf_cnpj || 'Não informado';

    const topbarAvatar =
        document.querySelector('.topbar-user .user-avatar');

    const topbarName =
        document.querySelector('.topbar-user .user-info strong');

    const topbarSince =
        document.querySelector('.topbar-user .user-info span');

    if (topbarAvatar) {
        topbarAvatar.textContent = iniciais;
    }

    if (topbarName) {
        topbarName.textContent = nomeExibicao;
    }

    if (topbarSince) {
        topbarSince.textContent =
            `Cliente desde ${mesAbreviado}/${ano}`;
    }
}

async function iniciarPagina() {
    const usuario = await verificarAutenticacao();

    if (!usuario) {
        return;
    }

    await carregarPerfil(usuario);
}

iniciarPagina();