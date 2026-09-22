require('dotenv').config();

const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productos.routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API SkinShelf' });
});

app.use('/api/productos', productosRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
