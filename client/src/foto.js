// La ruta de la imagen de un producto. Guardo solo el nombre del archivo y las
// imagenes viven en public/fotos, pero acepto tambien una direccion completa por
// si alguna foto viniera de fuera.
export const rutaFoto = (foto) => {
  if (!foto) return null;
  return foto.startsWith('http') ? foto : `/fotos/${foto}`;
};
