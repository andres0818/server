const { Pool } = require('pg');
const path = require('path');
// Cargamos explícitamente el archivo .env desde la raíz del proyecto
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const poolConfig = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT, 10) || 5432
};

// Depuración (Ocultando datos sensibles)
console.log(`Conectando a DB: ${poolConfig.host}:${poolConfig.port} con usuario: ${poolConfig.user}`);

const pool = new Pool(poolConfig);

pool.on('error', (err, client) => {
  console.error('Error inesperado en el cliente de la base de datos:', err);
});

module.exports = pool;
