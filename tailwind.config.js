/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary:  "#E85D04",
        secondary: "#1A1A2E",
        accent:   "#F48C06",
        surface:  "#16213E",
        muted:    "#0F3460",
        "text-main": "#EAEAEA",
        subtle:   "#9CA3AF",
      },
      fontFamily: {
        heading: ["var(--font-rajdhani)"],
        body:    ["var(--font-inter)"],
      },
    },
  },
  plugins: [],
};
