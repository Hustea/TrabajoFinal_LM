// URL de la API
const API_URL = 'https://restcountries.com/v3.1/all';

// Elemento donde se mostrarán los países
const countriesContainer = document.getElementById('countries');

// Función para obtener datos de la API
async function fetchCountries() {
  try {
    // Hacemos una petición GET
    const response = await fetch(API_URL);

    // Convertimos la respuesta a JSON
    const countries = await response.json();

    // Mostramos los primeros 5 países como ejemplo
    displayCountries(countries.slice(0, 5));
  } catch (error) {
    console.error('Error al obtener los países:', error);
  }
}

// Función para mostrar los países en la página
function displayCountries(countries) {
  countries.forEach(country => {
    const countryElement = document.createElement('div');
    countryElement.classList.add('country');
    countryElement.innerHTML = `
      <h2>${country.name.common}</h2>
      <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
      <p><strong>Región:</strong> ${country.region}</p>
      <p><strong>Población:</strong> ${country.population.toLocaleString()}</p>
    `;
    countriesContainer.appendChild(countryElement);
  });
}

// Llamamos a la función
fetchCountries();
