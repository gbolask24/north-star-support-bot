import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [viteSingleFile()],
  build: {
    // Single self-contained dist/index.html — reviewable by double-click, no server needed
    assetsInlineLimit: 100000000,
    cssCodeSplit: false,
  },
});
