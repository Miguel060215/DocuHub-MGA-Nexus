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
                const el = document.getElementById(id);
                if (el) el.style.color = reglas[id] ? "green" : "red";
            }
        });
    }

    if (pass2) {
        pass2.addEventListener("input", function() {
            const mensaje = document.getElementById("coincidencia");
            if (!mensaje) return;
            const esValido = (pass1 && pass1.value === this.value && pass1.value !== "");
            mensaje.textContent = esValido ? "Las contraseñas coinciden" : "Las contraseñas no coinciden";
            mensaje.style.color = esValido ? "green" : "red";
        });
    }

    document.querySelectorAll(".toggle-pass").forEach(boton => {
        boton.addEventListener("click", function() {
            let input = this.previousElementSibling;
            if (!input) return;
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

            const minimoEl = document.getElementById("minimo");
            if (minimoEl && minimoEl.style.color !== "green") {
                alert("La contraseña no cumple con los requisitos de seguridad.");
                return;
            }
            if (pass1 && pass2 && pass1.value !== pass2.value) {
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
                contrasena: pass1 ? pass1.value : '',
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

    const cargarNovedades = async () => {
        const contenedorNovedades = document.getElementById('novedades-container');
        if (!contenedorNovedades) return;

        try {
            const response = await fetch('/documentos/recientes');
            if (!response.ok) throw new Error('Error al obtener documentos recientes');

            const documentos = await response.json();
            contenedorNovedades.innerHTML = '';

            documentos.forEach(doc => {
                const article = document.createElement('article');
                article.className = 'card';
                article.innerHTML = `
                    <h3 class="card-title">${doc.titulo}</h3>
                    <div class="card-meta">
                        <span>Autor: ${doc.autor_nombre || 'Desconocido'}</span> | <span>Carrera: ${doc.nombre_carrera || 'General'}</span>
                    </div>
                    <p class="card-excerpt">
                        ${doc.resumen ? doc.resumen.substring(0, 95) + '...' : 'Sin descripción disponible.'}
                    </p>
                    <a href="/pages/documento.html?id=${doc.id_documento}" class="btn-outline btn-block">VER DOCUMENTO</a>
                `;
                contenedorNovedades.appendChild(article);
            });
        } catch (error) {
            console.error("No se pudieron renderizar las novedades: ", error);
            contenedorNovedades.innerHTML = '<p>No se pudieron cargar las novedades en este momento.</p>';
        }
    };

    const cargarDetalleDocumento = async () => {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');

        if (!id) return;

        try {
            const response = await fetch(`/documentos/${id}`);
            if (!response.ok) throw new Error('No se pudo cargar el documento');

            const doc = await response.json();

            const tituloEl = document.querySelector('.detalle-titulo');
            if (tituloEl) tituloEl.textContent = doc.titulo;

            const metas = document.querySelectorAll('.detalle-meta__item');
            if (metas.length >= 4) {
                metas[0].innerHTML = `<strong>Autor:</strong> ${doc.autor_nombre || 'Desconocido'}`;
                metas[1].innerHTML = `<strong>Carrera:</strong> ${doc.nombre_carrera || 'General'}`;
                const fechaFormateada = doc.fecha_subida ? new Date(doc.fecha_subida).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }) : 'Fecha desconocida';
                metas[2].innerHTML = `<strong>Fecha:</strong> ${fechaFormateada}`;
                metas[3].innerHTML = `<strong>Tipo:</strong> Documento`;
            }

            const resumenEl = document.querySelector('.detalle-resumen__texto');
            if (resumenEl) resumenEl.textContent = doc.resumen || 'Sin resumen disponible.';

            const tagsContainer = document.querySelector('.detalle-tags');
            if (tagsContainer && doc.etiquetas) {
                tagsContainer.innerHTML = '';
                doc.etiquetas.forEach(tag => {
                    const span = document.createElement('span');
                    span.className = 'detalle-tag';
                    span.textContent = tag.nombre_etiqueta;
                    tagsContainer.appendChild(span);
                });
            }

            const iframe = document.getElementById('pdf-iframe');
            const downloadBtn = document.querySelector('.download-btn');
            
            if (iframe && doc.archivo_url) {
                iframe.dataset.src = doc.archivo_url;
            }
            if (downloadBtn && doc.archivo_url) {
                downloadBtn.href = doc.archivo_url;
            }

        } catch (error) {
            console.error("Error al renderizar el detalle del documento:", error);
        }
    };

    const cargarFiltrosCarreras = async () => {
        const contenedor = document.getElementById('carreras-checklist-container');
        if (!contenedor) return;

        try {
            const response = await fetch('/carreras');
            if (!response.ok) throw new Error('Error al cargar carreras');
            const carreras = await response.json();

            contenedor.innerHTML = '';
            carreras.forEach(c => {
                const label = document.createElement('label');
                label.className = 'check-btn';
                label.innerHTML = `
                    <input type="checkbox" name="carrera" value="${c.id_carrera}"> 
                    ${c.nombre_carrera}
                `;
                contenedor.appendChild(label);
            });
        } catch (err) {
            console.error('No se pudieron cargar los filtros de carreras:', err);
        }
    };

    const ejecutarBusqueda = async () => {
        const inputTexto = document.getElementById('input-busqueda');
        const contenedorResultados = document.getElementById('resultados-container');
        if (!contenedorResultados || !inputTexto) return;

        const query = inputTexto.value.trim();
        const checkboxes = document.querySelectorAll('input[name="carrera"]:checked');
        const carrerasSeleccionadas = Array.from(checkboxes).map(cb => cb.value).join(',');

        try {
            contenedorResultados.innerHTML = '<p>Buscando documentos...</p>';
            const url = `/documentos/buscar?q=${encodeURIComponent(query)}&carreras=${carrerasSeleccionadas}`;
            const response = await fetch(url);
            if (!response.ok) throw new Error('Error en la búsqueda');

            const resultados = await response.json();
            contenedorResultados.innerHTML = '';

            if (resultados.length === 0) {
                contenedorResultados.innerHTML = '<p>No se encontraron resultados para tu búsqueda.</p>';
                return;
            }

           resultados.forEach(doc => {
                const card = document.createElement('article');
                card.className = 'card-resultado';
                
                const indicadorLocal = doc.es_local 
                    ? '<span title="Documento Local DocuHub" style="float:right; color: gold;">⭐ Local</span>' 
                    : '<span style="float:right; color: gray;">🌐 CORE API</span>';

                card.innerHTML = `
                    <div class="card-resultado-header">
                        ${indicadorLocal}
                        <h4>${doc.titulo}</h4>
                        <p>Autor: ${doc.autor_nombre || 'Desconocido'}</p>
                        <p>Carrera: ${doc.nombre_carrera || 'General'}</p>
                        <p>Abstract: ${doc.resumen ? doc.resumen.substring(0, 110) + '...' : 'Sin resumen'}</p>
                    </div>
                    <hr class="dotted-divider">
                    <div class="card-resultado-footer">
                        <div class="tags-green">
                            <span class="tag-green">Investigación</span>
                        </div>
                        <button class="btn-ver-mas" type="button">Ver Mas</button>
                    </div>
                `;

                const btnVerMas = card.querySelector('.btn-ver-mas');
                if (doc.es_local) {
                    btnVerMas.addEventListener('click', () => {
                        window.location.href = `/pages/documento.html?id=${doc.id_documento}`;
                    });
                } else if (doc.archivo_url) {
                    btnVerMas.addEventListener('click', () => {
                        window.open(doc.archivo_url, '_blank', 'noopener,noreferrer');
                    });
                } else {
                    btnVerMas.disabled = true;
                    btnVerMas.title = 'Este documento no tiene una URL de descarga disponible desde CORE';
                    btnVerMas.textContent = 'No disponible';
                }

                contenedorResultados.appendChild(card);
            });
        } catch (err) {
            console.error('Error al realizar la búsqueda:', err);
            contenedorResultados.innerHTML = '<p>Ocurrió un error al procesar la búsqueda.</p>';
        }
    };

    cargarNovedades();
    cargarDetalleDocumento();
    cargarFiltrosCarreras();

    const btnBuscar = document.getElementById('btn-ejecutar-busqueda');
    const inputBusqueda = document.getElementById('input-busqueda');

    if (btnBuscar) btnBuscar.addEventListener('click', ejecutarBusqueda);
    if (inputBusqueda) {
        inputBusqueda.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') ejecutarBusqueda();
        });
    }
});