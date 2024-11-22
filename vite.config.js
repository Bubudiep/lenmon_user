import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Cho phép truy cập từ mạng cục bộ
    port: 6500, // Đặt cổng là 3009
    open: true, // Mở trình duyệt khi chạy
  },
});
