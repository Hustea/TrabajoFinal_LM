// Listado de mazos (puedes agregar más)
const mazos = [
    {
        nombre: "Squirreled Away",
        cartas: [
            "1 Hazel of the Rootbloom",
            "2 Acorn Harvest",
            "1 Chatterstorm",
            "2 Nut Collector"
            // Agrega más cartas si lo necesitas
        ],
        imagen: "https://via.placeholder.com/200x150" // Cambia por una URL válida
    },
    {
        nombre: "Beastly Bounty",
        cartas: [
            "1 Beast Whisperer",
            "2 Cultivate",
            "3 Garruk's Packleader"
        ],
        imagen: "https://via.placeholder.com/200x150" // Cambia por una URL válida
    }
    // Agrega más mazos aquí
];

// Elementos del DOM
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const resultsContainer = document.getElementById("results-container");

// Buscar mazos
searchButton.addEventListener("click", () => {
    const query = searchInput.value.toLowerCase();
    resultsContainer.innerHTML = "";

    const resultados = mazos.filter(mazo =>
        mazo.nombre.toLowerCase().includes(query)
    );

    if (resultados.length > 0) {
        resultados.forEach(mazo => mostrarMazo(mazo));
    } else {
        resultsContainer.innerHTML = "<p>No se encontraron mazos.</p>";
    }
});

// Mostrar un mazo
function mostrarMazo(mazo) {
    const mazoDiv = document.createElement("div");
    mazoDiv.className = "result-item";

    const imagen = document.createElement("img");
    imagen.src = mazo.imagen;

    const titulo = document.createElement("h3");
    titulo.textContent = mazo.nombre;

    mazoDiv.appendChild(imagen);
    mazoDiv.appendChild(titulo);

    mazoDiv.addEventListener("click", () => mostrarCartasDelMazo(mazo));

    resultsContainer.appendChild(mazoDiv);
}

// Mostrar cartas del mazo seleccionado
function mostrarCartasDelMazo(mazo) {
    resultsContainer.innerHTML = "";

    const title = document.createElement("h2");
    title.textContent = `Cartas del Mazo: ${mazo.nombre}`;
    title.className = "mazo-title";

    const cardList = document.createElement("ul");
    cardList.className = "card-list";

    mazo.cartas.forEach(carta => {
        const listItem = document.createElement("li");
        listItem.textContent = carta;
        cardList.appendChild(listItem);
    });

    resultsContainer.appendChild(title);
    resultsContainer.appendChild(cardList);

    const backButton = document.createElement("button");
    backButton.textContent = "Volver";
    backButton.className = "back-button";
    backButton.addEventListener("click", () => {
        searchInput.value = "";
        resultsContainer.innerHTML = "";
    });

    resultsContainer.appendChild(backButton);
}
