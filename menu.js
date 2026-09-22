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

function showModal(item) {
    if (!modal) return;

    const modalContent = modal.querySelector('.modal-content');
    if (!modalContent) return;

    const basePrice = parseFloat(item.price);
    let sizeAddPrice = 0;
    let additivesAddPrice = 0;

    modalContent.innerHTML = '';

    const imageCard = document.createElement('div');
    imageCard.classList.add('image-card');

    const img = document.createElement('img');
    img.id = 'modal-img';
    img.src = `assets/${item.src}`;
    img.alt = item.name;
    imageCard.appendChild(img);

    const menuDescription = document.createElement('div');
    menuDescription.classList.add('menu-description');
    menuDescription.id = 'description';

    const menuTitle = document.createElement('div');
    menuTitle.classList.add('menu-title');

    const h3Title = document.createElement('h3');
    h3Title.classList.add('heading-3');
    h3Title.textContent = item.name;

    const pDescription = document.createElement('p');
    pDescription.classList.add('medium');
    pDescription.textContent = item.description;

    menuTitle.append(h3Title, pDescription);
    menuDescription.appendChild(menuTitle);

    if (item.sizes) {
        const menuSize = document.createElement('div');
        menuSize.classList.add('menu-size');

        const pSizeTitle = document.createElement('p');
        pSizeTitle.classList.add('medium');
        pSizeTitle.textContent = 'Size';

        const tabsSizeContainer = document.createElement('div');
        tabsSizeContainer.classList.add('modal-tabs-size');

        Object.entries(item.sizes).forEach(([key, value], index) => {
            const tabItem = document.createElement('div');
            tabItem.classList.add('tab-item-modal');
            tabItem.setAttribute('data-size', key);
            tabItem.setAttribute('data-add-price', value['add-price']);

            if (index === 0) {
                tabItem.classList.add('active');
                sizeAddPrice = parseFloat(value['add-price']) || 0;
            }

            const spanKey = document.createElement('span');
            spanKey.textContent = key.toUpperCase();

            const spanValue = document.createElement('span');
            spanValue.textContent = value.size;

            tabItem.append(spanKey, spanValue);

            tabItem.addEventListener('click', () => {
                tabsSizeContainer.querySelectorAll('.tab-item-modal').forEach(t => t.classList.remove('active'));
                tabItem.classList.add('active');
                sizeAddPrice = parseFloat(value['add-price']) || 0;
                updateTotalPrice();
            });

            tabsSizeContainer.appendChild(tabItem);
        });

        menuSize.append(pSizeTitle, tabsSizeContainer);
        menuDescription.appendChild(menuSize);
    }

    if (Array.isArray(item.additives)) {
        const menuAdditives = document.createElement('div');
        menuAdditives.classList.add('menu-additives');

        const pAdditivesTitle = document.createElement('p');
        pAdditivesTitle.classList.add('medium');
        pAdditivesTitle.textContent = 'Additives';

        const tabsAdditivesContainer = document.createElement('div');
        tabsAdditivesContainer.classList.add('modal-tabs-additives');

        item.additives.forEach((additive, index) => {
            const tabItem = document.createElement('div');
            tabItem.classList.add('tab-item-modal');
            tabItem.setAttribute('data-additive', additive.name);
            tabItem.setAttribute('data-add-price', additive['add-price']);

            const spanIndex = document.createElement('span');
            spanIndex.textContent = index + 1;

            const spanName = document.createElement('span');
            spanName.textContent = additive.name;

            tabItem.append(spanIndex, spanName);

            tabItem.addEventListener('click', () => {
                tabItem.classList.toggle('active');

                let currentAdditivesTotal = 0;
                tabsAdditivesContainer.querySelectorAll('.tab-item-modal.active').forEach(activeTab => {
                    currentAdditivesTotal += parseFloat(activeTab.getAttribute('data-add-price')) || 0;
                });
                additivesAddPrice = currentAdditivesTotal;
                updateTotalPrice();
            });

            tabsAdditivesContainer.appendChild(tabItem);
        });

        menuAdditives.append(pAdditivesTitle, tabsAdditivesContainer);
        menuDescription.appendChild(menuAdditives);
    }

    const modalTotal = document.createElement('div');
    modalTotal.classList.add('modal-total');

    const pTotalTitle = document.createElement('p');
    pTotalTitle.classList.add('heading-3');
    pTotalTitle.textContent = 'Total:';

    const pTotalPrice = document.createElement('p');
    pTotalPrice.classList.add('heading-3');
    pTotalPrice.id = 'modal-total-price';

    function updateTotalPrice() {
        const total = basePrice + sizeAddPrice + additivesAddPrice;
        pTotalPrice.textContent = `$${total.toFixed(2)}`;
    }
    updateTotalPrice();

    modalTotal.append(pTotalTitle, pTotalPrice);
    menuDescription.appendChild(modalTotal);

    const modalAlert = document.createElement('div');
    modalAlert.classList.add('modal-alert');

    const alertImg = document.createElement('img');
    alertImg.src = 'assets/info-empty.svg';
    alertImg.alt = 'info';

    const pAlertText = document.createElement('p');
    pAlertText.classList.add('caption');
    pAlertText.textContent = 'The cost is not final. Download our mobile app to see the final price and place your order. Earn loyalty points and enjoy your favorite coffee with up to 20% discount.';

    modalAlert.append(alertImg, pAlertText);
    menuDescription.appendChild(modalAlert);

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.classList.add('button-secondary', 'modal-close-btn');
    closeBtn.id = 'close';
    closeBtn.textContent = 'Close';
    closeBtn.addEventListener('click', closeModal);
    menuDescription.appendChild(closeBtn);

    modalContent.append(imageCard, menuDescription);

    modal.style.display = 'flex';
    document.body.classList.add('lock');
    document.documentElement.classList.add('lock');
}


loadData();
