document.addEventListener("DOMContentLoaded", () => {
    const tablaCuerpo = document.querySelector('.table-container tbody');
    const previewContainer = document.querySelector('.l-document-preview');

    const cargarSolicitudes = async () => {
        try {
            const response = await fetch('/documentos/admin/solicitudes');
            if (!response.ok) throw new Error('Error al obtener las solicitudes');

            const documentos = await response.json();
            tablaCuerpo.innerHTML = '';

            if (documentos.length === 0) {
                tablaCuerpo.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay solicitudes registradas.</td></tr>';
                return;
            }

            documentos.forEach(doc => {
                const tr = document.createElement('tr');

                const fechaFormateada = doc.fecha_subida 
                    ? new Date(doc.fecha_subida).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) 
                    : 'Sin fecha';

                let claseEstado = 'estado-pendiente';
                let textoEstado = doc.nombre_estado || 'pendiente';
                
                if (doc.id_estado === 2) {
                    claseEstado = 'estado-aprobado'; 
                } else if (doc.id_estado === 3) {
                    claseEstado = 'estado-rechazado'; 
                }

                tr.innerHTML = `
                    <td>${doc.titulo}</td>
                    <td>${doc.autor_nombre || 'Desconocido'}</td>
                    <td>${fechaFormateada}</td>
                    <td><span class="badge ${claseEstado}">${textoEstado.charAt(0).toUpperCase() + textoEstado.slice(1)}</span></td>
                    <td>
                        <button class="btn-aprobar" data-id="${doc.id_documento}" data-estado-actual="${doc.id_estado}">Aprobar</button>
                        <button class="btn-rechazar" data-id="${doc.id_documento}" data-estado-actual="${doc.id_estado}">Rechazar</button>
                        <button class="btn-leer" data-id="${doc.id_documento}">Leer</button>
                    </td>
                `;

                tablaCuerpo.appendChild(tr);
            });

            vincularEventosBotones();

        } catch (error) {
            console.error('Error al cargar la bandeja del administrador:', error);
            tablaCuerpo.innerHTML = '<tr><td colspan="5" style="text-align: center; color: red;">Error al cargar las solicitudes.</td></tr>';
        }
    };

    const vincularEventosBotones = () => {
        document.querySelectorAll('.btn-leer').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                try {
                    const response = await fetch(`/documentos/${id}`);
                    if (!response.ok) throw new Error('No se pudo cargar el detalle');
                    const doc = await response.json();

                    previewContainer.innerHTML = `
                        <h3>CONTENIDO DEL DOCUMENTO</h3>
                        <div class="detalle-admin-card">
                            <h4>${doc.titulo}</h4>
                            <p><strong>Autor:</strong> ${doc.autor_nombre || 'Desconocido'}</p>
                            <p><strong>Carrera:</strong> ${doc.nombre_carrera || 'General'}</p>
                            <p><strong>Resumen:</strong> ${doc.resumen || 'Sin resumen disponible.'}</p>
                        </div>
                        <div class="pdf-viewer-container" style="height: 350px; border: 1px solid #ddd;">
                            <iframe src="${doc.archivo_url}" width="100%" height="100%" style="border: none;"></iframe>
                        </div>
                        <div style="margin-top: 10px; text-align: center;">
                            <a href="${doc.archivo_url}" target="_blank" class="btn-outline" style="padding: 6px 12px; font-size: 0.85rem; text-decoration: none; display: inline-block;">Abrir PDF en pestaña nueva</a>
                        </div>
                    `;
                } catch (err) {
                    console.error('Error al cargar la vista previa:', err);
                    previewContainer.innerHTML = '<h3>CONTENIDO DEL DOCUMENTO</h3><p style="color: red;">Error al cargar el documento.</p>';
                }
            });
        });

        document.querySelectorAll('.btn-aprobar').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                const estadoActual = parseInt(e.target.getAttribute('data-estado-actual'));

                if (estadoActual !== 1) {
                    const confirmar = confirm("Este documento ya había sido procesado previamente. ¿Estás seguro de cambiar su estado a APROBADO?");
                    if (!confirmar) return;
                }

                await actualizarEstado(id, 2);
            });
        });

        document.querySelectorAll('.btn-rechazar').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                const estadoActual = parseInt(e.target.getAttribute('data-estado-actual'));

                if (estadoActual !== 1) {
                    const confirmar = confirm("Este documento ya había sido procesado previamente. ¿Estás seguro de cambiar su estado a RECHAZADO?");
                    if (!confirmar) return;
                }

                await actualizarEstado(id, 3);
            });
        });
    };

    const actualizarEstado = async (idDocumento, nuevoEstado) => {
        try {
            const response = await fetch(`/documentos/admin/estado/${idDocumento}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id_estado: nuevoEstado })
            });

            const textoRespuesta = await response.text();
            let resultado;
            try {
                resultado = JSON.parse(textoRespuesta);
            } catch (e) {
                console.error("La respuesta del servidor no es un JSON válido:", textoRespuesta);
                alert("Error: El servidor devolvió una respuesta no válida.");
                return;
            }

            if (response.ok) {
                cargarSolicitudes();
            } else {
                alert(resultado.message || 'Error al actualizar el estado');
            }
        } catch (err) {
            console.error('Error crítico de red o de ejecución en actualizarEstado:', err);
            alert('Error al conectar con el servidor');
        }
    };

    // 👇 FUNCIÓN DEL MAPA DENTRO DEL DOMContentLoaded
    const cargarMapaAdmin = async () => {
        const contenedorMapa = document.getElementById('mapa-accesos');
        if (!contenedorMapa) return;

        const map = L.map('mapa-accesos').setView([23.6345, -102.5528], 4);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        try {
            const response = await fetch('/documentos/admin/geo/stats');
            const accesos = await response.json();

            accesos.forEach(acceso => {
                if (acceso.lat && acceso.lon) {
                    L.marker([acceso.lat, acceso.lon])
                        .addTo(map)
                        .bindPopup(`<b>Ciudad:</b> ${acceso.ciudad || 'Desconocida'}<br><b>País:</b> ${acceso.pais || 'Desconocido'}<br><b>IP:</b> ${acceso.ip}`);
                }
            });
        } catch (err) {
            console.error('Error al cargar datos geográficos para el mapa:', err);
        }
    };


    cargarSolicitudes();
    cargarMapaAdmin(); 
});