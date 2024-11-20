// script-search.js

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
      cardContainer.innerHTML = `<p>No se encontraron cartas.</p
