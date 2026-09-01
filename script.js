const menu = document.querySelector('.menu');
const mobileNav = document.querySelector('#mobile-nav');
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!open));
  mobileNav.hidden = open;
  mobileNav.classList.toggle('open', !open);
});
mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  mobileNav.hidden = true;
  mobileNav.classList.remove('open');
}));
document.querySelector('#year').textContent = new Date().getFullYear();
