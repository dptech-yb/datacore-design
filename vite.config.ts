import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// Relative assets keep the site deployable both at a project Pages URL and locally.
// "@/components/ui" 与 "@/lib" 指向 registry/：文档站示例直接渲染组件源里的真组件。
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^@\/components\/ui\/(.*)$/, replacement: path.resolve(__dirname, "registry/ui/$1") },
      { find: /^@\/lib\/(.*)$/, replacement: path.resolve(__dirname, "registry/lib/$1") },
    ],
  },
});
