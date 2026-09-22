# DESPLIEGUE.md — SkinShelf paso a paso

Guía para dejar la API y el frontend funcionando en internet. No hace falta tarjeta en ninguno de los tres servicios.

---

## 1. MongoDB Atlas (la base de datos)

1. Entra en [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) y crea una cuenta.
2. **Create a cluster** → elige el plan gratuito **M0** y la región más cercana (Frankfurt o Ireland).
3. **Database Access** → *Add New Database User*:
   - Usuario: `skinshelf`
   - Contraseña: genérala y **guárdala**. Si tiene `@`, `/`, `:` o `#`, cámbiala por una solo con letras y números: esos caracteres rompen la cadena de conexión.
   - Rol: *Read and write to any database*.
4. **Network Access** → *Add IP Address* → **Allow access from anywhere** (`0.0.0.0/0`). Render no tiene IP fija, así que es necesario.
5. **Database → Connect → Drivers** → copia la cadena, que se parece a:

```
mongodb+srv://skinshelf:TU_CONTRASENA@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

6. Añádele el nombre de la base de datos **antes del `?`**:

```
mongodb+srv://skinshelf:TU_CONTRASENA@cluster0.xxxxx.mongodb.net/skinshelf?retryWrites=true&w=majority
```

7. Pégala en `server/.env` como `MONGODB_URI` y comprueba en local que la API arranca y guarda productos.

> ❗ Si no le pones nombre de base de datos, Mongo guarda todo en `test` y luego no encuentras nada en la pestaña *Collections*.

---

## 2. GitHub (el repositorio)

```bash
# Antes de subir: comprueba que el .env NO está incluido
git status --ignored | grep .env

git add .
git commit -m "chore: proyecto listo para desplegar"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/skinshelf.git
git push -u origin main
```

Entra en el repo en GitHub y **busca tu contraseña de Atlas en el buscador del repositorio**. Si aparece, la has subido: cámbiala en Atlas inmediatamente y reescribe el historial.

---

## 3. Render (la API)

1. [render.com](https://render.com) → *New* → **Web Service** → conecta tu repo de GitHub.
2. Configuración:

| Campo | Valor |
|---|---|
| Name | `skinshelf-api` |
| Root Directory | `server` |
| Runtime | Node |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | Free |

3. **Environment → Add Environment Variable**:

| Key | Value |
|---|---|
| `MONGODB_URI` | tu cadena de Atlas completa |
| `CORS_ORIGIN` | `https://skinshelf.vercel.app` *(la pones después del paso 4; de momento déjala en blanco o con `*` y la ajustas)* |

> ⚠️ **No** pongas `PORT`. Render lo inyecta él; tu código debe usar `process.env.PORT || 4000`.

4. Deploy. Cuando termine, abre la URL: debe responder `{ "ok": true, "mensaje": "API SkinShelf" }`.

> 💤 El plan gratuito duerme el servicio tras 15 minutos sin uso: la primera petición puede tardar ~30 segundos. Menciónalo en el README para que no parezca un bug.

---

## 4. Vercel (el frontend)

1. [vercel.com](https://vercel.com) → *Add New* → **Project** → importa el mismo repo.
2. Configuración:

| Campo | Valor |
|---|---|
| Framework Preset | Vite |
| Root Directory | `client` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

3. **Environment Variables**:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://skinshelf-api.onrender.com` (sin barra final) |

4. Deploy.

> ⚠️ Las variables `VITE_*` se compilan dentro del bundle. Si cambias `VITE_API_URL` después, hay que **volver a hacer deploy**; no basta con guardarla.

---

## 5. Cerrar el círculo del CORS

1. Copia la URL final de Vercel (`https://skinshelf-xxxx.vercel.app`).
2. En Render, actualiza `CORS_ORIGIN` con ese valor exacto, **sin barra final**.
3. En `server/src/app.js`:

```js
app.use(cors({ origin: process.env.CORS_ORIGIN }));
```

4. Guarda → Render redespliega solo.

---

## 6. Comprobación final

Con la app de Vercel abierta y la consola del navegador a la vista:

- [ ] La lista carga (aunque esté vacía)
- [ ] Crear un producto → aparece en la lista
- [ ] Editar → el cambio persiste tras recargar la página
- [ ] Eliminar → desaparece y sigue sin estar tras recargar
- [ ] El filtro por categoría funciona
- [ ] Cero errores rojos en la consola
- [ ] En Atlas → *Collections* → la colección `productos` tiene los documentos
- [ ] Responsive: prueba en el móvil de verdad, no solo en el inspector

---

## 7. Errores típicos

| Síntoma | Causa | Solución |
|---|---|---|
| `Failed to fetch` en el navegador | CORS mal configurado o `VITE_API_URL` con barra final | Revisa ambos y redespliega el frontend |
| La API responde pero la lista sale vacía siempre | `VITE_API_URL` apunta a localhost en producción | Ponla en Vercel y **redeploy** |
| `MongooseServerSelectionError` en los logs de Render | IP no permitida en Atlas | Network Access → `0.0.0.0/0` |
| `bad auth` | La contraseña tiene caracteres especiales | Genera una solo con letras y números |
| La primera carga tarda 30 s | Servicio gratuito dormido en Render | Normal; explícalo en el README |
| Build de Vercel falla | Root Directory mal puesto | Debe ser `client`, no la raíz |
