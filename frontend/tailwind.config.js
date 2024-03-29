/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-gray": "#f3f6fc",
      },
      backgroundImage: {
        refresh: "url('./assets/icons/refresh.svg')",
        uparrow: "url('./assets/icons/chevron-up.svg')",
        downarrow: "url('./assets/icons/chevron-down.svg')",
        leftarrow: "url('./assets/icons/chevron-left.svg')",
        rightarrow: "url('./assets/icons/chevron-right.svg')",
        plus: "url('./assets/icons/plus.svg')",
        upload: "url('./assets/icons/cloud-arrow-up.svg')",
        menu: "url('./assets/icons/menu.png')",
        "xmark-light": "url('./assets/icons/xmark-light.svg')",
        "xmark-dark": "url('./assets/icons/xmark-dark.svg')",
        pencil: "url('./assets/icons/pencil.png')",
        search: "url('./assets/icons/magnifying-glass.svg')",
        logout: "url('./assets/icons/logout.svg')",
        "vertical-dots": "url('./assets/icons/ellipsis-vertical-solid.svg')",
        telescope: "url('./assets/icons/telescope.png')",
        locationpin: "url('./assets/icons/location-pin.png')",
        plant: "url('./assets/icons/plant.png')",
      },
      animation: {
        slidein: "slidein 1s forwards",
        slideout: "slideout 1s forwards",
        slideup: "slideup 1s forwards",
        slidedown: "slidedown 1s forwards",
      },
      keyframes: {
        slidein: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(100%)" },
        },
        slideout: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0%)" },
        },
        slideup: {
          "0%": { transform: "translateY(0%)" },
          "100%": { transform: "translateY(-100%)" },
        },
        slidedown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0%)" },
        },
      },
    },
  },
  plugins: [],
};
