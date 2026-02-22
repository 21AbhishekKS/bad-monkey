module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#121212',
        foreground: '#fafafa',
        border: '#27272a',
        'brand-primary': '#D4FF00',
        'brand-secondary': '#FF3B30',
        'brand-accent': '#00E0FF',
      },
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        subheading: ['Space Grotesk', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};