(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const menuLinks = document.querySelectorAll('#site-menu a');
  const year = document.getElementById('year');

  if (year) year.textContent = String(new Date().getFullYear());

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('is-open');
    });

    menuLinks.forEach((link) => {
      link.addEventListener('click', () => {
        menuButton.setAttribute('aria-expanded', 'false');
        nav.classList.remove('is-open');
      });
    });
  }
})();
