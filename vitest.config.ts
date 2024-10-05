import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    browser: {
      name: 'chrome',
      provider: 'webdriverio',
      enabled: true,
      headless: true,
    },
  },
});
