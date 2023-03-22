import { fileURLToPath, URL } from "node:url";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 5678,
    host: "127.0.0.1",
  },
  plugins: [nodeResolve(), vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
});
