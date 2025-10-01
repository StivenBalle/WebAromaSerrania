import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    // CONFIGURACIÓN CLAVE PARA RENDER
    rollupOptions: {
      input: {
        main: "./index.html",
      },
    },
  },
  // CONFIGURACIÓN PARA PRODUCCIÓN
  base: "./", // Esto es IMPORTANTE para rutas relativas
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
