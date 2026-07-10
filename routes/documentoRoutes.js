const express = require('express');
const router = express.Router();
const upload = require('../middlewares/uploadMiddleware');
const documentoController = require('../controllers/documentoController');

router.post('/subir', upload.single('archivo'), documentoController.subirDocumento);

module.exports = router;