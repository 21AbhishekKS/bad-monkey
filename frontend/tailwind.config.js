/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0a",
        surface: "#121212",
        foreground: "#fafafa",
        border: "#27272a",
        "brand-primary": "#D4FF00",
        "brand-secondary": "#FF3B30",
        "brand-accent": "#00E0FF",
        "neutral-100": "#f5f5f5",
        "neutral-500": "#737373",
        "neutral-900": "#171717",
      },
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        subheading: ['Space Grotesk', 'monospace'],
        body: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        none: '0px',
      },
      backdropBlur: {
        md: '12px',
        lg: '24px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};