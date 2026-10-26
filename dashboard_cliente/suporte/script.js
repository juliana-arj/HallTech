
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

async function carregarPerfilNavbar(usuario) {
    const { data, error } = await supabaseClient
        .from('usuarios')
        .select(`
            nome_completo,
            data_cadastro
        `)
        .eq('id_usuario', usuario.id)
        .single();

    if (error) {
        console.error('Erro ao carregar perfil:', error);
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

    const avatar = document.getElementById('userAvatar');
    const nome = document.getElementById('userName');
    const desde = document.getElementById('userSince');

    if (avatar) {
        avatar.textContent = iniciais;
    }

    if (nome) {
        nome.textContent = nomeExibicao;
    }

    if (desde && data.data_cadastro) {
        const dataCadastro = new Date(data.data_cadastro);

        const mes = dataCadastro
            .toLocaleDateString('pt-BR', {
                month: 'short'
            })
            .replace('.', '');

        const ano = dataCadastro.getFullYear();

        desde.textContent =
            `Cliente desde ${mes.charAt(0).toUpperCase()}${mes.slice(1)}/${ano}`;
    }
}

async function iniciarPagina() {
    const usuario = await verificarAutenticacao();

    if (!usuario) {
        return;
    }

    await carregarPerfilNavbar(usuario);
}

iniciarPagina();