/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backdropBlur: {
        'xs': '2px',
      },
      colors: {
        'glass-white': 'rgba(255, 255, 255, 0.1)',
        'glass-black': 'rgba(0, 0, 0, 0.1)',
        
        // Design System Colors
        'sky-blue': {
          DEFAULT: '#72DDF7',
          50: '#f0fdff',
          100: '#ccf7fe',
          200: '#9aedfe',
          300: '#5dddfc',
          400: '#22c3f3',
          500: '#0ba5d9',
          600: '#0e85b8',
          700: '#126b96',
          800: '#17597b',
          900: '#194c68',
        },
        'vista-blue': {
          DEFAULT: '#8093F1',
          50: '#f0f2ff',
          100: '#e4e8ff',
          200: '#cdd5ff',
          300: '#a6b4ff',
          400: '#7989fc',
          500: '#4c5ef6',
          600: '#3843eb',
          700: '#2d35d8',
          800: '#272eaf',
          900: '#252b8a',
        },
        'snow': '#FCF7F8',
        'black': '#000300',
        
        // Primary and Secondary aliases
        'primary': {
          DEFAULT: '#72DDF7',
          50: '#f0fdff',
          100: '#ccf7fe',
          200: '#9aedfe',
          300: '#5dddfc',
          400: '#22c3f3',
          500: '#0ba5d9',
          600: '#0e85b8',
          700: '#126b96',
          800: '#17597b',
          900: '#194c68',
        },
        'secondary': {
          DEFAULT: '#8093F1',
          50: '#f0f2ff',
          100: '#e4e8ff',
          200: '#cdd5ff',
          300: '#a6b4ff',
          400: '#7989fc',
          500: '#4c5ef6',
          600: '#3843eb',
          700: '#2d35d8',
          800: '#272eaf',
          900: '#252b8a',
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
