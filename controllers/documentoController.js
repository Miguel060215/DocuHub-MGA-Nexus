const Documento = require('../models/documentoModel');
const Etiqueta = require('../models/etiquetasModel');
const DocumentoEtiqueta = require('../models/documentoEtiquetasModel');
const db = require('../config/db');

const documentoController = {
    subirDocumento: async (req, res) => {
        try {
            const { titulo, resumen, id_usuario, id_carrera, palabras } = req.body;

            if (!req.file) {
                return res.status(400).json({ message: 'No se ha adjuntado ningún archivo PDF' });
            }

            const nuevoDoc = {
                titulo,
                resumen,
                archivo_url: `/uploads/${req.file.filename}`,
                nombre_original: req.file.originalname,
                id_usuario,
                id_carrera
            };

            const idDocumento = await Documento.create(nuevoDoc);

            // Procesar palabras clave si existen
            if (palabras && palabras.trim() !== '') {
                const listaPalabras = palabras.split(',').map(p => p.trim()).filter(p => p !== '');
                for (const palabra of listaPalabras) {
                    const idEtiqueta = await Etiqueta.findOrCreate(palabra);
                    await DocumentoEtiqueta.create(idDocumento, idEtiqueta);
                }
            }

            await db.query(
                "UPDATE usuarios SET rol = 'autor' WHERE id_usuario = ? AND rol = 'lector'",
                [id_usuario]
            );

            res.status(201).json({ 
                message: 'Documento subido, etiquetas registradas y rol actualizado a autor con éxito',
                id_documento: idDocumento 
            });
        } catch (error) {
            console.error('Error detallado al subir documento:', error.message);
            console.error('Stack:', error.stack);
            res.status(500).json({ message: 'Error interno en el servidor', detalle: error.message });
        }
    }
};

module.exports = documentoController;