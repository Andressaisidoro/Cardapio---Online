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
const addressWarn = document.getElementById('address-warn');
const nameWarn = document.getElementById('name-warn');
const paymentWarn = document.getElementById('payment-warn');
const paymentInput = document.getElementById('payment');
const trocoInput = document.getElementById('troco');
const scheduleDateInput = document.getElementById('schedule-date');
const scheduleTimeInput = document.getElementById('schedule-time');
const scheduleContainer = document.getElementById('schedule-container');
const trocoContainer = document.getElementById('troco-container');
const searchBar = document.getElementById('search-bar');
const navbar = document.getElementById('categories-nav'); // Corrigido para o ID correto

let cart = [];
let currentSearch = '';

function searchItems(query) {
  currentSearch = query;
  cart = []; // Limpa o carrinho na nova pesquisa
  const filteredItems = allMenuItems.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase())
  );
  displayItems(filteredItems);
  updateCartDisplay();
}

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  updateCartModal();
}

function updateCartDisplay() {
  const cartCount = cart.length;
  cartCountDisplay.textContent = cartCount;
}

// Listener para a barra de pesquisa
searchBar.addEventListener('input', function() {
  let searchQuery = this.value.toLowerCase();
  let products = document.querySelectorAll('#menu-items .product');

  products.forEach(function(product) {
    let productName = product.getAttribute('data-name').toLowerCase();

    if (productName.includes(searchQuery)) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
});

// Função para atualizar o modal do carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const itemElement = document.createElement('div');
    itemElement.classList.add('flex', 'justify-between', 'mb-2', 'border-b', 'pb-2');

    itemElement.innerHTML = `
      <span>${item.name} (${item.quantity}x) - R$ ${item.price}</span>
      <button class="text-red-500" onclick="removeFromCart(${index})">Remover</button>
    `;

    cartItemsContainer.appendChild(itemElement);
    total += parseFloat(item.price.replace(',', '.')) * item.quantity;
  });

  cartTotal.textContent = total.toFixed(2).replace('.', ',');
  cartCountDisplay.textContent = cart.length;
}

// Função para remover itens do carrinho
function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartModal();
}

// Exibir o modal do carrinho e desabilitar o botão "Ver Meu Carrinho"
cartBtn.addEventListener('click', () => {
  cartModal.classList.remove('hidden');
  cartModal.classList.add('flex');
  cartBtn.disabled = true; // Desabilita o botão "Ver Meu Carrinho"
  navbar.classList.add('hidden'); // Oculta o menu de navegação
});

// Fechar o modal do carrinho e habilitar o botão "Ver Meu Carrinho" novamente
closeModalBtn.addEventListener('click', () => {
  cartModal.classList.add('hidden');
  cartModal.classList.remove('flex');
  cartBtn.disabled = false; // Habilita o botão "Ver Meu Carrinho" novamente
  navbar.classList.remove('hidden'); // Mostra o menu de navegação novamente
});

// Função para verificar o horário de funcionamento e atualizar o status
function checkOpeningHours() {
  const openingTime = 18;
  const closingTime = 23;
  const now = new Date();
  const currentHour = now.getHours();

  const isOpen = currentHour >= openingTime && currentHour < closingTime;

  if (isOpen) {
    operationStatusBtn.textContent = "Aberto";
    operationStatusBtn.style.backgroundColor = "#4caf50";
    checkoutBtn.style.display = 'block';
    toScheduleBtn.style.display = 'none';
    scheduleContainer.classList.add('hidden');
  } else {
    operationStatusBtn.textContent = "Fechado";
    operationStatusBtn.style.backgroundColor = "#f44336";
    checkoutBtn.style.display = 'none';
    toScheduleBtn.style.display = 'block';
    scheduleContainer.classList.remove('hidden');
  }
}

// Atualizar o status do restaurante ao carregar a página
window.addEventListener('load', () => {
  checkOpeningHours();
});

// Atualizar o status do restaurante a cada 1 minuto
setInterval(checkOpeningHours, 60000);

// Adicionar ao carrinho ao clicar nos botões correspondentes
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.getAttribute('data-name');
    const price = btn.getAttribute('data-price');
    addToCart(name, price);
  });
});

// Mostrar/ocultar campo de troco ao selecionar o pagamento
paymentInput.addEventListener('change', function() {
  if (this.value === 'dinheiro') {
    trocoContainer.classList.remove('hidden');
  } else {
    trocoContainer.classList.add('hidden');
  }
});

// Função para enviar mensagem pelo WhatsApp
function sendOrderToWhatsApp(message) {
  const phone = "00000000000"; // Substituir pelo número correto
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
}

// Finalizar compra e enviar mensagem
checkoutBtn.addEventListener('click', () => {
  const address = addressInput.value.trim();
  const name = nameInput.value.trim();
  const payment = paymentInput.value.trim();
  const troco = trocoInput.value.trim();

  addressWarn.classList.add('hidden');
  nameWarn.classList.add('hidden');
  paymentWarn.classList.add('hidden');

  if (!address) {
    addressWarn.classList.remove('hidden');
    return;
  }

  if (!name) {
    nameWarn.classList.remove('hidden');
    return;
  }

  if (!payment) {
    paymentWarn.classList.remove('hidden');
    return;
  }

  if (cart.length === 0) {
    alert('Seu carrinho está vazio. Adicione itens antes de finalizar o pedido.');
    return;
  }

  const cartItems = cart.map(item => `${item.name} (${item.quantity}x) - R$ ${item.price}`).join("\n");
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price.replace(',', '.')) * item.quantity, 0).toFixed(2);

  let message = `Novo Pedido:\n\n${cartItems}\n\nTotal: R$ ${total}\n\nEndereço: ${address}\nNome: ${name}\nPagamento: ${payment}`;
  
  if (payment === 'dinheiro' && troco) {
    message += `\nTroco para: R$ ${troco}`;
  }

  sendOrderToWhatsApp(message);

  cart = [];
  updateCartModal();
  cartModal.classList.add('hidden');
  cartModal.classList.remove('flex');

  addressInput.value = '';
  nameInput.value = '';
  paymentInput.value = '';
  trocoInput.value = '';
});

// Agendar Pedido
toScheduleBtn.addEventListener('click', () => {
  const address = addressInput.value.trim();
  const name = nameInput.value.trim();
  const payment = paymentInput.value.trim();
  const troco = trocoInput.value.trim();
  const scheduleDate = scheduleDateInput.value;
  const scheduleTime = scheduleTimeInput.value;

  addressWarn.classList.add('hidden');
  nameWarn.classList.add('hidden');
  paymentWarn.classList.add('hidden');

  if (!address) {
    addressWarn.classList.remove('hidden');
    return;
  }

  if (!name) {
    nameWarn.classList.remove('hidden');
    return;
  }

  if (!payment) {
    paymentWarn.classList.remove('hidden');
    return;
  }

  if (cart.length === 0) {
    alert('Seu carrinho está vazio. Adicione itens antes de agendar o pedido.');
    return;
  }

  const cartItems = cart.map(item => `${item.name} (${item.quantity}x) - R$ ${item.price}`).join("\n");
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price.replace(',', '.')) * item.quantity, 0).toFixed(2);

  let message = `Novo Pedido Agendado:\n\n${cartItems}\n\nTotal: R$ ${total}\n\nEndereço: ${address}\nNome: ${name}\nPagamento: ${payment}\nData: ${scheduleDate}\nHora: ${scheduleTime}`;

  if (payment === 'dinheiro' && troco) {
    message += `\nTroco para: R$ ${troco}`;
  }

  sendOrderToWhatsApp(message);

  cart = [];
  updateCartModal();
  cartModal.classList.add('hidden');
  cartModal.classList.remove('flex');

  addressInput.value = '';
  nameInput.value = '';
  paymentInput.value = '';
  trocoInput.value = '';
});

// Quando abrir o modal
function abrirModal() {
    document.body.classList.add('modal-open');
}

// Quando fechar o modal
function fecharModal() {
    document.body.classList.remove('modal-open');
}

// No botão de abrir carrinho
document.querySelector('.abrir-carrinho').addEventListener('click', abrirModal);

// No botão de fechar carrinho
document.querySelector('.fechar-carrinho').addEventListener('click', fecharModal);

















