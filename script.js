// script.js

// Elementos del DOM
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchButton');
const cardContainer = document.getElementById('cardContainer');

// Función para buscar cartas
async function fetchCards(query) {
  try {
    // URL de la API
    const response = await fetch(`https://api.scryfall.com/cards/search?q=${query}`);
    const data = await response.json();

    // Verificamos si hay resultados
    if (data.object === "error") {
      cardContainer.innerHTML = `<p>No se encontraron cartas.</p>`;
      return;
    }

    // Mostramos las cartas
    displayCards(data.data);
  } catch (error) {
    console.error('Error al buscar cartas:', error);
    cardContainer.innerHTML = `<p>Error al cargar los datos.</p>`;
  }
}

// Función para mostrar cartas en la página
function displayCards(cards) {
  // Limpiamos el contenedor
  cardContainer.innerHTML = '';

  // Iteramos sobre las cartas y las mostramos
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

// Evento para el botón de búsqueda
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchCards(query);
  } else {
    alert('Por favor, escribe algo para buscar.');
  }
});
