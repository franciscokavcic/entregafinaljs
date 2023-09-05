document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
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
        window.location.href = "main.html"; // Redireccionar en caso de inicio 
      } else {
        alert("Nombre de usuario o contraseña incorrectos. Por favor, intenta nuevamente.");
        nombreUsuarioInput.value = ""; // Limpiar el campo de nombre de usuario
        contrasenaInput.value = ""; // Limpiar el campo de contraseña
      }
    });
  });
  