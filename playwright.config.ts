import { defineConfig, devices } from '@playwright/test';
import { targets } from './src/config/targets';

const ci = Boolean(process.env.CI);

export default defineConfig({
  globalSetup: './src/config/global-setup.ts',
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 2 : 0,
  workers: ci ? 2 : undefined,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    [
      'allure-playwright',
      {
        resultsDir: 'allure-results',
        detail: true,
        suiteTitle: true,
        environmentInfo: {
          ui_base_url: targets.uiBaseUrl,
          api_base_url: targets.apiBaseUrl,
          node: process.version,
        },
      },
    ],
  ],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'ui',
      testDir: './tests/ui',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: targets.uiBaseUrl,
        testIdAttribute: 'data-test',
      },
    },
    {
      name: 'api',
      testDir: './tests/api',
      use: {
        baseURL: targets.apiBaseUrl,
      },
    },
  ],
});
