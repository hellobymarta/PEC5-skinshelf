const notFound = (req, res, next) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.originalUrl}` });
};

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  if (err.name === 'ValidationError') {
    const mensajes = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ error: mensajes.join(', ') });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Id no válido' });
  }

  if (err.code === 11000) {
    return res.status(400).json({ error: 'Valor duplicado' });
  }

  res.status(500).json({ error: 'Error interno del servidor' });
};

module.exports = { notFound, errorHandler };
