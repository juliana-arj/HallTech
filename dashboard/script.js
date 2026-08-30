
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacao();
});

async function verificarAutenticacao() {

    try {

        const {
            data,
            error
        } = await supabaseClient.auth.getSession();

        if (error) {
            console.error('Erro ao verificar sessão:', error);
            window.location.href = '../login/index.html';
            return;
        }

        if (!data.session) {
            window.location.href = '../login/index.html';
            return;
        }
        carregarPerfilNavbar(data.session.user.id);

        carregarEstatisticasChamados(data.session.user.id);

    } catch (erro) {

        console.error('Erro inesperado na autenticação:', erro);

    }
}

async function carregarEstatisticasChamados(userId) {

    try {

        const {
            data: chamados,
            error
        } = await supabaseClient
            .from('chamados')
            .select('id_chamado, id_usuario, status')
            .eq('id_usuario', userId);

        if (error) {

            console.error('Erro ao buscar chamados:', error);
            return;

        }

        if (!chamados) {

            console.log('Nenhum dado retornado.');
            return;

        }

        const chamadosAbertos = chamados.filter(chamado => {

            return chamado.status &&
                chamado.status.trim().toLowerCase() === 'aberto';

        });

        const elemento = document.getElementById(
            'totalChamadosAbertos'
        );

        if (elemento) {

            elemento.textContent = chamadosAbertos.length;

        } else {

            console.error(
                'Elemento #totalChamadosAbertos não foi encontrado no HTML.'
            );

        }

    } catch (erro) {

        console.error(
            'Erro inesperado ao carregar estatísticas:',
            erro
        );

    }
}

async function carregarPerfilNavbar(userId) {

    try {

        const {
            data: usuario,
            error
        } = await supabaseClient
            .from('usuarios')
            .select('nome_completo, data_cadastro')
            .eq('id_usuario', userId)
            .single();

        if (error) {

            console.error(
                'Erro ao buscar dados do usuário:',
                error
            );

            return;
        }

        if (!usuario) {

            console.error(
                'Usuário não encontrado na tabela usuarios.'
            );

            return;
        }

        const nomeCompleto = usuario.nome_completo || 'Usuário';


        const partesNome = nomeCompleto
            .trim()
            .split(/\s+/);

        let iniciais = partesNome[0]
            .charAt(0)
            .toUpperCase();

        if (partesNome.length > 1) {

            iniciais += partesNome[partesNome.length - 1]
                .charAt(0)
                .toUpperCase();

        }

        let textoDataCadastro = 'Cliente desde';

        if (usuario.data_cadastro) {

            const dataCadastro = new Date(
                usuario.data_cadastro
            );

            const mes = dataCadastro.toLocaleDateString(
                'pt-BR',
                {
                    month: 'short'
                }
            );

            const ano = dataCadastro.getFullYear();

            const mesFormatado =
                mes.charAt(0).toUpperCase() +
                mes.slice(1);

            textoDataCadastro =
                `Cliente desde ${mesFormatado}/${ano}`;

        }

        const avatar =
            document.getElementById('userAvatar');

        if (avatar) {

            avatar.textContent = iniciais;

        }

        const elementoNome =
            document.getElementById('userName');

        if (elementoNome) {

            elementoNome.textContent = nomeCompleto;

        }
        
        const elementoData =
            document.getElementById('userSince');

        if (elementoData) {

            elementoData.textContent =
                textoDataCadastro;

        }

    } catch (erro) {

        console.error(
            'Erro inesperado ao carregar perfil:',
            erro
        );

    }
}

async function carregarUltimosChamados() {

    const {
        data: { user },
        error: authError
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
        console.error('Erro ao obter usuário:', authError);
        return;
    }

    const { data: chamados, error } = await supabaseClient
        .from('chamados')
        .select('numero_chamado, assunto, status, data_abertura')
        .eq('id_usuario', user.id)
        .order('data_abertura', { ascending: false })
        .limit(4);

    if (error) {
        console.error('Erro ao buscar últimos chamados:', error);
        return;
    }

    const container = document.getElementById('ultimosChamados');

    if (!container) {
        console.error('Elemento #ultimosChamados não encontrado no HTML.');
        return;
    }

    if (!chamados || chamados.length === 0) {

        container.innerHTML = `
            <div class="ticket-empty">
                <p>Você ainda não possui chamados.</p>
            </div>
        `;

        return;
    }

    container.innerHTML = chamados.map(chamado => {

        const data = new Date(chamado.data_abertura);

        const dataFormatada = data.toLocaleDateString('pt-BR');

        let statusTexto = '';
        let statusClasse = '';

        switch (chamado.status) {

            case 'aberto':
                statusTexto = 'Aberto';
                statusClasse = 'status-aberto';
                break;

            case 'em_andamento':
                statusTexto = 'Em andamento';
                statusClasse = 'status-andamento';
                break;

            case 'resolvido':
                statusTexto = 'Resolvido';
                statusClasse = 'status-resolvido';
                break;

            case 'fechado':
                statusTexto = 'Fechado';
                statusClasse = 'status-fechado';
                break;

            default:
                statusTexto = chamado.status;
                statusClasse = '';
        }

        return `
            <div class="ticket-item">

                <div class="ticket-info">

                    <strong>#${chamado.numero_chamado}</strong>

                    <p>${chamado.assunto}</p>

                    <span>${dataFormatada}</span>

                </div>

                <span class="status-badge ${statusClasse}">
                    ${statusTexto}
                </span>

            </div>
        `;

    }).join('');

    console.log('Últimos chamados:', chamados);
}

supabaseClient.auth.onAuthStateChange((event, session) => {

    if (!session) {

        window.location.href = '../login/index.html';

    }

});

carregarUltimosChamados();