require('dotenv').config();

const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productos.routes');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Sin CORS_ORIGIN, el middleware de cors no llega a anadir ninguna cabecera y
// el navegador bloquea todas las peticiones del frontend. La API arrancaria
// igual y el fallo solo se veria en el navegador, asi que aviso aqui.
if (!process.env.CORS_ORIGIN) {
  console.warn(
    'Falta CORS_ORIGIN en las variables de entorno: el navegador bloqueara las peticiones del frontend.'
  );
}

app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API SkinShelf' });
});

app.use('/api/productos', productosRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
