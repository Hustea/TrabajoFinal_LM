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
  // ... (tu código existente)
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
      <div class="cartas-container"></div>
    `;

    // Evento al hacer clic
    card.addEventListener('click', () => {
      const cartasContainer = card.querySelector('.cartas-container');
      cartasContainer.innerHTML = '';

      mazo.cartas.forEach((carta) => {
        const cartaDiv = document.createElement('div');
        cartaDiv.className = 'carta';
        cartaDiv.textContent = `${carta.cantidad}x ${carta.nombre}`;

        cartaDiv.addEventListener('click', () => {
          // Mostrar la imagen de la carta en un modal (opcional)
          // Aquí puedes implementar la lógica para mostrar la imagen en un modal o directamente en la cartaDiv
          // Por ejemplo, usando un modal:
          // mostrarModal(carta.nombre);

          // O directamente en la cartaDiv:
          fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(carta.nombre)}`)
            .then(response => response.json())
            .then(data => {
              const img = document.createElement('img');
              img.src = data.image_uris.png;
              cartaDiv.appendChild(img);
            });
        });

        cartasContainer.appendChild(cartaDiv);
      });

      cartasContainer.style.display = 'block';
    });

    contenedor.appendChild(card);
  });
}
// Inicializar
cargarMazos();
