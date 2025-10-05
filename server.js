// server.js
require('dotenv').config(); // solo localmente
const express = require('express');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const { sequelize } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Swagger (misma configuración que antes)
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mi Tienda Digital API',
      version: '1.0.0',
      description: 'API REST para gestionar productos'
    },
    servers: [{ url: `http://localhost:${PORT}` }]
  },
  apis: ['./routes/*.js']
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/api', productRoutes);

// Manejo errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Error interno' });
});

// Iniciar: primero conectar a la DB
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a MySQL');
    await sequelize.sync(); // crea tabla si no existe
    app.listen(PORT, () => {
      console.log(`✅ API corriendo en http://localhost:${PORT}`);
      console.log(`📚 Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error('Error conectando a DB:', err);
    process.exit(1);
  }
}
start();
