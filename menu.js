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

loadData();
