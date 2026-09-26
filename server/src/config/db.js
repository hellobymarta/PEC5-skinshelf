const mongoose = require('mongoose');

// En Vercel cada peticion puede despertar una funcion nueva. Si abriera una
// conexion por peticion, el cluster se quedaria sin conexiones enseguida. Por
// eso la guardo en una variable global: si ya esta abierta la reutilizo, y si
// se esta abriendo espero a esa misma promesa en vez de abrir otra.
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
