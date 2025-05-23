import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import fs from "fs";
import type { ConfigEnv, Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";

const particleWasmPlugin: Plugin | undefined = {
  name: "particle-wasm",
  apply: (_, env: ConfigEnv) => {
    return env.mode === "development";
  },
  buildStart: () => {
    const copiedPath = path.join(
      __dirname,
      "./node_modules/@particle-network/thresh-sig/wasm/thresh_sig_wasm_bg.wasm" //@particle-network/thresh-sig dir
    );
    const dir = path.join(__dirname, "node_modules/.vite/wasm");
    const resultPath = path.join(dir, "thresh_sig_wasm_bg.wasm");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync(copiedPath, resultPath);
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      exclude: [],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      overrides: {
        // Since `fs` is not supported in browsers, we can use the `memfs` package to polyfill it.
        fs: "memfs",
      },
      protocolImports: true,
    }),
    particleWasmPlugin,
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {},
  server: {
    port: 8000,
  },
});
