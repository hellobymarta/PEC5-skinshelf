import { rutaFoto } from '../foto';

const Estrellas = ({ puntuacion }) => (
  <span className="text-dia" aria-label={`Puntuación: ${puntuacion} de 5`}>
    {Array.from({ length: 5 }, (_, i) => (i < puntuacion ? '★' : '☆')).join('')}
  </span>
);

const ESTILO_ESTADO = {
  'sin abrir': 'border-borde text-suave',
  'en uso': 'border-acento/30 bg-acento-claro text-acento',
  terminado: 'border-borde text-suave line-through',
};

const ESTILO_MOMENTO = {
  mañana: 'bg-dia-claro text-dia',
  noche: 'bg-noche-claro text-noche',
  ambos: 'bg-hueso text-suave',
};

function ProductoCard({ producto, onEditar, onEliminar }) {
  const foto = rutaFoto(producto.foto);

  return (
    <article className="tarjeta flex flex-col gap-3 p-5">
      {foto && (
        <div className="-mx-2 -mt-2 mb-1 flex aspect-square items-center justify-center rounded-lg bg-hueso">
          <img
            src={foto}
            alt={producto.nombre}
            loading="lazy"
            className="h-full w-full object-contain p-4"
          />
        </div>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="etiqueta">{producto.categoria}</p>
          <h3 className="mt-1 line-clamp-2 font-medium">{producto.nombre}</h3>
          <p className="truncate text-sm text-suave">{producto.marca}</p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] ${
            ESTILO_MOMENTO[producto.momentoUso] || 'bg-hueso text-suave'
          }`}
        >
          {producto.momentoUso}
        </span>
      </div>

      {producto.ingredienteClave && (
        <p className="text-sm text-suave">{producto.ingredienteClave}</p>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
        <span
          className={`rounded-full border px-2.5 py-0.5 text-[11px] ${
            ESTILO_ESTADO[producto.estado] || 'border-borde text-suave'
          }`}
        >
          {producto.estado}
        </span>
        <span className="text-suave">{producto.precio.toFixed(2)} €</span>
        {producto.puntuacion != null && <Estrellas puntuacion={producto.puntuacion} />}
      </div>

      {producto.notas && (
        <p className="line-clamp-2 text-sm text-suave">{producto.notas}</p>
      )}

      <div className="mt-auto flex gap-2 pt-1">
        <button type="button" onClick={() => onEditar(producto)} className="boton-suave flex-1">
          Editar
        </button>
        <button
          type="button"
          onClick={() => onEliminar(producto._id)}
          className="boton-suave flex-1 text-suave hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          Eliminar
        </button>
      </div>
    </article>
  );
}

export default ProductoCard;
