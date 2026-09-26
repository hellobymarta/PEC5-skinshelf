const mongoose = require('mongoose');
const Producto = require('../models/Producto');

// Los únicos campos que acepto del cliente. Sin esta lista, el req.body entero
// llega al modelo y se puede colar un _id elegido a mano: lo comprobé mandando
// «_id»: «aaaa...» en un POST y el documento se creó con ese identificador.
const CAMPOS_PERMITIDOS = [
  'nombre',
  'marca',
  'categoria',
  'ingredienteClave',
  'momentoUso',
  'precio',
  'fechaApertura',
  'estado',
  'puntuacion',
  'notas',
  'foto',
];

const soloCamposPermitidos = (cuerpo = {}) => {
  const limpio = {};
  CAMPOS_PERMITIDOS.forEach((campo) => {
    if (cuerpo[campo] !== undefined) limpio[campo] = cuerpo[campo];
  });
  return limpio;
};

const listarProductos = async (req, res, next) => {
  try {
    const filtro = {};
    if (req.query.categoria) filtro.categoria = req.query.categoria;
    if (req.query.estado) filtro.estado = req.query.estado;

    const productos = await Producto.find(filtro).sort({ createdAt: -1 });
    res.json(productos);
  } catch (error) {
    next(error);
  }
};

const obtenerProducto = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Id no válido' });
    }

    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    next(error);
  }
};

const crearProducto = async (req, res, next) => {
  try {
    const producto = await Producto.create(soloCamposPermitidos(req.body));
    res.status(201).json(producto);
  } catch (error) {
    next(error);
  }
};

const actualizarProducto = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Id no válido' });
    }

    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      soloCamposPermitidos(req.body),
      { new: true, runValidators: true }
    );
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(producto);
  } catch (error) {
    next(error);
  }
};

const eliminarProducto = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Id no válido' });
    }

    const producto = await Producto.findByIdAndDelete(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ mensaje: 'Producto eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
