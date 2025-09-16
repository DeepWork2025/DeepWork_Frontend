/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customGreen1: "#F6FEF9",
        customGreen2: "#A9EFC5",
        customGreen3: "#32C48D",
        customGreen4: "#074D31",
        customPurple1: "#F5F3FF",
        customPurple2: "#E9D7FE",
        customPurple3: "#D6BBFB",
        customPurple4: "#53389E",
        customBlue1: "#F5FBFF",
        customBlue2: "#B9E6FE",
        customBlue3: "#7CD4FD",
        customBlue4: "#194185",
        customRed1: "#FFF5F6",
        customRed2: "#FECDD6",
        customRed3: "#FEA3B4",
        customRed4: "#89123E",
        customYellow1: "#FFFCF5",
        customYellow2: "#FDDCAB",
        customYellow3: "#FEB273",
        customYellow4: "#89123E",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
};
