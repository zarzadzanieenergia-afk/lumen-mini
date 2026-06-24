import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["lumen-icon.png"],
      manifest: {
        name: "LUMEN Mini — Ewidencja i planer odcinków oświetlenia",
        short_name: "LUMEN Mini",
        description: "Lokalna ewidencja i planer odcinków oświetlenia ulicznego.",
        theme_color: "#17324d",
        background_color: "#f5f7f9",
        display: "standalone",
        start_url: "/",
        icons: [
          { src: "/lumen-icon.png", sizes: "1024x1024", type: "image/png", purpose: "any maskable" }
        ]
      }
    })
  ]
});
