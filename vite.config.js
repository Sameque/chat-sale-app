import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    define: {
      'import.meta.env.SUPABASE_URL':JSON.stringify(process.env.SUPABASE_URL),
      'import.meta.env.SUPABASE_KEY':JSON.stringify(process.env.SUPABASE_KEY),
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      allowedHosts: [
        "localhost",
        "127.0.0.1",
        "0.0.0.0",
        ".ngrok-free.app"
      ],
    },
});
