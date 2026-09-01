
const form = document.querySelector('#cadastroForm');
const campoDocumento = document.querySelector('#document');
const campoTelefone = document.querySelector('#phone');

campoDocumento.addEventListener('input', () => {

    campoDocumento.value =
        campoDocumento.value.replace(/\D/g, '');

});


campoTelefone.addEventListener('input', () => {

    campoTelefone.value =
        campoTelefone.value.replace(/\D/g, '');

});


function validarCPF(cpf) {

    cpf = cpf.replace(/\D/g, '');

    if (cpf.length !== 11) {
        return false;
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf.charAt(i)) * (10 - i);
    }

    let resto = soma % 11;

    let primeiroDigito =
        resto < 2 ? 0 : 11 - resto;

    if (Number(cpf.charAt(9)) !== primeiroDigito) {
        return false;
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf.charAt(i)) * (11 - i);
    }

    resto = soma % 11;

    let segundoDigito =
        resto < 2 ? 0 : 11 - resto;

    if (Number(cpf.charAt(10)) !== segundoDigito) {
        return false;
    }

    return true;
}

function validarCNPJ(cnpj) {

    cnpj = cnpj.replace(/\D/g, '');

    if (cnpj.length !== 14) {
        return false;
    }

    if (/^(\d)\1{13}$/.test(cnpj)) {
        return false;
    }

    let tamanho = 12;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);

    let soma = 0;
    let posicao = 5;

    for (let i = 0; i < tamanho; i++) {

        soma +=
            Number(numeros.charAt(i)) *
            posicao;

        posicao--;

        if (posicao < 2) {
            posicao = 9;
        }
    }

    let primeiroDigito =
        soma % 11 < 2
            ? 0
            : 11 - (soma % 11);

    numeros += primeiroDigito;

    soma = 0;
    posicao = 6;

    for (let i = 0; i < 13; i++) {

        soma +=
            Number(numeros.charAt(i)) *
            posicao;

        posicao--;

        if (posicao < 2) {
            posicao = 9;
        }
    }

    let segundoDigito =
        soma % 11 < 2
            ? 0
            : 11 - (soma % 11);

    digitos =
        digitos.charAt(0) +
        digitos.charAt(1);

    return (
        primeiroDigito ===
        Number(digitos.charAt(0)) &&
        segundoDigito ===
        Number(digitos.charAt(1))
    );
}

function validarCPFouCNPJ(documento) {

    const numeros =
        documento.replace(/\D/g, '');

    if (numeros.length === 11) {

        return validarCPF(numeros);

    }

    if (numeros.length === 14) {

        return validarCNPJ(numeros);

    }

    return false;
}

function validarTelefone(telefone) {

    const numeros =
        telefone.replace(/\D/g, '');

    if (
        numeros.length !== 10 &&
        numeros.length !== 11
    ) {
        return false;
    }

    const ddd =
        Number(numeros.substring(0, 2));

    if (ddd < 11 || ddd > 99) {
        return false;
    }

    if (
        numeros.length === 11 &&
        numeros.charAt(2) !== '9'
    ) {
        return false;
    }

    if (/^(\d)\1+$/.test(numeros)) {
        return false;
    }

    return true;
}

form.addEventListener('submit', async (event) => {

    event.preventDefault();

    const nomeCompleto =
        document
            .querySelector('#fullName')
            .value
            .trim();

    const cpfCnpjDigitado =
        document
            .querySelector('#document')
            .value
            .trim();

    const email =
        document
            .querySelector('#cadastroEmail')
            .value
            .trim();

    const telefoneDigitado =
        document
            .querySelector('#phone')
            .value
            .trim();

    const senha =
        document
            .querySelector('#cadastroPassword')
            .value;

    const confirmacaoSenha =
        document
            .querySelector('#confirmPassword')
            .value;

    if (nomeCompleto.length < 3) {

        alert(
            'Digite seu nome completo.'
        );

        return;
    }

    if (!validarCPFouCNPJ(cpfCnpjDigitado)) {

        alert(
            'Digite um CPF ou CNPJ válido.'
        );

        return;
    }

    if (!validarTelefone(telefoneDigitado)) {

        alert(
            'Digite um telefone válido com DDD.'
        );

        return;
    }

    if (senha !== confirmacaoSenha) {

        alert(
            'As senhas não coincidem.'
        );

        return;
    }

    if (senha.length < 8) {

        alert(
            'A senha deve possuir pelo menos 8 caracteres.'
        );

        return;
    }

    const cpfCnpj =
        cpfCnpjDigitado.replace(/\D/g, '');

    const telefone =
        telefoneDigitado.replace(/\D/g, '');

    const botao =
        form.querySelector(
            'button[type="submit"]'
        );

    botao.disabled = true;

    botao.textContent =
        'Cadastrando...';

    try {

        const { data, error } =
            await supabaseClient.auth.signUp({

                email: email,

                password: senha,

                options: {

                    data: {

                        nome_completo:
                            nomeCompleto,

                        cpf_cnpj:
                            cpfCnpj,

                        telefone:
                            telefone
                    }
                }
            });

        if (error) {

            console.error(
                'Erro no cadastro:',
                error
            );

            if (
                error.message
                    .toLowerCase()
                    .includes('usuarios_cpf_cnpj_key')
            ) {

                alert(
                    'Este CPF ou CNPJ já está cadastrado.'
                );

            } else {

                alert(
                    'Não foi possível realizar o cadastro: ' +
                    error.message
                );
            }


            botao.disabled = false;

            botao.textContent =
                'Cadastrar';

            return;
        }

        alert(
            'Cadastro realizado com sucesso! ' +
            'Verifique seu e-mail para confirmar a conta.'
        );


        window.location.href =
            '../login/index.html';


    } catch (error) {

        console.error(
            'Erro inesperado:',
            error
        );


        alert(
            'Ocorreu um erro inesperado. Tente novamente.'
        );


        botao.disabled = false;

        botao.textContent =
            'Cadastrar';
    }

});
