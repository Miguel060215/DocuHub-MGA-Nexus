require('dotenv').config(); // Debe ser la primera línea
const mysql = require('mysql2/promise');

// Depuración: Verifica si las variables llegan a Node.js
console.log("Configuración de DB:", {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password_length: process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0
});

if (!process.env.DB_PASSWORD) {
    console.error("¡ERROR! No se cargó la contraseña de la base de datos desde el .env");
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 23626,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl:{
        rejectUnauthorized: false
    }
});

module.exports = pool;