const db = require('../config/db');

const Documento = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM documentos');
        return rows;
    },
    create: async (d) => {
        const query = 'INSERT INTO documentos (titulo, resumen, archivo_url, fecha_subida, id_usuario) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.query(query, [d.titulo, d.resumen, d.archivo_url, d.fecha_subida, d.id_usuario]);
        return result.insertId;
    }
};
module.exports = Documento;