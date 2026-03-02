import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://projektmimmobilien.de',
  output: 'static',
  compressHTML: true,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  server: {
    host: true,
  },
  integrations: [sitemap()],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
