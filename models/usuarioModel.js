const db = require('../config/db');

const Usuario = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM usuarios');
        return rows;
    },
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
        return rows[0];
    },
    getByCorreo: async (correo) => {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        return rows[0];
    },
    create: async (u) => {
        const query = `INSERT INTO usuarios (nombre, apellido_paterno, apellido_materno, correo, nombre_usuario, contrasena, id_carrera) 
                       VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(query, [u.nombre, u.apellido_paterno, u.apellido_materno, u.correo, u.nombre_usuario, u.contrasena, u.id_carrera]);
        return result.insertId;
    }
};
module.exports = Usuario;