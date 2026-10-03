import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: { DEFAULT: '#E8358A', soft: '#FF7CBA', deep: '#B81F68' },
        ink: { DEFAULT: '#141317', soft: '#3A373F', mute: '#6E6A75' },
        paper: { DEFAULT: '#F7F6F4', warm: '#EFEDE8', dim: '#E4E1DC' }
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace']
      },
      transitionTimingFunction: { out: 'cubic-bezier(.16,1,.3,1)' }
    }
  },
  plugins: []
} satisfies Config
