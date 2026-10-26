/* Carrega o rodapé compartilhado em todas as páginas. Requer servidor HTTP (não file://). */
(() => {
  const currentScript = document.currentScript;
  if (!currentScript) return;
  const rootUrl = new URL('.', currentScript.src);
  const cssUrl = new URL('global.css', rootUrl);
  const footerUrl = new URL('footer.html', rootUrl);

  if (!document.querySelector('link[data-halltech-global-css], link[href$="global.css"]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = cssUrl.href;
    css.dataset.halltechGlobalCss = 'true';
    document.head.appendChild(css);
  }

  const mountFooter = async () => {
    // Remove rodapés antigos/temporários para garantir que todas as páginas
    // usem exatamente o mesmo footer.html compartilhado.
    document.querySelectorAll('.site-footer').forEach(existingFooter => existingFooter.remove());
    const response = await fetch(footerUrl.href);
    if (!response.ok) throw new Error(`Não foi possível carregar o rodapé (${response.status}).`);
    const html = await response.text();
    const mount = document.createElement('div');
    mount.innerHTML = html.trim();
    const footer = mount.querySelector('.site-footer');
    if (!footer) throw new Error('O arquivo footer.html não contém .site-footer.');

    footer.querySelectorAll('[data-href]').forEach(link => {
      const path = link.getAttribute('data-href');
      link.setAttribute('href', path === '#' ? '#' : new URL(path, rootUrl).href);
    });
    footer.querySelectorAll('[data-asset]').forEach(asset => {
      asset.setAttribute('src', new URL(asset.dataset.asset, rootUrl).href);
    });
    const year = footer.querySelector('.footer-year');
    if (year) year.textContent = String(new Date().getFullYear());

    const main = document.querySelector('main');
    if (main) main.insertAdjacentElement('afterend', footer);
    else document.body.appendChild(footer);

    const form = footer.querySelector('.footer-newsletter-form');
    if (form) form.addEventListener('submit', event => {
      event.preventDefault();
      alert('Inscrito com sucesso!');
      form.reset();
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => mountFooter().catch(console.error), { once: true });
  } else {
    mountFooter().catch(console.error);
  }
})();
