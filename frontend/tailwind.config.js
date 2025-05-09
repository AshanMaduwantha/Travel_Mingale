/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      dropShadow: {
        glow: [
          "0 0 5px rgba(253, 224, 71, 0.5)",
          "0 0 15px rgba(253, 224, 71, 0.3)",
        ],
        "glow-md": [
          "0 0 8px rgba(253, 224, 71, 0.6)",
          "0 0 20px rgba(253, 224, 71, 0.4)",
        ],
        "glow-intense": [
          "0 0 10px rgba(253, 224, 71, 0.8)",
          "0 0 25px rgba(253, 224, 71, 0.6)",
          "0 0 40px rgba(253, 224, 71, 0.4)",
        ],
        "glow-extreme": [
          "0 0 15px rgba(253, 224, 71, 0.9)",
          "0 0 30px rgba(253, 224, 71, 0.7)",
          "0 0 60px rgba(253, 224, 71, 0.5)",
        ],
        "glow-neon": [
          "0 0 5px #fff",
          "0 0 10px #fff",
          "0 0 15px #fff",
          "0 0 20px rgba(253, 224, 71, 0.8)",
          "0 0 35px rgba(253, 224, 71, 0.6)",
          "0 0 40px rgba(253, 224, 71, 0.4)",
        ],
      },
    },
  },
  plugins: [],
};
