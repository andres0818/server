const pool = require('../config/db');

const initDb = async () => {
  try {
    // 1. Crear tabla de miembros con columna password
    await pool.query(`
      CREATE TABLE IF NOT EXISTS members (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        password TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Crear tabla de observaciones
    await pool.query(`
      CREATE TABLE IF NOT EXISTS observations (
        id SERIAL PRIMARY KEY,
        member_id VARCHAR(50) NOT NULL,
        type VARCHAR(10) NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('? Base de datos (miembros con password) inicializada');
  } catch (err) {
    console.error('? Error inicializando DB:', err);
  }
};

module.exports = initDb;
