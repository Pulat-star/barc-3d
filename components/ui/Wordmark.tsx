/**
 * The BÄRC mark: heavy white wordmark with the gold swoosh sweeping up past the C.
 * Drawn rather than bitmapped so it stays crisp at nav size and at hero size.
 */
export default function Wordmark({ className = '', size = '1.35rem' }: { className?: string; size?: string }) {
  return (
    <span
      className={`relative inline-block select-none leading-none ${className}`}
      style={{ fontSize: size }}
      aria-label="BÄRC"
    >
      <span className="font-brand font-black tracking-[0.005em]">BÄRC</span>
      <svg
        aria-hidden
        viewBox="0 0 120 17"
        className="pointer-events-none absolute left-[6%] w-[104%]"
        style={{ bottom: '-0.3em', height: '0.42em' }}
      >
        <defs>
          <linearGradient id="bk-swoosh" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#D98A12" />
            <stop offset="0.45" stopColor="#F9B81F" />
            <stop offset="1" stopColor="#FFE083" />
          </linearGradient>
        </defs>
        <path
          fill="url(#bk-swoosh)"
          d="M4 10.6 C 34 16.4, 82 16.1, 119 0.8 C 110 9.4, 90 13.6, 64 14.4 C 42 15.1, 20 13.6, 4 10.6 Z"
        />
      </svg>
    </span>
  )
}
