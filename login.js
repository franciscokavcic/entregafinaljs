document.addEventListener("DOMContentLoaded", () => {
  const miAudio = document.getElementById("miAudio");
  const audioContainer = document.getElementById("audioContainer");
  const loginForm = document.getElementById("loginForm");

  // Reproducir el audio  al cargar la página
  miAudio.play();

  // Pausar el audio después de 6 segundos
  setTimeout(() => {
      miAudio.pause();
      audioContainer.style.display = "none"; // Ocultar el contenedor del audio
      audioEnded();
  }, 4800);

  // Cuando el audio haya terminado o se pause manualmente, mostrar el formulario de inicio de sesión
  function audioEnded() {
      miAudio.removeEventListener("ended", audioEnded);
      miAudio.removeEventListener("pause", audioEnded);
      loginForm.style.display = "block"; // Mostrar el formulario de inicio de sesión
  }

  miAudio.addEventListener("ended", audioEnded);
  miAudio.addEventListener("pause", audioEnded);

  const nombreUsuarioInput = document.getElementById("nombreUsuario");
  const contrasenaInput = document.getElementById("contrasena");

  const usuarios = [
      { nombreUsuario: "francisco", contrasena: "coder" },
      { nombreUsuario: "usuario2", contrasena: "contrasena2" },
  ];

  loginForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const nombreUsuario = nombreUsuarioInput.value;
      const contrasena = contrasenaInput.value;

      const usuarioValido = usuarios.some((usuario) =>
          usuario.nombreUsuario === nombreUsuario && usuario.contrasena === contrasena
      );

      if (usuarioValido) {
          window.location.href = "main.html"; 
      } else {
          alert("Nombre de usuario o contraseña incorrectos. Por favor, intenta nuevamente.");
          nombreUsuarioInput.value = "";
      }
  });
});
