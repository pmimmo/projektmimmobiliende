import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://projektmimmobilien.de',
  base: process.env.ASTRO_BASE || '',
  output: 'static',
  compressHTML: true,
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  server: {
    host: true,
  },
  integrations: process.env.ASTRO_BASE
    ? []
    : [
        sitemap({
          filter: (page) => !page.includes('/widerruf/danke/') && !page.includes('/seo-preview/'),
        }),
      ],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
