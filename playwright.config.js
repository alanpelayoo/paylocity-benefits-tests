// @ts-check
const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  retries: 0,
  reporter: "html",
  use: {
    baseURL: "https://wmxrwq14uc.execute-api.us-east-1.amazonaws.com/Prod",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "ui-tests",
      testDir: "./tests/ui",
      use: {
        headless: true,
      },
    },
    {
      name: "api-tests",
      testDir: "./tests/api",
    },
  ],
});
