// Elementos del menú móvil
const btnMenu = document.getElementById('btn-menu');
const menuDesplegable = document.getElementById('menu-desplegable');

// Verificar si existe el menú antes de ejecutar
if (btnMenu && menuDesplegable) {
    btnMenu.addEventListener('click', () => {
        menuDesplegable.classList.toggle('active');
    });
}

// Elementos del Login/Registro
const btnShowLogin = document.getElementById('btn-show-login');
const btnShowRegister = document.getElementById('btn-show-register');
const formLogin = document.getElementById('form-login');
const formRegister = document.getElementById('form-register');

// Verificar si existen los elementos antes de ejecutar
if (btnShowLogin && btnShowRegister) {
    btnShowLogin.addEventListener('click', () => {
        formLogin.classList.remove('hidden');
        formRegister.classList.add('hidden');
        btnShowLogin.classList.add('active');
        btnShowRegister.classList.remove('active');
    });

    btnShowRegister.addEventListener('click', () => {
        formRegister.classList.remove('hidden');
        formLogin.classList.add('hidden');
        btnShowRegister.classList.add('active');
        btnShowLogin.classList.remove('active');
    });
}