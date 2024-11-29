document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('#search-form');
  const searchInput = document.querySelector('#search-input');
  const resultadosContainer = document.querySelector('#resultados');

  let mazos = [];

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
      card.innerHTML = `<h3>${mazo.nombre}</h3>`;
      card.addEventListener('click', () => abrirNuevaPestaña(mazo));
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
          }
        })
        .catch((error) => console.error('Error al cargar la imagen:', error));
    });
  });

  // Abrir nueva pestaña con la lista de cartas
  function abrirNuevaPestaña(mazo) {
    const nuevaVentana = window.open('', '_blank');
    nuevaVentana.document.write(`
      <html>
      <head>
        <title>${mazo.nombre}</title>
        <link rel="stylesheet" href="styles-mazos.css">
      </head>
      <body>
        <button id="volver" onclick="window.close()">Volver</button>
        <button id="descargar" class="descargar-btn">Descargar lista</button>
        <h1>${mazo.nombre}</h1>
        <div class="cartas-grid"></div>
        <script>
          (${descargarMazo.toString()})();
        </script>
      </body>
      </html>
    `);

    const cartasGrid = nuevaVentana.document.querySelector('.cartas-grid');
    const botonDescargar = nuevaVentana.document.querySelector('#descargar');

    botonDescargar.addEventListener('click', () => descargarMazo(mazo, nuevaVentana));

    mazo.cartas.forEach((carta) => {
      const cartaDiv = nuevaVentana.document.createElement('div');
      cartaDiv.className = 'carta';

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
        .catch(() => {
          cartaDiv.innerHTML = `<p>${carta.cantidad}x ${carta.nombre} (Imagen no encontrada)</p>`;
          cartasGrid.appendChild(cartaDiv);
        });
    });
  }

  // Descargar la lista de cartas como un archivo de texto
  function descargarMazo(mazo, ventana) {
    const contenido = mazo.cartas
      .map((carta) => `${carta.cantidad}x ${carta.nombre}`)
      .join('\n');
    const blob = new Blob([contenido], { type: 'text/plain' });
    const enlace = ventana.document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = `${mazo.nombre}.txt`;
    enlace.click();
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
