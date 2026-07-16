const db = require('../config/db');

const Documento = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM documentos');
        return rows;
    },

    getRecent: async (limit = 4) => {
        const query = `
            SELECT d.*, u.nombre AS autor_nombre, c.nombre_carrera, e.nombre_estado 
            FROM documentos d
            LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
            LEFT JOIN carreras c ON d.id_carrera = c.id_carrera
            JOIN estados_documento e ON d.id_estado = e.id_estado
            WHERE d.id_estado = 2 
            ORDER BY d.fecha_subida DESC 
            LIMIT ?
        `;
        const [rows] = await db.query(query, [limit]);
        return rows;
    },

    getById: async (id) => {
        const queryDoc = `
            SELECT d.*, u.nombre AS autor_nombre, c.nombre_carrera, e.nombre_estado 
            FROM documentos d
            LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
            LEFT JOIN carreras c ON d.id_carrera = c.id_carrera
            JOIN estados_documento e ON d.id_estado = e.id_estado
            WHERE d.id_documento = ?
        `;
        const [rows] = await db.query(queryDoc, [id]);
        if(rows.length === 0) return null;

        const documento = rows[0];

        const queryTags = `
            SELECT e.nombre_etiqueta 
            FROM etiquetas e
            JOIN documentos_etiquetas de ON e.id_etiqueta = de.id_etiqueta
            WHERE de.id_documento = ?
        `;
        const [tags] = await db.query(queryTags, [id]);
        documento.etiquetas = tags;
        return documento;
    },

    searchLocal: async (termino, carrerasId = []) => {
        let query = `
            SELECT d.*, u.nombre AS autor_nombre, c.nombre_carrera, 1 AS es_local
            FROM documentos d
            LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
            LEFT JOIN carreras c ON d.id_carrera = c.id_carrera
            WHERE d.id_estado = 2 AND (d.titulo LIKE ? OR d.resumen LIKE ?)
        `;
        const params = [`%${termino}%`, `%${termino}%`];
        
        if(carrerasId.length > 0) {
            query += ' AND d.id_carrera IN (?)';
            params.push(carrerasId);
        }
        query += ' ORDER BY d.fecha_subida DESC LIMIT 25';
        
        const [rows] = await db.query(query, params);
        return rows;
    },

    create: async (d) => {
        const query = `
            INSERT INTO documentos (titulo, resumen, archivo_url, nombre_original, fecha_subida, id_usuario, id_carrera, id_estado) 
            VALUES (?, ?, ?, ?, NOW(), ?, ?, 1)
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
    },

    
    getAllForAdmin: async () => {
        const query = `
            SELECT d.*, u.nombre AS autor_nombre, c.nombre_carrera, e.nombre_estado 
            FROM documentos d
            LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
            LEFT JOIN carreras c ON d.id_carrera = c.id_carrera
            JOIN estados_documento e ON d.id_estado = e.id_estado
            ORDER BY 
                CASE WHEN d.id_estado = 1 THEN 0 ELSE 1 END, 
                d.fecha_subida DESC
        `;
        const [rows] = await db.query(query);
        return rows;
    },

    updateStatus: async (idDocumento, idEstado) => {
        const query = `UPDATE documentos SET id_estado = ? WHERE id_documento = ?`;
        const [result] = await db.query(query, [idEstado, idDocumento]);
        return result.affectedRows;
    }
};

module.exports = Documento;