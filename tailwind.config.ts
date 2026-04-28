import type { Config } from 'tailwindcss';
import colors from 'tailwindcss/colors';

export default {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#1e3a8a',
        sky: {
          ...colors.sky,
          DEFAULT: '#0ea5e9',
        },
        cloud: '#f8fafc',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(14, 165, 233, 0.12)',
      },
    },
  },
  plugins: [],
} satisfies Config;
