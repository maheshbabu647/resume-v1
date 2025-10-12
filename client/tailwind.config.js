/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // The `colors` object is intentionally omitted.
      // Your theme is defined directly in your index.css file via the @theme block.
      
      // Updated grid pattern from your new CTA section
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.03'%3e%3ccircle cx='30' cy='30' r='2'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e\")",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
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
        // Added shimmer animation from your component code
        "shimmer": {
          '100%': { transform: 'translateX(100%)' },
        },
        "fadeIn": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "twinkle": { 
          '0%, 100%': { transform: 'scale(1) rotate(0deg)', opacity: '0.7' },
          '50%': { transform: 'scale(1.2) rotate(10deg)', opacity: '1' },
        },
        "slideInUp": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "shimmer": "shimmer 2s infinite",
        "fadeIn": "fadeIn 0.5s ease-in-out",
        "twinkle": 'twinkle 2s ease-in-out infinite',
        "slideInUp": "slideInUp 0.5s ease-out forwards",
      },
    },
  },
  // If you encounter module errors, you may need to install this plugin
  // or adjust your project to use CommonJS for the config (tailwind.config.cjs).
  plugins: [
    require("tailwindcss-animate")
  ],
}