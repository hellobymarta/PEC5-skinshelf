# AGENTS.md — Instrucciones para los agentes de IA

Este archivo es el contexto que deben leer las herramientas de IA (Claude Code, Cursor, Copilot, ChatGPT) antes de tocar nada del proyecto **SkinShelf**.

---

## 1. El proyecto

SkinShelf es una mini aplicación fullstack para gestionar productos de skincare. Una sola entidad (`Producto`) con CRUD completo de extremo a extremo. Es un proyecto académico: prima la **claridad y la comprensión** sobre la sofisticación.

Lee siempre `PLAN.md` antes de escribir código. La definición de la entidad y los enums que hay allí son la fuente de verdad.

---

## 2. Stack y versiones

| Capa | Tecnología |
|---|---|
| Backend | Node.js 18+, Express 4, Mongoose 8 |
| Base de datos | MongoDB Atlas (cluster gratuito M0) |
| Frontend | React 18 + Vite, Tailwind CSS 3 |
| HTTP | `fetch` nativo (**no** axios) |
| Despliegue | API en Render · frontend en Vercel |

---

## 3. Estructura de carpetas

```
skinshelf/
├── PLAN.md  AGENTS.md  SKILLS.md  TASKS.md  README.md
├── .gitignore  .gitattributes
├── requests.http
├── skinshelf.postman_collection.json
├── server/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── config/db.js
│       ├── models/Producto.js
│       ├── controllers/productos.controller.js
│       ├── routes/productos.routes.js
│       ├── middlewares/errorHandler.js
│       ├── app.js
│       └── server.js
└── client/
    ├── .env.example
    ├── package.json
    └── src/
        ├── services/api.js
        ├── components/
        │   ├── ProductoList.jsx
        │   ├── ProductoCard.jsx
        │   └── ProductoForm.jsx
        ├── App.jsx
        └── main.jsx
```

No crees carpetas ni archivos fuera de este árbol sin pedirlo antes.

---

## 4. Convenciones de código

**Generales**

- Todo el código, comentarios y mensajes de error **en español**.
- Nombres de variables y funciones en `camelCase`; componentes React en `PascalCase`.
- Nada de `console.log` olvidados en el código final.
- Funciones cortas y con una sola responsabilidad.
- Comentarios solo donde la intención no sea obvia; nada de comentar línea por línea.

**Backend**

- CommonJS (`require` / `module.exports`), no ESM.
- Toda función asíncrona con `async/await` + `try/catch` y `next(error)` en el catch.
- Los controladores no tocan `res.status(500)` directamente: delegan en el `errorHandler`.
- Respuestas siempre JSON. Errores con la forma `{ error: "mensaje" }`.
- Códigos de estado: `200` OK, `201` creado, `400` validación o id inválido, `404` no encontrado, `500` error interno.
- `findByIdAndUpdate` **siempre** con `{ new: true, runValidators: true }`.
- Validar el formato del `ObjectId` antes de consultar (`mongoose.Types.ObjectId.isValid`).

**Frontend**

- Solo componentes funcionales con hooks. Nada de clases.
- Props desestructuradas en la firma del componente.
- `key` en los `.map()` = `producto._id`, nunca el índice.
- Estados de carga, error y lista vacía siempre visibles al usuario.
- Nada de `window.location.reload()`: tras una operación se actualiza el estado.
- Variables de entorno con `import.meta.env.VITE_*` (**no** `process.env`).
- Estilos solo con clases de Tailwind; nada de CSS suelto ni estilos inline.
- Responsive obligatorio: móvil primero, luego `sm:`, `md:`, `lg:`.

---

## 5. Reglas de seguridad (no negociables)

1. **Nunca** escribas credenciales, URIs de Mongo, contraseñas ni tokens en el código. Todo por `process.env` / `import.meta.env`.
2. **Nunca** crees ni modifiques un archivo `.env`. Solo `.env.example`, con valores ficticios.
3. No añadas dependencias nuevas sin proponerlo y esperar confirmación.
4. No borres ni sobrescribas archivos que no te hayan pedido tocar.
5. En producción, CORS con el dominio concreto del frontend, nunca `origin: '*'`.

---

## 6. Comandos

```bash
# Backend
cd server && npm install
npm run dev          # nodemon, puerto 4000
npm start            # producción

# Frontend
cd client && npm install
npm run dev          # Vite, puerto 5173
npm run build
npm run preview
```

---

## 7. Git

- Un commit por unidad de trabajo con sentido; nunca un único commit gigante.
- Mensajes en formato `tipo(ámbito): descripción` en español y en minúsculas.
  - `feat(api): crud completo de productos`
  - `fix(ui): corregir enum de categoría en el select`
  - `docs: actualizar README con el uso de IA`
  - `chore: añadir gitignore y gitattributes`
- **No hagas commits automáticamente.** Propón el mensaje y espera confirmación.
- `.env`, `node_modules/` y `dist/` nunca entran en el repositorio.

---

## 8. Cómo debe trabajar el agente

1. Antes de generar, **explica** qué vas a crear y espera el visto bueno.
2. Genera **un archivo o una funcionalidad por vez**, no el proyecto entero de golpe.
3. Después de cada archivo, explica en pocas líneas las decisiones no obvias.
4. Si algo del enunciado es ambiguo, **pregunta**; no inventes requisitos.
5. Si no estás seguro de una API o una versión, dilo en lugar de suponer.
6. No cambies decisiones de `PLAN.md` por tu cuenta: propón el cambio y justifícalo.
7. Al terminar una fase, recuerda actualizar `TASKS.md`.

---

## 9. Qué no delego en la IA

- La decisión final del modelo de datos y de la arquitectura.
- La gestión de secretos y variables de entorno.
- Probar que la aplicación funciona de verdad (navegador, `.http`, Postman).
- La reflexión y la documentación del proceso personal de aprendizaje.
