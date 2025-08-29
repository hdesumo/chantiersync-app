import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/frontend",
  use: {
    baseURL: "http://localhost:3000",  // ton Next.js
    headless: true                     // exécution en mode CLI
  }
});
