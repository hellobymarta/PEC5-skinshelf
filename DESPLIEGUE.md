# DESPLIEGUE.md — SkinShelf paso a paso

Guía para dejar la API y el frontend funcionando en internet. No hace falta tarjeta en ninguno de los dos servicios.

El repositorio lleva dentro las dos partes, así que se crean **dos proyectos de Vercel** sobre el mismo repositorio, cambiando el *Root Directory* de cada uno.

---

## 1. MongoDB Atlas (la base de datos)

1. Entra en [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) y crea una cuenta.
2. **Create a cluster** → plan gratuito **M0** y la región más cercana.
3. **Database Access** → *Add New Database User*:
   - Rol: *Read and write to any database*.
   - Si la contraseña lleva `@`, `/`, `:` o `#`, cámbiala por una solo con letras y números: esos caracteres rompen la cadena de conexión.
4. **Network Access** → *Add IP Address* → **Allow access from anywhere** (`0.0.0.0/0`). Las funciones de Vercel no tienen IP fija, así que es necesario.
5. **Database → Connect → Drivers** → copia la cadena, que se parece a:

```
mongodb+srv://usuario:contrasena@cluster0.xxxxx.mongodb.net/skinshelf?retryWrites=true&w=majority
```

---

## 2. La API en Vercel

1. [vercel.com](https://vercel.com) → **Add New… → Project** → importa el repositorio.
2. Configuración:

| Campo | Valor |
|---|---|
| Project Name | `skinshelf-api` |
| Root Directory | `server` |
| Framework Preset | Other |

3. **Environment Variables**:

| Key | Value |
|---|---|
| `MONGODB_URI` | la cadena de Atlas |
| `CORS_ORIGIN` | la URL del frontend (al principio `*`, luego la definitiva) |

`PORT` no se pone: en serverless no hay puerto que escuchar.

4. **Deploy**. Al terminar, la raíz de la URL devuelve `{"ok":true,"mensaje":"API SkinShelf"}` y `/api/productos` devuelve la lista.

`server/vercel.json` es lo que manda todas las peticiones a la función de `server/api/index.js`, que exporta la aplicación de Express.

---

## 3. El frontend en Vercel

1. **Add New… → Project** → el mismo repositorio otra vez.
2. Configuración:

| Campo | Valor |
|---|---|
| Project Name | `skinshelf` |
| Root Directory | `client` |
| Framework Preset | Vite (lo detecta solo) |

3. **Environment Variables**:

| Key | Value |
|---|---|
| `VITE_API_URL` | la URL de la API, **sin barra final** |

Las variables `VITE_*` se compilan dentro del bundle. Si se cambia `VITE_API_URL` después, hay que volver a desplegar; no basta con guardarla.

4. **Deploy**.

---

## 4. Cerrar el CORS

Con la URL del frontend ya conocida, en el proyecto de la API:

1. *Settings → Environment Variables* → `CORS_ORIGIN` = la URL del frontend, **sin barra final**.
2. *Deployments* → los tres puntos del último → **Redeploy**.

Así la API deja de aceptar peticiones de cualquier origen y solo responde al frontend.

---

## 5. Comprobación final

1. `https://<api>/` → `{"ok":true,"mensaje":"API SkinShelf"}`
2. `https://<api>/api/productos` → la lista de productos
3. `https://<frontend>/` → las dos rutinas y el inventario, con el CRUD completo
4. Crear, editar y eliminar un producto desde la web desplegada
