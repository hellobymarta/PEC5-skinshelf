import { useEffect, useState } from 'react';

const construirEstadoInicial = (producto) => ({
  nombre: producto?.nombre ?? '',
  marca: producto?.marca ?? '',
  categoria: producto?.categoria ?? '',
  ingredienteClave: producto?.ingredienteClave ?? '',
  momentoUso: producto?.momentoUso ?? 'ambos',
  precio: producto?.precio ?? 0,
  fechaApertura: producto?.fechaApertura ? producto.fechaApertura.slice(0, 10) : '',
  estado: producto?.estado ?? 'sin abrir',
  puntuacion: producto?.puntuacion ?? '',
  notas: producto?.notas ?? '',
});

const construirDatosParaGuardar = (valores) => ({
  nombre: valores.nombre,
  marca: valores.marca,
  categoria: valores.categoria,
  ingredienteClave: valores.ingredienteClave.trim() || undefined,
  momentoUso: valores.momentoUso,
  precio: Number(valores.precio) || 0,
  fechaApertura: valores.fechaApertura || undefined,
  estado: valores.estado,
  puntuacion: valores.puntuacion === '' ? undefined : Number(valores.puntuacion),
  notas: valores.notas.trim() || undefined,
});

function ProductoForm({ productoInicial, onGuardar, onCancelar }) {
  const [valores, setValores] = useState(() => construirEstadoInicial(productoInicial));
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    setValores(construirEstadoInicial(productoInicial));
    setError('');
  }, [productoInicial]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setValores((prev) => ({ ...prev, [name]: value }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setError('');
    setEnviando(true);
    try {
      await onGuardar(construirDatosParaGuardar(valores));
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={manejarEnvio} className="flex flex-col gap-4">
      {error && (
        <p className="rounded-md bg-red-50 text-red-700 text-sm px-3 py-2">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={valores.nombre}
            onChange={manejarCambio}
            required
            maxLength={80}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Marca</label>
          <input
            type="text"
            name="marca"
            value={valores.marca}
            onChange={manejarCambio}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-1.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select
            name="categoria"
            value={valores.categoria}
            onChange={manejarCambio}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-1.5"
          >
            <option value="" disabled>
              Selecciona una categoría
            </option>
            <option value="limpiador">limpiador</option>
            <option value="tonico">tonico</option>
            <option value="serum">serum</option>
            <option value="hidratante">hidratante</option>
            <option value="protector solar">protector solar</option>
            <option value="mascarilla">mascarilla</option>
            <option value="tratamiento">tratamiento</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ingrediente clave
          </label>
          <input
            type="text"
            name="ingredienteClave"
            value={valores.ingredienteClave}
            onChange={manejarCambio}
            placeholder="ej. niacinamida 5%"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Momento de uso
          </label>
          <select
            name="momentoUso"
            value={valores.momentoUso}
            onChange={manejarCambio}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5"
          >
            <option value="mañana">mañana</option>
            <option value="noche">noche</option>
            <option value="ambos">ambos</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Precio (€)</label>
          <input
            type="number"
            name="precio"
            value={valores.precio}
            onChange={manejarCambio}
            min={0}
            step="0.01"
            className="w-full rounded-md border border-gray-300 px-3 py-1.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha de apertura
          </label>
          <input
            type="date"
            name="fechaApertura"
            value={valores.fechaApertura}
            onChange={manejarCambio}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
          <select
            name="estado"
            value={valores.estado}
            onChange={manejarCambio}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5"
          >
            <option value="sin abrir">sin abrir</option>
            <option value="en uso">en uso</option>
            <option value="terminado">terminado</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Puntuación (1-5)
          </label>
          <input
            type="number"
            name="puntuacion"
            value={valores.puntuacion}
            onChange={manejarCambio}
            min={1}
            max={5}
            className="w-full rounded-md border border-gray-300 px-3 py-1.5"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notas</label>
        <textarea
          name="notas"
          value={valores.notas}
          onChange={manejarCambio}
          maxLength={300}
          rows={3}
          className="w-full rounded-md border border-gray-300 px-3 py-1.5"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={enviando}
          className="flex-1 rounded-md bg-gray-900 text-white text-sm py-2 hover:bg-gray-700 disabled:opacity-50"
        >
          {enviando ? 'Guardando...' : 'Guardar'}
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="flex-1 rounded-md border border-gray-300 text-sm py-2 hover:bg-gray-50"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

export default ProductoForm;
