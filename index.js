require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor activo en http://localhost:${PORT}`);
});