const burger = document.getElementById('burger');
const navMenu = document.getElementById('nav-menu');

burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('open');
    document.body.classList.toggle('lock');
});

const menuLink = document.getElementById('nav-menu-link');
if (window.location.pathname.includes('menu.html') && menuLink) {
    menuLink.classList.add('active');
}
