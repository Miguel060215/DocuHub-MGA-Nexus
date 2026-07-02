const db = require('../config/db');

const Etiqueta = {
    // Obtener todas las etiquetas
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM etiquetas');
        return rows;
    },

    // Obtener una etiqueta por su ID
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM etiquetas WHERE id_etiqueta = ?', [id]);
        return rows[0];
    },

    // Obtener una etiqueta por su nombre (para evitar duplicados al crear)
    getByNombre: async (nombre) => {
        const [rows] = await db.query('SELECT * FROM etiquetas WHERE nombre_etiqueta = ?', [nombre]);
        return rows[0];
    },

    // Crear una nueva etiqueta
    create: async (nombre) => {
        const [result] = await db.query('INSERT INTO etiquetas (nombre_etiqueta) VALUES (?)', [nombre]);
        return result.insertId;
    }
};

module.exports = Etiqueta;