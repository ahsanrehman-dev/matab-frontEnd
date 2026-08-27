import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = (env.Backend_Url || "").replace(/\/$/, "");

  return {
    plugins: [react(), tailwindcss()],
    define: {
      "process.env.Backend_Url": JSON.stringify(backendUrl),
    },
  };
});
