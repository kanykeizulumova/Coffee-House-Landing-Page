const tabs = document.querySelectorAll('.menu-tabs .tab-item');
const menuGrid = document.querySelector('.menu-grid');
const modal = document.getElementById('myModal');
const loadMoreBtn = document.getElementById('load-more');

let catalogData = [];
let currentCategory = 'coffee';

async function loadData() {
    try {
        const response = await fetch('./products.json');
        catalogData = await response.json();
        console.log('Данные загружены');

        filterCards(currentCategory);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

function renderCards(data) {
    if (!menuGrid) return;
    menuGrid.innerHTML = '';

    data.forEach(item => {
        const preview = document.createElement('div');
        preview.classList.add('preview');
        preview.dataset.category = item.category;

        const img = document.createElement('img');
        img.src = `assets/${item.src}`;
        img.alt = item.name;

        const previewDesc = document.createElement('div');
        previewDesc.classList.add('preview-description');

        const title = document.createElement('h3');
        title.classList.add('heading-3');
        title.textContent = item.name;

        const description = document.createElement('p');
        description.classList.add('medium');
        description.textContent = item.description;

        const price = document.createElement('p');
        price.classList.add('heading-3');
        price.textContent = `$${item.price}`;

        previewDesc.append(title, description, price);
        preview.append(img, previewDesc);

        menuGrid.appendChild(preview);
    });

    updateLoadMoreButton(data.length);
}


function filterCards(category) {
    currentCategory = category;
    if (menuGrid) {
        menuGrid.classList.remove('show-all');
    }

    const filtered = catalogData.filter(item => item.category === category);
    renderCards(filtered);
}

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filterValue = tab.dataset.filter;
        filterCards(filterValue);
    });
});

function updateLoadMoreButton(totalItems) {
    if (!loadMoreBtn) return;

    if (totalItems <= 4 || (menuGrid && menuGrid.classList.contains('show-all'))) {
        loadMoreBtn.style.display = 'none';
    } else {
        if (window.innerWidth <= 768) {
            loadMoreBtn.style.display = 'inline-flex';
        } else {
            loadMoreBtn.style.display = 'none';
        }
    }
}

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        if (menuGrid) {
            menuGrid.classList.add('show-all');
        }
        loadMoreBtn.style.display = 'none';
    });
}

window.addEventListener('resize', () => {
    const currentCardsCount = menuGrid ? menuGrid.querySelectorAll('.preview').length : 0;
    updateLoadMoreButton(currentCardsCount);
});

if (menuGrid) {
    menuGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.preview');
        if (!card) return;

        const cardTitle = card.querySelector('h3')?.textContent.trim();
        const foundData = catalogData.find(item => item.name === cardTitle);

        if (foundData) {
            showModal(foundData);
        }
    });
}


function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    document.body.classList.remove('lock');
    document.documentElement.classList.remove('lock');
}

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeModal();
    }
});

window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal && modal.style.display === 'flex') {
        closeModal();
    }
});



loadData();
