import { test, expect } from "@playwright/test";

test.describe("ChantierSync - Login", () => {
  test("Connexion SUPERADMIN réussie", async ({ page }) => {
    // Aller sur la page login
    await page.goto("http://localhost:3000/login");

    // Renseigner email et mot de passe
    await page.fill('input[type="email"]', "superadmin@chantiersync.com");
    await page.fill('input[type="password"]', "superadmin123");

    // Soumettre le formulaire
    await page.click("button[type=submit]");

    // Vérifier redirection vers dashboard
    await page.waitForURL(/.*dashboard\/superadmin/, { timeout: 15000 });

    // Vérifier présence du rôle SUPERADMIN
    await expect(page.locator("body")).toContainText("SUPERADMIN");
  });

  test("Connexion échoue avec mauvais mot de passe", async ({ page }) => {
    await page.goto("http://localhost:3000/login");

    await page.fill('input[type="email"]', "superadmin@chantiersync.com");
    await page.fill('input[type="password"]', "wrongpassword");

    await page.click("button[type=submit]");

    // Vérifier message d'erreur affiché
    await expect(page.locator("body")).toContainText("Identifiants incorrects");
  });
});
