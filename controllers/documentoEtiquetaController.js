const DocumentoEtiqueta = require('../models/documentoEtiquetasModel');

const documentoEtiquetaController = {
    obtenerPorDocumento: async (req, res) => {
        try {
            const { id } = req.params;
            const etiquetas = await DocumentoEtiqueta.getByDocumento ? await DocumentoEtiqueta.getByDocumento(id) : [];
            res.json(etiquetas);
        } catch (error) {
            console.error('Error al obtener etiquetas del documento:', error);
            res.status(500).json({ message: 'Error interno en el servidor' });
        }
    }
};

module.exports = documentoEtiquetaController;