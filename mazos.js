document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('#search-form');
  const searchInput = document.querySelector('#search-input');
  const resultadosContainer = document.querySelector('#resultados');
  const vistaPrincipal = document.querySelector('#vista-principal');
  const vistaDetalles = document.querySelector('#vista-detalles');
  const tituloMazo = document.querySelector('#titulo-mazo');
  const cartasGrid = document.querySelector('#cartas-grid');
  const volverBtn = document.querySelector('#volver');

  let mazos = []; // Aquí se cargarán los mazos desde el archivo Squirreled Away.txt

  // Cargar los mazos desde el archivo predefinido
  fetch('./Squirreled Away.txt')
    .then((response) => response.text())
    .then((data) => {
      mazos = parseMazos(data);
    })
    .catch((error) => console.error('Error al cargar los mazos:', error));

  // Manejar el formulario de búsqueda
  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim().toLowerCase();

    resultadosContainer.innerHTML = '';

    const resultados = mazos.filter((mazo) =>
      mazo.nombre.toLowerCase().includes(query)
    );

    resultados.forEach((mazo) => {
      const card = document.createElement('div');
      card.className = 'mazo-card';
      card.innerHTML = `<h3>${mazo.nombre}</h3>`;

      // Cargar la imagen de la primera carta
      const primeraCarta = mazo.cartas[0]?.nombre || 'Unknown';
      obtenerImagenCarta(primeraCarta)
        .then((imageUrl) => {
          if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = primeraCarta;
            card.prepend(img);
          }
        })
        .catch((error) => console.error('Error al cargar la imagen de la carta:', error));

      // Al hacer clic en el mazo, se muestra la vista de detalles
      card.addEventListener('click', () => mostrarDetalleMazo(mazo));
      resultadosContainer.appendChild(card);
    });
  });

  // Función para mostrar los detalles de un mazo
  function mostrarDetalleMazo(mazo) {
    vistaPrincipal.style.display = 'none';
    vistaDetalles.style.display = 'block';

    // Actualizar el título del mazo
    tituloMazo.textContent = mazo.nombre;

    // Limpiar el contenedor de cartas
    cartasGrid.innerHTML = '';

    // Mostrar las cartas del mazo
    mazo.cartas.forEach((carta) => {
      const cartaDiv = document.createElement('div');
      cartaDiv.className = 'carta';

      obtenerImagenCarta(carta.nombre)
        .then((imageUrl) => {
          if (imageUrl) {
            cartaDiv.innerHTML = `
              <img src="${imageUrl}" alt="${carta.nombre}">
              <p>${carta.cantidad}x ${carta.nombre}</p>
            `;
          } else {
            cartaDiv.innerHTML = `<p>${carta.cantidad}x ${carta.nombre} (Imagen no encontrada)</p>`;
          }
          cartasGrid.appendChild(cartaDiv);
        })
        .catch((error) => {
          console.error('Error al cargar la imagen de la carta:', error);
          cartaDiv.innerHTML = `<p>${carta.cantidad}x ${carta.nombre} (Imagen no encontrada)</p>`;
          cartasGrid.appendChild(cartaDiv);
        });
    });
  }

  // Volver a la vista principal
  volverBtn.addEventListener('click', () => {
    vistaDetalles.style.display = 'none';
    vistaPrincipal.style.display = 'block';
  });

  // Función para parsear el archivo de texto Squirreled Away.txt
  function parseMazos(data) {
    const lines = data.split('\n');
    const mazos = [];
    let mazoActual = null;

    lines.forEach((line) => {
      if (!line.trim()) return;

      const match = line.match(/^(\d+)\s+(.+?)(\s\(.+?\))?\s*$/);
      if (match) {
        const [, cantidad, nombre] = match;
        mazoActual.cartas.push({
          cantidad: parseInt(cantidad, 10),
          nombre: nombre.trim(),
        });
      } else {
        if (mazoActual) mazos.push(mazoActual);
        mazoActual = { nombre: line.trim(), cartas: [] };
      }
    });

    if (mazoActual) mazos.push(mazoActual);
    return mazos;
  }

  // Función para obtener la imagen de una carta priorizando la primera reimpresión
  async function obtenerImagenCarta(nombreCarta) {
    try {
      const response = await fetch(`https://api.scryfall.com/cards/search?q=!${encodeURIComponent(nombreCarta)}`);
      const data = await response.json();

      if (data.data && data.data.length > 0) {
        const primeraCarta = data.data[0];
        return primeraCarta.image_uris?.normal || primeraCarta.image_uris?.small || null;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener los datos de la carta:', error);
      return null;
    }
  }
});
