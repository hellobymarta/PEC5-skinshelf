const API_URL = import.meta.env.VITE_API_URL;

// Leo el cuerpo como texto y luego intento convertirlo, en vez de llamar a
// respuesta.json() directamente. Si quien contesta no es mi API (por ejemplo la
// pagina de error de Render mientras el servicio despierta), lo que llega es
// HTML: con .json() saltaba un "Unexpected token '<'" que no dice nada.
const manejarRespuesta = async (respuesta) => {
  const texto = await respuesta.text();

  let datos = null;
  try {
    datos = texto ? JSON.parse(texto) : null;
  } catch {
    datos = null;
  }

  if (!respuesta.ok) {
    throw new Error(
      (datos && datos.error) || `La API respondio con un error ${respuesta.status}.`
    );
  }

  if (texto && datos === null) {
    throw new Error(
      'La respuesta no es JSON. Comprueba que VITE_API_URL apunta a la API.'
    );
  }

  return datos;
};

export const listarProductos = async (filtros = {}) => {
  const params = new URLSearchParams();
  if (filtros.categoria) params.append('categoria', filtros.categoria);
  if (filtros.estado) params.append('estado', filtros.estado);

  const queryString = params.toString();
  const url = queryString
    ? `${API_URL}/api/productos?${queryString}`
    : `${API_URL}/api/productos`;

  const respuesta = await fetch(url);
  return manejarRespuesta(respuesta);
};

export const obtenerProducto = async (id) => {
  const respuesta = await fetch(`${API_URL}/api/productos/${id}`);
  return manejarRespuesta(respuesta);
};

export const crearProducto = async (datos) => {
  const respuesta = await fetch(`${API_URL}/api/productos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return manejarRespuesta(respuesta);
};

export const actualizarProducto = async (id, datos) => {
  const respuesta = await fetch(`${API_URL}/api/productos/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos),
  });
  return manejarRespuesta(respuesta);
};

export const eliminarProducto = async (id) => {
  const respuesta = await fetch(`${API_URL}/api/productos/${id}`, {
    method: 'DELETE',
  });
  return manejarRespuesta(respuesta);
};
