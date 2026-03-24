const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const initDb = require('./models/initDb');
const observationRoutes = require('./routes/observationRoutes');
const memberRoutes = require('./routes/memberRoutes');

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.DB_HOST || !process.env.DB_USER) {
  console.error('? ERROR: Variables de entorno DB_HOST o DB_USER no encontradas');
  process.exit(1);
}

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'DELETE', 'OPTIONS'] }));
app.use(express.json());

initDb();

app.use('/api/observations', observationRoutes);
app.use('/api/members', memberRoutes);

app.get('/health', (req, res) => res.status(200).json({ status: 'OK' }));

app.listen(port, () => {
  console.log(`? Servidor API corriendo en puerto ${port}`);
});
