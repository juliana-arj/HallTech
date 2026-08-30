const form = document.querySelector('#forgotPasswordForm');

form.addEventListener('submit', async (event) => {

    event.preventDefault();

    const email = document
        .querySelector('#forgotEmail')
        .value
        .trim();

    const button = document.querySelector('#forgotPasswordButton');

    if (!email) {
        alert('Digite seu e-mail.');
        return;
    }

    button.disabled = true;
    button.textContent = 'Enviando...';

    try {

        const { error } =
            await supabaseClient.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo:
                        `${window.location.origin}/login/nova-senha.html`
                }
            );

        if (error) {

            console.error(
                'Erro ao solicitar recuperação:',
                error
            );

            alert(
                'Não foi possível enviar o e-mail de recuperação. Tente novamente.'
            );

            button.disabled = false;
            button.textContent =
                'Enviar link de recuperação';

            return;
        }

        alert(
            'E-mail de recuperação enviado! Verifique sua caixa de entrada.'
        );

        button.textContent = 'E-mail enviado!';

    } catch (error) {

        console.error(
            'Erro inesperado:',
            error
        );

        alert(
            'Ocorreu um erro inesperado. Tente novamente.'
        );

        button.disabled = false;
        button.textContent =
            'Enviar link de recuperação';
    }

});