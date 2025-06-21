/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF8F6',
        sage: {
          DEFAULT: '#768973',
          700: '#566a59'
        },
        rose: {
          DEFAULT: '#C89FAC',
          700: '#9D7888'
        },
        slate: '#444'
      },
      fontFamily: {
        head: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif']
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography')
  ]
} 