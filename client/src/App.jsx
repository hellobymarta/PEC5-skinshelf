import { useEffect, useState } from 'react';
import ProductoList from './components/ProductoList';
import ProductoForm from './components/ProductoForm';
import Rutina from './components/Rutina';
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

const VISTAS = [
  { clave: 'manana', texto: 'Mañana' },
  { clave: 'noche', texto: 'Noche' },
  { clave: 'productos', texto: 'Mis productos' },
];

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [vista, setVista] = useState('manana');
  const [filtros, setFiltros] = useState({ categoria: '', estado: '' });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);

  // Los filtros son de la vista de inventario. En las rutinas pido la lista
  // entera, porque ahi quien decide que se ve es el momento de uso.
  const cargarProductos = async () => {
    setCargando(true);
    setError('');
    try {
      const datos = await listarProductos(vista === 'productos' ? filtros : {});
      setProductos(datos);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [vista, filtros]);

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
    <div className="min-h-screen">
      <header className="border-b border-borde bg-nieve">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-5">
          <div>
            <p className="etiqueta">Rutina de skincare</p>
            <h1 className="text-lg font-semibold tracking-tight">SkinShelf</h1>
          </div>
          {!mostrarFormulario && (
            <button type="button" onClick={abrirFormularioCrear} className="boton">
              Añadir producto
            </button>
          )}
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
        {mostrarFormulario ? (
          <div className="tarjeta p-5 sm:p-7">
            <h2 className="mb-5 text-base font-medium">
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
            <nav className="flex gap-1 rounded-xl border border-borde bg-nieve p-1">
              {VISTAS.map((una) => (
                <button
                  key={una.clave}
                  type="button"
                  onClick={() => setVista(una.clave)}
                  aria-pressed={vista === una.clave}
                  className={`flex-1 rounded-lg px-3 py-2 text-sm transition ${
                    vista === una.clave
                      ? 'bg-tinta text-nieve'
                      : 'text-suave hover:text-tinta'
                  }`}
                >
                  {una.texto}
                </button>
              ))}
            </nav>

            {vista === 'productos' && (
              <div className="flex flex-col gap-3 sm:flex-row">
                <select
                  name="categoria"
                  value={filtros.categoria}
                  onChange={manejarCambioFiltro}
                  className="campo sm:w-56"
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
                  className="campo sm:w-56"
                >
                  <option value="">Todos los estados</option>
                  {ESTADOS.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            {cargando && <p className="py-12 text-center text-sm text-suave">Cargando…</p>}

            {/* Si la carga fallo no enseno el contenido: con la lista vacia
                saldria un mensaje que contradice al del error. */}
            {!cargando && !error && vista === 'productos' && (
              <ProductoList
                productos={productos}
                onEditar={abrirFormularioEditar}
                onEliminar={eliminarProductoConfirmado}
              />
            )}

            {!cargando && !error && vista !== 'productos' && (
              <Rutina momento={vista} productos={productos} />
            )}
          </>
        )}
      </main>

      <footer className="mx-auto max-w-4xl px-4 pb-10">
        <p className="text-sm text-suave">SkinShelf · Marta Alarcón</p>
      </footer>
    </div>
  );
}

export default App;
