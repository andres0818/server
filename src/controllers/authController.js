const pool = require('../config/db');

const checkUserStatus = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Debes ingresar un nombre' });
  try {
    const result = await pool.query('SELECT * FROM members WHERE LOWER(name) = LOWER($1)', [name.trim()]);
    if (result.rows.length === 0) return res.status(403).json({ error: 'No estás autorizado.' });
    const user = result.rows[0];
    res.json({
      id: user.id,
      name: user.name,
      hasPassword: (user.password && user.password !== '') ? true : false
    });
  } catch (err) {
    console.error('Error en checkUserStatus:', err);
    res.status(500).json({ error: 'Error interno' });
  }
};

const setPassword = async (req, res) => {
  const { id, password } = req.body;
  try {
    // Primero verificamos si el usuario existe sin pedir la columna password aún
    const userCheck = await pool.query('SELECT * FROM members WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) return res.status(404).json({ error: 'Usuario no existe' });

    // Intentamos actualizar. Si la columna no existe, fallará aquí con un error claro en consola.
    await pool.query('UPDATE members SET password = $1 WHERE id = $1', [password, id]);
    res.json({ success: true });
  } catch (err) {
    console.error('ERROR CRITICO AL GUARDAR PASSWORD:', err.message);
    res.status(500).json({ error: 'Error al guardar contraseña: ' + err.message });
  }
};

const login = async (req, res) => {
  const { id, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM members WHERE id = $1 AND password = $2', [id, password]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Contraseña incorrecta' });
    res.json({ id: result.rows[0].id, name: result.rows[0].name });
  } catch (err) {
    res.status(500).json({ error: 'Error en login' });
  }
};

module.exports = { checkUserStatus, setPassword, login };
