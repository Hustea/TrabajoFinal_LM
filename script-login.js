// script-login.js

// Seleccionamos los elementos necesarios
const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('errorMessage');

// Credenciales predefinidas
const USERNAME = 'admin';
const PASSWORD = '1234';

// Manejador del formulario
loginForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Evita recargar la página

  // Obtener los valores del formulario
  const enteredUsername = document.getElementById('username').value;
  const enteredPassword = document.getElementById('password').value;

  // Verificar credenciales
  if (enteredUsername === USERNAME && enteredPassword === PASSWORD) {
    // Redirigir al buscador
    window.location.href = 'search.html';
  } else {
    // Mostrar mensaje de error
    errorMessage.textContent = 'Usuario o contraseña incorrectos';
  }
});
