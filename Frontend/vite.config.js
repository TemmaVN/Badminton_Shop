import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  optimizeDeps: {
    include: ['recharts'],
  },
  server: {
    port: 3000,
    proxy: {
      // Backend_ThucTap chạy ở http://localhost:5001 (profile "http")
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on("error", (err, req, res) => {
            console.log("Proxy error:", err.message);
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                message:
                  "Backend not available. Make sure Backend_ThucTap is running on port 5001",
              }),
            );
          });
        },
      },
      // Ảnh tĩnh lưu trong wwwroot/uploads của Backend_ThucTap
      "/uploads": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});