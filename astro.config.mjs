import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/server';

// https://astro.build/config
export default defineConfig({
  output: 'server',      // dùng server mode cho Vercel
  adapter: vercel(),     // adapter Vercel
  // site: 'https://astro-demo-xxxxx.vercel.app', // có cũng được, chưa bắt buộc
});
