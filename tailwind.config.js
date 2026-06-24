/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17324d",
        teal: "#287b78",
        amber: "#d69b3c",
        paper: "#f5f7f9"
      },
      boxShadow: {
        card: "0 10px 30px rgba(23,50,77,.08)"
      }
    }
  },
  plugins: []
};
