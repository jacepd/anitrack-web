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
        primary:   "#3B82F6",
        secondary: "#0D0D1A",
        accent:    "#60A5FA",
        surface:   "#111827",
        muted:     "#1E2A3A",
        "text-main": "#EAEAEA",
        subtle:    "#9CA3AF",
      },
    },
  },
  plugins: [],
};
