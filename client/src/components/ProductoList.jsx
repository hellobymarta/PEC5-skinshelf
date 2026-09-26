import ProductoCard from './ProductoCard';

function ProductoList({ productos, onEditar, onEliminar }) {
  if (productos.length === 0) {
    return (
      <div className="tarjeta p-10 text-center">
        <p className="text-sm text-suave">
          No hay productos que coincidan con lo que buscas.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {productos.map((producto) => (
        <ProductoCard
          key={producto._id}
          producto={producto}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />
      ))}
    </div>
  );
}

export default ProductoList;
