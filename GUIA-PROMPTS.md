# GUÍA DE PROMPTS — PEC 5 · SkinShelf

**Para Marta.** Aquí tienes, en orden, **todos los prompts que tienes que dar tú a la IA**, qué esperar de cada respuesta y **qué revisar** antes de aceptarla. La idea es que la IA escriba código, pero que las decisiones y la revisión sean tuyas (eso es literalmente lo que evalúa la PEC).

---

## 0. Antes de empezar

### Qué herramienta usar (lo más aconsejable)

| Herramienta | Para qué | Por qué |
|---|---|---|
| **Claude Code** (terminal o extensión de VS Code) | Escribir el proyecto entero | Crea y edita los archivos directamente, hace los commits y lee AGENTS.md automáticamente. Es lo que la rúbrica llama "agentes". |
| **Claude / ChatGPT en el navegador** | Entender el código y resolver dudas | Para pedir explicaciones línea a línea antes de dar algo por bueno. |

👉 **Recomendación:** haz el proyecto con **Claude Code** y usa el chat web para la parte de "explícame esto". Documenta **las dos** en el README: queda mejor que usar solo una.

Los prompts de abajo funcionan igual en las dos. Si usas el chat web, añade al final: *"dame el archivo completo con su ruta"*.

### Instalación previa

```bash
node -v        # necesitas 18 o superior
npm i -g @anthropic-ai/claude-code   # si vas con Claude Code
```

Y ten a mano:
- Cuenta en **MongoDB Atlas** (gratis, cluster M0).
- Cuenta en **GitHub**.
- Cuenta en **Vercel** (frontend) y **Render** (backend).

---

## 1. La idea: SkinShelf 🧴

**Gestor de tu estantería de skincare.** Guardas los productos que tienes (Medicube, Beauty of Joseon, La Roche-Posay…), en qué momento los usas, cuándo los abriste, cómo van y qué puntuación les das.

**Entidad principal: `Producto`**

| Campo | Tipo | Obligatorio | Notas |
|---|---|---|---|
| `nombre` | String | ✅ | Ej. "Zero Pore Pad 2.0" |
| `marca` | String | ✅ | Ej. "Medicube" |
| `categoria` | String (enum) | ✅ | limpiador · tónico · serum · hidratante · protector solar · mascarilla · tratamiento |
| `ingredienteClave` | String | ❌ | Ej. "niacinamida 5%" |
| `momentoUso` | String (enum) | ❌ | mañana · noche · ambos (por defecto `ambos`) |
| `precio` | Number | ❌ | ≥ 0 |
| `fechaApertura` | Date | ❌ | Para calcular el PAO |
| `estado` | String (enum) | ❌ | sin abrir · en uso · terminado (por defecto `sin abrir`) |
| `puntuacion` | Number | ❌ | 1–5 |
| `notas` | String | ❌ | máx. 300 caracteres |

Esto **no se parece en nada a Vagamundo** (viajes) y da juego para filtros y un pequeño resumen por categoría, que es lo que lo hace bonito de portafolio.

> ⚠️ Antes de dar el primer prompt de código, **crea la carpeta y el repo** (paso 2). Si no, la IA te esparce archivos por cualquier sitio.

---

## 2. Preparar el repo (esto lo haces tú, sin IA)

```bash
mkdir skinshelf && cd skinshelf
git init
mkdir server client
```

Copia dentro de la carpeta `skinshelf/` los archivos que te he preparado: `PLAN.md`, `AGENTS.md`, `SKILLS.md`, `TASKS.md`, `README.md`, `.gitignore`, `.gitattributes`.

```bash
git add .
git commit -m "docs: plan, agents, skills y tasks del proyecto"
```

> 💡 **Haz un commit después de cada fase.** La rúbrica da 5 puntos a Git. Un repo con 15 commits descriptivos puntúa mucho más que uno con "primer commit" y ya.

---

## 3. FASE 1 — Backend

### Prompt 1.1 · Contexto inicial

```
Vamos a crear una mini app fullstack llamada SkinShelf: un gestor de productos
de skincare (CRUD completo) para una asignatura de desarrollo web.

Stack obligatorio: Node.js + Express + MongoDB con Mongoose en el backend,
React con Vite + Tailwind en el frontend.

Lee los archivos PLAN.md y AGENTS.md de la raíz del proyecto antes de escribir
nada y respeta las convenciones que hay ahí.

No escribas código todavía. Dime qué estructura de carpetas propones para
server/ y qué archivos vas a crear, y espera mi confirmación.
```

**Qué revisar:** que proponga separar `models/`, `controllers/`, `routes/`, `config/` y no te meta todo en un `index.js` de 300 líneas. Si lo hace, respóndele: *"Sepáralo en models, controllers, routes y config"*.

---

### Prompt 1.2 · Modelo Mongoose

```
Crea server/src/models/Producto.js: un esquema de Mongoose para "Producto" con
estos campos:

- nombre: String, obligatorio, trim, máx 80 caracteres
- marca: String, obligatorio, trim
- categoria: String, obligatorio, enum ['limpiador','tonico','serum','hidratante','protector solar','mascarilla','tratamiento']
- ingredienteClave: String, opcional
- momentoUso: String, enum ['mañana','noche','ambos'], por defecto 'ambos'
- precio: Number, mínimo 0, por defecto 0
- fechaApertura: Date, opcional
- estado: String, enum ['sin abrir','en uso','terminado'], por defecto 'sin abrir'
- puntuacion: Number, entre 1 y 5, opcional
- notas: String, máx 300 caracteres

Añade timestamps: true. Pon mensajes de error de validación en español.
Explícame después, en 5 líneas, qué hace exactamente `enum` y qué pasa si
envío un valor que no está en la lista.
```

**Qué revisar:**
- Que los `enum` estén escritos **exactamente igual** que los usarás en el frontend (tildes incluidas: `'mañana'`).
- Que `timestamps: true` esté puesto.
- Que la validación de `puntuacion` use `min`/`max`, no un `validate` raro.

📝 **Anota en SKILLS.md** cualquier cosa que la IA se invente aquí (es muy típico que añada campos que no le has pedido, o que se salte el `trim`).

---

### Prompt 1.3 · Conexión a la base de datos + servidor

```
Crea:
1. server/src/config/db.js — conexión a MongoDB con mongoose.connect leyendo
   process.env.MONGODB_URI, con try/catch y process.exit(1) si falla.
2. server/src/app.js — app de Express con cors, express.json(), una ruta GET /
   que devuelva { ok: true, mensaje: 'API SkinShelf' }, y el montaje de
   /api/productos.
3. server/src/server.js — arranca el servidor en process.env.PORT || 4000
   después de conectar a la base de datos.
4. server/package.json con los scripts "dev" (nodemon) y "start".

Usa CommonJS (require), no ESM. No pongas ninguna credencial en el código:
todo por variables de entorno.
```

**Qué revisar:**
- ❗ Que **no** haya ninguna URI de Mongo escrita a pelo en el código. Es el error más típico y más penalizado.
- Que `require('dotenv').config()` esté al principio de `server.js`.
- Que el servidor arranque **después** de conectar a Mongo, no antes.

---

### Prompt 1.4 · Controlador CRUD

```
Crea server/src/controllers/productos.controller.js con las cinco funciones del
CRUD para Producto:

- listarProductos (GET): admite filtros opcionales por query ?categoria= y
  ?estado=, y ordena por createdAt descendente.
- obtenerProducto (GET /:id)
- crearProducto (POST)
- actualizarProducto (PUT /:id) con runValidators: true y new: true
- eliminarProducto (DELETE /:id)

Requisitos:
- async/await con try/catch, y next(error) en el catch.
- Si el id no existe, responde 404 con { error: 'Producto no encontrado' }.
- Valida que el id sea un ObjectId válido antes de consultar y responde 400 si no.
- Respuestas siempre en JSON.

Después explícame por qué hace falta runValidators: true en el update.
```

**Qué revisar (aquí es donde la IA más falla):**
- ⚠️ `findByIdAndUpdate` **sin** `{ new: true }` → te devuelve el producto viejo y el frontend parece que no actualiza. Compruébalo.
- ⚠️ `runValidators: true` se olvida casi siempre → puedes meter una `categoria` inválida por PUT.
- Que un id con formato incorrecto dé **400**, no un 500 feo de CastError.

---

### Prompt 1.5 · Rutas + manejo de errores

```
Crea:
1. server/src/routes/productos.routes.js con el router de Express que conecta
   las cinco funciones del controlador a GET /, GET /:id, POST /, PUT /:id,
   DELETE /:id.
2. server/src/middlewares/errorHandler.js con dos middlewares: notFound (404
   para rutas que no existen) y errorHandler (500 genérico, que devuelva
   status 400 y los mensajes si el error es un ValidationError de Mongoose).

Móntalos en app.js en el orden correcto y explícame por qué el errorHandler
tiene que ir el último y por qué lleva cuatro parámetros.
```

**Qué revisar:** que el `errorHandler` tenga **4 parámetros** `(err, req, res, next)` — si tiene 3, Express no lo reconoce como manejador de errores y nunca se ejecuta. Es un fallo clásico de la IA.

---

### Prompt 1.6 · Variables de entorno

```
Crea server/.env.example con PORT y MONGODB_URI (con valores de ejemplo, sin
credenciales reales) y asegúrate de que .env está en el .gitignore.
```

**Ahora tú:** crea el `.env` de verdad con tu URI de Atlas. **Nunca** lo subas.

```bash
git add . && git commit -m "feat(api): CRUD completo de productos con validaciones y manejo de errores"
```

---

### Prompt 1.7 · Probar la API

```
Arranca el servidor y prueba con curl los cinco endpoints de /api/productos:
crear un producto, listarlos, obtener uno por id, actualizarlo y borrarlo.
Enséñame la salida real de cada llamada.
```

> Si usas el chat web en vez de Claude Code, usa directamente el archivo `requests.http` que ya tienes (extensión **REST Client** de VS Code) o importa `skinshelf.postman_collection.json` en Postman.

**Qué revisar:** haz tú al menos **una prueba que tiene que fallar**: crea un producto con `"categoria": "inventada"` y comprueba que responde **400**, no 500 ni 201. Apunta el resultado, va al README.

---

## 4. FASE 2 — Frontend

### Prompt 2.1 · Scaffold

```
Crea el frontend en la carpeta client/ con Vite + React (JavaScript, no
TypeScript) y configura Tailwind CSS v3.

Crea también client/.env.example con VITE_API_URL=http://localhost:4000

No crees componentes todavía, solo el scaffold y Tailwind funcionando.
```

**Qué revisar:** que `tailwind.config.js` tenga el `content` apuntando a `./src/**/*.{js,jsx}`. Si se deja esto, Tailwind no aplica ningún estilo y parece que "no funciona".

---

### Prompt 2.2 · Servicio de API

```
Crea client/src/services/api.js con cinco funciones (listarProductos,
obtenerProducto, crearProducto, actualizarProducto, eliminarProducto) que
llamen a la API usando fetch y import.meta.env.VITE_API_URL.

Cada función debe lanzar un Error con el mensaje del backend si la respuesta
no es ok. No uses axios.
```

**Qué revisar:** que use `import.meta.env.VITE_API_URL` y **no** `process.env` (eso es de Node, en Vite da `undefined`). Fallo garantizado de la IA si no se lo dices.

---

### Prompt 2.3 · Listado

```
Crea client/src/components/ProductoList.jsx y ProductoCard.jsx.

ProductoList recibe por props la lista de productos y las funciones onEditar y
onEliminar. Muestra las tarjetas en grid responsive (1 columna en móvil, 2 en
tablet, 3 en escritorio) con Tailwind.

ProductoCard muestra nombre, marca, categoría (como badge de color según la
categoría), momento de uso, precio y puntuación con estrellas, y dos botones:
Editar y Eliminar.

Componentes funcionales, props desestructuradas, sin librerías externas.
```

**Qué revisar:** que el `key` del `.map()` sea `producto._id` y no el índice. Y comprueba el responsive de verdad estrechando la ventana — la rúbrica menciona el responsive al detalle.

---

### Prompt 2.4 · Formulario

```
Crea client/src/components/ProductoForm.jsx: un formulario controlado con
useState para todos los campos de Producto.

- Sirve tanto para crear como para editar: si recibe la prop productoInicial,
  carga sus valores y el botón dice "Guardar cambios"; si no, dice "Añadir producto".
- Usa useEffect para recargar los campos cuando cambie productoInicial.
- categoria, momentoUso y estado son <select> con las mismas opciones del enum
  del modelo.
- Valida antes de enviar que nombre y marca no estén vacíos y muestra el error
  debajo del campo.
- Al enviar, llama a onSubmit(datos) y limpia el formulario si era creación.
```

**Qué revisar:**
- ⚠️ Que las opciones de los `<select>` coincidan **exactamente** con los `enum` del modelo. La IA suele poner `"Protector solar"` con mayúscula y el backend lo rechaza con un 400. Es el bug más divertido de contar en la reflexión.
- Que los inputs tengan `value` **y** `onChange` (si falta uno, el campo no se deja escribir).

---

### Prompt 2.5 · App: conectar todo

```
Escribe client/src/App.jsx:

- useState para: productos, cargando, error, productoEditando y filtroCategoria.
- useEffect que cargue los productos al montar.
- Handlers de crear, actualizar y eliminar que llamen al servicio y actualicen
  el estado sin recargar la página.
- Confirmación con window.confirm antes de eliminar.
- Un <select> para filtrar por categoría.
- Estados visibles de "Cargando...", error y lista vacía.
- Cabecera con el nombre SkinShelf y un contador de productos.
```

**Qué revisar:**
- Que el `useEffect` tenga array de dependencias `[]`. Sin él → bucle infinito de peticiones (míralo en la pestaña Red del navegador).
- Que después de crear/editar **no** haga un `window.location.reload()`. Si lo hace, pídele que actualice el estado en su lugar.

```bash
git add . && git commit -m "feat(ui): listado, formulario y conexión con la API"
```

---

### Prompt 2.6 · Repaso responsive

```
Revisa todos los componentes y arregla los problemas de responsive: el
formulario debe ser de una columna en móvil, los botones no se deben desbordar,
el texto largo debe truncarse con ellipsis y el grid debe respirar. Usa solo
clases de Tailwind y dime qué has cambiado y por qué.
```

---

## 5. FASE 3 — Revisión crítica (¡esta es la parte que puntúa!)

### Prompt 3.1 · Que te explique su propio código

```
Explícame línea a línea el controlador actualizarProducto y el useEffect de
App.jsx, como si yo tuviera que defenderlo en un examen oral. Señala qué
pasaría si quito runValidators y qué pasaría si quito el array de dependencias.
```

### Prompt 3.2 · Auditoría

```
Revisa todo el proyecto y dime:
1. Qué credenciales o datos sensibles podrían estar expuestos.
2. Qué validaciones faltan en el backend que ahora mismo solo están en el frontend.
3. Qué pasa si la API está caída: ¿la interfaz lo gestiona bien?
4. Tres cosas que tú mismo has hecho mal o de forma mejorable.

No cambies nada todavía, solo el informe.
```

👉 **La respuesta a este prompt es oro para tu reflexión del README.** Cópiala y quédate con lo que sea verdad (comprueba cada punto, la IA se inventa "problemas" que no existen).

### Prompt 3.3 · Archivos de trabajo actualizados

```
Actualiza TASKS.md marcando como hechas las tareas completadas y añade las que
hayan salido nuevas. No toques PLAN.md ni AGENTS.md.
```

---

## 6. FASE 4 — Despliegue

### Prompt 4.1

```
Prepara el proyecto para desplegar: backend en Render y frontend en Vercel.
Dime exactamente qué variables de entorno tengo que configurar en cada
plataforma, qué build command y start command poner, y qué tengo que cambiar
en la configuración de CORS del backend para que acepte el dominio de Vercel.
```

**Qué revisar:** que el CORS **no** quede en `origin: '*'` en producción. Pon tu dominio de Vercel.

### Prompt 4.2

```
Actualiza requests.http y la colección de Postman para que la variable base
apunte a la URL de producción, y añade en el README la sección de despliegue
con las dos URLs.
```

---

## 7. FASE 5 — Documentación final

### Prompt 5.1

```
Lee todo el repositorio y escribe la sección "Uso de IA" del README: qué
herramientas usé, qué partes generó la IA, qué corregí yo y qué errores
concretos produjo. Sé específico con archivos y líneas, sin inventarte nada:
si no tienes constancia de un error, no lo pongas.
```

⚠️ **Esta respuesta la tienes que reescribir tú.** La IA no sabe qué corregiste tú de verdad. Úsala como esqueleto y rellénala con lo que anotaste por el camino.

### Prompt 5.2 · Reflexión

La reflexión la escribes **tú a mano**. Si quieres ayuda para ordenarla:

```
Te voy a contar en desorden lo que me ha pasado durante el proyecto y tú lo
ordenas en una reflexión de 400 palabras, en primera persona y sin lenguaje
grandilocuente: [aquí cuentas tus notas]
```

---

## 8. Checklist final antes de entregar

- [ ] Repo en GitHub con **10+ commits** descriptivos
- [ ] `.gitignore` y `.gitattributes` en el repo *(5 pts de la rúbrica)*
- [ ] `PLAN.md` *(4 pts)*
- [ ] `AGENTS.md` *(3 pts)*
- [ ] `SKILLS.md` *(2 pts)*
- [ ] `README.md` con proceso, prompts y reflexión *(1 pt)*
- [ ] `TASKS.md` actualizado al final (no todo en ⬜)
- [ ] `.env.example` en server y client · `.env` **NO** subido
- [ ] `requests.http` + `skinshelf.postman_collection.json`
- [ ] CRUD completo funcionando desde la interfaz: listar, crear, editar, eliminar
- [ ] Datos guardándose de verdad en MongoDB Atlas
- [ ] URL del frontend y URL de la API funcionando
- [ ] Responsive comprobado en móvil, tablet y escritorio
- [ ] Entregado en Google Classroom

---

## 9. Cuaderno de errores (rellénalo tú sobre la marcha)

Cada vez que la IA meta la pata, apúntalo aquí mismo. Esto es lo que después copias al README y lo que separa un 5 de un 10.

| # | Dónde | Qué hizo mal la IA | Cómo lo arreglé |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |
