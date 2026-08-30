const form = document.querySelector('#cadastroForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const nomeCompleto = document.querySelector('#fullName').value.trim();
    const cpfCnpj = document.querySelector('#document').value.trim();
    const email = document.querySelector('#cadastroEmail').value.trim();
    const telefone = document.querySelector('#phone').value.trim();
    const senha = document.querySelector('#cadastroPassword').value;
    const confirmacaoSenha = document.querySelector('#confirmPassword').value;

    if (senha !== confirmacaoSenha) {
        alert('As senhas não coincidem.');
        return;
    }

    if (senha.length < 8) {
        alert('A senha deve possuir pelo menos 8 caracteres.');
        return;
    }

    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: senha,

            options: {
                data: {
                    nome_completo: nomeCompleto,
                    cpf_cnpj: cpfCnpj,
                    telefone: telefone
                }
            }
        });

        if (error) {
            console.error('Erro no cadastro:', error);

            alert(
                'Não foi possível realizar o cadastro: ' +
                error.message
            );

            return;
        }

        alert(
            'Cadastro realizado com sucesso! ' +
            'Verifique seu e-mail para confirmar a conta.'
        );

        window.location.href = '../login/index.html';

    } catch (error) {
        console.error('Erro inesperado:', error);

        alert('Ocorreu um erro inesperado. Tente novamente.');
    }
});