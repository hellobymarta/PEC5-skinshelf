// La entrada que usa Vercel: la aplicación de Express montada como función
// serverless. Todo lo que llegue aquí lo enruta Express igual que en local
// (las reglas de vercel.json redirigen las peticiones a este archivo).
module.exports = require('../src/app');
