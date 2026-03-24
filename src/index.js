const express = require('express');
const cors = require('cors');
require('dotenv').config();

const initDb = require('./models/initDb');
const observationRoutes = require('./routes/observationRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Configuración de CORS robusta
app.use(cors({
  origin: '*', // Permite peticiones desde cualquier origen en desarrollo
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Inicializar DB
initDb();

// Rutas
app.use('/api/observations', observationRoutes);

// Endpoint de salud del servidor
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

app.listen(port, () => {
  console.log(`✅ Servidor API corriendo en puerto ${port}`);
});
