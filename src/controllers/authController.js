const pool = require('../config/db');

// Iniciar sesión: pide nombre. Si no tiene password, le pedirá que la cree.
const checkUserStatus = async (req, res) => {
  const { name } = req.body;
  try {
    const result = await pool.query('SELECT * FROM members WHERE LOWER(name) = LOWER($1)', [name]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Miembro no encontrado' });
    
    const user = result.rows[0];
    res.json({
      id: user.id,
      name: user.name,
      hasPassword: user.password ? true : false
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al verificar usuario' });
  }
};

// Guardar contraseña por primera vez
const setPassword = async (req, res) => {
  const { id, password } = req.body;
  try {
    const check = await pool.query('SELECT password FROM members WHERE id = $1', [id]);
    if (check.rows[0].password) return res.status(400).json({ error: 'Contraseña ya configurada' });
    
    await pool.query('UPDATE members SET password = $1 WHERE id = $1', [password, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Error al guardar contraseña' });
  }
};

// Login normal con contraseña
const login = async (req, res) => {
  const { id, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM members WHERE id = $1 AND password = $2', [id, password]);
    if (result.rows.length === 0) return res.status(401).json({ error: 'Contraseña incorrecta' });
    
    const user = result.rows[0];
    res.json({ id: user.id, name: user.name });
  } catch (err) {
    res.status(500).json({ error: 'Error en el login' });
  }
};

module.exports = { checkUserStatus, setPassword, login };
