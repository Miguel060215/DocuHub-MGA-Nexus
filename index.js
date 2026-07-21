require('dotenv').config();
require('./config/passport');

const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');

const app = express();

app.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

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