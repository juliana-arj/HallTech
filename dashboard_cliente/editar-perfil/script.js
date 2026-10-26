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
            cpf_cnpj
        `)
        .eq('id_usuario', usuario.id)
        .single();

    if (error) {
        console.error('Erro ao carregar perfil:', error);
        alert('Não foi possível carregar seus dados.');
        return;
    }

    document.getElementById('nomeCompleto').value =
        data.nome_completo || '';

    document.getElementById('cpfCnpj').value =
        data.cpf_cnpj || '';

    document.getElementById('email').value =
        data.email || usuario.email || '';

    document.getElementById('telefone').value =
        data.telefone || '';
}

async function salvarPerfil(usuario) {

    const nomeCompleto =
        document.getElementById('nomeCompleto').value.trim();

    const cpfCnpj =
        document.getElementById('cpfCnpj').value.trim();

    const telefone =
        document.getElementById('telefone').value.trim();

    if (!nomeCompleto) {
        alert('Informe seu nome completo.');
        return;
    }

    const botao = document.getElementById('salvarPerfil');

    botao.disabled = true;
    botao.textContent = 'Salvando...';

    const { error } = await supabaseClient
        .from('usuarios')
        .update({
            nome_completo: nomeCompleto,
            cpf_cnpj: cpfCnpj || null,
            telefone: telefone || null
        })
        .eq('id_usuario', usuario.id);

    if (error) {
        console.error('Erro ao atualizar perfil:', error);

        alert('Não foi possível salvar as alterações.');

        botao.disabled = false;
        botao.textContent = 'Salvar alterações';

        return;
    }

    alert('Perfil atualizado com sucesso.');

    window.location.href = '../perfil/index.html';
}

async function iniciarPagina() {

    const usuario = await verificarAutenticacao();

    if (!usuario) {
        return;
    }

    await carregarPerfil(usuario);

    document
        .getElementById('salvarPerfil')
        .addEventListener('click', () => {
            salvarPerfil(usuario);
        });
}

iniciarPagina();