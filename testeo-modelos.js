// Script para probar manualmente que los modelos funcionan contra la base de datos.
// Ejecutar desde la raiz del proyecto con: node test-models.js
// IMPORTANTE: asegurate de que tu .env tenga las credenciales correctas y que
// las tablas ya existan (corre el script SQL en Workbench antes de esto).

const Carrera = require('./models/carreraModel');
const Usuario = require('./models/usuarioModel');
const Documento = require('./models/documentoModel');
const Etiqueta = require('./models/etiquetasModel');
const DocumentoEtiqueta = require('./models/documentoEtiquetasModel');

async function run() {
    try {
        console.log('--- 1. CARRERAS ---');
        const idCarrera = await Carrera.create('Ingenieria de Prueba');
        console.log('Carrera creada con id:', idCarrera);
        console.log('getAll:', await Carrera.getAll());
        console.log('getById:', await Carrera.getById(idCarrera));

        console.log('\n--- 2. USUARIOS ---');
        const idUsuario = await Usuario.create({
            nombre: 'Usuario Prueba',
            correo: `prueba_${Date.now()}@test.com`,
            password: '123456',
            id_carrera: idCarrera
        });
        console.log('Usuario creado con id:', idUsuario);
        console.log('getById:', await Usuario.getById(idUsuario));
        console.log('getByCorreo:', await Usuario.getByCorreo((await Usuario.getById(idUsuario)).correo));

        console.log('\n--- 3. DOCUMENTOS ---');
        const idDocumento = await Documento.create({
            titulo: 'Documento de Prueba',
            descripcion: 'Descripcion de prueba',
            archivo_url: '/uploads/prueba.pdf',
            id_usuario: idUsuario,
            id_carrera: idCarrera
        });
        console.log('Documento creado con id:', idDocumento);
        console.log('getById:', await Documento.getById(idDocumento));
        console.log('search "Prueba":', await Documento.search('Prueba'));

        console.log('\n--- 4. ETIQUETAS ---');
        const idEtiqueta = await Etiqueta.create(`etiqueta_${Date.now()}`);
        console.log('Etiqueta creada con id:', idEtiqueta);
        console.log('getById:', await Etiqueta.getById(idEtiqueta));

        console.log('\n--- 5. DOCUMENTOS_ETIQUETAS ---');
        await DocumentoEtiqueta.create(idDocumento, idEtiqueta);
        console.log('Relacion creada.');
        console.log('Etiquetas del documento:', await DocumentoEtiqueta.getEtiquetasByDocumento(idDocumento));
        console.log('Documentos de la etiqueta:', await DocumentoEtiqueta.getDocumentosByEtiqueta(idEtiqueta));

        console.log('\n--- 6. LIMPIEZA ---');
        await DocumentoEtiqueta.delete(idDocumento, idEtiqueta);
        await Documento.delete(idDocumento);
        await Usuario.delete(idUsuario);
        console.log('Datos de prueba eliminados. (La carrera de prueba se dejo, borrala manualmente si quieres)');

        console.log('\n Todos los modelos funcionaron correctamente.');
    } catch (error) {
        console.error('\n Algo fallo:', error.message);
    } finally {
        process.exit();
    }
}

run();