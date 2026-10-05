/** The X in the close pill. Both strokes must share the same box, or they
 *  render as a bent line instead of a cross. */
export default function CloseIcon({ bg = '#fff', ink = '#2A0846' }: { bg?: string; ink?: string }) {
  return (
    <span className="relative grid h-7 w-7 shrink-0 place-items-center rounded-full" style={{ background: bg }}>
      <span className="absolute" style={{ width: 10, height: 1.6, borderRadius: 1, background: ink, transform: 'rotate(45deg)' }} />
      <span className="absolute" style={{ width: 10, height: 1.6, borderRadius: 1, background: ink, transform: 'rotate(-45deg)' }} />
    </span>
  )
}
