document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('#search-form');
  const searchInput = document.querySelector('#search-input');
  const resultadosContainer = document.querySelector('#resultados');
  const cartaContainer = document.querySelector('#carta-container');

  let mazos = []; // Aquí cargarás tus mazos desde el archivo o fuente

  // Cargar los mazos desde el archivo predefinido (solo ejemplo)
  fetch('Squirreled Away.txt')
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

  // Mostrar las cartas de un mazo
  function mostrarCartas(mazo) {
    cartaContainer.innerHTML = `
      <h2>${mazo.nombre}</h2>
      <ul>
        ${mazo.cartas
          .map(
            (carta) => `<li>${carta.cantidad}x ${carta.nombre}</li>`
          )
          .join('')}
      </ul>
    `;
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
