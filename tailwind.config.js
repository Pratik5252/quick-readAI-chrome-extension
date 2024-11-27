/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-bg": "rgb(var(--color-primary-background) / <alpha-value>)",
        "secondary-bg":
          "rgb(var(--color-secondary-background) / <alpha-value>)",
        primary: "rgb(var(--color-primary-text) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary-text) / <alpha-value>)",
        br: "rgb(var(--color-border) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        error: "rgb(var(--color-error) / <alpha-value>)",
        loader: "rgb(var(--loader-bg-color) / <alpha-value>)",
      },
    },
  },
  plugins: [],
};
