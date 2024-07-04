import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    ssr: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "npm-ri",
      fileName: "index",
      formats: ["es"],
    },
    outDir: "bin",
  },
});
