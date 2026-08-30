
const ticketForm = document.getElementById('ticketForm');
const ticketCategory = document.getElementById('ticketCategory');
const btnCancelar = document.getElementById('btn-cancelar');

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

async function carregarCategorias() {

    const { data, error } = await supabaseClient
        .from('categorias_chamados')
        .select('id_categoria, nome')
        .order('nome');

    if (error) {
        console.error('Erro ao carregar categorias:', error);

        ticketCategory.innerHTML = `
            <option value="">Erro ao carregar categorias</option>
        `;

        return;
    }

    ticketCategory.innerHTML = `
        <option value="">Selecione uma categoria</option>
    `;

    data.forEach(categoria => {

        const option = document.createElement('option');

        option.value = categoria.id_categoria;
        option.textContent = categoria.nome;

        ticketCategory.appendChild(option);
    });

}

ticketForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const { data: sessionData, error: sessionError } =
        await supabaseClient.auth.getSession();

    if (sessionError || !sessionData.session) {
        alert('Sua sessão expirou. Faça login novamente.');
        window.location.href = '../login/index.html';
        return;
    }

    const usuario = sessionData.session.user;

    const assunto = document.getElementById('ticketTitle').value.trim();
    const descricao = document.getElementById('ticketDescription').value.trim();
    const prioridade = document.querySelector(
        'input[name="priority"]:checked'
    ).value;

    const idCategoria = ticketCategory.value;

    if (!idCategoria) {
        alert('Selecione uma categoria para o chamado.');
        return;
    }

    const chamado = {
        id_usuario: usuario.id,
        id_categoria: idCategoria,
        assunto: assunto,
        descricao: descricao,
        prioridade: prioridade
    };

    const submitButton = ticketForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.querySelector('span').textContent = 'Enviando...';

    const { error } = await supabaseClient
        .from('chamados')
        .insert(chamado);

    if (error) {
        console.error('Erro ao cadastrar chamado:', error);
        alert('Não foi possível cadastrar o chamado.');

        submitButton.disabled = false;
        submitButton.querySelector('span').textContent = 'Enviar Chamado';

        return;
    }

    alert('Chamado aberto com sucesso!');

    window.location.href = '../dashboard-chamados/index.html';

    if (error) {

        console.error('Erro ao cadastrar chamado:', error);

        alert('Não foi possível cadastrar o chamado.');

        submitButton.disabled = false;
        submitButton.querySelector('span').textContent = 'Enviar Chamado';

        return;
    }

    alert('Chamado aberto com sucesso!');

    window.location.href = '../dashboard-chamados/index.html';
});

btnCancelar.addEventListener('click', () => {

    window.location.href = '../dashboard-chamados/index.html';

});

async function iniciarPagina() {

    const usuario = await verificarAutenticacao();

    if (!usuario) {
        return;
    }

    await carregarCategorias();
}

iniciarPagina();