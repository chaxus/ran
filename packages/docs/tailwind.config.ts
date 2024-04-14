import type { Config } from 'tailwindcss';

export default {
  content: ['./.vitepress/**/*.vue'],
  options: {
    safelist: ['html', 'body'],
  },
  theme: {},
  plugins: [],
} satisfies Config;
