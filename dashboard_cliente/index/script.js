
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

async function carregarUltimosChamados(usuario) {

    const container = document.getElementById('ultimosChamados');

    const { data, error } = await supabaseClient
        .from('chamados')
        .select(`
            id_chamado,
            numero_chamado,
            assunto,
            status,
            prioridade,
            data_abertura,
            categorias_chamados (
                nome
            )
        `)
        .eq('id_usuario', usuario.id)
        .order('data_abertura', { ascending: false })
        .limit(3);

    if (error) {
        console.error('Erro ao carregar últimos chamados:', error);

        container.innerHTML = `
            <div class="small muted">
                Não foi possível carregar os chamados.
            </div>
        `;

        return;
    }

    if (!data || data.length === 0) {

        container.innerHTML = `
            <div class="small muted" style="padding: 20px 0; text-align: center;">
                Você ainda não possui chamados.
            </div>
        `;

        return;
    }

    container.innerHTML = '';

    data.forEach(chamado => {

        const dataFormatada = new Date(
            chamado.data_abertura
        ).toLocaleDateString('pt-BR');

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

        const statusFormatado =
            chamado.status.charAt(0).toUpperCase() +
            chamado.status.slice(1);

        const chamadoElement = document.createElement('div');

        chamadoElement.style.cursor = 'pointer';

        chamadoElement.addEventListener('click', () => {
            window.location.href =
                `../detalhes-chamado/index.html?id=${chamado.id_chamado}`;
        });

        chamadoElement.innerHTML = `
            <div style="padding: 14px 0; border-bottom: 1px solid #e5e7eb;">
                <div class="row-between">
                    <span>
                        <strong>#${chamado.numero_chamado}</strong>
                        ${chamado.assunto}
                    </span>

                    <span class="badge ${classeStatus}">
                        ${statusFormatado}
                    </span>
                </div>

                <div class="small muted" style="margin-top: 6px;">
                    ${chamado.categorias_chamados?.nome ?? 'Sem categoria'}
                    · ${dataFormatada}
                </div>
            </div>
        `;

        container.appendChild(chamadoElement);
    });
}

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

    const partesNome = nomeCompleto.trim().split(/\s+/);

    let nomeExibicao = nomeCompleto;

    if (partesNome.length >= 2) {
        nomeExibicao = `${partesNome[0]} ${partesNome[partesNome.length - 1]}`;
    }

    const primeiraLetra =
        partesNome[0]?.charAt(0) || '';

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

    document.querySelector('.user-avatar').textContent =
        iniciais;

    document.querySelector('.user-info strong').textContent =
        nomeExibicao;

    document.querySelector('.user-info span').textContent =
        `Cliente desde ${mesFormatado.charAt(0).toUpperCase() + mesFormatado.slice(1)}/${ano}`;
}

async function carregarChamadosAbertos(usuario) {

    const elemento = document.querySelector('.inline-style-15');

    const { count, error } = await supabaseClient
        .from('chamados')
        .select('id_chamado', {
            count: 'exact',
            head: true
        })
        .eq('id_usuario', usuario.id)
        .eq('status', 'aberto');

    if (error) {
        console.error('Erro ao carregar chamados abertos:', error);
        elemento.textContent = '0';
        return;
    }

    elemento.textContent = count ?? 0;
}


async function iniciarPagina() {

    const usuario = await verificarAutenticacao();

    if (!usuario) {
        return;
    }

    await carregarPerfilNavbar(usuario);
    await carregarUltimosChamados(usuario);
    await carregarChamadosAbertos(usuario);
}

iniciarPagina();