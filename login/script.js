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
            email: email,
            password: senha
        });

        if (error) {
            console.error('Erro no login:', error);

            alert(
                'Não foi possível realizar o login: ' +
                error.message
            );

            return;
        }

        console.log('Login realizado:', data);

        alert('Login realizado com sucesso!');

        window.location.href = '../landingPage/index.html';

    } catch (error) {

        console.error('Erro inesperado:', error);

        alert(
            'Ocorreu um erro inesperado. Tente novamente.'
        );
    }
});