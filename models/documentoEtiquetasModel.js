const db = require('../config/db');

const DocumentoEtiqueta = {
    create: async (idDocumento, idEtiqueta) => {
        await db.query('INSERT INTO documentos_etiquetas (id_documento, id_etiqueta) VALUES (?, ?)', [idDocumento, idEtiqueta]);
        return true;
    }
};
module.exports = DocumentoEtiqueta;