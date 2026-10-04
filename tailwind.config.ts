import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: { DEFAULT: '#F9B81F', soft: '#FFE083', deep: '#D98A12' },
        plum: { DEFAULT: '#2E0A4F', deep: '#1C0733', lift: '#4A1578' },
        violet: { DEFAULT: '#7B3FBF', soft: '#C4ACE6', glow: '#9B4EE6' }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        brand: ['var(--font-brand)', 'var(--font-sans)', 'sans-serif'],
        ar: ['var(--font-ar)', 'var(--font-sans)', 'sans-serif']
      },
      transitionTimingFunction: { out: 'cubic-bezier(.16,1,.3,1)' }
    }
  },
  plugins: []
} satisfies Config
