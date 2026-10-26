const authButton = document.querySelector('#auth-button');
const headerActions = document.querySelector('#header-actions');
const profileButton = document.querySelector('#profile-button');
const logoutButton = document.querySelector('#logout-button');

async function verificarSessao() {
   const authButton = $('ht-auth-button');
   const headerActions = $('ht-actions');

   if (!authButton || !headerActions) return;

   header.dataset.auth = 'loading';

   const client = await getSupabase();

   if (!client) {
      applySession(localStorage.getItem('halltechLoggedIn') === 'true' ? { user: {} } : null);
      return;
   }

   try {
      const { data, error } = await client.auth.getSession();

      if (error) throw error;

      applySession(data.session);

      client.auth.onAuthStateChange((_event, session) => {
         applySession(session);
      });
   } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      applySession(null);
   }
}

function applySession(session) {
   const authButton = $('ht-auth-button');
   const headerActions = $('ht-actions');
   const loggedIn = Boolean(session);
   const user = session?.user;
   const email = user?.email || '';
   const metadata = user?.user_metadata || {};
   const fullName = (metadata.full_name || metadata.name || metadata.nome || '').trim();
   const firstName = fullName ? fullName.split(/\s+/)[0] : (email ? email.split('@')[0] : 'Minha conta');

   header.dataset.auth = loggedIn ? 'in' : 'out';
   document.body.classList.toggle('logged-in', loggedIn);

   if (authButton) authButton.style.display = loggedIn ? 'none' : 'flex';
   if (headerActions) headerActions.style.display = loggedIn ? 'flex' : 'none';

   $('ht-profile-name').textContent = firstName || 'Minha conta';
   $('ht-profile-email').textContent = email || 'Cliente HallTech';
   $('ht-profile-avatar').textContent = (firstName || 'HT').slice(0, 2).toUpperCase();

   if (!loggedIn) {
      closeOverlay();
      closeProfile();
   }
}

$('ht-logout-button').addEventListener('click', async () => {
   const client = await getSupabase();

   try {
      localStorage.removeItem('halltechLoggedIn');

      if (client) {
         const { error } = await client.auth.signOut();

         if (error) throw error;
      }

      window.location.href = ROUTES.login;
   } catch (error) {
      console.error('Erro ao encerrar sessão:', error);
      alert('Não foi possível sair da conta.');
   }
});

verificarSessao();

if (logoutButton) {

   logoutButton.addEventListener('click', async () => {

      const { error } = await supabaseClient.auth.signOut();

      if (error) {

         alert('Não foi possível sair da conta.');

         return;
      }

      window.location.href = '../../login/index.html';
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