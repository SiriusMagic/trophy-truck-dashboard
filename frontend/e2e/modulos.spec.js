import { expect, test } from "@playwright/test";

const GROUPS = {
  driving: ["driving", "crab-mode", "aerodinamica", "tires", "enhanced-tires", "traction", "suspension", "transmission"],
  energy: ["power", "autonomy", "compressor"],
  safety: ["security", "viden", "awareness", "codes"],
  comfort: ["comfort", "uv-hygiene", "smart", "treer"],
  diagnostics: ["monitoring", "diagnostics"],
};

test.beforeEach(async ({ page }) => {
  page.errores = [];
  page.on("pageerror", (error) => page.errores.push(error.message));
  page.on("console", (message) => { if (message.type() === "error" && !/WebGL|GPU|GL_/i.test(message.text())) page.errores.push(message.text()); });
  await page.goto("./");
});

test("el tablero permanece visible mientras se abre cada sistema", async ({ page }) => {
  for (const [group, modules] of Object.entries(GROUPS)) {
    await page.getByTestId(`category-${group}`).click();
    await page.getByTestId(`open-${modules[0]}`).click();
    for (const id of modules.slice(1)) await page.getByLabel("Cambiar función").selectOption(id);
    await expect(page.getByTestId("dashboard-panel")).toBeVisible();
    await expect(page.getByTestId("card-speed")).toHaveText("85");
    await expect(page.getByTestId("system-panel")).toBeVisible();
  }
  expect(page.errores).toEqual([]);
});

test("el buscador encuentra funciones sin cambiar de pantalla", async ({ page }) => {
  await page.getByRole("button", { name: "Buscar funciones" }).click();
  await page.getByRole("searchbox", { name: "Buscar función" }).fill("potencia");
  await expect(page.getByTestId("open-power")).toBeVisible();
  await expect(page.getByTestId("open-driving")).toHaveCount(0);
  await page.getByTestId("open-power").click();
  await expect(page.getByTestId("dashboard-panel")).toBeVisible();
  await expect(page.getByTestId("module-power")).toBeVisible();
});

test("el tablero muestra telemetría y vehículo 3D", async ({ page }) => {
  await expect(page.getByTestId("card-speed")).toHaveText("85");
  await expect(page.locator("canvas").first()).toBeVisible();
  await expect(page.getByTestId("category-driving")).toBeVisible();
  expect(page.errores).toEqual([]);
});
