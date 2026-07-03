const db = require('../config/db');

const Etiqueta = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM etiquetas');
        return rows;
    },
    create: async (nombre) => {
        const [result] = await db.query('INSERT INTO etiquetas (nombre_etiqueta) VALUES (?)', [nombre]);
        return result.insertId;
    }
};
module.exports = Etiqueta;