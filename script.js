const main = document.getElementById('bookshop-app');
let books = [];
let cart = new Set();

function createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) {
        element.classList.add(className);
    }
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
    btnShowMore.addEventListener('click', showMore(id));

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
    const cards = books.map(book => createCard(book))
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
    shoppingCart.innerHTML = '0';
    shoppingButton.append(shoppingImg, shoppingCart);
    shoppingButton.addEventListener('click', showCart);

    header.append(shoppingName, shoppingButton);
    return header;
}

function addBookToCart(bookId) {
    return function() {
        const book = books.find(({ id }) => id === bookId);
        cart.add(book);
        const countElement = document.querySelector('.orderquantity');
        countElement.innerHTML = cart.size;
    }
}

async function showBooks() {
    clearMain();
    books = await getBooks();
    const header = createHeader();
    const cardlist = createCardList();
    main.append(header, cardlist);
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

        main.append(overlay, modal);
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

    const orderBtn = createElement('button', 'order-btn');
    orderBtn.innerHTML = 'Confirm';
    orderTotal.append(totalSpan, orderBtn);
    orderBtn.addEventListener('click', showOrderForm);

    order.append(orderName, createOrderList(), orderTotal);
    return order;
}

function deleteBookFromOrder(book) {
    return e => {
        cart.delete(book);
        e.currentTarget.closest('.order-card').remove();
        setOrderSumTotal();
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
    }
}

function createField(id, name, labelName, type, size) {
    const field = createElement('div', 'field');
    const label = createElement('label');
    label.for = id;
    label.innerHTML = labelName;
    const input = createElement('input');
    input.name = name;
    input.id = id;
    input.type = type;
    input.size = size;
    field.append(label, input);
    return field;
}

function createRadio(id, value) {
    const element = createElement('input');
    element.type = 'radio';
    element.Id = id;
    element.name = 'choose';
    element.value = value;
    return element
}

function createLabel(forElement, text) {
    const label = createElement('label');
    label.for = forElement;
    label.innerHTML = text;
    return label;
}

function createFieldGift(value, labelName) {
    const element = createElement('div');
    const input = createElement('input');
    input.type = 'checkbox';
    input.id = value;
    input.name = 'interest';
    input.value = value;
    const label = createElement('label');
    label.for = value;
    label.innerHTML = labelName;
    element.append(input, value);
    return element;
}

function createCheckbox() {
    const checkbox = createElement('fieldset', 'fieldset');

    const checkboxLegend = createElement('legend');
    checkboxLegend.innerHTML = 'Choose 2 gifts: (optional)';

    const giftPack = createFieldGift('pack', 'Pack as a gift');
    const addPostcard = createFieldGift('postcard', 'Add postcard');
    const discount = createFieldGift('discount', 'Provide 2% discount to the next time');
    const branded = createFieldGift('discount', 'Provide 2% discount to the next time');

    checkbox.append(checkboxLegend, giftPack, addPostcard, discount, branded);
    return checkbox;
}

function createFormButton() {
    const formBtn = createElement('button', 'form-btn');
    formBtn.type = 'submit';
    formBtn.value = 'Complete';
    formBtn.innerHTML = 'Submit';
    return formBtn;
}

function createFieldsetPyament() {
    const fieldset = createElement('fieldset', 'fieldset');

    const title = createElement('legend');
    title.innerHTML = 'Choose payment type:';

    const paymentType = createElement('div', 'payment-type');

    const cashInput = createRadio('contactChoice1', 'cash');
    const cashInputLabel = createLabel('contactChoice1', 'Cash');

    const cardInput = createRadio('contactChoice2', 'card');
    const cardInputLabel = createLabel('contactChoice2', 'Card');

    paymentType.append(cashInput, cashInputLabel, cardInput, cardInputLabel);
    fieldset.append(title, paymentType);
    return fieldset;
}

function createFormOrder() {
    const form = createElement('div', 'form');

    const orderName = createElement('h2', 'order-name');
    orderName.innerHTML ='ORDER FORM';

    const formBegin = createElement('form', 'form-begin');

    const fieldName = createField('form-name', 'name', 'Name:', 'text', 40);
    const fieldSurname = createField('form-surname', 'surname', 'Surname:', 'text', 40);
    const fieldDeliveryDate = createField('form-date', 'delivery date', 'Delivery date:', 'date', 10);
    const fieldStreet = createField('form-street', 'street', 'Street:', 'text', 40);
    const fieldHouseNumber = createField('form-number', 'house-number', 'House number:', 'number', 40);
    const fieldFlatNumber = createField('form-number', 'flat-number', 'Flat number:', 'number', 40);

    const fieldset = createFieldsetPyament();

    const checkbox = createCheckbox();

    const formBtn = createFormButton();

    formBegin.append(fieldName, fieldSurname, fieldDeliveryDate, fieldStreet, fieldHouseNumber, fieldFlatNumber, fieldset, checkbox, formBtn);

    form.append(orderName,formBegin);
    return form;
}

function showOrderForm() {
    clearMain();
    main.append(createFormOrder());
}

start();
