const express = require('express');
const cors = require('cors');
const path = require('path');
// Carga inicial de dotenv en la raíz
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const initDb = require('./models/initDb');
const observationRoutes = require('./routes/observationRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Verificación rápida de variables de entorno críticas
if (!process.env.DB_HOST || !process.env.DB_USER) {
  console.error('❌ ERROR: Variables de entorno DB_HOST o DB_USER no encontradas en .env');
  process.exit(1);
}

// Configuración de CORS robusta
app.use(cors({
  origin: '*',
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
