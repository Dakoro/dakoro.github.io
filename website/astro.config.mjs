// @ts-check

import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://yourdomain.com',
  integrations: [mdx(), sitemap()],
  i18n: {
    defaultLocale: "fr",
    locales: ["en", "fr"],
    routing: {
      prefixDefaultLocale: true
    }
  }
});
