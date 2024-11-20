// Elementos del DOM
const loginScreen = document.getElementById('loginScreen');
const searchScreen = document.getElementById('searchScreen');
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchButton');
const cardContainer = document.getElementById('cardContainer');

// Credenciales predefinidas
const USERNAME = 'admin';
const PASSWORD = '1234';

// Manejo del formulario de Login
loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Evita que el formulario recargue la página

  const enteredUsername = document.getElementById('username').value;
  const enteredPassword = document.getElementById('password').value;

  // Validar credenciales
  if (enteredUsername === USERNAME && enteredPassword === PASSWORD) {
    errorMessage.textContent = ''; // Limpiamos mensajes de error
    loginScreen.classList.add('hidden');
    searchScreen.classList.remove('hidden');
  } else {
    errorMessage.textContent = 'Usuario o contraseña incorrectos';
  }
});

// Función para buscar cartas
async function fetchCards(query) {
  try {
    const response = await fetch(`https://api.scryfall.com/cards/search?q=${query}`);
    const data = await response.json();

    if (data.object === "error") {
      cardContainer.innerHTML = `<p>No se encontraron cartas.</p>`;
      return;
    }

    displayCards(data.data);
  } catch (error) {
    console.error('Error al buscar cartas:', error);
    cardContainer.innerHTML = `<p>Error al cargar los datos.</p>`;
  }
}

// Función para mostrar cartas
function displayCards(cards) {
  cardContainer.innerHTML = '';
  cards.forEach(card => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');

    cardElement.innerHTML = `
      <img src="${card.image_uris ? card.image_uris.normal : 'https://via.placeholder.com/200'}" alt="${card.name}">
      <h2>${card.name}</h2>
      <p><strong>Tipo:</strong> ${card.type_line}</p>
      <p><strong>Precio:</strong> $${card.prices.usd || 'N/A'}</p>
    `;

    cardContainer.appendChild(cardElement);
  });
}

// Evento del botón de búsqueda
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchCards(query);
  } else {
    alert('Por favor, escribe algo para buscar.');
  }
});
