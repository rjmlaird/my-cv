import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://cv.rjmlaird.co.uk',
  output: 'static',
  compressHTML: true,
});
