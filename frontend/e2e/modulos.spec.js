// Abre cada módulo del panel y el tablero 3D en un navegador real, sin errores.
import { expect, test } from "@playwright/test";

const MODULOS = [
  ["driving", "Conducción"], ["crab-mode", "Modo Cangrejo"], ["aerodinamica", "Aerodinámica"],
  ["tires", "Neumáticos"], ["enhanced-tires", "Neumáticos Pro"], ["traction", "Tracción"],
  ["suspension", "Suspensión"], ["transmission", "Transmisión"], ["power", "Potencia"],
  ["autonomy", "Autonomía"], ["compressor", "Compresor"], ["security", "Seguridad"],
  ["viden", "Viden"], ["awareness", "Sensores"], ["codes", "Códigos"], ["comfort", "Confort"],
  ["uv-hygiene", "Higienización UV"], ["smart", "Inteligente"], ["treer", "TreeR"],
  ["monitoring", "Monitoreo"], ["diagnostics", "Diagnósticos"],
];

test.beforeEach(async ({ page }) => {
  page.errores = [];
  page.on("pageerror", (e) => page.errores.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/WebGL|GPU|GL_/i.test(m.text())) page.errores.push(m.text()); });
  await page.goto("./");
});

test("cada módulo del menú se abre sin errores", async ({ page }) => {
  await page.getByRole("button", { name: "Pantalla principal" }).click();
  for (const [id, nombre] of MODULOS) {
    const launcherCard = page.locator(".tt-module-card").filter({ hasText: nombre });
    if (await launcherCard.count()) await launcherCard.click();
    else await page.getByTestId(`nav-${id}`).click();
    await expect(page.getByText(nombre).first()).toBeVisible();
    // El módulo se descarga al abrirlo: espera a que termine de cargar y dibuje algo.
    await expect(page.getByText("Cargando módulo…")).toHaveCount(0);
    await expect(page.locator("main")).not.toBeEmpty();
  }
  expect(page.errores).toEqual([]);
});

test("el tablero muestra la telemetría y el modelo 3D", async ({ page }) => {
  await page.getByRole("button", { name: "Tablero" }).click();
  await expect(page.getByTestId("card-speed")).toHaveText("85km/h");
  await expect(page.locator("canvas").first()).toBeVisible();
  expect(page.errores).toEqual([]);
});
