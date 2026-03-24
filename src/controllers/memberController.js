const pool = require('../config/db');

const getMembers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM members ORDER BY name ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener miembros' });
  }
};

const createMember = async (req, res) => {
  const { id, name } = req.body;
  if (!id || !name) return res.status(400).json({ error: 'ID y Nombre requeridos' });
  
  try {
    // Verificar si ya existe un miembro con ese nombre (insensible a mayúsculas)
    const exists = await pool.query('SELECT * FROM members WHERE LOWER(name) = LOWER($1)', [name.trim()]);
    if (exists.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe un miembro con este nombre' });
    }

    const result = await pool.query('INSERT INTO members (id, name) VALUES ($1, $2) RETURNING *', [id, name.trim()]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear miembro' });
  }
};

const deleteMember = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM observations WHERE member_id = $1', [id]);
    const result = await pool.query('DELETE FROM members WHERE id = $1 RETURNING *', [id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar miembro' });
  }
};

module.exports = { getMembers, createMember, deleteMember };
