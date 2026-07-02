const db = require('../config/db');

const Usuario = {
    // Obtener todos los usuarios
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM usuarios');
        return rows;
    },

    // Obtener un usuario por su ID
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id_usuario = ?', [id]);
        return rows[0];
    },

    // Obtener un usuario por su correo (para el login)
    getByCorreo: async (correo) => {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        return rows[0];
    },

    // Crear un nuevo usuario
    create: async (usuario) => {
        const { nombre, correo, password, id_carrera } = usuario;
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, correo, password, id_carrera) VALUES (?, ?, ?, ?)',
            [nombre, correo, password, id_carrera]
        );
        return result.insertId;
    },

    // Actualizar los datos de un usuario
    update: async (id, usuario) => {
        const { nombre, correo, id_carrera } = usuario;
        const [result] = await db.query(
            'UPDATE usuarios SET nombre = ?, correo = ?, id_carrera = ? WHERE id_usuario = ?',
            [nombre, correo, id_carrera, id]
        );
        return result.affectedRows;
    },

    // Eliminar un usuario
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM usuarios WHERE id_usuario = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = Usuario;