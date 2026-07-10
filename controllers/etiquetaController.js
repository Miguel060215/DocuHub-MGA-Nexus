const Etiqueta = require('../models/etiquetasModel');

const etiquetaController = {
    obtenerEtiquetas: async (req, res) => {
        try {
            const etiquetas = await Etiqueta.getAll ? await Etiqueta.getAll() : [];
            res.json(etiquetas);
        } catch (error) {
            console.error('Error al obtener etiquetas:', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
};

module.exports = etiquetaController;