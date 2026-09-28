
const ticketForm = document.getElementById('ticketForm');
const ticketCategory = document.getElementById('ticketCategory');
const ticketPriority = document.getElementById('ticketPriority');
const btnEnviarChamado = document.getElementById('btnEnviarChamado');

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

async function carregarCategorias() {

    const { data, error } =
        await supabaseClient
            .from('categorias_chamados')
            .select('id_categoria, nome')
            .order('nome');

    if (error) {

        console.error(
            'Erro ao carregar categorias:',
            error
        );

        ticketCategory.innerHTML = `
            <option value="">
                Erro ao carregar categorias
            </option>
        `;

        return;
    }

    ticketCategory.innerHTML = `
        <option value="">
            Selecione uma categoria
        </option>
    `;

    data.forEach(categoria => {

        const option =
            document.createElement('option');

        option.value =
            categoria.id_categoria;

        option.textContent =
            categoria.nome;

        ticketCategory.appendChild(option);
    });
}

ticketForm.addEventListener(
    'submit',
    async (event) => {

        event.preventDefault();

        const {
            data: sessionData,
            error: sessionError
        } =
            await supabaseClient.auth.getSession();

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

        const usuario =
            sessionData.session.user;

        const assunto =
            document
                .getElementById('ticketTitle')
                .value
                .trim();

        const descricao =
            document
                .getElementById('ticketDescription')
                .value
                .trim();

        const prioridade =
            ticketPriority.value;

        const idCategoria =
            ticketCategory.value;

        if (!assunto) {

            alert(
                'Digite um título para o chamado.'
            );

            return;
        }

        if (!idCategoria) {

            alert(
                'Selecione uma categoria para o chamado.'
            );

            return;
        }

        if (!descricao) {

            alert(
                'Descreva o problema antes de enviar.'
            );

            return;
        }

        if (!prioridade) {

            alert(
                'Selecione uma prioridade.'
            );

            return;
        }

        btnEnviarChamado.disabled = true;

        const textoOriginal =
            btnEnviarChamado
                .querySelector('span')
                .textContent;

        btnEnviarChamado
            .querySelector('span')
            .textContent =
            'Enviando...';

        try {

            const chamado = {

                id_usuario:
                    usuario.id,

                id_categoria:
                    idCategoria,

                assunto:
                    assunto,

                descricao:
                    descricao,

                prioridade:
                    prioridade
            };

            const {
                data,
                error
            } =
                await supabaseClient
                    .from('chamados')
                    .insert(chamado)
                    .select()
                    .single();

            if (error) {

                console.error(
                    'Erro ao cadastrar chamado:',
                    error
                );

                alert(
                    'Não foi possível cadastrar o chamado.'
                );

                btnEnviarChamado.disabled =
                    false;

                btnEnviarChamado
                    .querySelector('span')
                    .textContent =
                    textoOriginal;

                return;
            }

            console.log(
                'Chamado cadastrado com sucesso:',
                data
            );

            alert(
                'Chamado aberto com sucesso!'
            );

            window.location.href =
                '../dashboard-chamados/index.html';

        } catch (error) {

            console.error(
                'Erro inesperado:',
                error
            );

            alert(
                'Ocorreu um erro inesperado. Tente novamente.'
            );

            btnEnviarChamado.disabled =
                false;

            btnEnviarChamado
                .querySelector('span')
                .textContent =
                textoOriginal;
        }
    }
);

const dataAbertura = document.getElementById('dataAbertura');

const hoje = new Date();

const dataFormatada =
    hoje.toLocaleDateString('pt-BR');

dataAbertura.innerHTML = `
    <svg fill="none" height="14" stroke="currentColor" stroke-linecap="round"
        stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="14">

        <rect height="18" rx="2" width="18" x="3" y="4"></rect>

        <path d="M16 2v4M8 2v4M3 10h18"></path>

    </svg>

    Automática — ${dataFormatada}
`;

async function iniciarPagina() {

    const usuario =
        await verificarAutenticacao();

    if (!usuario) {
        return;
    }

    await carregarCategorias();
}

iniciarPagina();