import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        side_panel: "index.html",
        background: "src/background/background.js",
        contentScript: 'src/background/contentScript.js',
      },
      output: {
        entryFileNames: "[name].js",
        assetFileNames: "[name].[ext]",
        chunkFileNames: "[name].js",
      },
    },
  },
  optimizeDeps: {
    include: ["regenerator-runtime"],
  },
  server: {
    port: 3000,
  },
});
