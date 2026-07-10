document.addEventListener('DOMContentLoaded', () => {
    const usuarioGuardado = localStorage.getItem('usuarioActual');
    const token = localStorage.getItem('token');

    const rutaActual = window.location.pathname;
    const esPaginaPublica = rutaActual.includes('login.html') || rutaActual === '/' || rutaActual.endsWith('index.html');

    if (!usuarioGuardado && !esPaginaPublica && rutaActual.includes('/pages/')) {
        window.location.href = '/pages/login.html';
        return;
    }

    const linkLogin = document.getElementById('link-login');
    const panelUsuario = document.getElementById('panel-usuario');
    const contenedorNombre = document.getElementById('usuario-nombre');

    if (usuarioGuardado) {
        const usuario = JSON.parse(usuarioGuardado);
        
        if (linkLogin) linkLogin.style.display = 'none';
        if (panelUsuario) panelUsuario.style.display = 'flex'; // o 'block' según tus estilos

        if (contenedorNombre) {
            contenedorNombre.textContent = usuario.nombre_usuario || usuario.nombre;
        }
    } else {
        if (linkLogin) linkLogin.style.display = 'block';
        if (panelUsuario) panelUsuario.style.display = 'none';
    }
});

function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuarioActual');
    window.location.href = '/pages/login.html';
}