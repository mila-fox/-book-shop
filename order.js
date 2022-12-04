function refreshBtnSubmit() {
    const btn = document.querySelector('.form-btn');
    if (!errors.size) {
        btn.removeAttribute("disabled");
    }
}

function validateField(field, isValid) {
    return function(e) {
        const value = field.value.trim();
        field.value = value;
        const wrapper = e.currentTarget.closest('.field');

        if (!isValid(value)) {
            wrapper.classList.add('error');
            errors.add(field.id);
        } else {
            wrapper.classList.remove('error');
            errors.delete(field.id);
        }
        refreshBtnSubmit();
    }
}

function validateName(value) {
    return value.length >= 4 && /^[A-ZА-ЯЁ]+$/i.test(value);
}

function validateSurname(value) {
    return value.length >= 5 && /^[A-ZА-ЯЁ]+$/i.test(value);
}

function getTomorrow() {
    const today = new Date();
    today.setHours(0,0,0,0);
    let tomorrow =  new Date();
    tomorrow.setHours(0,0,0,0);
    tomorrow.setDate(today.getDate() + 1);
    return tomorrow;
}

function validateDate(date) {
    const value = new Date(date);
    const tomorrow = getTomorrow();
    return value >= tomorrow;
}

function getDateForInput(date) {
    day = date.getDate(),
    month = date.getMonth() + 1,
    year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    return `${year}-${month}-${day}`;
}

function validateSstreet(value) {
    return value.length >= 5;
}

function validateNumber(value) {
    return !!value.length && /^[1-9][0-9]*$/.test(value);
}

function validateFlat(value) {
    return !!value.length && /^[1-9]\d*(-\d{1,}){0,1}$/.test(value);
}

function disableRestGifts() {
    const gifts = document.querySelectorAll('.gifts input');
    gifts.forEach(gift => {
        if (!gift.checked) {
            gift.disabled = true;
        }
    });
}

function enableRestGifts() {
    const gifts = document.querySelectorAll('.gifts input');
    gifts.forEach(gift => {
        gift.disabled = false;
    });
}

function checkGifts(e) {
    const checked = e.currentTarget.checked;
    if (checked) {
        countGifts += 1;
        if (countGifts == 2) {
            disableRestGifts();
        }
    } else {
        if (countGifts == 2) {
           enableRestGifts();
        }
        countGifts -= 1;
    }
}

function addEventForGifts() {
    const gifts = document.querySelectorAll('.gifts input');
    gifts.forEach(gift => {
        gift.addEventListener('click', checkGifts)
    });
}


function getOrderTotalSum() {
    return Array.from(cart.keys()).reduce((sum, { price }) => sum += price, 0);
}

function clearLocalStorage() {
    localStorage.clear();
}

function showDelivery(e) {
    e.preventDefault();

    const formElement = document.querySelector('.form-begin');
    const formData = new FormData(formElement);

    formElement.remove();

    const orderFormTitle = document.querySelector('.order-name');
    orderFormTitle.remove();

    const address = `The delivery address is ${formData.get('street')} street house ${formData.get('house-number')} flat ${formData.get('flat-number')}`;
    const customer = `Customer ${formData.get('name')} ${formData.get('surname')}`;

    const gifts = formData.getAll('interest');
    const giftsList = gifts.length ? `with ${gifts.join(', ')}` : '';

    const formDelivery = document.querySelector('.delivery');
    const deliveryAddress = document.querySelector('.address');
    deliveryAddress.innerHTML = address;
    const deliveryCustomer = document.querySelector('.customer');
    deliveryCustomer.innerHTML = customer;
    const paymentDelivery = document.querySelector('.payment');
    paymentDelivery.innerHTML = `Payment: $${getOrderTotalSum()} ${formData.get('choose')} `;
    const deliveryDescription = document.querySelector('.description');
    deliveryDescription.innerHTML = `Books: ${cart.size} ${giftsList}`;
    formDelivery.classList.add('active');

    clearLocalStorage();
}

function getCart() {
    const cart = JSON.parse(window.localStorage.getItem('cart'));
    return new Set(cart) || new Set();
}

const cart = getCart();

if (!cart.size) {
    window.location.href = "./index.html";
}

const errors = new Set();

const nameField = document.getElementById('form-name');
nameField.addEventListener('blur', validateField(nameField, validateName));
errors.add(nameField.id);

const surnameField = document.getElementById('form-surname');
surnameField.addEventListener('blur', validateField(surnameField, validateSurname));
errors.add(surnameField.id);

const dateField = document.getElementById('form-date');
dateField.value = getDateForInput(getTomorrow());
dateField.addEventListener('blur', validateField(dateField, validateDate));

const streetField = document.getElementById('form-street');
streetField.addEventListener('blur', validateField(streetField, validateSstreet));
errors.add(streetField.id);

const houseField = document.getElementById('form-number');
houseField.addEventListener('blur', validateField(houseField, validateNumber));
errors.add(houseField.id);

const flatField = document.getElementById('form-flat');
flatField.addEventListener('blur', validateField(flatField, validateFlat));
errors.add(flatField.id);

let countGifts = 0;
addEventForGifts();

const btnSubmit = document.querySelector('.form-begin');
btnSubmit.addEventListener('submit', showDelivery);
