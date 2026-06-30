import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class', 'media'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/hooks/**/*.{ts,tsx}',
  ],
  theme: {},
  plugins: [],
} satisfies Config;
