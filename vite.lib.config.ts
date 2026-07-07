import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "node:path";

// Builds the published package (dist/index.js + dist/index.d.ts) — a separate config from
// vite.config.ts, which stays focused on the local demo app and Vitest. CSS is not built here:
// dist/style.css and dist/theme.css are produced by the `build:lib:css`/`build:lib:theme`
// scripts instead, since neither is reachable from the src/index.ts module graph (consumers
// opt into one or the other explicitly rather than getting styles injected as a side effect
// of importing a component).
export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: "./tsconfig.app.json",
      include: ["src"],
      exclude: [
        "src/**/*.stories.tsx",
        "src/**/*.test.tsx",
        "src/**/*.mdx",
        "src/docs/**",
        "src/test/**",
        "src/App.tsx",
        "src/main.tsx",
        "src/vite-env.d.ts",
      ],
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: () => "index.js",
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        /^@visx\//,
        "class-variance-authority",
        "clsx",
        "tailwind-merge",
      ],
    },
  },
});
