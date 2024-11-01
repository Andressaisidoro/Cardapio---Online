// Definindo os elementos
const cartBtn = document.getElementById('cart-btn');
const operationStatusBtn = document.querySelector('.operation-status-btn');
const cartModal = document.getElementById('cart-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const cartCountDisplay = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const toScheduleBtn = document.getElementById('to-schedule-btn');
const addressInput = document.getElementById('address');
const nameInput = document.getElementById('name');
const paymentInput = document.getElementById('payment');
const trocoInput = document.getElementById('troco');
const scheduleDateInput = document.getElementById('schedule-date');
const scheduleTimeInput = document.getElementById('schedule-time');
const scheduleContainer = document.getElementById('schedule-container');
const trocoContainer = document.getElementById('troco-container');
const searchBar = document.getElementById('search-bar');
const navbar = document.querySelector('.categories-nav'); 
const orderTypeInput = document.getElementById('order-type-select');

// Evento para controlar a exibição do campo de troco
paymentInput.addEventListener('change', function() {
    if (this.value === 'dinheiro') {
        trocoContainer.classList.remove('hidden'); // Exibe o campo de troco
    } else {
        trocoContainer.classList.add('hidden'); // Oculta o campo de troco
        trocoInput.value = ''; // Limpa o valor do campo de troco
    }
});

let cart = [];
let currentSearch = '';

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCartModal();
}

function updateCartModal() {
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('flex', 'justify-between', 'mb-2', 'border-b', 'pb-2');

        itemElement.innerHTML = `
            <span>${item.name} (${item.quantity}x) - R$ ${item.price.replace('.', ',')}</span>
            <button class="text-red-500" onclick="removeFromCart(${index})">Remover</button>
        `;

        cartItemsContainer.appendChild(itemElement);
        total += parseFloat(item.price.replace(',', '.')) * item.quantity;
    });

    cartTotal.textContent = total.toFixed(2).replace('.', ',');
    cartCountDisplay.textContent = cart.length;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartModal();
}

cartBtn.addEventListener('click', () => {
    cartModal.classList.remove('hidden');
    cartModal.classList.add('flex');
    cartBtn.disabled = true;
    navbar.classList.add('hidden'); 
    document.body.classList.add('no-scroll');
});

closeModalBtn.addEventListener('click', () => {
    cartModal.classList.add('hidden');
    cartModal.classList.remove('flex');
    cartBtn.disabled = false;
    navbar.classList.remove('hidden'); 
    document.body.classList.remove('no-scroll');
});

function checkOpeningHours() {
    const openingTime = 18;
    const closingTime = 23;
    const now = new Date();
    const currentHour = now.getHours();

    const isOpen = currentHour >= openingTime && currentHour < closingTime;

    if (isOpen) {
        operationStatusBtn.textContent = "Aberto";
        operationStatusBtn.style.backgroundColor = "#60205f";
        checkoutBtn.style.display = 'block';
        toScheduleBtn.style.display = 'none';
        scheduleContainer.classList.add('hidden');
    } else {
        operationStatusBtn.textContent = "Fechado";
        operationStatusBtn.style.backgroundColor = "#000000";
        checkoutBtn.style.display = 'none';
        toScheduleBtn.style.display = 'block';
        scheduleContainer.classList.remove('hidden');
    }
}

window.addEventListener('load', checkOpeningHours);
setInterval(checkOpeningHours, 60000);

document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-name');
        const price = btn.getAttribute('data-price');
        addToCart(name, price);
    });
});

function formatCartItems() {
    return cart.map(item => `${item.name} (${item.quantity}x) - R$ ${item.price.replace('.', ',')}`).join('\n');
}

function sendOrderToWhatsApp(message) {
    const phone = "+5511940058709"; 
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
}

function checkout(isScheduled) {
    const address = addressInput.value;
    const name = nameInput.value;
    const paymentMethod = paymentInput.value;
    const orderType = orderTypeInput.value;
    const troco = trocoInput.value;

    // Verifique se todos os campos obrigatórios estão preenchidos
    if (!address || !name || !paymentMethod || !orderType) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }

    const cartItems = formatCartItems();
    const total = parseFloat(cartTotal.textContent.replace(',', '.')).toFixed(2).replace('.', ',');

    let message = `Novo Pedido${isScheduled ? ' Agendado' : ''}:\n\n${cartItems}\n\nTotal: R$ ${total}\n\nEndereço: ${address}\nNome: ${name}\nPagamento: ${paymentMethod}\nTipo de Pedido: ${orderType}`;
    
    if (isScheduled) {
        const scheduleDate = scheduleDateInput.value;
        const scheduleTime = scheduleTimeInput.value;
        message += `\n\nData do Agendamento: ${scheduleDate}\nHora do Agendamento: ${scheduleTime}`;
    }

    // Adiciona o campo de troco apenas se o método de pagamento for 'dinheiro' e troco não estiver vazio
    if (paymentMethod === 'dinheiro' && troco) {
        message += `\nTroco para: R$ ${troco}`;
    }

    sendOrderToWhatsApp(message);
    navbar.classList.remove('hidden'); 
    clearFormInputs(); 
}

function clearFormInputs() {
    addressInput.value = '';
    nameInput.value = '';
    paymentInput.value = '';
    trocoInput.value = '';
    scheduleDateInput.value = '';
    scheduleTimeInput.value = '';
    trocoContainer.classList.add('hidden'); // Oculta o campo de troco ao limpar
}

checkoutBtn.addEventListener('click', () => {
    checkout(false); 
});

toScheduleBtn.addEventListener('click', () => {
    checkout(true); 
});






























