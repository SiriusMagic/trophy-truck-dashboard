# Trophy Truck Eléctrico — Panel de Sistemas

Panel de control para un **trophy truck eléctrico** (camioneta todoterreno de competición). Mantiene el tablero visible mientras permite abrir 21 funciones de control en un panel integrado.

> ✅ **Funciona 100 % en el navegador.** No necesita servidor, base de datos ni Vercel. Los datos son simulados (`frontend/src/data/mockData.js`).

## Módulos

- **Panel principal**: velocidad, RPM, torque, batería y temperaturas.
- **Potencia, tracción y transmisión virtual**.
- **Suspensión, neumáticos y compresor**.
- **Modo cangrejo**: dirección en las cuatro ruedas.
- **Aerodinámica, conducción autónoma y avanzada**.
- **Sensores, seguridad y códigos**.
- **Confort e higienización UV**.
- **Diagnóstico y monitoreo de parámetros**.

## Cómo usarla

### Opción 1 — En el navegador, sin instalar nada

Ábrela en **https://siriusmagic.github.io/trophy-truck-dashboard/**

Se publica sola en GitHub Pages cada vez que hay un cambio en `main`. La primera vez hay que activarlo en **Settings → Pages → Source: GitHub Actions**.

### Opción 2 — En tu computadora

Requisitos: **Node.js 20 o superior** y **Yarn**.

```bash
cd frontend
yarn install
yarn dev        # abre http://localhost:3000
```

Para generar la versión final: `yarn build` (queda en `frontend/build/`) y `yarn preview` para probarla.

### Opción 3 — Compartirla desde tu computadora con un túnel

Con la app corriendo (`yarn dev`), en otra terminal:

```bash
npx cloudflared tunnel --url http://localhost:3000
```

Te dará un enlace `https://….trycloudflare.com` que puedes abrir desde el celular o compartir. Se cierra al detener el comando.

### Opción 4 — Docker

```bash
docker compose up --build   # http://localhost:3000
```

### Opción 5 — App de Android (APK)

GitHub compila un APK automáticamente (con [Capacitor](https://capacitorjs.com/)):

- **Versión de `main`:** en la página del repo → **Releases** → **APK más reciente** → descarga `trophy-truck.apk`.
- **Versión de un pull request:** pestaña **Actions** → la ejecución "APK Android" → sección **Artifacts** (viene en un .zip).

En el celular, abre el archivo y acepta "instalar apps de origen desconocido". Es un APK de prueba (sin firma de tienda), para probar, no para publicar en Google Play.

Para compilarlo en una computadora con Android Studio:

```bash
cd frontend
yarn build && npx cap add android && npx cap open android
```

## Pruebas

```bash
cd frontend
  yarn test:e2e   # abre los 21 módulos integrados y verifica el tablero 3D
```

GitHub las ejecuta en cada cambio. Las actualizaciones menores de Dependabot se fusionan solas cuando las pruebas pasan.

## Tecnología

- **React 19** + **Vite 8**
- **Tailwind CSS 4** + componentes **shadcn/ui** (Radix UI)
- **Three.js** para gráficos 3D
- **Capacitor 8** para empaquetar como app de Android

## Familia de proyectos

| Repo | Qué es |
|---|---|
| trophy-truck-ui-alfa | Versión alfa original (archivada) |
| trophy-truck-ui-3d | + modelo 3D y panel estilo BMW (archivada) |
| **trophy-truck-dashboard** | **Versión unificada: incluye todo lo anterior (este repo)** |

## Licencia

Copyright 2026 SiriusMagic

Este proyecto se distribuye bajo la **Licencia Apache 2.0**. Consulta el archivo [`LICENSE`](./LICENSE) para ver el texto completo.

En resumen: cualquiera puede usar, copiar, modificar y distribuir este código, siempre que conserve el aviso de copyright y la licencia. El software se entrega **"tal cual", sin garantías de ningún tipo**, y los autores no se hacen responsables de daños derivados de su uso.

## Seguridad

¿Encontraste una vulnerabilidad? Lee [`SECURITY.md`](./SECURITY.md) y repórtala de forma privada.
