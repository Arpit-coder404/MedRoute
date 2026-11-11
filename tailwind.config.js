/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#0a1220',
          DEFAULT: '#101D32',
          light: '#1b2d4b',
        },
        medblue: {
          50: '#edf4fd',
          100: '#d7e6fc',
          200: '#b0ccf9',
          500: '#2367D1',
          600: '#1d55af',
          700: '#17438e',
          DEFAULT: '#2367D1',
        },
        medteal: {
          50: '#ecfdf9',
          100: '#ccf8ee',
          200: '#99f1dc',
          500: '#19A999',
          600: '#14877a',
          DEFAULT: '#19A999',
        },
        mint: {
          DEFAULT: '#DDF5EC',
          light: '#f2fbf7',
        },
        warmwhite: '#F7F9FC',
        charcoal: '#182334',
        mutedgrey: '#8995A7',
        amberwarn: '#F0AE45',
        emergency: '#D94343',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 10px rgba(16, 29, 50, 0.05)',
        elevated: '0 10px 25px -5px rgba(16, 29, 50, 0.08), 0 8px 10px -6px rgba(16, 29, 50, 0.04)',
        emergency: '0 0 20px rgba(217, 67, 67, 0.25)',
      },
    },
  },
  plugins: [],
};

