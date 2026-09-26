import ProductoCard from './ProductoCard';

function ProductoList({ productos, onEditar, onEliminar }) {
  if (productos.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12">
        Aún no hay productos. Añade el primero para empezar tu estantería.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
