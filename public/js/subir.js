document.addEventListener('DOMContentLoaded', async () => {
    const selectCarrera = document.getElementById('carrera');
    const formSubir = document.getElementById('form-subir');

    if (selectCarrera) {
        try {
            const resCarreras = await fetch('/carreras');
            const carreras = await resCarreras.json();
            
            if (resCarreras.ok) {
                selectCarrera.innerHTML = '<option value="">Seleccione una carrera</option>';
                carreras.forEach(c => {
                    const option = document.createElement('option');
                    option.value = c.id_carrera; 
                    option.textContent = c.nombre_carrera; 
                    selectCarrera.appendChild(option);
                });
            } else {
                selectCarrera.innerHTML = '<option value="">Error al cargar carreras</option>';
            }
        } catch (err) {
            console.error('Error al obtener carreras:', err);
            selectCarrera.innerHTML = '<option value="">Error de conexión</option>';
        }
    }

    if (!formSubir) return;

    formSubir.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuarioGuardado = localStorage.getItem('usuarioActual');
        if (!usuarioGuardado) {
            alert('No hay una sesión activa. Inicia sesión nuevamente.');
            window.location.href = '/pages/login.html';
            return;
        }

        const usuario = JSON.parse(usuarioGuardado);
        const formData = new FormData();

        formData.append('titulo', document.getElementById('titulo').value);
        formData.append('resumen', document.getElementById('resumen').value);
        formData.append('palabras', document.getElementById('palabras').value);
        formData.append('id_carrera', selectCarrera.value);
        formData.append('id_usuario', usuario.id_usuario);
        
        const archivoInput = document.getElementById('archivo');
        if (archivoInput && archivoInput.files.length > 0) {
            formData.append('archivo', archivoInput.files[0]);
        }

        try {
            const response = await fetch('/documentos/subir', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                alert('¡Documento subido correctamente! Ahora eres autor.');
                formSubir.reset();
                
                // Actualizar rol a autor en la sesión local
                usuario.rol = 'autor';
                localStorage.setItem('usuarioActual', JSON.stringify(usuario));
                localStorage.setItem('rol', 'autor');
            } else {
                alert(data.message || 'Error al subir el documento');
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('Error de conexión con el servidor');
        }
    });
});