const db = require('../config/db');

const Documento = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM documentos');
        return rows;
    },
    getRecent: async (limit = 4) => {
        const query = `
            SELECT d.*, u.nombre AS autor_nombre, c.nombre_carrera 
            FROM documentos d
            LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
            LEFT JOIN carreras c ON d.id_carrera = c.id_carrera
            ORDER BY d.fecha_subida DESC 
            LIMIT ?
        `;
        const [rows] = await db.query(query, [limit]);
        return rows;
    },
    getById: async (id) => {
        const queryDoc = `
        SELECT d.*, u.nombre AS autor_nombre, c.nombre_carrera 
            FROM documentos d
            LEFT JOIN usuarios u ON d.id_usuario = u.id_usuario
            LEFT JOIN carreras c ON d.id_carrera = c.id_carrera
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
            WHERE (d.titulo LIKE ? OR d.resumen LIKE ?)
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