# SkinShelf 🧴

Mini aplicación fullstack para gestionar una estantería de productos de skincare: qué productos tengo, de qué marca, en qué momento del día los uso, cuándo los abrí y qué tal me van.

Proyecto de la **PEC 5 — Proyecto con IA**. Desarrollado con apoyo de herramientas de inteligencia artificial, con todo el código revisado, probado y corregido manualmente.

---

## 🔗 Enlaces

| | URL |
|---|---|
| Frontend | https://pec-5-skinshelf-web.vercel.app |
| API | https://pec-5-skinshelf.vercel.app |
| Repositorio | https://github.com/hellobymarta/PEC5-skinshelf |

---

## 📋 Descripción

SkinShelf sirve para seguir la rutina de cuidado facial de cada día. Los productos se registran con su marca, categoría, ingrediente clave, precio y momento de uso, y a partir de ahí la aplicación arma dos rutinas, la de mañana y la de noche: solo los productos de ese momento, en el orden en que se aplican, para ir marcándolos según se usan. La pestaña de inventario mantiene el alta, la edición y el borrado, con los datos guardados en MongoDB Atlas.

**Funcionalidades**

- Rutina de mañana y de noche con los pasos ordenados y marcables
- El marcado se reinicia cada día y no se guarda en la base de datos
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
| Despliegue | Vercel (dos proyectos: API y frontend) |

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
git clone https://github.com/hellobymarta/PEC5-skinshelf.git
cd skinshelf
```

**Backend**

```bash
cd server
npm install
cp .env.example .env     # con la cadena de conexión de Atlas
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
| Claude (aplicación de escritorio) | Generar el modelo, los controladores, las rutas, los middlewares y los componentes de React |
| Claude (misma sesión) | Explicar el código generado, auditarlo y ayudarme a reproducir los fallos que encontré |

### Prompts principales

Los prompts completos y reutilizables están en **[`SKILLS.md`](./SKILLS.md)**. Los cuatro que más peso tuvieron:

1. **Contexto inicial** — *"Lee `PLAN.md` y `AGENTS.md` y respeta esas convenciones. No escribas código todavía: dime qué estructura propones."*
2. **Modelo** — *"Crea un esquema de Mongoose para Producto con estos campos [...]. Explícame qué hace `enum`."*
3. **Controlador CRUD** — *"Crea el controlador con las cinco funciones, `async/await`, `next(error)`, 404 si no existe, 400 si el id no es válido, y `{ new: true, runValidators: true }` en el update."*
4. **Auditoría** — *"Revisa el proyecto y dime qué datos sensibles podrían estar expuestos, qué validaciones faltan en el backend y tres cosas que has hecho mal tú."*

### Qué generó la IA

- El modelo `Producto`, el controlador, las rutas y los middlewares del backend.
- El servicio `api.js` y los componentes `ProductoList`, `ProductoCard` y `ProductoForm`.
- La configuración inicial de Tailwind y el scaffold de Vite.
- La vista de rutina (`Rutina.jsx`, `rutina.js`) y la pasada de rediseño.
- Los archivos `requests.http` y la colección de Postman.

### Qué corregí yo y qué errores produjo la IA

| # | Dónde | Error de la IA | Cómo lo detecté y corregí |
|---|---|---|---|
| 1 | Repositorio (Git) | Afirmó que no había ningún `.DS_Store` rastreado tras comprobar solo la ruta `server/`, cuando el archivo estaba en la raíz y figuraba en el primer commit. | Lo detecté revisando la salida del `git commit` anterior. Le señalé la ruta real y lo sacó del índice con `git rm --cached`. |
| 2 | Planificación del backend | Usó `MONGO_URI` en lugar de `MONGODB_URI`, el nombre real definido en `.env.example`, pese a haber leído los archivos del proyecto. | Lo detecté al contrastar su plan con el `.env.example`. Habría provocado un fallo de conexión silencioso. Le exigí usar los nombres literales del archivo. |
| 3 | `ProductoForm.jsx` (diseño) | El diseño propuesto no incluía un `useEffect` para recargar los campos al cambiar `productoInicial`. | Lo detecté revisando el diseño antes de que generara el código. Sin él, al pulsar "Editar" en otro producto los campos conservarían los datos del anterior, porque `useState` solo toma el valor inicial en el primer render. |
| 4 | `ProductoForm.jsx` (diseño) | No contemplaba que el backend devuelve `fechaApertura` en ISO completo y que `<input type="date">` solo acepta `yyyy-MM-dd`. | Lo detecté en la misma revisión. Sin el `.slice(0, 10)`, el campo de fecha aparecería vacío al editar aunque el producto tuviera fecha. |

> Los errores 3 y 4 no producen ningún mensaje en consola: la aplicación
> simplemente se comporta mal. Detectarlos exigió revisar el diseño antes de
> generar el código, lo que resultó mucho más barato que depurarlos después.

### Decisiones que tomé yo

- La entidad, sus campos y sus validaciones (definidos en `PLAN.md` antes de pedir nada a la IA).
- La estructura de carpetas y las convenciones recogidas en `AGENTS.md`.
- Descartar autenticación y subida de imágenes para centrar el alcance.
- Usar `fetch` en vez de axios y mantener el backend en CommonJS.
- La gestión de variables de entorno y el contenido del `.gitignore`.
- Mantener Vite 5 y Tailwind 3 pese a que `npm audit` reporta dos
  vulnerabilidades en esbuild/vite: solo son explotables contra el servidor de
  desarrollo local y la actualización a Vite 8 implica un cambio mayor de
  configuración. Decisión documentada, no silenciada.
- Deducir el orden de los pasos de la categoría en vez de añadir un campo
  `orden` al modelo: el orden lo marca el tipo de producto, no la persona.
- Guardar el marcado del día en el navegador y no en MongoDB: es un dato del
  día, no del producto, y en la base de datos habría obligado a un modelo nuevo
  sin ganar nada.
- Excluir de la rutina los productos terminados, y el protector solar de la
  rutina de noche aunque esté marcado como «ambos».

---

## 💭 Reflexión

**Qué fue más rápido gracias a la IA**

Todo el esqueleto. El modelo, el controlador con las cinco operaciones, las rutas, los middlewares y los cuatro componentes de React salieron en una sesión, cuando a mano me habrían llevado días. Los archivos de prueba también. Lo que no fue más rápido fue entenderlo: leer y comprobar el código generado me llevó más tiempo que pedirlo, y esa parte no me la ahorró nadie.

**Qué fue más difícil de controlar**

Que la IA afirme cosas con total seguridad y estén mal. El caso más claro fue el del CORS. Me dijo que si faltaba la variable `CORS_ORIGIN` la API quedaba abierta a cualquier origen, y sonaba convincente. Lo comprobé con `curl` y no aparecía ninguna cabecera. Mirando el código del paquete `cors` se veía que con el origen vacío el middleware se salta entero, así que el riesgo real era el contrario: el frontend desplegado quedaría bloqueado. A partir de ahí dejé de dar por buena una explicación solo porque estuviera bien argumentada.

**Qué errores aparecieron en el código generado**

Los tengo todos anotados en la tabla de arriba. Los tres que me parecen más importantes: el controlador pasaba el `req.body` entero al modelo, y mandando un POST con un `_id` inventado el documento se creó con ese identificador; el servicio del frontend llamaba a `respuesta.json()` antes de comprobar si la respuesta había ido bien, así que con una página de error salía «Unexpected token '<'» en vez de un mensaje útil; y el listado enseñaba a la vez el error y el mensaje de «aún no hay productos», que se contradicen. Este último no lo detectó ninguna herramienta, lo vi yo mirando la pantalla mientras probaba otra cosa.

**Qué tuve que modificar**

Por seguridad, añadí una lista de campos permitidos para que el cuerpo de la petición no llegue entero al modelo. Por claridad, cambié cómo se lee la respuesta en el frontend y quité la contradicción del listado. Y por decisión mía cambié el despliegue: el plan decía Render y acabé en Vercel, lo que obligó a convertir el backend en función serverless y a cachear la conexión con Atlas.

**Qué entendí mejor al revisar el código**

Tres cosas que no habría entendido leyendo un tutorial. Que Mongoose descarta en silencio los campos que no están en el esquema, que es por lo que el campo de la foto no se guardaba hasta reiniciar el servidor y no daba ningún error. Que el CORS no protege la API sino al navegador, y por eso `curl` recibía los datos igualmente mientras la web quedaba bloqueada. Y que en serverless no hay un proceso encendido, así que la conexión a la base de datos hay que abrirla en la primera petición y guardarla.

**¿Volvería a usar IA para una aplicación similar? ¿Por qué?**

Sí, pero sabiendo para qué. Para escribir código repetitivo y para explicarme cosas va muy bien. Para decidir la arquitectura o para dar algo por bueno sin probarlo, no. Lo que cambiaría la próxima vez es pedir menos y comprobar antes: casi todos los fallos que encontré salieron de probar un caso que debía fallar, no de leer el código. Y desconfiar especialmente de las respuestas que suenan más seguras.

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
