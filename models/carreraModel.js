const db = require('../config/db');

const Carrera = {
    // Obtener todas las carreras
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM carreras');
        return rows;
    },

    // Obtener una carrera por su ID
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM carreras WHERE id_carrera = ?', [id]);
        return rows[0];
    },

    // Crear una nueva carrera
    create: async (nombre) => {
        const [result] = await db.query('INSERT INTO carreras (nombre_carrera) VALUES (?)', [nombre]);
        return result.insertId;
    }
};

module.exports = Carrera;