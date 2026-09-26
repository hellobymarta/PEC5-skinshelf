require('dotenv').config();

const express = require('express');
const cors = require('cors');
const productosRoutes = require('./routes/productos.routes');
const conectarDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandler');

const app = express();

// Sin CORS_ORIGIN, el middleware de cors no llega a añadir ninguna cabecera y
// el navegador bloquea todas las peticiones del frontend. La API arrancaría
// igual y el fallo solo se vería en el navegador, así que aviso aquí.
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

// En local la conexión la abre server.js al arrancar; en Vercel no hay arranque,
// así que la abro aquí antes de las rutas de datos. Como está cacheada, solo se
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

// La ruta de estado va antes y a propósito no pasa por conMongo: así distingo
// «la API no responde» de «la API responde pero no llega a Mongo».
app.use('/api/productos', conMongo, productosRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
