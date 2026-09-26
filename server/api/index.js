// La entrada que usa Vercel: la aplicacion de Express montada como funcion
// serverless. Todo lo que llegue aqui lo enruta Express igual que en local
// (las reglas de vercel.json redirigen las peticiones a este archivo).
module.exports = require('../src/app');
