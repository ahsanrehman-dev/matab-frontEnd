import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const PRODUCTION_BACKEND_URL = "https://matab-backend.onrender.com";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = (
    env.VITE_BACKEND_URL ||
    env.Backend_Url ||
    (mode === "production" ? PRODUCTION_BACKEND_URL : "")
  ).replace(/\/$/, "");

  if (!backendUrl) {
    console.warn(
      "[vite] Backend_Url / VITE_BACKEND_URL is not set. API calls will go to this origin and POST routes will 405 on Vercel."
    );
  } else {
    console.log(`[vite] Backend URL: ${backendUrl}`);
  }

  return {
    plugins: [react(), tailwindcss()],
    define: {
      "process.env.Backend_Url": JSON.stringify(backendUrl),
      "import.meta.env.VITE_BACKEND_URL": JSON.stringify(backendUrl),
    },
  };
});
