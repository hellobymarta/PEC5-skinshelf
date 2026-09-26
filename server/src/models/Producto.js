const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      maxlength: [80, 'El nombre no puede superar los 80 caracteres'],
    },
    marca: {
      type: String,
      required: [true, 'La marca es obligatoria'],
      trim: true,
    },
    categoria: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: {
        values: [
          'limpiador',
          'tonico',
          'serum',
          'hidratante',
          'protector solar',
          'mascarilla',
          'tratamiento',
        ],
        message: '{VALUE} no es una categoría válida',
      },
    },
    ingredienteClave: {
      type: String,
      trim: true,
    },
    momentoUso: {
      type: String,
      enum: {
        values: ['mañana', 'noche', 'ambos'],
        message: '{VALUE} no es un momento de uso válido',
      },
      default: 'ambos',
    },
    precio: {
      type: Number,
      min: [0, 'El precio no puede ser negativo'],
      default: 0,
    },
    fechaApertura: {
      type: Date,
    },
    estado: {
      type: String,
      enum: {
        values: ['sin abrir', 'en uso', 'terminado'],
        message: '{VALUE} no es un estado válido',
      },
      default: 'sin abrir',
    },
    puntuacion: {
      type: Number,
      min: [1, 'La puntuación mínima es 1'],
      max: [5, 'La puntuación máxima es 5'],
    },
    notas: {
      type: String,
      trim: true,
      maxlength: [300, 'Las notas no pueden superar los 300 caracteres'],
    },
    // Solo el nombre del archivo, por ejemplo «collagen-jelly-cream.jpg». La
    // imagen vive en client/public/fotos: aquí no se sube nada, que exigiría
    // almacenamiento externo.
    foto: {
      type: String,
      trim: true,
      maxlength: [120, 'El nombre del archivo es demasiado largo'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Producto', productoSchema);
