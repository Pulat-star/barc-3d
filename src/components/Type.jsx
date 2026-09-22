// Headline that reveals word by word from behind a mask.
// The observer watches the *wrapper*, never the clipped inner span —
// a clipped element reports zero intersection and would never reveal.
export function Split({ text, as: Tag = 'span', className = '', start = 0, step = 55 }) {
  const words = String(text).split(' ')
  return (
    <Tag className={`split ${className}`.trim()}>
      {words.map((w, i) => (
        <span className="split__w" key={`${w}-${i}`} data-rv="word" style={{ '--d': `${start + i * step}ms` }}>
          <span className="split__i">{w}</span>
        </span>
      ))}
    </Tag>
  )
}

export function Chapter({ n, label, tone = 'dark' }) {
  return (
    <div className={`chapterbar chapterbar--${tone}`}>
      <span data-rv="up">{label}</span>
      <span data-rv="up" style={{ '--d': '90ms' }}>Bo‘lim {n}</span>
    </div>
  )
}
