const pool = require('../config/db');

const initDb = async () => {
  try {
    // 1. Crear tabla de miembros
    await pool.query(`
      CREATE TABLE IF NOT EXISTS members (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
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

    // 3. Insertar miembros iniciales
    const members = [
      ['la_ratica99', 'la ratica99'],
      ['ferilo12', 'ferilo12'],
      ['derek', 'Derek'],
      ['andres', 'Andres']
    ];

    for (const [id, name] of members) {
      await pool.query('INSERT INTO members (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING', [id, name]);
    }

    console.log('? Base de datos (miembros y observaciones) inicializada');
  } catch (err) {
    console.error('? Error inicializando DB:', err);
  }
};

module.exports = initDb;
