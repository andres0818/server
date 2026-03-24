const pool = require('../config/db');

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS observations (
        id SERIAL PRIMARY KEY,
        member_id VARCHAR(50) NOT NULL,
        type VARCHAR(10) NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Tabla observations verificada/creada');
  } catch (err) {
    console.error('❌ Error inicializando DB:', err);
  }
};

module.exports = initDb;
