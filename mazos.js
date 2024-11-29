document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.querySelector('#search-form');
  const searchInput = document.querySelector('#search-input');
  const resultadosContainer = document.querySelector('#resultados');
  const vistaPrincipal = document.querySelector('#vista-principal');
  const vistaDetalles = document.querySelector('#vista-detalles');
  const tituloMazo = document.querySelector('#titulo-mazo');
  const cartasGrid = document.querySelector('#cartas-grid');
  const volverBtn = document.querySelector('#volver');
  const descargarListaBtn = document.querySelector('#descargar-lista');

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

      const primeraCarta = mazo.cartas[0]?.nombre || 'Unknown';
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
        .catch((error) => console.error('Error al cargar la imagen de la carta:', error));

      card.addEventListener('click', () => mostrarDetalleMazo(mazo));
      resultadosContainer.appendChild(card);
    });
  });

  function mostrarDetalleMazo(mazo) {
    vistaPrincipal.style.display = 'none';
    vistaDetalles.style.display = 'block';

    tituloMazo.textContent = mazo.nombre;

    cartasGrid.innerHTML = '';
    mazo.cartas.forEach((carta) => {
      const cartaDiv = document.createElement('div');
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

    descargarListaBtn.onclick = () => descargarLista(mazo);
  }

  function descargarLista(mazo) {
    const contenido = mazo.cartas
      .map((carta) => `${carta.cantidad}x ${carta.nombre}`)
      .join('\n');
    const blob = new Blob([contenido], { type: 'text/plain' });
    const enlace = document.createElement('a');
    enlace.href = URL.createObjectURL(blob);
    enlace.download = `${mazo.nombre}.txt`;
    enlace.click();
  }

  volverBtn.addEventListener('click', () => {
    vistaDetalles.style.display = 'none';
    vistaPrincipal.style.display = 'block';
  });

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
