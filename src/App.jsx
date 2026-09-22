import { useEffect, useRef, useState } from 'react'
import Scene3D from './components/Scene3D'
import { Split, Chapter } from './components/Type'
import { PRODUCTS, SCENES, NAV_LINKS } from './data'
import { startJourney, registerSections, registerPanels, onActiveChange } from './journey'
import { observeReveals } from './reveal'

/* ------------------------------------------------------------------ nav */
function Nav() {
  const [open, setOpen] = useState(false)
  const [solid, setSolid] = useState(false)

  useEffect(() => {
    const onScroll = () => setSolid((window.scrollY || 0) > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { if (open) observeReveals() }, [open])

  return (
    <>
      <div className="progress" aria-hidden="true"><span /></div>
      <header className={`nav${solid ? ' nav--solid' : ''}`} data-open={open || undefined}>
        <a className="nav__brand" href="#top">BÄRC</a>
        <nav className="nav__links" aria-label="Asosiy">
          {NAV_LINKS.map((l) => <a key={l.href} href={l.href}>{l.label}</a>)}
        </nav>
        <div className="nav__actions">
          <span className="nav__lang">UZ · RU</span>
          <a className="btn btn--gold nav__cta" href="#sorov">So‘rov qoldirish</a>
          <button className="btn btn--ghost nav__menu" type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? 'Yopish' : 'Menyu'}
          </button>
        </div>
        {open && (
          <div className="nav__sheet">
            {NAV_LINKS.map((l, i) => (
              <a key={l.href} href={l.href} data-rv="up" style={{ '--d': `${i * 60}ms` }} onClick={() => setOpen(false)}>{l.label}</a>
            ))}
            <a className="btn btn--gold" href="#sorov" data-rv="up" style={{ '--d': '260ms' }} onClick={() => setOpen(false)}>So‘rov qoldirish</a>
          </div>
        )}
      </header>
    </>
  )
}

/* ----------------------------------------------------------------- hero */
function Hero({ innerRef }) {
  return (
    <section className="hero" id="top" ref={innerRef}>
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__motes" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => <i key={i} style={{ '--i': i }} />)}
      </div>

      <div className="wrap hero__wrap">
        <p className="kicker" data-rv="up">3 IN 1 · 60 DONA · SOVUQ SUVDA HAM</p>
        <h1 className="display">
          <Split text="ISTALGAN KIR USTIDAN" start={80} />
          <Split text="G‘ALABA QOZONING" className="display__em" start={260} />
        </h1>
        <div className="hero__foot">
          <p className="lede" data-rv="up" style={{ '--d': '520ms' }}>
            Bitta kapsulada uchta kuch: qiyin dog‘larga qarshi vosita, chuqur tozalash va uzoq
            saqlanadigan ifor. Sovuq suvda ham to‘liq ishlaydi.
          </p>
          <div className="row" data-rv="up" style={{ '--d': '640ms' }}>
            <a className="btn btn--violet" href="#katalog">Katalogni ko‘rish</a>
            <a className="btn btn--ghost" href="#mahsulotlar">Qanday ishlaydi ↓</a>
          </div>
        </div>
      </div>

      <div className="hero__slot" aria-hidden="true" />
      <p className="hero__hint" data-rv="up" style={{ '--d': '900ms' }}>UYGA KIRING ↓</p>
    </section>
  )
}

/* ------------------------------------------------- pinned product story */
function Chapters({ innerRef }) {
  const [active, setActive] = useState(0)
  useEffect(() => onActiveChange(setActive), [])
  useEffect(() => { observeReveals() }, [active])
  const p = PRODUCTS[active]

  return (
    <section className="chapters" id="mahsulotlar" ref={innerRef}>
      <div className="chapters__sticky">
        <div className="chapters__bg" style={{ backgroundImage: `url(${SCENES.machine})` }} />
        <div className="chapters__veil" />
        <Chapter n="01" label="MAHSULOTLAR" />

        <div className="wrap chapters__wrap">
          <div className="panel" key={p.key}>
            <p className="panel__eyebrow" data-rv="up">
              <span style={{ color: p.accent }}>{p.n}</span>
              <span className="panel__rule" />
              {p.tag}
            </p>
            <Split as="h2" text={p.name.toUpperCase()} className="panel__name" start={60} step={70} />
            <p className="panel__desc" data-rv="up" style={{ '--d': '240ms' }}>{p.desc}</p>
            <dl className="specs">
              {p.specs.map(([k, v], i) => (
                <div className="specs__row" key={k} data-rv="up" style={{ '--d': `${320 + i * 90}ms` }}>
                  <dt>{k}</dt><dd>{v}</dd>
                </div>
              ))}
            </dl>
            <div className="row" data-rv="up" style={{ '--d': '640ms' }}>
              <a className="btn btn--gold" href="#sorov">So‘rov qoldirish</a>
              <a className="btn btn--ghost" href="#katalog">Batafsil</a>
            </div>
          </div>
        </div>

        <div className="dots" aria-hidden="true">
          {PRODUCTS.map((x, i) => (
            <span key={x.key} className={i === active ? 'dots__d dots__d--on' : 'dots__d'}
              style={i === active ? { background: x.accent } : undefined} />
          ))}
        </div>
        <p className="counter">0{active + 1} / 0{PRODUCTS.length}</p>
      </div>
    </section>
  )
}

/* --------------------------------------------------------- stacked panels */
function Panel({ id, n, label, tone = 'dark', bg, children, panelRef }) {
  return (
    <section className={`panel3d panel3d--${tone}`} id={id} ref={panelRef}>
      <div className="panel3d__inner">
        {bg && (
          <>
            <div className="panel3d__bg" style={{ backgroundImage: `url(${bg})` }} />
            <div className="panel3d__veil" />
          </>
        )}
        <Chapter n={n} label={label} tone={tone} />
        <div className="wrap panel3d__wrap">{children}</div>
      </div>
    </section>
  )
}

const BENEFITS = [
  ['01', 'Kuchli tozalash', 'Qattiq dog‘larni — yog‘, choy, o‘t — birinchi yuvishdayoq yo‘qotadi.', '#E8B84B'],
  ['02', 'Yoqimli ifor', 'Amethyst ifori uzoq vaqt saqlanadi, shkafdan yangilik hidi keladi.', '#D79BEE'],
  ['03', 'Matoni asraydi', 'Rang va tolalarni mukammal himoya qiladi — kiyim yangiligicha qoladi.', '#CFC3F2']
]

const CHECKS = [
  'Oldindan o‘lchangan — har safar bir xil miqdor',
  'Qo‘lingiz ifloslanmaydi, idish yuvish shart emas',
  'Bir xil natija har safar — o‘lchovda xato yo‘q'
]

/* ------------------------------------------------------------------ form */
function RequestForm() {
  const [sent, setSent] = useState(false)
  const [scent, setScent] = useState(PRODUCTS[0].key)
  useEffect(() => { observeReveals() }, [sent])

  if (sent) {
    return (
      <div className="form form--done" role="status">
        <p className="form__tick" data-rv="up">✓</p>
        <h3 data-rv="up" style={{ '--d': '90ms' }}>Rahmat!</h3>
        <p data-rv="up" style={{ '--d': '170ms' }}>So‘rovingiz qabul qilindi. Menejerimiz tez orada siz bilan bog‘lanadi.</p>
        <button className="btn btn--ghost" type="button" data-rv="up" style={{ '--d': '250ms' }} onClick={() => setSent(false)}>
          Yana yuborish
        </button>
      </div>
    )
  }

  return (
    <form className="form" onSubmit={(e) => { e.preventDefault(); setSent(true) }} data-rv="up" style={{ '--d': '200ms' }}>
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
            <button key={p.key} type="button"
              className={`chip chip--pick${scent === p.key ? ' is-on' : ''}`}
              style={scent === p.key ? { background: p.accent, borderColor: p.accent, color: '#fff' } : undefined}
              onClick={() => setScent(p.key)}>
              {p.name}
            </button>
          ))}
        </div>
      </fieldset>
      <button className="btn btn--gold btn--wide" type="submit">So‘rovni yuborish →</button>
      <p className="form__note">Ma’lumotlaringiz faqat buyurtma bo‘yicha bog‘lanish uchun ishlatiladi.</p>
    </form>
  )
}

/* ------------------------------------------------------------------- app */
export default function App() {
  const heroRef = useRef(null)
  const chapRef = useRef(null)
  const [atForm, setAtForm] = useState(false)
  const panelRefs = useRef([])
  const setPanel = (i) => (el) => { panelRefs.current[i] = el }

  useEffect(() => {
    registerSections(heroRef.current, chapRef.current)
    registerPanels(panelRefs.current)
    observeReveals()
    const stop = startJourney(PRODUCTS.length)
    const t = setTimeout(() => observeReveals(), 400)

    // the floating CTA has no job once the form itself is on screen
    const form = document.getElementById('sorov')
    const io = form && new IntersectionObserver(
      ([e]) => setAtForm(e.isIntersecting),
      { threshold: 0.12 }
    )
    if (io && form) io.observe(form)

    return () => { clearTimeout(t); io?.disconnect(); stop() }
  }, [])

  return (
    <>
      <Nav />
      <Scene3D />

      <main>
        <Hero innerRef={heroRef} />
        <Chapters innerRef={chapRef} />

        <div className="stack">
          <Panel id="qollash" n="02" label="SOVUQ SUV" bg={SCENES.room} panelRef={setPanel(0)}>
            <div className="lay lay--shirt">
              <div className="lay__copy">
                <Split as="h2" text="SOVUQ SUVDA HAM DOG‘ QOLMAYDI" className="display display--md" step={60} />
                <p className="lede" data-rv="up" style={{ '--d': '380ms' }}>
                  Qaynoq suv va uzoq rejim shart emas. BÄRC fermentlari 20 °C da ham tolalar orasiga
                  kirib, dog‘ va hidni yechadi — elektr esa tejaladi.
                </p>
                <div className="row">
                  {['20 °C', '30 °C', '40 °C'].map((t, i) => (
                    <span className="chip" key={t} data-rv="up" style={{ '--d': `${480 + i * 90}ms` }}>{t}</span>
                  ))}
                </div>
                <div className="row" data-rv="up" style={{ '--d': '760ms' }}>
                  <a className="btn btn--violet" href="#katalog">Katalogni ko‘rish</a>
                </div>
              </div>

              <div className="shirt" data-rv="scale" style={{ '--d': '240ms' }}>
                <div className="shirt__stage">
                  <img className="shirt__img shirt__img--dirty" src={SCENES.shirtDirty} alt="" loading="lazy" />
                  <img className="shirt__img shirt__img--clean" src={SCENES.shirtClean} alt="" loading="lazy" />
                  <span className="shirt__sweep" aria-hidden="true" />
                  <span className="shirt__foam" aria-hidden="true">
                    {Array.from({ length: 10 }, (_, i) => <i key={i} style={{ '--i': i }} />)}
                  </span>
                </div>
                <p className="shirt__tag" aria-hidden="true">
                  <span className="shirt__tag--a">DOG‘LI</span>
                  <span className="shirt__tag--b">TOZA</span>
                </p>
              </div>
            </div>
          </Panel>

          <Panel id="afzalliklar" n="03" label="UCH QATLAM" tone="violet" panelRef={setPanel(1)}>
            <div className="lay lay--two">
              <figure className="media" data-rv="scale">
                <img src={SCENES.towels} alt="" loading="lazy" />
                <span className="media__glow" aria-hidden="true" />
              </figure>
              <div className="lay__copy">
                <Split as="h2" text="BITTA KAPSULA, UCHTA KUCH" className="display display--md" step={60} />
                <div className="benefits">
                  {BENEFITS.map(([n, t, d, c], i) => (
                    <div className="benefit" key={n} data-rv="up" style={{ '--d': `${320 + i * 130}ms` }}>
                      <span className="benefit__n" style={{ color: c }}>{n}</span>
                      <div><h3>{t}</h3><p>{d}</p></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <Panel id="olchash" n="04" label="O‘LCHASH YO‘Q" bg={SCENES.studio} panelRef={setPanel(2)}>
            <div className="lay lay--split lay--end">
              <div className="lay__copy">
                <Split as="h2" text="O‘LCHASH SHART EMAS" className="display display--md" step={60} />
                <p className="lede" data-rv="up" style={{ '--d': '300ms' }}>
                  To‘kilmaydi, sochilmaydi. Bitta pod — bitta yuklama, har safar bir xil natija.
                </p>
                <ul className="checks">
                  {CHECKS.map((c, i) => (
                    <li key={c} data-rv="up" style={{ '--d': `${420 + i * 120}ms` }}><span>✓</span>{c}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Panel>

          <Panel id="katalog" n="05" label="KATALOG" tone="cream" panelRef={setPanel(3)}>
            <div className="lay lay--center">
              <p className="kicker" data-rv="up">HAR QADOQDA 60 DONA</p>
              <Split as="h2" text="O‘ZINGIZGA MOS IFORNI TANLANG" className="display display--md" step={55} />
              <div className="cards">
                {PRODUCTS.map((p, i) => (
                  <article className="card" key={p.key} data-rv="up" style={{ '--d': `${260 + i * 140}ms` }}>
                    <div className="card__shelf">
                      <span className="card__glow" style={{ background: `radial-gradient(circle, ${p.accent}55, transparent 70%)` }} />
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
          </Panel>

          <Panel id="sorov" n="06" label="ALOQA" bg={SCENES.studio} panelRef={setPanel(4)}>
            <div className="lay lay--form">
              <div className="lay__copy">
                <Split as="h2" text="NARX VA YETKAZIB BERISH" className="display display--md" step={60} />
                <p className="lede" data-rv="up" style={{ '--d': '320ms' }}>
                  Ismingiz va telefon raqamingizni qoldiring — menejerimiz ulgurji va chakana
                  narxlar bo‘yicha tez orada bog‘lanadi.
                </p>
              </div>
              <RequestForm />
            </div>
          </Panel>
        </div>
      </main>

      <footer className="footer">
        <div className="wrap footer__wrap">
          <div>
            <p className="footer__brand" data-rv="up">BÄRC</p>
            <p className="footer__tag" data-rv="up" style={{ '--d': '100ms' }}>Toza. Yangi. Ishonchli.</p>
          </div>
          <nav className="footer__links" aria-label="Pastki menyu">
            {NAV_LINKS.map((l, i) => (
              <a key={l.href} href={l.href} data-rv="up" style={{ '--d': `${140 + i * 70}ms` }}>{l.label}</a>
            ))}
          </nav>
          <div className="footer__contact" data-rv="up" style={{ '--d': '420ms' }}>
            <a href="tel:+998901234567">+998 90 123 45 67</a>
            <p>© 2026 BÄRC · Toshkent</p>
          </div>
        </div>
      </footer>

      <a className={`dock${atForm ? ' dock--off' : ''}`} href="#sorov">So‘rov qoldirish</a>
    </>
  )
}
