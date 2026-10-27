// Abre cada módulo del panel y el tablero 3D en un navegador real, sin errores.
import { expect, test } from "@playwright/test";

const MODULOS = [
  "Reconocimiento", "Seguridad", "Modo Cangrejo", "Viden", "Geocercas", "Aerodinámica",
  "Neumáticos", "Neumáticos Pro", "Compresor", "Higienización UV", "Monitoreo", "Códigos",
  "TreeR", "Autonomía", "Tracción", "Inteligente", "Confort", "Conducción", "Potencia",
  "Suspensión", "Sensores", "Diagnósticos", "Transmisión", "Sistema Neural",
];

test.beforeEach(async ({ page }) => {
  page.errores = [];
  page.on("pageerror", (e) => page.errores.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/WebGL|GPU|GL_/i.test(m.text())) page.errores.push(m.text()); });
  await page.goto("./");
});

test("cada módulo del menú se abre sin errores", async ({ page }) => {
  const menu = page.locator("aside, nav").first();
  for (const nombre of MODULOS) {
    await menu.getByText(nombre, { exact: true }).click();
    await expect(page.getByText(nombre).first()).toBeVisible();
  }
  expect(page.errores).toEqual([]);
});

test("el tablero muestra la telemetría y el modelo 3D", async ({ page }) => {
  await page.getByText("Click para Dashboard").click();
  await expect(page.getByText("85 km/h").first()).toBeVisible();
  await expect(page.locator("canvas").first()).toBeVisible();
  expect(page.errores).toEqual([]);
});
