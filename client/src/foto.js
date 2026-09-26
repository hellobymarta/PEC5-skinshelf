// La ruta de la imagen de un producto. Guardo solo el nombre del archivo y las
// imágenes viven en public/fotos, pero acepto también una dirección completa por
// si alguna foto viniera de fuera.
export const rutaFoto = (foto) => {
  if (!foto) return null;
  return foto.startsWith('http') ? foto : `/fotos/${foto}`;
};
