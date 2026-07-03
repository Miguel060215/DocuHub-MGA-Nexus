const db = require('../config/db');

const Carrera = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM carreras');
        return rows;
    },
    create: async (nombre) => {
        const [result] = await db.query('INSERT INTO carreras (nombre_carrera) VALUES (?)', [nombre]);
        return result.insertId;
    }
};
module.exports = Carrera;