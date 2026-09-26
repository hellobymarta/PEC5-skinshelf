require('dotenv').config();

const app = require('./app');
const conectarDB = require('./config/db');

const PORT = process.env.PORT || 4000;

// Solo para trabajar en local. En Vercel no se ejecuta: allí la entrada es
// api/index.js, que exporta la aplicación como función.
conectarDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`No he podido conectar con MongoDB: ${error.message}`);
    process.exit(1);
  });
