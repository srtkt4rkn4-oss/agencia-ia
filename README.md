# AgencIA · Landing page

Next.js 14 (App Router) + Tailwind CSS + Framer Motion  
Backend: Notion API + Resend

---

## 1. Instalación

```bash
npm install
```

---

## 2. Variables de entorno

Copia el archivo de ejemplo y rellena las tres claves:

```bash
cp .env.example .env.local
```

Abre `.env.local` y añade tus valores:

```
NOTION_API_KEY=secret_xxxxxxxxxxxx
NOTION_DATABASE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_API_KEY=re_xxxxxxxxxxxx
```

### Cómo obtener cada clave

**Notion:**
1. Ve a [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations) y crea una integración.
2. Copia el `Internal Integration Token` → `NOTION_API_KEY`.
3. Abre tu base de datos en Notion, copia el ID de la URL (32 caracteres tras el último `/`) → `NOTION_DATABASE_ID`.
4. Comparte la base de datos con tu integración (botón "Connect to" en la BD).

La base de datos debe tener estas propiedades:
| Nombre   | Tipo       |
|----------|------------|
| ID       | Title      |
| Nombre   | Rich text  |
| Empresa  | Rich text  |
| Email    | Email      |
| Mensaje  | Rich text  |
| Fecha    | Date       |

**Resend:**
1. Crea cuenta en [https://resend.com](https://resend.com).
2. Ve a API Keys y genera una clave → `RESEND_API_KEY`.

---

## 3. Desarrollo local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

El servidor arranca con error si falta alguna de las tres variables de entorno.

---

## 4. Subir a GitHub de forma segura

```bash
# Verificar que .env.local NO aparece en el staging
git status

# Si accidentalmente fue añadido, quitarlo del tracking
git rm --cached .env.local

# Comprobar el .gitignore antes del primer push
cat .gitignore | grep .env
```

**Nunca hagas commit de `.env.local`.** El `.gitignore` ya lo excluye, pero compruébalo antes del primer `git add`.

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TU_USUARIO/laagencia.git
git push -u origin main
```

---

## 5. Variables de entorno en Vercel

1. En el dashboard de Vercel, abre tu proyecto → **Settings → Environment Variables**.
2. Añade las tres variables (una por una):
   - `NOTION_API_KEY`
   - `NOTION_DATABASE_ID`
   - `RESEND_API_KEY`
3. Selecciona los entornos donde aplican (Production, Preview, Development).
4. Haz un nuevo deploy para que los cambios surtan efecto.

Las variables en Vercel son cifradas y nunca se exponen al cliente.

---

## Estructura del proyecto

```
app/
  layout.tsx          # Root layout con metadatos
  page.tsx            # Punto de entrada → renderiza LandingPage
  globals.css         # Tailwind base styles
  api/
    contact/
      route.ts        # POST handler: validación + Notion + Resend
components/
  LandingPage.tsx     # Toda la UI con animaciones Framer Motion
  FadeInWhenVisible.tsx  # Componente de animación reutilizable
next.config.js        # Security headers
.env.local            # Claves reales (ignorado por git)
.env.example          # Plantilla para otros desarrolladores
```
