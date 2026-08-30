
const tabelaChamados = document.querySelector('.tickets-table tbody');
const filtros = document.querySelectorAll('.filter-tab');

let chamados = [];

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

function atualizarCards(chamados) {

    const totalAbertos = chamados.filter(
        chamado => chamado.status === 'aberto'
    ).length;

    const totalAndamento = chamados.filter(
        chamado => chamado.status === 'em andamento'
    ).length;

    const totalResolvidos = chamados.filter(
        chamado => chamado.status === 'resolvido'
    ).length;

    const totalChamados = chamados.length;

    document.getElementById('total-abertos').textContent = totalAbertos;
    document.getElementById('total-andamento').textContent = totalAndamento;
    document.getElementById('total-resolvidos').textContent = totalResolvidos;
    document.getElementById('total-chamados').textContent = totalChamados;
}

async function carregarChamados(usuario) {

    const { data, error } = await supabaseClient
        .from('chamados')
        .select(`
        id_chamado,
        numero_chamado,
        assunto,
        prioridade,
        status,
        data_abertura,
        categorias_chamados (
            nome
        )
    `)
        .eq('id_usuario', usuario.id)
        .order('data_abertura', { ascending: false });

    if (error) {
        console.error('Erro ao carregar chamados:', error);
        return;
    }

    chamados = data;

    atualizarCards(data);

    exibirChamados(chamados);
}

function exibirChamados(listaChamados) {

    if (!listaChamados || listaChamados.length === 0) {

        tabelaChamados.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center;">
                    Nenhum chamado encontrado.
                </td>
            </tr>
        `;

        return;
    }

    tabelaChamados.innerHTML = '';

    listaChamados.forEach(chamado => {

        const dataFormatada = new Date(
            chamado.data_abertura
        ).toLocaleDateString('pt-BR');

        const prioridade =
            chamado.prioridade.charAt(0).toUpperCase() +
            chamado.prioridade.slice(1);

        const status =
            chamado.status.charAt(0).toUpperCase() +
            chamado.status.slice(1);

        let classeStatus = '';

        if (chamado.status === 'aberto') {
            classeStatus = 'status-aberto';

        } else if (chamado.status === 'em andamento') {
            classeStatus = 'status-andamento';

        } else if (chamado.status === 'resolvido') {
            classeStatus = 'status-resolvido';

        } else if (chamado.status === 'fechado') {
            classeStatus = 'status-fechado';
        }

        const linha = document.createElement('tr');

        linha.style.cursor = 'pointer';

        linha.addEventListener('click', () => {
            window.location.href = `../detalhes/index.html?id=${chamado.id_chamado}`;
        });

        linha.innerHTML = `
            <td class="ticket-id-cell">
                #${chamado.numero_chamado}
            </td>

            <td class="ticket-title-cell">
                ${chamado.assunto}
            </td>

            <td>
                ${chamado.categorias_chamados?.nome ?? 'Sem categoria'}
            </td>

            <td>
                ${prioridade}
            </td>

            <td>
                <span class="status-badge ${classeStatus}">
                    ${status}
                </span>
            </td>

            <td class="ticket-date-cell">
                ${dataFormatada}
            </td>
        `;

        tabelaChamados.appendChild(linha);
    });
}

filtros.forEach(filtro => {

    filtro.addEventListener('click', () => {

        filtros.forEach(item => {
            item.classList.remove('active');
        });

        filtro.classList.add('active');

        const statusSelecionado = filtro.dataset.status;

        if (statusSelecionado === 'todos') {

            exibirChamados(chamados);

        } else {

            const chamadosFiltrados = chamados.filter(chamado =>
                chamado.status === statusSelecionado
            );

            exibirChamados(chamadosFiltrados);
        }

    });

});

async function carregarPerfilNavbar(usuario) {

    const { data, error } = await supabaseClient
        .from('usuarios')
        .select('nome_completo, data_cadastro')
        .eq('id_usuario', usuario.id)
        .single();

    if (error) {
        console.error('Erro ao buscar usuário:', error);
        return;
    }

    const nomeCompleto = data.nome_completo;

    const partesNome = nomeCompleto.trim().split(' ');

    const primeiraLetra = partesNome[0]?.charAt(0) || '';
    const ultimaLetra =
        partesNome.length > 1
            ? partesNome[partesNome.length - 1].charAt(0)
            : '';

    const iniciais = (
        primeiraLetra + ultimaLetra
    ).toUpperCase();

    const dataCadastro = new Date(data.data_cadastro);

    const mes = dataCadastro.toLocaleDateString('pt-BR', {
        month: 'short'
    });

    const ano = dataCadastro.getFullYear();

    const mesFormatado = mes.replace('.', '');

    document.getElementById('userAvatar').textContent = iniciais;

    document.getElementById('userName').textContent = nomeCompleto;

    document.getElementById('userSince').textContent =
        `Cliente desde ${mesFormatado.charAt(0).toUpperCase() + mesFormatado.slice(1)}/${ano}`;
}


async function iniciarPagina() {

    const usuario = await verificarAutenticacao();

    if (!usuario) {
        return;
    }

    await carregarPerfilNavbar(usuario);
    await carregarChamados(usuario);
}

iniciarPagina();