/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],

  presets: [require("nativewind/preset")],

  theme: {
    extend: {
      colors: {
        primary: "#8B3DFF",
        "primary-dark": "#6D28D9",

        pink: "#FF5C8A",
        "pink-dark": "#EC4899",

        "light-pink": "#FFF4F8",
        "light-purple": "#F6F1FF",

        "app-background": "#FFFBFD",
        "app-text": "#251B2D",
        "app-muted": "#8A8192",
        "app-border": "#EEE8F1",

        success: "#22C55E",

        danger: "#EF4444",
        sos: "#FF4D5A",
        "sos-light": "#FFF0F1",
      },
    },
  },

  plugins: [],
};