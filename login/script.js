const form = document.querySelector('#loginForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.querySelector('#loginEmail').value.trim();
    const senha = document.querySelector('#loginPassword').value;

    if (!email || !senha) {
        alert('Preencha o e-mail e a senha.');
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password: senha
        });

        if (error) {
            console.error('Erro no login:', error);
            alert('Não foi possível realizar o login: ' + error.message);
            return;
        }

        const { data: usuario, error: erroUsuario } = await supabaseClient
            .from('usuarios')
            .select('id_perfil')
            .eq('id_usuario', data.user.id)
            .single();

        if (erroUsuario || !usuario) {
            console.error('Erro ao consultar usuário:', erroUsuario);
            alert('Não foi possível identificar o perfil do usuário.');
            await supabaseClient.auth.signOut();
            return;
        }

        const ID_PERFIL_ADMIN = 'COLOQUE_AQUI_O_ID_DO_PERFIL_ADMINISTRADOR';

        if (usuario.id_perfil === "e987ee31-64a3-4560-b56f-844b3b6f52e0") {
            window.location.href = '../dashboard_admin/dashboard-admin/index.html';
        } else {
            window.location.href = '../landing/landingPage/index.html';
        }
    } catch (error) {
        console.error('Erro inesperado:', error);
        alert('Ocorreu um erro inesperado. Tente novamente.');
    }
});