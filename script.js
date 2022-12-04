const main = document.getElementById('bookshop-app');
let books = [];
let cart = null;
const queryString = window.location.search;

const logoFromQuery = new URLSearchParams(queryString).get('logo');
let logo;
switch (logoFromQuery) {
    case "true":
        logo = true;
        break;
    case "false":
    default:
        logo = false;
        break;
}
const startWithLogo = logoFromQuery === null ? true : logo;

function createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) {
        element.classList.add(className);
    }
    return element;
}

function getCart() {
    const cart = JSON.parse(window.localStorage.getItem('cart'));
    return new Set(cart) || new Set();
}

async function start() {
    cart = getCart();
    books = await getBooks();

    if (!startWithLogo) {
        showBooks();
    } else {
        const logo = createElement('div', 'logo');

        const overlay = createElement('div', 'overlay');

        const clock = createElement("div", 'clock');

        const btnStart = createElement("button", 'btn-enter');
        btnStart.innerHTML = 'TIME &mdash; BOOK';
        btnStart.addEventListener('click', showBooks);

        logo.append(overlay, clock, btnStart);

        main.append(logo);
    }
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
    btnShowMore.addEventListener('click', showMore(id));

    catalogCardImg.append(btnShowMore);

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
    btnCardAdd.addEventListener('click', addBookToCart(id));

    cardOrder.append(elementPrice, btnCardAdd);

    allTitle.append(elementTitle, elementAuthor);

    catalogCard.append(catalogCardImg, allTitle, cardOrder);

    catalogCardBook.append(catalogCard);

    card.append(catalogCardBook);

    return card;
}

function createCardList() {
    const listCards = createElement('ul', 'list-books');
    const cards = books.map(book => createCard(book));
    listCards.append(...cards);
    return listCards;
}

function clearMain() {
    while (main.firstChild) {
        main.firstChild.remove();
    }
}

function createHeader() {
    const header = createElement('div', 'book-shop');

    const shoppingName = createElement('h2', 'shopping-name');
    shoppingName.innerHTML = 'BOOK CATALOG';

    const shoppingButton = createElement('button', 'shopping-button');
    const shoppingImg = createElement('div', 'shoppinimg');
    const shoppingCart = createElement('span', 'orderquantity');
    shoppingCart.innerHTML = cart.size;
    shoppingButton.append(shoppingImg, shoppingCart);
    shoppingButton.addEventListener('click', showCart);

    header.append(shoppingName, shoppingButton);
    return header;
}

function updateStorage() {
    window.localStorage.setItem('cart', JSON.stringify(Array.from(cart.keys())));
}

function addBookToCart(bookId) {
    return function() {
        const isBookInCart = Array.from(cart.keys()).find(({ id }) => id === bookId);
        if (!isBookInCart) {
            const book = books.find(({ id }) => id === bookId);
            cart.add(book);
            const countElement = document.querySelector('.orderquantity');
            countElement.innerHTML = cart.size;
            updateStorage();
        }
    }
}

function showBooks() {
    clearMain();
    const content = new DocumentFragment();
    const header = createHeader();
    const cardlist = createCardList();
    content.append(header, cardlist);
    main.append(content);
}

function showMore(currentId) {
    return function() {
        const windowInnerHeight = document.documentElement.clientHeight
        yOffset = window.pageYOffset;

        const book = books.find(({ id }) => id == currentId);
        const overlay = createElement('div', 'main-overlay');
        overlay.addEventListener('click', closeDescription);

        const modal = createElement('div', 'show-more-modal');
        modal.style.top = `${yOffset + windowInnerHeight/2}px`;
        const modalTitle = createElement('span', 'modal-title')

        modalTitle.innerHTML = book.title
        const bookdescription = createElement('p', 'book-description');
        bookdescription.innerHTML = book.description;

        const btnClose = createElement('button', 'description-close');

        const btnImg = createElement('img', 'btn-img');
        btnImg.src = './assets/icons/window_close_icon_135015.svg';

        btnClose.append(btnImg);
        btnClose.addEventListener('click', closeDescription);

        modal.append(btnClose, modalTitle, bookdescription);
        document.body.style.overflow = 'hidden';

        const content = new DocumentFragment();
        content.append(overlay, modal)

        main.append(content);
    }
}

function closeDescription() {
    document.body.style.overflow = '';
    const overlay = document.querySelector('.main-overlay');
    const modal = document.querySelector('.show-more-modal');
    modal.remove();
    overlay.remove();
}


function orderBooks() {
    const btnClose = createElement('button', 'description-close');
    const btnImg = createElement('img', 'btn-img');
    btnImg.src = './assets/icons/window_close_icon_135015.svg';
}

function getOrderTotalSum() {
    return Array.from(cart.keys()).reduce((sum, { price }) => sum += price, 0);
}

function setOrderSumTotal() {
    const orderTotal = document.querySelector('.order-total span');
    orderTotal.innerHTML = `Total: $${getOrderTotalSum()}`;
}

function order() {
    const order = createElement('div', 'order');
    const orderName = createElement('h2','order-name');
    orderName.innerHTML = 'ORDER BOOKS';

    const orderTotal = createElement('div', 'order-total');
    const totalSpan = createElement('span');
    totalSpan.innerHTML = `Total: $${getOrderTotalSum()}`;

    const wrapperBtn = createElement('div', 'order-wrapper-btn');

    const cancelBtn = createElement('button', 'order-btn-cancel');
    cancelBtn.innerHTML = 'Cancel';
    cancelBtn.addEventListener('click', showBooks);

    const orderBtn = createElement('button', 'order-btn');
    orderBtn.innerHTML = 'Confirm';
    orderBtn.addEventListener('click', showOrderForm);

    wrapperBtn.append(orderBtn, cancelBtn);

    orderTotal.append(totalSpan, wrapperBtn);

    order.append(orderName, createOrderList(), orderTotal);
    return order;
}

function deleteBookFromOrder(book) {
    return e => {
        cart.delete(book);
        e.currentTarget.closest('.order-card').remove();
        setOrderSumTotal();
        updateStorage();
        if (!cart.size) {
            const btnShoeOrder = document.querySelector('.order-btn');
            btnShoeOrder.disabled = true;
        }
    }
}

function createOrder(book) {
    const { id, author, imageLink, title, price } = book;
    const card = createElement('li', 'order-card');

    const orderImg = createElement('img', 'order-img');
    orderImg.src = `./assets/images/${imageLink}`;

    const orderBook = createElement('div', "order-book");

    const orderAuthor = createElement('span', 'order-author');
    orderAuthor.innerHTML = author;

    const orderTitle = createElement('span', 'order-title');
    orderTitle.innerHTML = title;

    const orderPrice = createElement('span', 'order-price');
    orderPrice.innerHTML = `$${price}`;

    const orderCloseBtn = createElement('button', 'order-close');
    orderCloseBtn.addEventListener('click', deleteBookFromOrder(book));
    const orderCloseImg = createElement('img', 'order-close-img');
    orderCloseImg.src = './assets/icons/window_close_icon_135015.svg';
    orderCloseBtn.append(orderCloseImg);

    orderBook.append(orderAuthor, orderTitle, orderPrice);
    card.append(orderImg, orderBook, orderCloseBtn);

    return card;
}

function createOrderList() {
    const orderListCards = createElement('ul');
    const cards = Array.from(cart.keys()).map(book => createOrder(book))
    orderListCards.append(...cards);
    return orderListCards;
}

function showCart() {
    if (cart.size) {
        clearMain();
        main.append(order());
        window.scrollTo(0, 0);
    }
}

function showOrderForm() {
    window.location.href = "./order.html";
}

start();
