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

async function carregarPerfilTopbar(usuario) {
    const { data, error } = await supabaseClient
        .from('usuarios')
        .select(`
            nome_completo,
            data_cadastro
        `)
        .eq('id_usuario', usuario.id)
        .single();

    if (error) {
        console.error('Erro ao carregar dados do usuário:', error);
        return;
    }

    const nomeCompleto = data.nome_completo || 'Usuário';
    const partesNome = nomeCompleto.trim().split(/\s+/);

    let nomeExibicao = nomeCompleto;
    let iniciais = partesNome[0]?.charAt(0) || '';

    if (partesNome.length >= 2) {
        nomeExibicao =
            `${partesNome[0]} ${partesNome[partesNome.length - 1]}`;

        iniciais =
            `${partesNome[0].charAt(0)}${partesNome[partesNome.length - 1].charAt(0)}`;
    }

    iniciais = iniciais.toUpperCase();

    const dataCadastro = data.data_cadastro
        ? new Date(data.data_cadastro)
        : null;

    const mes = dataCadastro
        ? dataCadastro.toLocaleDateString('pt-BR', {
            month: 'short'
        }).replace('.', '')
        : '';

    const mesAbreviado = mes
        ? mes.charAt(0).toUpperCase() + mes.slice(1)
        : '';

    const ano = dataCadastro
        ? dataCadastro.getFullYear()
        : '';

    const avatar = document.getElementById('userAvatar');
    const nome = document.getElementById('userName');
    const clienteDesde = document.getElementById('userSince');

    if (avatar) {
        avatar.textContent = iniciais;
    }

    if (nome) {
        nome.textContent = nomeExibicao;
    }

    if (clienteDesde && dataCadastro) {
        clienteDesde.textContent =
            `Cliente desde ${mesAbreviado}/${ano}`;
    }
}

async function iniciarPagina() {
    const usuario = await verificarAutenticacao();

    if (!usuario) {
        return;
    }

    await carregarPerfilTopbar(usuario);
}

iniciarPagina();