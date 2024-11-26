// Listas de mazos (provisionalmente cargadas en este script)
const mazos = [
    {
        nombre: "Squirreled Away",
        imagen: "https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=507980&type=card", // URL de la primera carta
        cartas: [
            "1 Hazel of the Rootbloom",
            "1 Squirrel Sovereign",
            "2 Chitter Spitter",
            // ...
        ]
    },
    // Agrega más mazos aquí
];

// Referencias a elementos del DOM
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsContainer = document.getElementById('resultsContainer');

// Evento para manejar la búsqueda
searchButton.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase();
    const resultados = mazos.filter(mazo => mazo.nombre.toLowerCase().includes(query));

    // Limpiar resultados previos
    resultsContainer.innerHTML = '';

    // Mostrar resultados
    resultados.forEach(mazo => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';

        resultItem.innerHTML = `
            <img src="${mazo.imagen}" alt="${mazo.nombre}">
            <h3>${mazo.nombre}</h3>
        `;

        // Manejar clic para ver cartas del mazo
        resultItem.addEventListener('click', () => {
            mostrarCartasDelMazo(mazo);
        });

        resultsContainer.appendChild(resultItem);
    });
});

// Función para mostrar las cartas del mazo
function mostrarCartasDelMazo(mazo) {
    // Aquí podrías redirigir a otra página o mostrar un modal con las cartas.
    alert(`Cartas del mazo "${mazo.nombre}":\n${mazo.cartas.join('\n')}`);
}
