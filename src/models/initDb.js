const pool = require('../config/db');

const initDb = async () => {
  try {
    // 1. Asegurar tabla de miembros y columna password
    await pool.query(`
      CREATE TABLE IF NOT EXISTS members (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Añadir columna password si no existe (Fix para el error 500)
    await pool.query(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM pg_attribute WHERE attrelid = 'members'::regclass AND attname = 'password') THEN
          ALTER TABLE members ADD COLUMN password TEXT;
        END IF;
      END $$;
    `);

    // 2. Tabla de observaciones
    await pool.query(`
      CREATE TABLE IF NOT EXISTS observations (
        id SERIAL PRIMARY KEY,
        member_id VARCHAR(50) NOT NULL,
        type VARCHAR(10) NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('? Base de datos sincronizada correctamente');
  } catch (err) {
    console.error('? Error sincronizando DB:', err);
  }
};

module.exports = initDb;
