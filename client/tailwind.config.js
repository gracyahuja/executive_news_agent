/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        costco: {
          red: "#E31837",
          "red-dark": "#B8122D",
          "red-light": "#FDECEA",
          blue: "#005DAA",
          "blue-dark": "#004A8A",
          "blue-light": "#E8F0F9",
          gray: "#F5F5F5",
          "gray-mid": "#E0E0E0",
          "gray-dark": "#757575",
          text: "#1A1A1A",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          '"Helvetica Neue"',
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)",
        "card-hover": "0 4px 12px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
