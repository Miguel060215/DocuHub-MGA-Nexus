const db = require('../config/db');

const carreraController = {
    obtenerCarreras: async (req, res) => {
        try {
            const [rows] = await db.query('SELECT id_carrera, nombre_carrera FROM carreras');
            res.status(200).json(rows);
        } catch (error) {
            console.error('Error al obtener carreras:', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
};

module.exports = carreraController;