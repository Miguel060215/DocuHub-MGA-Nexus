const db = require('../config/db');

const DocumentoEtiqueta = {
    // Obtener todas las etiquetas asociadas a un documento
    getEtiquetasByDocumento: async (idDocumento) => {
        const [rows] = await db.query(
            `SELECT e.* FROM etiquetas e
             INNER JOIN documentos_etiquetas de ON e.id_etiqueta = de.id_etiqueta
             WHERE de.id_documento = ?`,
            [idDocumento]
        );
        return rows;
    },

    // Obtener todos los documentos asociados a una etiqueta
    getDocumentosByEtiqueta: async (idEtiqueta) => {
        const [rows] = await db.query(
            `SELECT d.* FROM documentos d
             INNER JOIN documentos_etiquetas de ON d.id_documento = de.id_documento
             WHERE de.id_etiqueta = ?`,
            [idEtiqueta]
        );
        return rows;
    },

    // Asociar una etiqueta a un documento (llave primaria compuesta, no genera insertId util)
    create: async (idDocumento, idEtiqueta) => {
        await db.query(
            'INSERT INTO documentos_etiquetas (id_documento, id_etiqueta) VALUES (?, ?)',
            [idDocumento, idEtiqueta]
        );
        return true;
    },

    // Eliminar la relacion entre un documento y una etiqueta
    delete: async (idDocumento, idEtiqueta) => {
        const [result] = await db.query(
            'DELETE FROM documentos_etiquetas WHERE id_documento = ? AND id_etiqueta = ?',
            [idDocumento, idEtiqueta]
        );
        return result.affectedRows;
    }
};

module.exports = DocumentoEtiqueta;