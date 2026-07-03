require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

const authRoutes = require('./routes/authRoutes');
const carreraRoutes = require('./routes/carrerasRoutes');
const documentoRoutes = require('./routes/documentoRoutes');
const etiquetasRoutes = require('./routes/etiquetasRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);
app.use('/carreras', carreraRoutes);
app.use('/documentos', documentoRoutes);
app.use('/etiquetas', etiquetasRoutes);
app.use('/usuarios', usuarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});