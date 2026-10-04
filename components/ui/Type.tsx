/** A headline line that rises out of its own mask. 0.12 s between lines. */
export function Lines({
  lines, start = 0, step = 120, className = ''
}: { lines: string[]; start?: number; step?: number; className?: string }) {
  return (
    <>
      {lines.map((l, i) => (
        <span key={`${l}-${i}`} className={`line ${className}`.trim()} data-rv>
          <span className="line__i" style={{ ['--d' as string]: `${start + i * step}ms` }}>{l}</span>
        </span>
      ))}
    </>
  )
}
