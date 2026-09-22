# SkinShelf 🧴

Mini aplicación fullstack para gestionar una estantería de productos de skincare: qué productos tengo, de qué marca, en qué momento del día los uso, cuándo los abrí y qué tal me van.

Proyecto de la **PEC 5 — Proyecto con IA**. Desarrollado con apoyo de herramientas de inteligencia artificial, con todo el código revisado, probado y corregido manualmente.

> ✍️ Los bloques marcados con `[...]` los tienes que completar tú al terminar. Todo lo demás ya está escrito.

---

## 🔗 Enlaces

| | URL |
|---|---|
| Frontend | `[URL de Vercel]` |
| API | `[URL de Render]` |
| Repositorio | `[URL de GitHub]` |

---

## 📋 Descripción

SkinShelf permite llevar el control de los productos de cuidado facial: registrarlos con su marca, categoría, ingrediente clave, precio y momento de uso; marcar en qué estado están (sin abrir, en uso, terminado); puntuarlos, editarlos y eliminarlos. Todo desde la interfaz, con los datos guardados en MongoDB Atlas.

**Funcionalidades**

- Listado de productos con filtro por categoría y por estado
- Alta de productos con validación en cliente y en servidor
- Edición en el mismo formulario reutilizable
- Eliminación con confirmación previa
- Estados de carga, error y lista vacía
- Interfaz responsive (móvil, tablet, escritorio)

---

## 🧱 Stack

| Capa | Tecnología |
|---|---|
| Backend | Node.js · Express · Mongoose |
| Base de datos | MongoDB Atlas |
| Frontend | React (Vite) · Tailwind CSS |
| Despliegue | Render (API) · Vercel (frontend) |

```mermaid
flowchart LR
    UI[React · SkinShelf] --> Service[services/api.js]
    Service -->|fetch| API[(API Express · /api/productos)]
    API --> Ctrl[productos.controller.js]
    Ctrl --> Model[Modelo Producto · Mongoose]
    Model --> DB[(MongoDB Atlas)]
```

---

## 🗂️ Modelo de datos

| Campo | Tipo | Obligatorio | Validación |
|---|---|---|---|
| `nombre` | String | ✅ | máx. 80 caracteres |
| `marca` | String | ✅ | — |
| `categoria` | String | ✅ | limpiador · tonico · serum · hidratante · protector solar · mascarilla · tratamiento |
| `ingredienteClave` | String | ❌ | — |
| `momentoUso` | String | ❌ | mañana · noche · ambos (def. `ambos`) |
| `precio` | Number | ❌ | ≥ 0 |
| `fechaApertura` | Date | ❌ | — |
| `estado` | String | ❌ | sin abrir · en uso · terminado (def. `sin abrir`) |
| `puntuacion` | Number | ❌ | 1–5 |
| `notas` | String | ❌ | máx. 300 caracteres |

---

## 🔌 Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/` | Estado de la API |
| `GET` | `/api/productos` | Listar (admite `?categoria=` y `?estado=`) |
| `GET` | `/api/productos/:id` | Obtener uno |
| `POST` | `/api/productos` | Crear |
| `PUT` | `/api/productos/:id` | Actualizar |
| `DELETE` | `/api/productos/:id` | Eliminar |

Códigos: `200` OK · `201` creado · `400` validación o id inválido · `404` no encontrado · `500` error interno.

---

## ⚙️ Instalación y ejecución

```bash
git clone [URL del repositorio]
cd skinshelf
```

**Backend**

```bash
cd server
npm install
cp .env.example .env     # rellena MONGODB_URI con tu cadena de Atlas
npm run dev              # http://localhost:4000
```

**Frontend**

```bash
cd client
npm install
cp .env.example .env     # VITE_API_URL=http://localhost:4000
npm run dev              # http://localhost:5173
```

### Variables de entorno

`server/.env`

```
PORT=4000
MONGODB_URI=mongodb+srv://USUARIO:CONTRASENA@cluster.xxxxx.mongodb.net/skinshelf
CORS_ORIGIN=http://localhost:5173
```

`client/.env`

```
VITE_API_URL=http://localhost:4000
```

---

## 🧪 Pruebas de la API

- `requests.http` — extensión **REST Client** de VS Code
- `skinshelf.postman_collection.json` — importable en Postman o Thunder Client

Incluyen casos correctos y casos que deben fallar (categoría fuera del enum, id inexistente, id mal formado).

---

## 🤖 Uso de la IA

### Herramientas utilizadas

| Herramienta | Para qué |
|---|---|
| `[Claude Code / ChatGPT / Copilot...]` | Generación de modelo, controladores, rutas y componentes |
| `[...]` | Explicación del código y resolución de errores |

### Prompts principales

Los prompts completos y reutilizables están en **[`SKILLS.md`](./SKILLS.md)**. Los cuatro que más peso tuvieron:

1. **Contexto inicial** — *"Lee `PLAN.md` y `AGENTS.md` y respeta esas convenciones. No escribas código todavía: dime qué estructura propones."*
2. **Modelo** — *"Crea un esquema de Mongoose para Producto con estos campos [...]. Explícame qué hace `enum`."*
3. **Controlador CRUD** — *"Crea el controlador con las cinco funciones, `async/await`, `next(error)`, 404 si no existe, 400 si el id no es válido, y `{ new: true, runValidators: true }` en el update."*
4. **Auditoría** — *"Revisa el proyecto y dime qué datos sensibles podrían estar expuestos, qué validaciones faltan en el backend y tres cosas que has hecho mal tú."*

### Qué generó la IA

- `[Modelo `Producto`, controlador, rutas y middlewares del backend]`
- `[Servicio `api.js` y los componentes `ProductoList`, `ProductoCard`, `ProductoForm`]`
- `[Configuración inicial de Tailwind y el scaffold de Vite]`

### Qué corregí yo y qué errores produjo la IA

> Rellena esta tabla con lo que te vaya pasando de verdad. Es lo que más puntúa.

| # | Dónde | Error de la IA | Corrección |
|---|---|---|---|
| 1 | `productos.controller.js` | `[...]` | `[...]` |
| 2 | `ProductoForm.jsx` | `[...]` | `[...]` |
| 3 | `services/api.js` | `[...]` | `[...]` |
| 4 | `[...]` | `[...]` | `[...]` |

### Decisiones que tomé yo

- La entidad, sus campos y sus validaciones (definidos en `PLAN.md` antes de pedir nada a la IA).
- La estructura de carpetas y las convenciones recogidas en `AGENTS.md`.
- Descartar autenticación y subida de imágenes para centrar el alcance.
- Usar `fetch` en vez de axios y mantener el backend en CommonJS.
- La gestión de variables de entorno y el contenido del `.gitignore`.
- `[...]`

---

## 💭 Reflexión

> Escríbela tú, en primera persona. Estas preguntas son las que pide el enunciado; úsalas como guion, no como formulario.

**Qué fue más rápido gracias a la IA**

`[...]`

**Qué fue más difícil de controlar**

`[...]`

**Qué errores aparecieron en el código generado**

`[...]`

**Qué tuve que modificar**

`[...]`

**Qué entendí mejor al revisar el código**

`[...]`

**¿Volvería a usar IA para una app similar? ¿Por qué?**

`[...]`

---

## 📁 Archivos de trabajo con IA

| Archivo | Contenido |
|---|---|
| [`PLAN.md`](./PLAN.md) | Objetivo, alcance, entidad, fases y decisiones |
| [`AGENTS.md`](./AGENTS.md) | Contexto y reglas para las herramientas de IA |
| [`SKILLS.md`](./SKILLS.md) | Prompts y técnicas reutilizables |
| [`TASKS.md`](./TASKS.md) | Seguimiento de tareas |

---

## 👩‍💻 Autora

Marta Alarcón — PEC 5, Proyecto con IA.
