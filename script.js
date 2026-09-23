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

const inner = document.querySelector('.row-slider');
const slider = document.querySelector('.slider');
const prevBtn = document.querySelector('.left');
const nextBtn = document.querySelector('.right');
const controls = document.querySelectorAll('.controls .control');

if (inner && prevBtn && nextBtn) {
    const items = inner.querySelectorAll('.slider-content');
    let currentIndex = 0;
    const maxIndex = items.length - 1;

    function updateCarousel() {
        if (items.length === 0) return;

        items.forEach(item => {
            item.style.transform = `translateX(-${currentIndex * 100}%)`;
        });

        controls.forEach((control, index) => {
            control.classList.toggle('active', index === currentIndex);
        });
    }

    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
        } else {
            currentIndex = maxIndex;
        }
        updateCarousel();
    });

    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 40;

    slider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const items = inner.querySelectorAll('.slider-content');
        const swipeDistance = touchEndX - touchStartX;
        let currentIndex = 0;
        const maxIndex = items.length - 1;

        if (swipeDistance < -swipeThreshold) {
            currentIndex = (currentIndex < maxIndex) ? currentIndex + 1 : 0;
            updateCarousel();
        }
        else if (swipeDistance > swipeThreshold) {
            currentIndex = (currentIndex > 0) ? currentIndex - 1 : maxIndex;
            updateCarousel();
        }
    }

}

