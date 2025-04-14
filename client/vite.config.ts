import { defineConfig } from 'vite';
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';
import glsl from 'vite-plugin-glsl';
import {resolve} from "path";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [wasm(), topLevelAwait(), glsl()],
  build: {
    rollupOptions: {
      treeshake: false,
    },
    sourcemap: true  // Generate source maps
    
  },
  server: {
    host: '0.0.0.0',  // Important for Docker
    port: 5173,
    strictPort: true,
    hmr: {
      port: 5173,  // Must match the server port
    }
  },
  
  resolve:{
    alias:[{
      find:"@common",replacement:resolve(__dirname,"../common")
    }]
  }
});