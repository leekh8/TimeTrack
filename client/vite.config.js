import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// CRA → Vite 마이그레이션 (2026-07-11)
// - dev 포트는 CRA와 동일하게 3000 유지
// - 출력 디렉토리는 CRA와 동일한 build/ 로 맞춰 Vercel 배포 호환성 확보
// - 테스트는 vitest(jsdom) — 기존 Jest 테스트를 그대로 재사용
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build",
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    css: true,
  },
});
