# SKILLS.md — Habilidades, técnicas y prompts reutilizables

Prompts y técnicas que he usado con la IA en **SkinShelf**. Están escritos para poder reutilizarlos en cualquier otro CRUD cambiando solo la entidad.

---

## 1. Técnicas que me han funcionado

| Técnica | En qué consiste | Por qué funciona |
|---|---|---|
| **Contexto primero** | Empezar cada sesión con "lee `PLAN.md` y `AGENTS.md` antes de escribir nada". | Evita que invente estructura, nombres o stack distintos a los acordados. |
| **Plan antes que código** | "No escribas código todavía: dime qué archivos vas a crear y espera confirmación." | Detecto el desvío antes de tener 300 líneas que revisar. |
| **Un archivo por prompt** | Pedir el proyecto en trozos pequeños. | Puedo leer y entender cada pieza; si algo falla, sé exactamente dónde. |
| **Explícamelo** | Terminar los prompts con "explícame qué hace X y qué pasaría si lo quito". | Me obliga a entender el código y detecto cuando la IA no sabe justificar lo que ha escrito. |
| **Auto-auditoría** | Pedirle que critique su propio código y liste tres cosas mejorables. | Saca fallos reales, aunque también inventa alguno: hay que verificar uno a uno. |
| **Prompt de error con contexto** | Pegar el error completo + el archivo + qué esperaba que pasara. | Sin el error literal, la IA adivina; con él, acierta casi siempre a la primera. |
| **Casos que deben fallar** | Probar siempre un caso inválido, no solo el feliz. | Ahí es donde aparecen los 500 que deberían ser 400. |

---

## 2. Prompts reutilizables

### 2.1 · Arranque de sesión

> "Lee `PLAN.md` y `AGENTS.md` de la raíz y respeta esas convenciones. No escribas código todavía: dime qué estructura de carpetas propones y espera mi confirmación."

### 2.2 · Modelo de datos

> "Crea un esquema de Mongoose para `[ENTIDAD]` con estos campos: `[lista con tipo, obligatoriedad y validación]`. Añade `timestamps: true` y mensajes de validación en español. Después explícame en 5 líneas qué hace `enum` y qué pasa si envío un valor que no está en la lista."

### 2.3 · Controlador CRUD

> "Crea un controlador de Express para `[ENTIDAD]` con listar, obtener por id, crear, actualizar y eliminar. Usa `async/await` con `try/catch` y `next(error)`. Devuelve 404 si no existe y 400 si el id no es un ObjectId válido. En el update usa `{ new: true, runValidators: true }`. Explícame por qué hace falta `runValidators`."

### 2.4 · Manejo de errores

> "Crea dos middlewares: `notFound` (404 para rutas inexistentes) y `errorHandler` genérico que devuelva 400 con los mensajes si el error es un `ValidationError` de Mongoose. Móntalos en el orden correcto y explícame por qué el `errorHandler` lleva cuatro parámetros."

### 2.5 · Servicio de API en React

> "Crea `services/api.js` con las cinco funciones del CRUD usando `fetch` e `import.meta.env.VITE_API_URL`. Cada función debe lanzar un `Error` con el mensaje del backend si la respuesta no es `ok`. No uses axios."

### 2.6 · Componente de listado

> "Crea `[Entidad]List.jsx` y `[Entidad]Card.jsx`. La lista recibe por props los elementos y las funciones `onEditar` y `onEliminar`, y los muestra en grid responsive (1/2/3 columnas). La tarjeta muestra `[campos]` y dos botones. Componentes funcionales, props desestructuradas, `key` = `_id`."

### 2.7 · Formulario reutilizable crear/editar

> "Crea un formulario controlado con `useState` para todos los campos de `[ENTIDAD]`. Debe servir para crear y para editar: si recibe `[entidad]Inicial`, carga sus valores con `useEffect` y cambia el texto del botón. Los campos con enum son `<select>` con **exactamente** las mismas opciones del modelo. Valida los obligatorios antes de enviar y muestra el error bajo el campo."

### 2.8 · Conectar todo en App

> "Escribe `App.jsx` con estados para lista, cargando, error y elemento en edición; `useEffect` con dependencias `[]` para la carga inicial; handlers de crear, actualizar y eliminar que actualicen el estado sin recargar la página; y confirmación antes de eliminar."

### 2.9 · Depuración

> "Tengo este error: `[error literal completo]`. Ocurre cuando `[acción]`. Este es el archivo implicado: `[código]`. Esperaba que `[comportamiento]`. Dime la causa antes de darme la solución."

### 2.10 · Revisión crítica

> "Revisa el proyecto y dime: 1) qué datos sensibles podrían estar expuestos, 2) qué validaciones faltan en el backend, 3) qué pasa si la API está caída, 4) tres cosas que has hecho mal tú. No cambies nada, solo el informe."

### 2.11 · Defensa oral

> "Explícame línea a línea `[archivo/función]` como si tuviera que defenderlo en un examen. Señala qué pasaría si quito `[X]`."

### 2.12 · Responsive

> "Revisa los componentes y arregla los problemas de responsive: formulario a una columna en móvil, botones que no se desborden, texto largo truncado. Solo clases de Tailwind, y dime qué has cambiado y por qué."

### 2.13 · Despliegue

> "Prepara el proyecto para desplegar la API en Render y el frontend en Vercel. Dime qué variables de entorno configurar en cada plataforma, qué build y start command, y qué cambiar en CORS para aceptar el dominio de Vercel."

---

## 3. Antipatrones detectados

Cosas que hace la IA si no se lo impides expresamente:

| Antipatrón | Cómo lo evito |
|---|---|
| Meter todo el backend en un `index.js` | Le doy la estructura de carpetas en el prompt. |
| `findByIdAndUpdate` sin `{ new: true }` | Lo pido explícitamente y lo compruebo con Postman. |
| Olvidar `runValidators: true` | Idem: lo pido y pruebo un PUT con una categoría inválida. |
| `errorHandler` con 3 parámetros | Le pido que me explique por qué lleva 4; si no lo sabe, lo corrijo. |
| `process.env` en el frontend de Vite | Especifico `import.meta.env.VITE_*` en el prompt. |
| Opciones del `<select>` distintas al `enum` | Le paso la lista literal copiada del modelo. |
| `useEffect` sin array de dependencias | Lo pido explícitamente y miro la pestaña Red del navegador. |
| `window.location.reload()` tras guardar | Prohibido en `AGENTS.md`. |
| Añadir axios, lodash, moment… sin pedirlo | Regla en `AGENTS.md`: no añadir dependencias sin confirmación. |
| Escribir la URI de Mongo en el código | Regla en `AGENTS.md` + revisión manual antes de cada commit. |

---

## 4. Qué NO delego en la IA

- Decidir el modelo de datos final y la arquitectura del proyecto.
- Gestionar secretos y variables de entorno.
- Dar por buena una respuesta sin probar la app en el navegador y la API en Postman.
- Escribir la reflexión y el relato de mi propio aprendizaje.
