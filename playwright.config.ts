// playwright.config.ts - Fixed configuration
import { defineConfig, devices } from '@playwright/test';

const isContainerized = !!process.env.PW_TEST_CONNECT_WS_ENDPOINT;

export default defineConfig({
  // Increased timeouts for containerized environments
  timeout: 60000,
  globalTimeout: isContainerized ? 1800000 : undefined,

  // Configure webServer with proper error handling
  webServer: isContainerized ? undefined : {
    command: 'bun run dev --filter=web', // or 'turbo run dev --filter=web'
    url: 'http://127.0.0.1:3000',
    timeout: 180 * 1000,
    reuseExistingServer: !process.env.CI,
    env: {
      PORT: '3000'
    }
  },

  use: {
    // Dynamic base URL
    baseURL: isContainerized ? 'http://hostmachine:3000' : 'http://127.0.0.1:3000',

    // Container connection configuration
    ...(isContainerized && {
      connectOptions: {
        wsEndpoint: 'ws://127.0.0.1:7900/',
        timeout: 60000,
        exposeNetwork: '<loopback>',
      }
    }),

    // Extended timeouts for network operations
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    }
  ],
});