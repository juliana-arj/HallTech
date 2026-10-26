
const urlParams = new URLSearchParams(
    window.location.search
);

const idChamado = urlParams.get('id');

const tituloPagina =
    document.querySelector('.page-title');

const subtituloPagina =
    document.querySelector('.page-sub');

const informacaoAbertura =
    document.querySelector('.small.muted');

const badges =
    document.querySelectorAll('.badge');

const botaoResolver =
    document.querySelector('.btn-secondary.btn-block');

async function verificarAutenticacao() {
    const { data, error } =
        await supabaseClient.auth.getSession();

    if (error) {
        console.error(
            'Erro ao verificar sessão:',
            error
        );

        window.location.href =
            '../login/index.html';

        return null;
    }

    if (!data.session) {
        window.location.href =
            '../login/index.html';

        return null;
    }

    return data.session.user;
}

function formatarTexto(texto) {
    if (!texto) {
        return '';
    }

    return texto.charAt(0).toUpperCase() +
        texto.slice(1);
}

function formatarDataHora(data) {
    if (!data) {
        return '';
    }

    const dataFormatada =
        new Date(data);

    const dataParte =
        dataFormatada.toLocaleDateString(
            'pt-BR'
        );

    const horaParte =
        dataFormatada.toLocaleTimeString(
            'pt-BR',
            {
                hour: '2-digit',
                minute: '2-digit'
            }
        );

    return `${dataParte} às ${horaParte}`;
}

function obterClasseStatus(status) {
    if (status === 'aberto') {
        return 'badge-blue';
    }

    if (status === 'em andamento') {
        return 'badge-blue';
    }

    if (status === 'resolvido') {
        return 'badge-green';
    }

    if (status === 'fechado') {
        return 'badge-gray';
    }

    return 'badge-gray';
}

function obterClassePrioridade(prioridade) {
    if (prioridade === 'urgente') {
        return 'badge-red';
    }

    if (prioridade === 'alta') {
        return 'badge-orange';
    }

    if (prioridade === 'media') {
        return 'badge-blue';
    }

    if (prioridade === 'baixa') {
        return 'badge-gray';
    }

    return 'badge-gray';
}

function atualizarBadge(
    elemento,
    texto,
    classe
) {
    if (!elemento) {
        return;
    }

    elemento.textContent = texto;

    elemento.classList.remove(
        'badge-blue',
        'badge-orange',
        'badge-gray',
        'badge-green',
        'badge-red'
    );

    elemento.classList.add(classe);
}

function preencherChamado(chamado) {
    if (tituloPagina) {
        tituloPagina.textContent =
            `Chamado #${chamado.numero_chamado}`;
    }

    if (subtituloPagina) {
        subtituloPagina.textContent =
            chamado.assunto;
    }

    if (informacaoAbertura) {
        informacaoAbertura.textContent =
            `Aberto em ${formatarDataHora(chamado.data_abertura)}`;
    }

    const status =
        formatarTexto(chamado.status);

    const prioridade =
        formatarTexto(chamado.prioridade);

    const categoria =
        chamado.categorias_chamados?.nome ??
        'Sem categoria';

    const badgeStatusTopo =
        document.querySelector(
            '.row-between .badge'
        );

    const badgeStatusDetalhes =
        document.querySelector(
            '.card .field .badge'
        );

    atualizarBadge(
        badgeStatusTopo,
        status,
        obterClasseStatus(chamado.status)
    );

    atualizarBadge(
        badgeStatusDetalhes,
        status,
        obterClasseStatus(chamado.status)
    );

    const camposDetalhes =
        document.querySelectorAll(
            '.card .field'
        );

    camposDetalhes.forEach(campo => {
        const label =
            campo.querySelector('label');

        const badge =
            campo.querySelector('.badge');

        if (!label) {
            return;
        }

        const textoLabel =
            label.textContent
                .trim()
                .toLowerCase();

        if (
            textoLabel === 'status' &&
            badge
        ) {
            atualizarBadge(
                badge,
                status,
                obterClasseStatus(
                    chamado.status
                )
            );
        }

        if (
            textoLabel === 'prioridade' &&
            badge
        ) {
            atualizarBadge(
                badge,
                prioridade,
                obterClassePrioridade(
                    chamado.prioridade
                )
            );
        }

        if (
            textoLabel === 'categoria' &&
            badge
        ) {
            atualizarBadge(
                badge,
                categoria,
                'badge-gray'
            );
        }
    });

    atualizarBotaoResolver(
        chamado.status
    );
}

function atualizarBotaoResolver(status) {
    if (!botaoResolver) {
        return;
    }

    if (
        status === 'resolvido' ||
        status === 'fechado'
    ) {
        botaoResolver.disabled = true;
        botaoResolver.textContent =
            'Chamado resolvido';
        return;
    }

    botaoResolver.disabled = false;
    botaoResolver.textContent =
        'Marcar como resolvido';
}

async function carregarChamado(usuario) {
    if (!idChamado) {
        alert(
            'Não foi possível identificar o chamado.'
        );

        window.location.href =
            '../chamados/index.html';

        return;
    }

    const { data, error } =
        await supabaseClient
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
            .eq(
                'id_chamado',
                idChamado
            )
            .eq(
                'id_usuario',
                usuario.id
            )
            .single();

    if (error) {
        console.error(
            'Erro ao carregar chamado:',
            error
        );

        alert(
            'Não foi possível carregar o chamado.'
        );

        window.location.href =
            '../chamados/index.html';

        return;
    }

    preencherChamado(data);
}

async function marcarComoResolvido() {
    if (!idChamado) {
        return;
    }

    const confirmacao = confirm(
        'Deseja marcar este chamado como resolvido?'
    );

    if (!confirmacao) {
        return;
    }

    botaoResolver.disabled = true;
    botaoResolver.textContent = 'Atualizando...';

    const {
        data: sessionData,
        error: sessionError
    } = await supabaseClient.auth.getSession();

    if (
        sessionError ||
        !sessionData.session
    ) {
        alert(
            'Sua sessão expirou. Faça login novamente.'
        );

        window.location.href =
            '../login/index.html';

        return;
    }

    const usuario = sessionData.session.user;

    const {
        data,
        error
    } = await supabaseClient
        .from('chamados')
        .update({
            status: 'resolvido'
        })
        .eq('id_chamado', idChamado)
        .eq('id_usuario', usuario.id)
        .select('id_chamado, status');

    if (error) {
        console.error(
            'Erro ao atualizar chamado:',
            error
        );

        alert(
            `Não foi possível atualizar o chamado.\n\nErro: ${error.message}`
        );

        botaoResolver.disabled = false;
        botaoResolver.textContent =
            'Marcar como resolvido';

        return;
    }

    console.log(
        'Resultado da atualização:',
        data
    );

    if (!data || data.length === 0) {
        alert(
            'O chamado não foi atualizado. Nenhum registro foi encontrado para este usuário.'
        );

        botaoResolver.disabled = false;
        botaoResolver.textContent =
            'Marcar como resolvido';

        return;
    }

    const chamadoAtualizado = data[0];

    console.log(
        'Chamado atualizado:',
        chamadoAtualizado
    );

    if (
        chamadoAtualizado.status !== 'resolvido'
    ) {
        alert(
            'O banco não retornou o chamado como resolvido.'
        );

        botaoResolver.disabled = false;
        botaoResolver.textContent =
            'Marcar como resolvido';

        return;
    }

    const badgeStatusTopo =
        document.querySelector(
            '.row-between .badge'
        );

    const badgeStatusDetalhes =
        document.querySelector(
            '.card .field .badge'
        );

    atualizarBadge(
        badgeStatusTopo,
        'Resolvido',
        'badge-green'
    );

    atualizarBadge(
        badgeStatusDetalhes,
        'Resolvido',
        'badge-green'
    );

    atualizarBotaoResolver(
        'resolvido'
    );

    alert(
        'Chamado marcado como resolvido!'
    );
}

if (botaoResolver) {
    botaoResolver.addEventListener(
        'click',
        marcarComoResolvido
    );
}

async function iniciarPagina() {
    const usuario =
        await verificarAutenticacao();

    if (!usuario) {
        return;
    }

    await carregarChamado(usuario);
}

iniciarPagina();