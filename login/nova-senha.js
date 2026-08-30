const form = document.querySelector('#newPasswordForm');

form.addEventListener('submit', async (event) => {

    event.preventDefault();

    const novaSenha =
        document.querySelector('#newPassword').value;

    const confirmarSenha =
        document.querySelector('#confirmPassword').value;

    const button =
        document.querySelector('#newPasswordButton');

    if (novaSenha !== confirmarSenha) {

        alert('As senhas não coincidem.');
        return;

    }

    if (novaSenha.length < 6) {

        alert('A senha deve possuir pelo menos 6 caracteres.');
        return;

    }

    button.disabled = true;
    button.textContent = 'Alterando...';

    try {

        const { error } =
            await supabaseClient.auth.updateUser({
                password: novaSenha
            });


        if (error) {

            console.error(
                'Erro ao alterar senha:',
                error
            );

            alert(
                'Não foi possível alterar sua senha. O link pode ter expirado.'
            );

            button.disabled = false;
            button.textContent = 'Alterar senha';

            return;
        }


        console.log('Senha alterada com sucesso!');

        alert(
            'Senha alterada com sucesso! Você será redirecionado para o login.'
        );

        await supabaseClient.auth.signOut();
        window.location.href = 'index.html';


    } catch (error) {

        console.error(
            'Erro inesperado:',
            error
        );

        alert(
            'Ocorreu um erro inesperado. Tente novamente.'
        );

        button.disabled = false;
        button.textContent = 'Alterar senha';

    }

});