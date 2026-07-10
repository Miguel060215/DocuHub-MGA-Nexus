document.addEventListener("DOMContentLoaded", () => {
    const btnMenu = document.getElementById('btn-menu');
    const menuDesplegable = document.getElementById('menu-desplegable');
    if (btnMenu && menuDesplegable) {
        btnMenu.addEventListener('click', () => menuDesplegable.classList.toggle('active'));
    }

    const btnShowLogin = document.getElementById('btn-show-login');
    const btnShowRegister = document.getElementById('btn-show-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    // Detectamos el índice real de cada widget de reCAPTCHA, sin depender de asumir el orden a ciegas
    const captchaDivs = Array.from(document.querySelectorAll('.g-recaptcha'));
    const WIDGET_LOGIN = captchaDivs.indexOf(document.getElementById('captcha-login'));
    const WIDGET_REGISTER = captchaDivs.indexOf(document.getElementById('captcha-register'));

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

    const pass1 = document.getElementById("contraseña1");
    const pass2 = document.getElementById("contraseña2");

    if (pass1) {
        pass1.addEventListener("input", function() {
            const val = this.value;
            const reglas = {
                minimo: val.length >= 8,
                mayuscula: /[A-Z]/.test(val),
                numero: /[0-9]/.test(val),
                especial: /[!@#$%^&*(),.?":{}|<>]/.test(val)
            };
            for (let id in reglas) {
                document.getElementById(id).style.color = reglas[id] ? "green" : "red";
            }
        });
    }

    if (pass2) {
        pass2.addEventListener("input", function() {
            const mensaje = document.getElementById("coincidencia");
            const esValido = (pass1.value === this.value && pass1.value !== "");
            mensaje.textContent = esValido ? "Las contraseñas coinciden" : "Las contraseñas no coinciden";
            mensaje.style.color = esValido ? "green" : "red";
        });
    }

    document.querySelectorAll(".toggle-pass").forEach(boton => {
        boton.addEventListener("click", function() {
            let input = this.previousElementSibling;
            input.type = (input.type === "password") ? "text" : "password";
            this.textContent = (input.type === "text") ? "🙈" : "👀";
        });
    });

    if (formLogin) {
        formLogin.addEventListener('submit', async (e) => {
            e.preventDefault();

            const recapchaToken = grecaptcha.getResponse(WIDGET_LOGIN);
            if (recapchaToken.length === 0) {
                alert("Por favor, completa el reCAPTCHA.");
                return;
            }

            const inputs = formLogin.querySelectorAll('input');
            const data = {
                correo: inputs[0].value,
                contrasena: inputs[1].value,
                recaptchaToken: recapchaToken
            };

            try {
                const response = await fetch('/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok) {
                    localStorage.setItem('token', result.token);
                    localStorage.setItem('rol', result.rol);
                    // Guardamos la información completa del usuario para usarla en el resto de páginas
                    localStorage.setItem('usuarioActual', JSON.stringify(result.usuario));

                    if (result.rol === 'administrador') {
                        window.location.href = '/pages/admin.html';
                    } else {
                        window.location.href = '/index.html';
                    }
                } else {
                    alert(result.message);
                    grecaptcha.reset(WIDGET_LOGIN);
                }
            } catch (err) {
                alert('Error en el servidor');
                grecaptcha.reset(WIDGET_LOGIN);
            }
        });
    }

    if (formRegister) {
        formRegister.addEventListener('submit', async (e) => {
            e.preventDefault();

            const recapchaToken = grecaptcha.getResponse(WIDGET_REGISTER);
            if (recapchaToken.length === 0) {
                alert("Por favor, completa el reCAPTCHA.");
                return;
            }

            if (document.getElementById("minimo").style.color !== "green") {
                alert("La contraseña no cumple con los requisitos de seguridad.");
                return;
            }
            if (pass1.value !== pass2.value) {
                alert("Las contraseñas no coinciden");
                return;
            }

            const inputs = formRegister.querySelectorAll('input, select');
            const data = {
                nombre: inputs[0].value,
                apellido_paterno: inputs[1].value,
                apellido_materno: inputs[2].value,
                id_carrera: inputs[3].value,
                correo: inputs[4].value,
                nombre_usuario: inputs[5].value,
                contrasena: pass1.value,
                recaptchaToken: recapchaToken
            };

            try {
                const response = await fetch('/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                if (response.ok) {
                    alert('Registro exitoso');
                    location.reload();
                } else {
                    const res = await response.json();
                    alert(res.message);
                    grecaptcha.reset(WIDGET_REGISTER);
                }
            } catch (err) {
                alert('Error en el servidor');
                grecaptcha.reset(WIDGET_REGISTER);
            }
        });
    }
});