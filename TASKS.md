# TASKS.md — Seguimiento del proyecto SkinShelf

Estados: ⬜ pendiente · 🔄 en curso · ✅ hecho

> Actualizo este archivo al cerrar cada fase, antes del commit correspondiente.

---

## Fase 0 · Planificación

- ⬜ Elegir la idea y comprobar que es distinta al proyecto anterior
- ⬜ Definir la entidad `Producto` y sus campos
- ⬜ Escribir `PLAN.md`
- ⬜ Escribir `AGENTS.md` con las convenciones del proyecto
- ⬜ Crear el repositorio, `.gitignore` y `.gitattributes`
- ⬜ Primer commit con la documentación

## Fase 1 · Backend

- ⬜ Inicializar `server/` con Express y las dependencias mínimas
- ⬜ Conexión a MongoDB Atlas (`config/db.js`) con variables de entorno
- ⬜ Modelo `Producto` con Mongoose y validaciones (enums, min/max, maxlength)
- ⬜ Controlador: `listarProductos` con filtros `?categoria=` y `?estado=`
- ⬜ Controlador: `obtenerProducto` con validación de ObjectId
- ⬜ Controlador: `crearProducto`
- ⬜ Controlador: `actualizarProducto` con `new: true` y `runValidators: true`
- ⬜ Controlador: `eliminarProducto`
- ⬜ Rutas `/api/productos`
- ⬜ Middlewares `notFound` (404) y `errorHandler` (400/500)
- ⬜ `server/.env.example` y comprobación de que `.env` está ignorado

## Fase 2 · Pruebas de la API

- ⬜ `requests.http` con los cinco endpoints
- ⬜ Colección de Postman equivalente
- ⬜ Probar caso inválido: categoría fuera del enum → debe dar **400**
- ⬜ Probar id inexistente → debe dar **404**
- ⬜ Probar id mal formado → debe dar **400**, no 500
- ⬜ Comprobar en Atlas que los documentos se guardan de verdad

## Fase 3 · Frontend

- ⬜ Scaffold Vite + React + Tailwind
- ⬜ `client/.env.example` con `VITE_API_URL`
- ⬜ `services/api.js` con las cinco llamadas
- ⬜ `ProductoCard.jsx` con badge de categoría y puntuación
- ⬜ `ProductoList.jsx` en grid responsive
- ⬜ `ProductoForm.jsx` reutilizable para crear y editar
- ⬜ `App.jsx`: estados, `useEffect`, handlers y filtro por categoría
- ⬜ Estados de carga, error y lista vacía
- ⬜ Eliminar con confirmación
- ⬜ Repaso de responsive en móvil, tablet y escritorio

## Fase 4 · Revisión crítica

- ⬜ Pedir a la IA que explique el controlador de update y el `useEffect`
- ⬜ Auditoría de seguridad y validaciones
- ⬜ Verificar uno a uno los problemas que señale (descartar los inventados)
- ⬜ Corregir lo que sea real
- ⬜ Anotar los errores encontrados en el cuaderno de errores

## Fase 5 · Despliegue

- ⬜ Cluster en MongoDB Atlas + usuario + acceso de red
- ⬜ API desplegada en Render con sus variables de entorno
- ⬜ CORS configurado con el dominio del frontend (no `*`)
- ⬜ Frontend desplegado en Vercel con `VITE_API_URL` de producción
- ⬜ Comprobar el CRUD completo contra producción
- ⬜ Actualizar `requests.http` y Postman con la URL de producción

## Fase 6 · Documentación y entrega

- ⬜ `SKILLS.md` con los prompts realmente usados
- ⬜ `README.md`: descripción, instalación, uso de IA y prompts principales
- ⬜ Reflexión final escrita a mano
- ⬜ `TASKS.md` actualizado a su estado real
- ⬜ Repaso del historial de commits
- ⬜ Comprobar que `.env` no está en el repositorio
- ⬜ Entrega en Google Classroom con las dos URLs y el enlace al repo

---

## Incidencias abiertas

| # | Descripción | Estado |
|---|---|---|
| | | |
