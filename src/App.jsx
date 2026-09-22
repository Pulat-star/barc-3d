import { useEffect, useRef, useState } from 'react'
import Scene3D from './components/Scene3D'
import { PRODUCTS, SCENES, NAV_LINKS } from './data'
import { startJourney, registerSections, onActiveChange } from './journey'

function Nav() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid((window.scrollY || 0) > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`nav${solid ? ' nav--solid' : ''}`} data-open={open || undefined}>
      <a className="nav__brand" href="#top">BÄRC</a>

      <nav className="nav__links" aria-label="Asosiy">
        {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
      </nav>

      <div className="nav__actions">
        <span className="nav__lang">UZ · RU</span>
        <a className="btn btn--gold nav__cta" href="#sorov">So‘rov qoldirish</a>
        <button
          className="btn btn--ghost nav__menu"
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Yopish' : 'Menyu'}
        </button>
      </div>

      {open && (
        <div className="nav__sheet">
          {NAV_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <a className="btn btn--gold" href="#sorov" onClick={() => setOpen(false)}>So‘rov qoldirish</a>
        </div>
      )}
    </header>
  )
}

function Hero({ innerRef }) {
  return (
    <section className="hero" id="top" ref={innerRef}>
      <div className="hero__glow" aria-hidden="true" />
      <div className="wrap hero__wrap">
        <div className="hero__copy">
          <p className="kicker">3 IN 1 · 60 DONA · SOVUQ SUVDA HAM</p>
          <h1>
            Istalgan kir ustidan<br />
            <em>g‘alaba qozoning</em>
          </h1>
          <p className="lede">
            Bitta kapsulada uchta kuch: qiyin dog‘larga qarshi vosita, chuqur tozalash va uzoq
            saqlanadigan ifor. Sovuq suvda ham to‘liq ishlaydi.
          </p>
          <div className="row">
            <a className="btn btn--violet" href="#katalog">Katalogni ko‘rish</a>
            <a className="btn btn--ghost" href="#mahsulotlar">Qanday ishlaydi ↓</a>
          </div>
        </div>
        <div className="hero__slot" aria-hidden="true" />
      </div>
      <p className="hero__hint">UYGA KIRING ↓</p>
    </section>
  )
}

function Chapters({ innerRef }) {
  const [active, setActive] = useState(0)
  useEffect(() => onActiveChange(setActive), [])
  const p = PRODUCTS[active]

  return (
    <section className="chapters" id="mahsulotlar" ref={innerRef}>
      <div className="chapters__sticky">
        <div className="chapters__bg" style={{ backgroundImage: `url(${SCENES.machine})` }} />
        <div className="chapters__veil" />
        <div className="wrap chapters__wrap">
          <div className="panel" key={p.key}>
            <p className="panel__eyebrow">
              <span style={{ color: p.accent }}>{p.n}</span>
              <span className="panel__rule" />
              {p.tag}
            </p>
            <h2 className="panel__name">{p.name}</h2>
            <p className="panel__desc">{p.desc}</p>
            <dl className="specs">
              {p.specs.map(([k, v]) => (
                <div className="specs__row" key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="row">
              <a className="btn btn--gold" href="#sorov">So‘rov qoldirish</a>
              <a className="btn btn--ghost" href="#katalog">Batafsil</a>
            </div>
          </div>
        </div>
        <div className="dots" aria-hidden="true">
          {PRODUCTS.map((x, i) => (
            <span
              key={x.key}
              className={i === active ? 'dots__d dots__d--on' : 'dots__d'}
              style={i === active ? { background: x.accent } : undefined}
            />
          ))}
        </div>
        <p className="counter">0{active + 1} / 0{PRODUCTS.length}</p>
      </div>
    </section>
  )
}

function Cold() {
  return (
    <section className="split" id="qollash">
      <div className="split__media" style={{ backgroundImage: `url(${SCENES.room})` }} />
      <div className="split__veil split__veil--right" />
      <div className="wrap split__wrap">
        <div className="split__copy">
          <p className="kicker">QIYIN DOG‘LARGA QARSHI</p>
          <h2>Sovuq suvda ham<br /><em>dog‘ qolmaydi</em></h2>
          <p className="lede">
            Qaynoq suv va uzoq rejim shart emas. BÄRC fermentlari 20 °C da ham tolalar orasiga
            kirib, dog‘ va hidni yechadi — elektr esa tejaladi.
          </p>
          <div className="row">
            {['20 °C', '30 °C', '40 °C'].map((t) => <span className="chip" key={t}>{t}</span>)}
          </div>
          <div className="row">
            <a className="btn btn--violet" href="#katalog">Katalogni ko‘rish</a>
          </div>
        </div>
      </div>
    </section>
  )
}

const BENEFITS = [
  ['01', 'Kuchli tozalash', 'Qattiq dog‘larni — yog‘, choy, o‘t — birinchi yuvishdayoq yo‘qotadi.', '#E8B84B'],
  ['02', 'Yoqimli ifor', 'Amethyst ifori uzoq vaqt saqlanadi, shkafdan yangilik hidi keladi.', '#8E3FB0'],
  ['03', 'Matoni asraydi', 'Rang va tolalarni mukammal himoya qiladi — kiyim yangiligicha qoladi.', '#CFC3F2']
]

function Benefits() {
  return (
    <section className="section section--deep" id="afzalliklar">
      <div className="wrap benefits">
        <div className="benefits__media">
          <div className="benefits__glow" aria-hidden="true" />
          <img src={SCENES.towels} alt="" loading="lazy" />
        </div>
        <div className="benefits__list">
          <p className="kicker">1 POD = 3 QATLAM KUCH</p>
          <h2>Bitta kapsula,<br /><em>uchta kuch</em></h2>
          {BENEFITS.map(([n, t, d, c]) => (
            <div className="benefit" key={n}>
              <span className="benefit__n" style={{ color: c }}>{n}</span>
              <div>
                <h3>{t}</h3>
                <p>{d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const CHECKS = [
  'Oldindan o‘lchangan — har safar bir xil miqdor',
  'Qo‘lingiz ifloslanmaydi, idish yuvish shart emas',
  'Bir xil natija har safar — o‘lchovda xato yo‘q'
]

function Measure() {
  return (
    <section className="split split--flip">
      <div className="split__media" style={{ backgroundImage: `url(${SCENES.studio})` }} />
      <div className="split__veil split__veil--left" />
      <div className="wrap split__wrap split__wrap--end">
        <div className="split__copy">
          <p className="kicker">TO‘KILMAYDI, SOCHILMAYDI</p>
          <h2>O‘lchash<br /><em>shart emas</em></h2>
          <ul className="checks">
            {CHECKS.map((c) => <li key={c}><span>✓</span>{c}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Catalog() {
  return (
    <section className="section section--deep" id="katalog">
      <div className="wrap">
        <p className="kicker">KATALOG · HAR QADOQDA 60 DONA</p>
        <h2 className="section__title">O‘zingizga mos<br /><em>iforni tanlang</em></h2>
        <div className="cards">
          {PRODUCTS.map((p) => (
            <article className="card" key={p.key}>
              <div className="card__shelf">
                <span className="card__glow" style={{ background: `radial-gradient(circle, ${p.accent}66, transparent 70%)` }} />
                <img src={p.image} alt={`BÄRC ${p.name}`} loading="lazy" />
              </div>
              <div className="card__foot">
                <div>
                  <h3>{p.name}</h3>
                  <p>{p.short} · 60 dona</p>
                </div>
                <a className="btn btn--sm" style={{ background: p.accent, color: '#fff' }} href="#sorov">So‘rov →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Request() {
  const [sent, setSent] = useState(false)
  const [scent, setScent] = useState(PRODUCTS[0].key)

  return (
    <section className="section request" id="sorov">
      <div className="request__bg" style={{ backgroundImage: `url(${SCENES.studio})` }} aria-hidden="true" />
      <div className="request__veil" aria-hidden="true" />
      <div className="wrap request__wrap">
        <div className="request__copy">
          <p className="kicker">SO‘ROV QOLDIRISH</p>
          <h2>Narx va yetkazib<br /><em>berish haqida</em></h2>
          <p className="lede">
            Ismingiz va telefon raqamingizni qoldiring — menejerimiz ulgurji va chakana narxlar
            bo‘yicha tez orada bog‘lanadi.
          </p>
        </div>

        {sent ? (
          <div className="form form--done" role="status">
            <p className="form__tick">✓</p>
            <h3>Rahmat!</h3>
            <p>So‘rovingiz qabul qilindi. Menejerimiz tez orada siz bilan bog‘lanadi.</p>
            <button className="btn btn--ghost" type="button" onClick={() => setSent(false)}>Yana yuborish</button>
          </div>
        ) : (
          <form className="form" onSubmit={(e) => { e.preventDefault(); setSent(true) }}>
            <label className="field">
              <span>Ismingiz</span>
              <input name="name" required minLength={2} placeholder="Masalan, Madina" autoComplete="name" />
            </label>
            <label className="field">
              <span>Telefon raqamingiz</span>
              <input name="phone" required type="tel" inputMode="tel" placeholder="+998 90 123 45 67" autoComplete="tel" />
            </label>
            <fieldset className="field">
              <legend>Qaysi ifor?</legend>
              <div className="chips">
                {PRODUCTS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    className={`chip chip--pick${scent === p.key ? ' is-on' : ''}`}
                    style={scent === p.key ? { background: p.accent, borderColor: p.accent, color: '#fff' } : undefined}
                    onClick={() => setScent(p.key)}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </fieldset>
            <button className="btn btn--gold btn--wide" type="submit">So‘rovni yuborish →</button>
            <p className="form__note">Ma’lumotlaringiz faqat buyurtma bo‘yicha bog‘lanish uchun ishlatiladi.</p>
          </form>
        )}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__wrap">
        <div>
          <p className="footer__brand">BÄRC</p>
          <p className="footer__tag">Toza. Yangi. Ishonchli.</p>
        </div>
        <nav className="footer__links" aria-label="Pastki menyu">
          {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        </nav>
        <div className="footer__contact">
          <a href="tel:+998901234567">+998 90 123 45 67</a>
          <p>© 2026 BÄRC · Toshkent</p>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  const heroRef = useRef(null)
  const chapRef = useRef(null)

  useEffect(() => {
    registerSections(heroRef.current, chapRef.current)
    return startJourney(PRODUCTS.length)
  }, [])

  return (
    <>
      <Nav />
      <Scene3D />
      <main>
        <Hero innerRef={heroRef} />
        <Chapters innerRef={chapRef} />
        <Cold />
        <Benefits />
        <Measure />
        <Catalog />
        <Request />
      </main>
      <Footer />
    </>
  )
}
