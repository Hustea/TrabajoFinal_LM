// Seleccionamos los elementos necesarios
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('searchButton');
const cardContainer = document.getElementById('cardContainer');

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

// Función para mostrar las cartas
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

// Manejador del botón de búsqueda
searchButton.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchCards(query);
  } else {
    alert('Por favor, escribe algo para buscar.');
  }
});
