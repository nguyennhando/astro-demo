import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',    // cho phép SSR trên Vercel
  adapter: vercel(),   // dùng adapter Vercel
  // … nếu bạn có thêm cấu hình khác (integrations, etc.) thì giữ nguyên ở dưới
});
