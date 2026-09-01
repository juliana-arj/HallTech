const numeroChamado = document.getElementById('numeroChamado');
const tituloChamado = document.getElementById('tituloChamado');
const assuntoChamado = document.getElementById('assuntoChamado');
const categoriaChamado = document.getElementById('categoriaChamado');
const prioridadeChamado = document.getElementById('prioridadeChamado');
const statusChamado = document.getElementById('statusChamado');
const dataChamado = document.getElementById('dataChamado');
const descricaoChamado = document.getElementById('descricaoChamado');
const respostaChamado = document.getElementById('respostaChamado');

const anexoSection = document.getElementById('anexoSection');
const anexoChamado = document.getElementById('anexoChamado');

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

function pegarIdChamado() {

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const id =
        parametros.get('id');

    return id;
}

async function carregarChamado(usuario, idChamado) {

    if (!idChamado) {

        alert(
            'Chamado não encontrado.'
        );

        window.location.href =
            '../dashboard-chamados/index.html';

        return;
    }


    const { data, error } =
        await supabaseClient
            .from('chamados')
            .select(`
                id_chamado,
                numero_chamado,
                assunto,
                descricao,
                prioridade,
                status,
                resposta,
                anexo_url,
                data_abertura,
                data_resposta,
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
            'Não foi possível carregar este chamado.'
        );

        window.location.href =
            '../dashboard-chamados/index.html';

        return;
    }


    preencherChamado(data);
}

function preencherChamado(chamado) {

    numeroChamado.textContent =
        `#${chamado.numero_chamado}`;


    tituloChamado.textContent =
        `Chamado #${chamado.numero_chamado}`;


    assuntoChamado.textContent =
        chamado.assunto;


    categoriaChamado.textContent =
        chamado.categorias_chamados?.nome ??
        'Sem categoria';


    prioridadeChamado.textContent =
        formatarTexto(
            chamado.prioridade
        );


    statusChamado.textContent =
        formatarTexto(
            chamado.status
        );

    statusChamado.className =
        'status-badge';


    if (chamado.status === 'aberto') {

        statusChamado.classList.add(
            'status-aberto'
        );

    } else if (
        chamado.status === 'em andamento'
    ) {

        statusChamado.classList.add(
            'status-andamento'
        );

    } else if (
        chamado.status === 'resolvido'
    ) {

        statusChamado.classList.add(
            'status-resolvido'
        );

    } else if (
        chamado.status === 'fechado'
    ) {

        statusChamado.classList.add(
            'status-fechado'
        );
    }

    const dataFormatada =
        new Date(
            chamado.data_abertura
        ).toLocaleDateString(
            'pt-BR'
        );


    dataChamado.textContent =
        dataFormatada;

    descricaoChamado.textContent =
        chamado.descricao;

    if (chamado.anexo_url) {

        anexoSection.style.display =
            'block';


        const nomeArquivo =
            obterNomeArquivo(
                chamado.anexo_url
            );


        anexoChamado.innerHTML = `
            <div class="attachment-box">

                <div class="attachment-icon">
                    📎
                </div>

                <div class="attachment-info">

                    <strong>
                        ${nomeArquivo}
                    </strong>

                    <span>
                        Arquivo anexado ao chamado
                    </span>

                </div>

                <a
                    href="${chamado.anexo_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="attachment-button"
                >
                    Abrir arquivo
                </a>

            </div>
        `;

    } else {

        anexoSection.style.display =
            'none';
    }

    if (chamado.resposta) {

        respostaChamado.textContent =
            chamado.resposta;

    } else {

        respostaChamado.textContent =
            'A equipe de suporte ainda não respondeu este chamado.';
    }
}

function obterNomeArquivo(url) {

    try {

        const partes =
            new URL(url)
                .pathname
                .split('/');

        const nome =
            partes[partes.length - 1];

        return decodeURIComponent(
            nome
        );

    } catch (error) {

        return 'Arquivo anexado';
    }
}

function formatarTexto(texto) {

    if (!texto) {
        return '--';
    }

    return texto
        .charAt(0)
        .toUpperCase() +
        texto.slice(1);
}

async function iniciarPagina() {

    const usuario =
        await verificarAutenticacao();

    if (!usuario) {
        return;
    }


    const idChamado =
        pegarIdChamado();


    await carregarChamado(
        usuario,
        idChamado
    );
}


iniciarPagina();
