const COLOR_CATEGORIA = {
  limpiador: 'bg-blue-100 text-blue-800',
  tonico: 'bg-cyan-100 text-cyan-800',
  serum: 'bg-purple-100 text-purple-800',
  hidratante: 'bg-teal-100 text-teal-800',
  'protector solar': 'bg-amber-100 text-amber-800',
  mascarilla: 'bg-pink-100 text-pink-800',
  tratamiento: 'bg-rose-100 text-rose-800',
};

const ESTILO_ESTADO = {
  'sin abrir': 'bg-gray-100 text-gray-700',
  'en uso': 'bg-green-100 text-green-800',
  terminado: 'bg-gray-100 text-gray-500 line-through',
};

const Estrellas = ({ puntuacion }) => (
  <span className="text-amber-500" aria-label={`Puntuación: ${puntuacion} de 5`}>
    {Array.from({ length: 5 }, (_, i) => (i < puntuacion ? '★' : '☆')).join('')}
  </span>
);

function ProductoCard({ producto, onEditar, onEliminar }) {
  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-gray-900">{producto.nombre}</h3>
          <p className="text-sm text-gray-500">{producto.marca}</p>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap ${
            COLOR_CATEGORIA[producto.categoria] || 'bg-gray-100 text-gray-700'
          }`}
        >
          {producto.categoria}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            ESTILO_ESTADO[producto.estado] || 'bg-gray-100 text-gray-700'
          }`}
        >
          {producto.estado}
        </span>
        <span className="text-xs text-gray-500 capitalize">{producto.momentoUso}</span>
      </div>

      <div className="text-sm text-gray-700">
        <p>{producto.precio.toFixed(2)} €</p>
        {producto.ingredienteClave && (
          <p className="text-gray-500">{producto.ingredienteClave}</p>
        )}
      </div>

      {producto.puntuacion != null && <Estrellas puntuacion={producto.puntuacion} />}

      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => onEditar(producto)}
          className="flex-1 rounded-md bg-gray-900 text-white text-sm py-1.5 hover:bg-gray-700"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={() => onEliminar(producto._id)}
          className="flex-1 rounded-md border border-red-300 text-red-600 text-sm py-1.5 hover:bg-red-50"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}

export default ProductoCard;
