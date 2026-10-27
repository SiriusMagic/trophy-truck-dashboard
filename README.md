# Trophy Truck Eléctrico — Panel de Sistemas

Panel de control futurista para un **trophy truck eléctrico** (camioneta todoterreno de competición). Muestra telemetría (velocidad, RPM, torque, batería, temperatura) y más de 25 módulos para controlar el vehículo.

> ✅ **Funciona 100 % en el navegador.** No necesita servidor, base de datos ni Vercel. Los datos son simulados (`frontend/src/data/mockData.js`).

## Módulos

- **Panel principal**: velocidad, RPM, torque, batería y temperaturas.
- **Potencia, tracción y transmisión virtual**.
- **Suspensión, neumáticos y compresor**.
- **Modo cangrejo**: dirección en las cuatro ruedas.
- **Aerodinámica, conducción autónoma y avanzada**.
- **Reconocimiento, sensores y conciencia situacional**.
- **Seguridad, códigos y geocercas**.
- **Confort e higienización UV**.
- **Diagnóstico y monitoreo de parámetros**.
- **Sistema neural**: red neuronal visual con controles.

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

## Tecnología

- **React 19** + **Vite 8**
- **Tailwind CSS 4** + componentes **shadcn/ui** (Radix UI)
- **Three.js** para gráficos 3D

## Familia de proyectos

| Repo | Qué es |
|---|---|
| trophy-truck-ui-alfa | Versión alfa original (archivada) |
| trophy-truck-ui-3d | + modelo 3D y panel estilo BMW (archivada) |
| trophy-truck-ui-neuronal | + red neuronal visual (archivada) |
| **trophy-truck-dashboard** | **Versión unificada: incluye todo lo anterior (este repo)** |

## Licencia

Copyright 2026 SiriusMagic

Este proyecto se distribuye bajo la **Licencia Apache 2.0**. Consulta el archivo [`LICENSE`](./LICENSE) para ver el texto completo.

En resumen: cualquiera puede usar, copiar, modificar y distribuir este código, siempre que conserve el aviso de copyright y la licencia. El software se entrega **"tal cual", sin garantías de ningún tipo**, y los autores no se hacen responsables de daños derivados de su uso.

## Seguridad

¿Encontraste una vulnerabilidad? Lee [`SECURITY.md`](./SECURITY.md) y repórtala de forma privada.
