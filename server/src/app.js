require('dotenv').config();

const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productos.routes');
const conectarDB = require('./config/db');
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

// En local la conexion la abre server.js al arrancar; en Vercel no hay arranque,
// asi que la abro aqui antes de las rutas de datos. Como esta cacheada, solo se
// conecta de verdad la primera vez.
const conMongo = async (req, res, next) => {
  try {
    await conectarDB();
    next();
  } catch (error) {
    res.status(503).json({
      error: 'No he podido conectar con la base de datos.',
      detalle: error.message,
    });
  }
};

// La ruta de estado va antes y a proposito no pasa por conMongo: asi distingo
// "la API no responde" de "la API responde pero no llega a Mongo".
app.use('/api/productos', conMongo, productosRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
