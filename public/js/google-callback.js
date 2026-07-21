document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const rol = params.get('rol');
    const usuarioString = params.get('usuario');

    if (token && rol && usuarioString) {
        localStorage.setItem('token', token);
        localStorage.setItem('rol', rol);
        localStorage.setItem('usuarioActual', usuarioString);

        window.location.href = '/index.html';
    } else {
        window.location.href = '/pages/login.html';
    }
});