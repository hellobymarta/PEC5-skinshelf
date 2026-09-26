import { useEffect, useState } from 'react';
import ProductoList from './components/ProductoList';
import ProductoForm from './components/ProductoForm';
import {
  listarProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
} from './services/api';

const CATEGORIAS = [
  'limpiador',
  'tonico',
  'serum',
  'hidratante',
  'protector solar',
  'mascarilla',
  'tratamiento',
];

const ESTADOS = ['sin abrir', 'en uso', 'terminado'];

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [filtros, setFiltros] = useState({ categoria: '', estado: '' });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  const cargarProductos = async () => {
    setCargando(true);
    setError('');
    try {
      const datos = await listarProductos(filtros);
      setProductos(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [filtros]);

  const manejarCambioFiltro = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const abrirFormularioCrear = () => {
    setProductoEditando(null);
    setMostrarFormulario(true);
  };

  const abrirFormularioEditar = (producto) => {
    setProductoEditando(producto);
    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setProductoEditando(null);
  };

  const guardarProducto = async (datos) => {
    if (productoEditando) {
      await actualizarProducto(productoEditando._id, datos);
    } else {
      await crearProducto(datos);
    }
    cerrarFormulario();
    await cargarProductos();
  };

  const eliminarProductoConfirmado = async (id) => {
    const confirmado = window.confirm('¿Seguro que quieres eliminar este producto?');
    if (!confirmado) return;

    try {
      await eliminarProducto(id);
      await cargarProductos();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">SkinShelf</h1>
          {!mostrarFormulario && (
            <button
              type="button"
              onClick={abrirFormularioCrear}
              className="rounded-md bg-gray-900 text-white text-sm px-4 py-2 hover:bg-gray-700"
            >
              + Nuevo producto
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
        {mostrarFormulario ? (
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {productoEditando ? 'Editar producto' : 'Nuevo producto'}
            </h2>
            <ProductoForm
              productoInicial={productoEditando}
              onGuardar={guardarProducto}
              onCancelar={cerrarFormulario}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                name="categoria"
                value={filtros.categoria}
                onChange={manejarCambioFiltro}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
              >
                <option value="">Todas las categorías</option>
                {CATEGORIAS.map((categoria) => (
                  <option key={categoria} value={categoria}>
                    {categoria}
                  </option>
                ))}
              </select>

              <select
                name="estado"
                value={filtros.estado}
                onChange={manejarCambioFiltro}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
              >
                <option value="">Todos los estados</option>
                {ESTADOS.map((estado) => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <p className="rounded-md bg-red-50 text-red-700 text-sm px-3 py-2">{error}</p>
            )}

            {cargando ? (
              <p className="text-center text-gray-500 py-12">Cargando productos...</p>
            ) : (
              <ProductoList
                productos={productos}
                onEditar={abrirFormularioEditar}
                onEliminar={eliminarProductoConfirmado}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;
