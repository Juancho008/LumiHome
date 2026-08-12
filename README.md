# Lumi Home

Tienda de decoración + panel admin. Frontend y API en **Vercel**; datos en **Cloudflare KV**.

## Desarrollo local

Terminal 1 (API local con KV simulada):

```bash
npm run dev:api
```

Terminal 2 (Vite):

```bash
npm run dev
```

- Tienda: http://localhost:5173/
- Admin: http://localhost:5173/admin
- Token (`.dev.vars`): `lumi-admin-dev`

Vite proxyea `/api` → Worker en `:8787`.

## Deploy en Vercel

1. Crear un namespace KV en Cloudflare:

```bash
npx wrangler kv namespace create LUMI_STORE
```

2. En Vercel → Project → Settings → Environment Variables:

| Variable | Descripción |
|----------|-------------|
| `ADMIN_TOKEN` | Contraseña del panel `/admin` |
| `CF_ACCOUNT_ID` | Account ID de Cloudflare |
| `CF_KV_NAMESPACE_ID` | ID del namespace KV |
| `CF_API_TOKEN` | Token con permiso de edición KV |

3. Deploy:

```bash
npm i -g vercel
vercel
```

O conectá el repo en el dashboard de Vercel (build: `npm run build`, output: `dist`).

Las rutas `/api/*` viven como Serverless Functions en Vercel y leen/escriben el JSON del catálogo en Cloudflare KV (imágenes WebP en base64 incluidas).

## Panel admin

En `/admin`:

- Banners del hero
- Categorías
- Productos con descripción, color picker e **imagen por color** (convertida a WebP al subir)

Al cambiar el color en la tienda, cambia la imagen del producto.
