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

async function atualizarSenha() {
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const botao = document.getElementById('atualizarSenha');

    if (!novaSenha || !confirmarSenha) {
        alert('Preencha os dois campos de senha.');
        return;
    }

    if (novaSenha.length < 8) {
        alert('A nova senha deve ter pelo menos 8 caracteres.');
        return;
    }

    if (novaSenha !== confirmarSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    botao.disabled = true;
    botao.textContent = 'Atualizando...';

    const { error } = await supabaseClient.auth.updateUser({
        password: novaSenha
    });

    if (error) {
        console.error('Erro ao atualizar senha:', error);

        alert('Não foi possível atualizar a senha.');

        botao.disabled = false;
        botao.textContent = 'Atualizar senha';

        return;
    }

    alert('Senha atualizada com sucesso.');

    document.getElementById('novaSenha').value = '';
    document.getElementById('confirmarSenha').value = '';

    botao.disabled = false;
    botao.textContent = 'Atualizar senha';
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

    const avatar = document.querySelector('.user-avatar');
    const nome = document.querySelector('.user-info strong');
    const clienteDesde = document.querySelector('.user-info span');

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

    document
        .getElementById('atualizarSenha')
        .addEventListener('click', atualizarSenha);
}

iniciarPagina();