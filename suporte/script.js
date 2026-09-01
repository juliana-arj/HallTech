
const ticketForm = document.getElementById('ticketForm');
const ticketCategory = document.getElementById('ticketCategory');
const btnCancelar = document.getElementById('btn-cancelar');

const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');

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

        const option = document.createElement('option');

        option.value = categoria.id_categoria;
        option.textContent = categoria.nome;

        ticketCategory.appendChild(option);
    });
}

fileInput.addEventListener('change', () => {

    fileList.innerHTML = '';

    const arquivo = fileInput.files[0];

    if (!arquivo) {
        return;
    }

    const tamanhoMaximo = 10 * 1024 * 1024;

    if (arquivo.size > tamanhoMaximo) {

        alert('O arquivo deve ter no máximo 10 MB.');

        fileInput.value = '';

        return;
    }

    const tiposPermitidos = [
        'application/pdf',
        'image/png',
        'image/jpeg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!tiposPermitidos.includes(arquivo.type)) {

        alert(
            'Tipo de arquivo não permitido. ' +
            'Envie PDF, PNG, JPG, JPEG, DOC ou DOCX.'
        );

        fileInput.value = '';

        return;
    }

    const item = document.createElement('div');

    item.classList.add('file-item');

    item.textContent = arquivo.name;

    fileList.appendChild(item);
});

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

    const assunto =
        document.getElementById('ticketTitle').value.trim();

    const descricao =
        document.getElementById('ticketDescription').value.trim();

    const prioridade =
        document.querySelector(
            'input[name="priority"]:checked'
        ).value;

    const idCategoria = ticketCategory.value;

    const arquivo = fileInput.files[0];

    if (!idCategoria) {

        alert('Selecione uma categoria para o chamado.');

        return;
    }

    const submitButton =
        ticketForm.querySelector('button[type="submit"]');

    submitButton.disabled = true;

    submitButton.querySelector('span').textContent =
        'Enviando...';


    try {

        let anexoUrl = null;

        if (arquivo) {

            const extensao =
                arquivo.name
                    .split('.')
                    .pop()
                    .toLowerCase();

            const nomeArquivo =
                `${usuario.id}/${crypto.randomUUID()}.${extensao}`;


            const { error: uploadError } =
                await supabaseClient.storage
                    .from('chamados')
                    .upload(
                        nomeArquivo,
                        arquivo
                    );


            if (uploadError) {

                console.error(
                    'Erro ao enviar anexo:',
                    uploadError
                );

                alert(
                    'Não foi possível enviar o arquivo anexado.'
                );

                submitButton.disabled = false;

                submitButton.querySelector('span').textContent =
                    'Enviar Chamado';

                return;
            }

            const { data: urlData } =
                supabaseClient.storage
                    .from('chamados')
                    .getPublicUrl(nomeArquivo);


            anexoUrl = urlData.publicUrl;
        }

        const chamado = {

            id_usuario: usuario.id,

            id_categoria: idCategoria,

            assunto: assunto,

            descricao: descricao,

            prioridade: prioridade,

            anexo_url: anexoUrl
        };


        const { error: chamadoError } =
            await supabaseClient
                .from('chamados')
                .insert(chamado);

        if (chamadoError) {

            console.error(
                'Erro ao cadastrar chamado:',
                chamadoError
            );

            alert(
                'Não foi possível cadastrar o chamado.'
            );

            submitButton.disabled = false;

            submitButton.querySelector('span').textContent =
                'Enviar Chamado';

            return;
        }

        alert('Chamado aberto com sucesso!');

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

        submitButton.disabled = false;

        submitButton.querySelector('span').textContent =
            'Enviar Chamado';
    }
});

btnCancelar.addEventListener('click', () => {

    window.location.href =
        '../dashboard-chamados/index.html';

});

async function iniciarPagina() {

    const usuario =
        await verificarAutenticacao();

    if (!usuario) {
        return;
    }

    await carregarCategorias();
}

iniciarPagina();