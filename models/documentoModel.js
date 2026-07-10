const db = require('../config/db');

const Documento = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM documentos');
        return rows;
    },
    create: async (d) => {
        const query = `
            INSERT INTO documentos (titulo, resumen, archivo_url, nombre_original, fecha_subida, id_usuario, id_carrera) 
            VALUES (?, ?, ?, ?, NOW(), ?, ?)
        `;
        const [result] = await db.query(query, [
            d.titulo, 
            d.resumen, 
            d.archivo_url, 
            d.nombre_original, 
            d.id_usuario, 
            d.id_carrera
        ]);
        return result.insertId;
    }
};

module.exports = Documento;