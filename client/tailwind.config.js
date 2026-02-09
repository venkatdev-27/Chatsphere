import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },

      // 🔹 Keep shadcn tokens (optional, safe)
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        border: "hsl(var(--border))",
        ring: "hsl(var(--ring))",
        // Custom Theme Colors
        "theme-bg-primary": "var(--bg-primary)",
        "theme-bg-secondary": "var(--bg-secondary)",
        "theme-bg-tertiary": "var(--bg-tertiary)",
        "theme-text-primary": "var(--text-primary)",
        "theme-text-secondary": "var(--text-secondary)",
        "theme-text-muted": "var(--text-muted)",
        "theme-border": "var(--border-color)",
        "theme-primary": "var(--primary-color)",
        "theme-primary-hover": "var(--primary-hover)",
        "success-color": "var(--success-color)",
        "danger-color": "var(--danger-color)",
        "theme-bubble-sender": "var(--chat-bubble-sender)",
      },
    },
  },
  plugins: [animate],
};
