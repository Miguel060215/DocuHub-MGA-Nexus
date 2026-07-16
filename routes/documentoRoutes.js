const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const documentoController = require('../controllers/documentoController');
const Documento = require('../models/documentoModel');

router.get('/admin/solicitudes', documentoController.obtenerDocumentosAdmin);
router.put('/admin/estado/:id', documentoController.cambiarEstadoDocumento);

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

router.post('/subir', upload.single('archivo'), documentoController.subirDocumento);

router.get('/:id', documentoController.obtenerDocumentoPorId);

router.post('/geo/registrar', documentoController.registrarAccesoGeo);

router.get('/admin/geo/stats', documentoController.obtenerAccesosGeoAdmin);

module.exports = router;