const db = require('../config/db');

const Documento = {
    // Obtener todos los documentos
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM documentos');
        return rows;
    },

    // Obtener un documento por su ID
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM documentos WHERE id_documento = ?', [id]);
        return rows[0];
    },

    // Obtener documentos de una carrera especifica (para el catalogo)
    getByCarrera: async (idCarrera) => {
        const [rows] = await db.query('SELECT * FROM documentos WHERE id_carrera = ?', [idCarrera]);
        return rows;
    },

    // Obtener documentos subidos por un usuario especifico
    getByUsuario: async (idUsuario) => {
        const [rows] = await db.query('SELECT * FROM documentos WHERE id_usuario = ?', [idUsuario]);
        return rows;
    },

    // Buscar documentos por titulo (usado en buscar.html)
    search: async (texto) => {
        const [rows] = await db.query('SELECT * FROM documentos WHERE titulo LIKE ?', [`%${texto}%`]);
        return rows;
    },

    // Crear un nuevo documento (subir.html)
    create: async (documento) => {
        const { titulo, descripcion, archivo_url, id_usuario, id_carrera } = documento;
        const [result] = await db.query(
            'INSERT INTO documentos (titulo, descripcion, archivo_url, id_usuario, id_carrera) VALUES (?, ?, ?, ?, ?)',
            [titulo, descripcion, archivo_url, id_usuario, id_carrera]
        );
        return result.insertId;
    },

    // Eliminar un documento
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM documentos WHERE id_documento = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = Documento;