import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

const rotateX = plugin(function ({ addUtilities }) {
  addUtilities({
    '.rotate-y-180': {
      transform: 'rotateY(180deg)',
    },
  });
});

export default {
  content: [
    './App.tsx',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7518',
          light: '#eaf1ff',
          'dark-light': 'rgba(67,97,238,.15)',
          dark: '#1A9286'
        },
        darkmode: {
          DEFAULT: '#993D00',
          secondary:'#032F12',
          text:'#77DD77', 
          light: '#eaeaec',
          'dark-light': 'rgba(59,63,92,.15)'
        },
        secondary: {
          DEFAULT: '#805dca',
          light: '#ebe4f7',
          'dark-light': 'rgb(128 93 202 / 15%)',
        },
        success: {
          DEFAULT: '#00ab55',
          light: '#ddf5f0',
          'dark-light': 'rgba(0,171,85,.15)',
        },
        danger: {
          DEFAULT: '#e7515a',
          light: '#fff5f5',
          'dark-light': 'rgba(231,81,90,.15)',
        },
        warning: {
          DEFAULT: '#e2a03f',
          light: '#fff9ed',
          'dark-light': 'rgba(226,160,63,.15)',
        },
        info: {
          DEFAULT: '#2196f3',
          light: '#e7f7ff',
          'dark-light': 'rgba(33,150,243,.15)',
        },
        dark: {
          DEFAULT: '#3b3f5c',
          light: '#eaeaec',
          'dark-light': 'rgba(59,63,92,.15)',
        },
        
        black: {
          DEFAULT: '#0e1726',
          light: '#e3e4eb',
          'dark-light': 'rgba(14,23,38,.15)',
        },
        white: {
          DEFAULT: '#ffffff',
          light: '#e0e6ed',
          dark: '#888ea8',
        },
      },
      fontFamily: {
        primary: ['Inter', ...defaultTheme.fontFamily.sans],
        nunito: ['var(--font-nunito)'],
      },
      spacing: {
        4.5: '18px',
      },
      boxShadow: {
        '3xl':
          '0 2px 2px rgb(224 230 237 / 46%), 1px 6px 7px rgb(224 230 237 / 46%)',
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            '--tw-prose-invert-headings': theme('colors.white.dark'),
            '--tw-prose-invert-links': theme('colors.white.dark'),
            h1: { fontSize: '40px', marginBottom: '0.5rem', marginTop: 0 },
            h2: { fontSize: '32px', marginBottom: '0.5rem', marginTop: 0 },
            h3: { fontSize: '28px', marginBottom: '0.5rem', marginTop: 0 },
            h4: { fontSize: '24px', marginBottom: '0.5rem', marginTop: 0 },
            h5: { fontSize: '20px', marginBottom: '0.5rem', marginTop: 0 },
            h6: { fontSize: '16px', marginBottom: '0.5rem', marginTop: 0 },
            p: { marginBottom: '0.5rem' },
            li: { margin: 0 },
            img: { margin: 0 },
          },
        },
      }),
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': {
            opacity: '0.99',
            filter:
              'drop-shadow(0 0 1px rgba(252, 211, 77)) drop-shadow(0 0 15px rgba(245, 158, 11)) drop-shadow(0 0 1px rgba(252, 211, 77))',
          },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': {
            opacity: '0.4',
            filter: 'none',
          },
        },
        shimmer: {
          '0%': {
            backgroundPosition: '-700px 0',
          },
          '100%': {
            backgroundPosition: '700px 0',
          },
        },
      },
      animation: {
        flicker: 'flicker 3s linear infinite',
        shimmer: 'shimmer 1.3s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    rotateX,
  ],
} satisfies Config;
