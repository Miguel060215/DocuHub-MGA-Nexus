const db = require('./config/db');
//chavos este archivo solamente es para comporbar si ya se conecto la base de datos local al proyecto
//para ejecutarlo solo copien esye comando "node test-db.js" y ejecutenlo desde la carpeta raiz del proyecto
async function testConnection() {
    try {
        const [rows] = await db.query('SELECT 1');
        console.log("¡Conexión a la base de datos exitosa!");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error.message);
    }
}

testConnection();