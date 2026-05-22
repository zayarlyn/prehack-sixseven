import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 6767,
  },
  resolve: {
    alias: {
      '@swap-web': path.resolve(__dirname, './src'),
    },
  },
});
