const express = require('express');
const router = express.Router();
const carreraController = require('../controllers/carreraController');

router.get('/', carreraController.obtenerCarreras);

module.exports = router;