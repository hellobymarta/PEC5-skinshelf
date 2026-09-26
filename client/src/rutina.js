// El orden en el que se aplican los productos. Lo deduzco de la categoria, asi
// no hace falta un campo nuevo en la base de datos: el que va primero es el que
// tiene menos indice en esta lista.
export const ORDEN_PASOS = [
  'limpiador',
  'tonico',
  'mascarilla',
  'tratamiento',
  'serum',
  'hidratante',
  'protector solar',
];

export const MOMENTOS = {
  manana: { clave: 'manana', valor: 'mañana', titulo: 'Rutina de mañana' },
  noche: { clave: 'noche', valor: 'noche', titulo: 'Rutina de noche' },
};

// Los productos de un momento, ya ordenados. Fuera los terminados (no se pueden
// usar) y fuera el protector solar por la noche, aunque este marcado como
// "ambos": de noche no se aplica.
export const pasosDelMomento = (productos, clave) => {
  const valor = MOMENTOS[clave].valor;

  return productos
    .filter((producto) => {
      if (producto.estado === 'terminado') return false;
      if (producto.momentoUso !== valor && producto.momentoUso !== 'ambos') return false;
      if (clave === 'noche' && producto.categoria === 'protector solar') return false;
      return true;
    })
    .sort((a, b) => ORDEN_PASOS.indexOf(a.categoria) - ORDEN_PASOS.indexOf(b.categoria));
};

// Lo que llevo hecho hoy. Va en el navegador y no en Mongo porque es un dato del
// dia, no del producto: manana la rutina vuelve a empezar de cero. La clave
// incluye la fecha, asi que se reinicia sola al cambiar el dia.
const claveDeHoy = () => `skinshelf-rutina-${new Date().toISOString().slice(0, 10)}`;

export const leerMarcados = () => {
  try {
    return JSON.parse(localStorage.getItem(claveDeHoy()) || '{}');
  } catch {
    return {};
  }
};

export const guardarMarcados = (marcados) => {
  try {
    localStorage.setItem(claveDeHoy(), JSON.stringify(marcados));
  } catch {
    // Si el navegador no deja guardar (modo privado), la rutina sigue
    // funcionando: solo se pierde el marcado al recargar.
  }
};
