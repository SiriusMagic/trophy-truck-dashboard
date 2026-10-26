# Despliegue

La app es un sitio estático (HTML + JS + CSS). Se puede publicar en cualquier hosting estático.

## GitHub Pages (automático)

1. Settings → Pages → Source: **GitHub Actions** (solo la primera vez).
2. Cada push a `main` ejecuta `.github/workflows/pages.yml`, que compila y publica.
3. URL: https://siriusmagic.github.io/trophy-truck-dashboard/

## Cualquier otro hosting (Netlify, Cloudflare Pages, Nginx…)

```bash
cd frontend
yarn install --frozen-lockfile
yarn build
```

Sube el contenido de `frontend/build/`. Las rutas son relativas, así que funciona en cualquier carpeta.

## Docker

```bash
docker compose up --build
```

Sirve la app con Nginx en http://localhost:3000.
