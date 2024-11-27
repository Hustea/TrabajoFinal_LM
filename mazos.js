/*document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('#search-form');
  const searchInput = document.querySelector('#search-input');
  const resultadosContainer = document.querySelector('#resultados');
  const cartaContainer = document.querySelector('#carta-container');

  let mazos = []; // Aquí cargarás tus mazos desde el archivo o fuente

  // Cargar los mazos desde el archivo predefinido
  fetch('./Squirreled Away.txt')
    .then((response) => response.text())
    .then((data) => {
      mazos = parseMazos(data);
    })
    .catch((error) => console.error('Error al cargar los mazos:', error));

  // Buscar mazos
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
      card.innerHTML = `
        <h3>${mazo.nombre}</h3>
      `;
      card.addEventListener('click', () => mostrarCartas(mazo));
      resultadosContainer.appendChild(card);

      // Cargar la imagen de la primera carta
      const primeraCarta = mazo.cartas[0].nombre;
      fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(primeraCarta)}`)
        .then((response) => response.json())
        .then((data) => {
          const imageUrl = data.image_uris?.normal || data.image_uris?.small;
          if (imageUrl) {
            const img = document.createElement('img');
            img.src = imageUrl;
            img.alt = primeraCarta;
            card.prepend(img);
          } else {
            console.error('No se encontró una imagen para la carta:', primeraCarta);
          }
        })
        .catch((error) => console.error('Error al cargar la imagen de la carta:', error));
    });
  });

  // Mostrar las cartas de un mazo con imágenes
  function mostrarCartas(mazo) {
    cartaContainer.innerHTML = `
      <h2>${mazo.nombre}</h2>
      <div class="cartas-grid"></div>
    `;
    const cartasGrid = cartaContainer.querySelector('.cartas-grid');

    mazo.cartas.forEach((carta) => {
      const cartaDiv = document.createElement('div');
      cartaDiv.className = 'carta';

      // Hacer la solicitud a Scryfall para obtener la imagen de la carta
      fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(carta.nombre)}`)
        .then((response) => response.json())
        .then((data) => {
          const imageUrl = data.image_uris?.normal || data.image_uris?.small;
          cartaDiv.innerHTML = `
            <img src="${imageUrl}" alt="${carta.nombre}">
            <p>${carta.cantidad}x ${carta.nombre}</p>
          `;
          cartasGrid.appendChild(cartaDiv);
        })
        .catch((error) => {
          console.error('Error al cargar la imagen de la carta:', error);
          cartaDiv.innerHTML = `<p>${carta.cantidad}x ${carta.nombre} (Imagen no encontrada)</p>`;
          cartasGrid.appendChild(cartaDiv);
        });
    });
  }

  // Parsear el archivo de texto de mazos
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
});
*/

document.addEventListener('DOMContentLoaded', () => {
  const contenedorMazos = document.getElementById('resultados');

  async function buscarImagen(nombreCarta) {
    try {
      // Realizamos una petición a la API de Scryfall
      const respuesta = await fetch(`https://api.scryfall.com/cards/named?fuzzy=${encodeURIComponent(nombreCarta)}`);
      if (!respuesta.ok) throw new Error('No se encontró la carta.');
      const datos = await respuesta.json();

      // Devolvemos la URL de la imagen
      return datos.image_uris?.normal || datos.image_uris?.large || datos.image_uris?.small || null;
    } catch (error) {
      console.error(`Error al buscar la imagen de la carta ${nombreCarta}:`, error);
      return null; // Retornamos null si hay un error
    }
  }

  async function mostrarMazo(mazo) {
    contenedorMazos.innerHTML = ''; // Limpiamos el contenido actual
    const titulo = document.createElement('h2');
    titulo.textContent = `Cartas del mazo: ${mazo.nombre}`;
    contenedorMazos.appendChild(titulo);

    const grid = document.createElement('div');
    grid.className = 'grid-cartas'; // Clase para diseño en grid
    contenedorMazos.appendChild(grid);

    // Iteramos las cartas del mazo
    for (const carta of mazo.cartas) {
      const cartaDiv = document.createElement('div');
      cartaDiv.className = 'carta';

      // Buscar la imagen de la carta
      const imagenUrl = await buscarImagen(carta.nombre);
      cartaDiv.innerHTML = `
        <img src="${imagenUrl || 'ruta/a/imagen_generica.jpg'}" alt="${carta.nombre}">
        <p>${carta.cantidad}x ${carta.nombre}</p>
      `;
      grid.appendChild(cartaDiv);
    }
  }

  // Escuchamos los eventos para buscar mazos
  document.getElementById('buscar').addEventListener('click', async () => {
    const termino = document.getElementById('buscador').value.toLowerCase();
    if (!termino) return;

    // Buscar el mazo
    const mazo = mazos.find((m) => m.nombre.toLowerCase().includes(termino));
    if (!mazo) {
      contenedorMazos.innerHTML = '<p>No se encontró el mazo.</p>';
      return;
    }

    await mostrarMazo(mazo);
  });

  // Inicializamos con todos los mazos (puedes ajustar esto si no lo necesitas)
  const listaMazos = document.getElementById('lista-mazos');
  mazos.forEach((mazo) => {
    const card = document.createElement('div');
    card.className = 'mazo-card';
    card.innerHTML = `
      <h3>${mazo.nombre}</h3>
    `;
    card.addEventListener('click', () => mostrarMazo(mazo));
    listaMazos.appendChild(card);
  });
});

