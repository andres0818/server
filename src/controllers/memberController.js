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
    const result = await pool.query('INSERT INTO members (id, name) VALUES ($1, $2) RETURNING *', [id, name]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear miembro' });
  }
};

const deleteMember = async (req, res) => {
  const { id } = req.params;
  try {
    // Primero eliminamos sus observaciones para mantener la integridad
    await pool.query('DELETE FROM observations WHERE member_id = $1', [id]);
    const result = await pool.query('DELETE FROM members WHERE id = $1 RETURNING *', [id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar miembro' });
  }
};

module.exports = { getMembers, createMember, deleteMember };
