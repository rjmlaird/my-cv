import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://cv.rjmlaird.co.uk',
  output: 'static',
  compressHTML: true,
  integrations: [
    // /ats/ is a noindex alternate view; keep it out of the sitemap.
    sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/ats') }),
    icon(),
  ],
});
