import react from '@vitejs/plugin-react';
import { defineConfig, mergeConfig } from 'vite';

import { sharedViteConfig } from '../../config/vite.shared';

export default defineConfig(() =>
  mergeConfig(sharedViteConfig, {
    plugins: [react()],
    server: {
      port: 5173,
    },
  })
);
