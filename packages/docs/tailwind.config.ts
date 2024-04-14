import type { Config } from 'tailwindcss';
// import { normalize, themeReplacements } from './.vitepress/lib/utils'

// const theme = themeReplacements()

export default {
  content: ['./.vitepress/**/*.vue'],
  options: {
    safelist: ['html', 'body'],
  },
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      red: 'red',
      blue: 'blue',
      primary: '#FF5000',
      link: '#37A0FF',
      brand: '#37A0FF',
      // ...normalize(theme)
    },
  },
  plugins: [],
} satisfies Config;
