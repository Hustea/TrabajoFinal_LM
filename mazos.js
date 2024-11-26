
//------------------------------------------------------------------------------------------------------------------------

// Archivo con las listas de mazos
const mazosFile = 'Squirreled Away.txt'; // Cambiar si hay más archivos

// Función para cargar y procesar los datos
async function cargarMazos() {
  try {
    const response = await fetch(mazosFile);
    const data = await response.text();

    // Procesar archivo de texto
    const mazos = procesarMazos(data);

    // Añadir evento al buscador
    document.getElementById('searchBar').addEventListener('input', (e) => {
      mostrarResultados(e.target.value, mazos);
    });

  } catch (error) {
    console.error("Error al cargar el archivo:", error);
  }
}

// Procesar el archivo de texto en un formato más utilizable
function procesarMazos(data) {
  const lines = data.split('\n');
  const mazos = [];
  let mazoActual = null;

  lines.forEach((line) => {
    if (!line.trim()) return;

    if (line.match(/^\d/)) {
      const [cantidad, ...nombrePartes] = line.split(' ');
      const nombreCarta = nombrePartes.join(' ').split('(')[0].trim();
      mazoActual.cartas.push({ cantidad: parseInt(cantidad), nombre: nombreCarta });
    } else {
      if (mazoActual) mazos.push(mazoActual);
      mazoActual = { nombre: line.trim(), cartas: [] };
    }
  });

  if (mazoActual) mazos.push(mazoActual);
  return mazos;
}

// Mostrar resultados basados en la búsqueda
function mostrarResultados(query, mazos) {
  const contenedor = document.getElementById('mazosResultados');
  contenedor.innerHTML = '';

  const resultados = mazos.filter((mazo) =>
    mazo.nombre.toLowerCase().includes(query.toLowerCase())
  );

  resultados.forEach((mazo) => {
    const card = document.createElement('div');
    card.className = 'mazo-card';
    card.innerHTML = `
      <img src="https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
        mazo.cartas[0].nombre
      )}" alt="${mazo.nombre}">
      <h3>${mazo.nombre}</h3>
    `;

    // Evento al hacer clic
    card.addEventListener('click', () => mostrarCartas(mazo));
    contenedor.appendChild(card);
  });
}

// Mostrar las cartas del mazo seleccionado
function mostrarCartas(mazo) {
  const contenedor = document.getElementById('mazosResultados');
  contenedor.innerHTML = `<h2>${mazo.nombre}</h2>`;

  mazo.cartas.forEach((carta) => {
    const cartaDiv = document.createElement('div');
    cartaDiv.className = 'mazo-card';
    cartaDiv.innerHTML = `
      <p>${carta.cantidad}x ${carta.nombre}</p>
      <img src="https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(
        carta.nombre
      )}" alt="${carta.nombre}">
    `;
    contenedor.appendChild(cartaDiv);
  });
}

// Inicializar
cargarMazos();

function mostrarCartasDelMazo(mazo) {
    // Aquí podrías redirigir a otra página o mostrar un modal con las cartas.
    alert(`Cartas del mazo "${mazo.nombre}":\n${mazo.cartas.join('\n')}`);
}
