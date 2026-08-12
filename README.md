# Lumi Home

Tienda de decoración + panel admin con Cloudflare Worker y KV.

## Desarrollo local

En una terminal:

```bash
npm run dev:api
```

En otra:

```bash
npm run dev
```

- Tienda: http://localhost:5173/
- Admin: http://localhost:5173/admin
- Token local (`.dev.vars`): `lumi-admin-dev`

Vite proxyea `/api` hacia el Worker en el puerto 8787.

## Deploy

1. Crear el namespace KV y actualizar `id` / `preview_id` en `wrangler.jsonc`:

```bash
npx wrangler kv namespace create LUMI_STORE
npx wrangler kv namespace create LUMI_STORE --preview
```

2. Configurar el secret:

```bash
npx wrangler secret put ADMIN_TOKEN
```

3. Publicar:

```bash
npm run deploy
```

## Panel admin

En `/admin` podés:

- Editar banners del hero
- Crear/editar categorías
- Crear/editar productos con descripción, color picker e **imagen por color** (convertida a WebP al subir)

El catálogo se guarda en KV (`catalog`) como JSON, con imágenes embebidas en base64 WebP cuando las subís desde el admin.
