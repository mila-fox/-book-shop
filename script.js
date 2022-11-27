const main = document.getElementById('bookshop-app');
let books = [];

function createElement(tag, className) {
    const element = document.createElement(tag);
    element.classList.add(className);
    return element;
}

function start() {
    const logo = createElement('div', 'logo');

    const overlay = createElement('div', 'overlay');

    const clock = createElement("div", 'clock');

    const btnStart = createElement("button", 'btn-enter');
    btnStart.innerHTML = 'TIME &mdash; BOOK';
    btnStart.addEventListener('click', showBooks);

    logo.append(overlay, clock, btnStart);

    main.append(logo);
}

function getBooks() {
    return fetch('./assets/data/books.json').then(response => {
        return response.json();
    });
}

function createCard({ id, author, imageLink, title, price, description }) {
    const card = createElement('li', 'catalog-li');
    const catalogCardBook = createElement('div', 'catalog-card-book');
    const catalogCard = createElement('div', 'catalog-card');
    const catalogCardImg = createElement('div', 'catalog-card-img');
    catalogCardImg.style.backgroundImage = `url('./assets/images/${imageLink}')`;


    const btnShowMore = createElement('button', 'catalog-card-show');
    btnShowMore.innerHTML = 'Show More';
    btnShowMore.setAttribute("data-id", id);
    btnShowMore.addEventListener('click', showMore);

    catalogCardImg.appendChild(btnShowMore);

    const allTitle = createElement('div', 'all-title');
    const elementTitle = createElement('span', 'catalog-card-title');
    elementTitle.innerHTML = title;
    const elementAuthor = createElement('span', 'catalog-card-author');
    elementAuthor.innerHTML = author;
    const cardOrder = createElement('div', 'catalog-card-order');
    const elementPrice = createElement('span', 'catalog-card-price');
    elementPrice.innerHTML = `&#36;${price}`;

    const btnCardAdd = createElement('button', 'catalog-card-add');
    btnCardAdd.innerHTML = 'Add To Bag';

    cardOrder.append(elementPrice, btnCardAdd);

    allTitle.append(elementTitle, elementAuthor);

    catalogCard.append(catalogCardImg, allTitle, cardOrder);

    catalogCardBook.append(catalogCard);

    card.append(catalogCardBook);

    return card;
}

function createCardList() {
    const listCards = createElement('ul', 'list-books');
    const cards = books.map(book => createCard(book))
    listCards.append(...cards);
    return listCards;
}

function clearMain() {
    while (main.firstChild) {
        main.firstChild.remove();
    }
}

async function showBooks() {
    clearMain();
    books = await getBooks();
    const cardlist = createCardList();
    main.appendChild(cardlist);
}

function showMore(e) {
    const windowInnerHeight = document.documentElement.clientHeight
    yOffset = window.pageYOffset;

    const bookId = e.currentTarget.getAttribute('data-id');
    const overlay = createElement('div', 'main-overlay');
    overlay.addEventListener('click', closeDescription);
    const modal = createElement('div', 'show-more-modal');
    modal.style.top = `${yOffset + windowInnerHeight/2}px`;
    const modalTitle = createElement('span', 'modal-title')
    modalTitle.innerHTML = books.find(({ id }) => id == bookId).title
    const bookdescription = createElement('p', 'book-description');
    bookdescription.innerHTML = books.find(({ id }) => id == bookId).description;
    const btnClose = createElement('button', 'description-close');
    const btnImg = createElement('img', 'btn-img');
    btnImg.src = './assets/icons/window_close_icon_135015.svg';
    btnClose.append(btnImg);
    btnClose.addEventListener('click', closeDescription);

    modal.append(btnClose, modalTitle, bookdescription);
    document.body.style.overflow = 'hidden';

    main.append(overlay, modal);

}

function closeDescription() {
    document.body.style.overflow = '';
    const overlay = document.querySelector('.main-overlay');
    const modal = document.querySelector('.show-more-modal');
    modal.remove();
    overlay.remove();
}

start();
