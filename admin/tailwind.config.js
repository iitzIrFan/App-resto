/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          maroon: "#7A0C0C",
          burgundy: "#8B1A1A",
          cream: "#FFF8F3",
          yellow: "#F4B400",
          mustard: "#DFA200",
          darkRed: "#4E0A0A",
        },
      },
    },
  },
  plugins: [],
};
