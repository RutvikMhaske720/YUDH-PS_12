/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3D6B5E',
          deep: '#2C5044',
          soft: '#5A8C7C',
          light: '#C5DDD6',
        },
        secondary: {
          DEFAULT: '#E8A87C',
          deep: '#D48A55',
        },
        accent: {
          DEFAULT: '#F4D9C6',
        },
        base: {
          DEFAULT: '#FAF7F2',
          2: '#F2EBDF',
          3: '#EDE4D5',
        },
        ink: {
          DEFAULT: '#1C2B27',
          2: '#3E4F49',
          3: '#6A7872',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['DM Sans', '-apple-system', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      boxShadow: {
        'sh-1': '0 1px 2px rgba(28,43,39,.04)',
        'sh-2': '0 16px 40px -16px rgba(28,43,39,.16)',
        'sh-3': '0 40px 80px -28px rgba(28,43,39,.26)',
      },
    },
  },
  plugins: [],
};
