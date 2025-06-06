/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // The `colors` object is no longer needed here.
      // Your theme is now defined directly in your index.css file.
      // The `brand` color is also removed to be consistent with the new method.

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fadeIn": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fadeOut": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "slideInUp": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fadeIn": "fadeIn 0.5s ease-in-out",
        "fadeOut": "fadeOut 0.5s ease-in-out",
        "slideInUp": "slideInUp 0.5s ease-out forwards",
      },
    },
  },
  // The plugins have been removed to avoid the previous module errors.
  // If you need to add them back, ensure they are compatible with ES Modules.
  plugins: [],
}
