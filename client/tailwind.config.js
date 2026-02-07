/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-bg-primary': 'var(--bg-primary)',
        'theme-bg-secondary': 'var(--bg-secondary)',
        'theme-bg-tertiary': 'var(--bg-tertiary)',
        'theme-text-primary': 'var(--text-primary)',
        'theme-text-secondary': 'var(--text-secondary)',
        'theme-text-muted': 'var(--text-muted)',
        'theme-border': 'var(--border-color)',
        'theme-primary': 'var(--primary-color)',
        'theme-primary-hover': 'var(--primary-hover)',
        'theme-bubble-sender': 'var(--chat-bubble-sender)',
      },
    },
  },
  plugins: [],
}
