const pool = require('../config/db');

const getObservations = async (req, res) => {
  const { days, memberId } = req.query;
  try {
    let query = 'SELECT * FROM observations';
    let params = [];

    if (days && days !== 'null' && days !== 'all') {
      query += ' WHERE created_at >= NOW() - $1::INTERVAL';
      params.push(days + ' days');
    }

    if (memberId) {
      query += (params.length === 0 ? ' WHERE ' : ' AND ') + 'member_id = $' + (params.length + 1);
      params.push(memberId);
    }

    query += ' ORDER BY created_at DESC';

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error en getObservations:', err);
    res.status(500).json({ error: 'Error al obtener observaciones' });
  }
};

const createObservation = async (req, res) => {
  const { memberId, type, comment } = req.body;
  if (!memberId || !type) {
    return res.status(400).json({ error: 'memberId y type son requeridos' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO observations (member_id, type, comment) VALUES ($1, $2, $3) RETURNING *',
      [memberId, type, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error en createObservation:', err);
    res.status(500).json({ error: 'Error al crear observación' });
  }
};

module.exports = {
  getObservations,
  createObservation
};
