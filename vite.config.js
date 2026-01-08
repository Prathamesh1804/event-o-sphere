import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Standard configuration for Tailwind v3 projects
export default defineConfig({
  plugins: [react()],
});