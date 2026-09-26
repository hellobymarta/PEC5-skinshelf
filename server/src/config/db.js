const mongoose = require('mongoose');

// En Vercel cada petición puede despertar una función nueva. Si abriera una
// conexión por petición, el cluster se quedaría sin conexiones enseguida. Por
// eso la guardo en una variable global: si ya está abierta la reutilizo, y si
// se está abriendo espero a esa misma promesa en vez de abrir otra.
let cacheada = globalThis.__conexionSkinshelf;

if (!cacheada) {
  cacheada = globalThis.__conexionSkinshelf = { conexion: null, promesa: null };
}

const conectarDB = async () => {
  if (cacheada.conexion) return cacheada.conexion;

  if (!cacheada.promesa) {
    cacheada.promesa = mongoose.connect(process.env.MONGODB_URI);
  }

  try {
    cacheada.conexion = await cacheada.promesa;
  } catch (error) {
    // Borro la promesa fallida para que el siguiente intento vuelva a probar
    // en vez de quedarse con el error guardado para siempre.
    cacheada.promesa = null;
    throw error;
  }

  console.log(`MongoDB conectado en: ${cacheada.conexion.connection.host}`);
  return cacheada.conexion;
};

module.exports = conectarDB;
