// playwright.config.ts (Key configurations highlighted)
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./test", // Set during initialization to 'test'
  /* Run tests sequentially for simplicity */
  fullyParallel: false,
  workers: 1,
  /* Other configurations */
  retries: process.env.CI ? 2 : 0,
  forbidOnly: !!process.env.CI,
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "http://127.0.0.1:3000", // Uncommented and set

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    // { // Commented out for faster demo runs
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // { // Commented out for faster demo runs
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    // Uncommented and configured
    command: "pnpm run dev",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: true, // Useful during development
  },
});
