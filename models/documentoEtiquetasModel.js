const db = require('../config/db');

const DocumentoEtiqueta = {
    create: async (idDocumento, idEtiqueta) => {
        const query = 'INSERT INTO documentos_etiquetas (id_documento, id_etiqueta) VALUES (?, ?)';
        const [result] = await db.query(query, [idDocumento, idEtiqueta]);
        return result;
    }
};

module.exports = DocumentoEtiqueta;