const burger = document.getElementById('burger');
const navMenu = document.getElementById('nav-menu');

if (burger && navMenu) {
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.classList.toggle('lock');
    });
}

const menuLink = document.getElementById('nav-menu-link');
if (window.location.pathname.includes('menu.html') && menuLink) {
    menuLink.classList.add('active');
}

const toggleButtons = document.querySelectorAll('#theme-toggle');
const htmlElement = document.documentElement;

const savedTheme = localStorage.getItem('theme');
const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const isDark = savedTheme === 'dark' || (!savedTheme && systemDark);

function applyTheme(dark) {
    if (dark) {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }

    toggleButtons.forEach(btn => {
        btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
        btn.setAttribute('title', dark ? 'Switch to light theme' : 'Switch to dark theme');
    });
}

applyTheme(isDark);

toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const currentlyDark = htmlElement.classList.contains('dark');
        const nextDark = !currentlyDark;
        applyTheme(nextDark);
        localStorage.setItem('theme', nextDark ? 'dark' : 'light');
    });
});

