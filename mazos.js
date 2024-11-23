// URL base del repositorio GitHub con los JSON de mazos
const githubBaseUrl = "https://raw.githubusercontent.com/USER/REPO/BRANCH/precon_json/";

// Listado de nombres de archivos JSON (puedes completarlo con más nombres si lo deseas)
const mazos = [
  "https://raw.githubusercontent.com/Westly/CommanderPrecons/refs/heads/main/precon_json/Animated%20Army%20(Bloomburrow%20Commander%20Precon%20Decklist).json",
  "https://raw.githubusercontent.com/Westly/CommanderPrecons/refs/heads/main/precon_json/Family%20Matters%20(Bloomburrow%20Commander%20Precon%20Decklist).json,
  "https://raw.githubusercontent.com/Westly/CommanderPrecons/refs/heads/main/precon_json/Peace%20Offering%20(Bloomburrow%20Commander%20Precon%20Decklist).json",
  "https://raw.githubusercontent.com/Westly/CommanderPrecons/refs/heads/main/precon_json/Squirreled%20Away%20(Bloomburrow%20Commander%20Precon%20Decklist).json"
  // Agrega más mazos aquí...
];

// Referencias al DOM
const searchInput = document.getElementById("searchInput");
const mazosList = document.getElementById("mazosList");

// Función para mostrar los mazos en la lista
function renderMazos(filteredMazos) {
  mazosList.innerHTML = ""; // Limpiamos la lista
  if (filteredMazos.length === 0) {
    mazosList.innerHTML = "<p>No se encontraron mazos.</p>";
    return;
  }

  // Crear un elemento por cada mazo
  filteredMazos.forEach((mazo) => {
    const mazoItem = document.createElement("div");
    mazoItem.className = "mazo-item";
    mazoItem.innerHTML = `
      <h3>${mazo.replace(".json", "")}</h3>
      <button class="view-button" onclick="fetchMazo('${mazo}')">Ver Mazo</button>
    `;
    mazosList.appendChild(mazoItem);
  });
}

// Función para filtrar los mazos según el texto ingresado
function filterMazos() {
  const query = searchInput.value.toLowerCase();
  const filteredMazos = mazos.filter((mazo) =>
    mazo.toLowerCase().includes(query)
  );
  renderMazos(filteredMazos);
}

// Función para obtener los datos de un mazo específico
function fetchMazo(mazoFile) {
  const url = githubBaseUrl + mazoFile;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      alert(`¡Datos del mazo "${mazoFile.replace('.json', '')}" cargados correctamente!`);
      console.log(data); // Aquí puedes mostrar los datos en la consola o procesarlos.
    })
    .catch((error) => {
      console.error("Error al cargar el archivo JSON:", error);
      alert("No se pudo cargar el mazo. Intenta de nuevo.");
    });
}

// Escuchar el evento input en la barra de búsqueda
searchInput.addEventListener("input", filterMazos);

// Mostrar todos los mazos al cargar la página
renderMazos(mazos);
