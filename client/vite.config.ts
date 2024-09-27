import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "node:path";

const proxyObject = {
  target: "http://localhost:8080",
  ws: true,
  changeOrigin: true,
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "/app",
  server: {
    proxy: {
      "/api": proxyObject,
      "/config": proxyObject,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
