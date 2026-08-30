const authButton = document.querySelector('#auth-button');
const headerActions = document.querySelector('#header-actions');
const profileButton = document.querySelector('#profile-button');
const logoutButton = document.querySelector('#logout-button');

async function verificarSessao() {

    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error('Erro ao verificar sessão:', error);
        return;
    }

    if (data.session) {

        if (authButton) {
            authButton.style.display = 'none';
        }

        if (headerActions) {
            headerActions.style.display = 'flex';
        }

    } else {

        console.log('Nenhum usuário está logado.');

        if (authButton) {
            authButton.style.display = 'flex';
        }

        if (headerActions) {
            headerActions.style.display = 'none';
        }
    }
}

verificarSessao();

async function protegerPagina() {

    const { data, error } = await supabaseClient.auth.getSession();

    if (error) {
        console.error('Erro ao verificar autenticação:', error);
        return;
    }

    if (!data.session) {

        window.location.href = '../login/index.html';
        return;
    }
}

if (logoutButton) { 

    logoutButton.addEventListener('click', async () => {

        const { error } = await supabaseClient.auth.signOut();

        if (error) {

            alert('Não foi possível sair da conta.');

            return;
        }

        window.location.href = '../login/index.html';
    });
}

const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');

if (menuToggle && mainNav) {

    menuToggle.addEventListener('click', () => {

        mainNav.classList.toggle('nav-open');

        menuToggle.classList.toggle('is-active');

    });

    mainNav.querySelectorAll('.nav-link').forEach((link) => {

        link.addEventListener('click', () => {

            mainNav.classList.remove('nav-open');

            menuToggle.classList.remove('is-active');

        });

    });

}