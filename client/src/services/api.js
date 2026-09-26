const API_URL = import.meta.env.VITE_API_URL;

const manejarRespuesta = async (respuesta) => {
  const datos = await respuesta.json();
  if (!respuesta.ok) {
    throw new Error(datos.error || 'Error inesperado');
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
