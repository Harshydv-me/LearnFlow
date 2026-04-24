/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "ping-slow": "ping 2s cubic-bezier(0,0,0.2,1) infinite",
        "slide-in": "slideIn 0.3s ease-out"
      },
      keyframes: {
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" }
        }
      }
    }
  },
  plugins: []
};
