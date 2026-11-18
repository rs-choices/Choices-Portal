import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Offline tests: pure rules in node, screens in jsdom (per-file comment).
export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./', import.meta.url)) } },
  test: { include: ['**/*.test.{ts,tsx}'], exclude: ['node_modules/**', '.next/**', '.netlify/**', '.claude/**'] },
});
