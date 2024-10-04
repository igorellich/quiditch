import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [wasm(), topLevelAwait(), glsl()],
  build: {
    rollupOptions: {
      treeshake: false,
    }
  }
});
