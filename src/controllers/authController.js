const pool = require('../config/db');

// 1. Verificar si el usuario existe (Insensible a mayúsculas)
const checkUserStatus = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Debes ingresar un nombre' });
  try {
    const result = await pool.query('SELECT * FROM members WHERE LOWER(name) = LOWER($1)', [name.trim()]);
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'No estás autorizado. Contacta con tu líder.' });
    }
    const user = result.rows[0];
    res.json({
      id: user.id,
      name: user.name,
      hasPassword: (user.password && user.password !== '') ? true : false
    });
  } catch (err) {
    console.error('Error en checkUserStatus:', err);
    res.status(500).json({ error: 'Error interno en el servidor' });
  }
};

// 2. Guardar contraseña por primera vez (SOLUCION AL ERROR DE PARAMETROS)
const setPassword = async (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) return res.status(400).json({ error: 'Datos incompletos' });
  try {
    const userCheck = await pool.query('SELECT * FROM members WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) return res.status(404).json({ error: 'Usuario no existe' });
    
    // Si ya tiene password, no dejamos cambiarla aquí
    if (userCheck.rows[0].password) {
      return res.status(400).json({ error: 'La contraseña ya fue configurada anteriormente' });
    }

    // CORRECCION: $1 para password, $2 para id
    await pool.query('UPDATE members SET password = $1 WHERE id = $2', [password, id]);
    res.json({ success: true, message: 'Contraseña configurada con éxito' });
  } catch (err) {
    console.error('Error al guardar password:', err.message);
    res.status(500).json({ error: 'Error técnico: ' + err.message });
  }
};

// 3. Login con contraseña
const login = async (req, res) => {
  const { id, password } = req.body;
  if (!id || !password) return res.status(400).json({ error: 'ID y Contraseña requeridos' });
  try {
    const result = await pool.query('SELECT * FROM members WHERE id = $1 AND password = $2', [id, password]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }
    const user = result.rows[0];
    res.json({ id: user.id, name: user.name });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ error: 'Error en el proceso de inicio de sesión' });
  }
};

module.exports = { checkUserStatus, setPassword, login };
