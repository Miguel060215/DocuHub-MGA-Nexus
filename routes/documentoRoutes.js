const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const documentoController = require('../controllers/documentoController');
const Documento = require('../models/documentoModel');

router.get('/recientes', async (req, res) => {
    try {
        const documentos = await Documento.getRecent(4);
        res.json(documentos);
    } catch (error) {
        console.error("Error al obtener documentos recientes:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
});

router.get('/buscar', documentoController.buscarDocumentos);

router.get('/:id', documentoController.obtenerDocumentoPorId);

router.post('/subir', upload.single('archivo'), documentoController.subirDocumento);

module.exports = router;