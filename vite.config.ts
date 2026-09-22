import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Relative assets keep the site deployable both at a project Pages URL and locally.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
