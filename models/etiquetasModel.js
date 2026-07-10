const db = require('../config/db');

const Etiqueta = {
    findOrCreate: async (nombre) => {
        const [rows] = await db.query('SELECT id_etiqueta FROM etiquetas WHERE nombre_etiqueta = ?', [nombre]);
        if (rows.length > 0) {
            return rows[0].id_etiqueta;
        }
        const [result] = await db.query('INSERT INTO etiquetas (nombre_etiqueta) VALUES (?)', [nombre]);
        return result.insertId;
    }
};

module.exports = Etiqueta;