export type Lang = 'en' | 'uz'
type Entry = Record<Lang, string>
const t = (en: string, uz: string): Entry => ({ en, uz })

/**
 * Copy follows one pattern everywhere: a small label, a promise in plain words,
 * then one concrete sentence that says what it actually does. No slogans that
 * a buyer has to decode.
 */
export const COPY = {
  nav: {
    system: t('System', 'Tizim'),
    range: t('Range', 'Assortiment'),
    formula: t('Formula', 'Formula'),
    contact: t('Contact', 'Aloqa'),
    cta: t('Talk to us', 'Bog‘lanish')
  },

  hero: {
    kicker: t('Laundry care system', 'Kir yuvish tizimi'),
    line1: t('One system,', 'Bitta tizim,'),
    line2: t('every wash', 'har bir yuvish'),
    lede: t(
      'Capsules today. Powder, gel and stain remover next. One formula platform behind all of them — so every load gets the right format, and a retailer stocks one brand instead of four.',
      'Bugun kapsula. Keyin poroshok, gel va dog‘ ketkazuvchi. Barchasi ortida bitta formula platformasi — har bir yuvish uchun to‘g‘ri format, do‘kon uchun esa to‘rtta emas, bitta brend.'
    ),
    cta: t('See how it works', 'Qanday ishlashini ko‘rish'),
    alt: t('See the range', 'Assortimentni ko‘rish'),
    meta: t('Est. 2024 · Made in UK', '2024 dan · Buyuk Britaniyada')
  },

  chain: {
    label: t('The system', 'Tizim'),
    kicker: t('The range', 'Assortiment'),
    title: t('Four formats, one formula', 'To‘rt format, bitta formula'),
    rangeLede: t(
      'Each format exists because a different load needs it. Same cleaning platform, different way of getting it onto the fabric.',
      'Har bir format o‘z yuklamasi uchun kerak. Tozalash platformasi bir xil, matoga yetib borish usuli boshqacha.'
    ),
    soon: t('In development', 'Ishlab chiqilmoqda'),
    available: t('Available now', 'Hozir mavjud'),
    categories: {
      pods: t('Capsules', 'Kapsula'),
      powder: t('Powder', 'Poroshok'),
      gel: t('Gel', 'Gel'),
      stain: t('Stain remover', 'Dog‘ ketkazuvchi')
    } as Record<string, Entry>,
    /** promise = the benefit in one line · detail = what it actually does */
    promise: {
      amethyst: t('For stains that already set', 'Qotib qolgan dog‘lar uchun'),
      crystal: t('Keeps whites actually white', 'Oqni oq holida saqlaydi'),
      original: t('The one you reach for daily', 'Har kuni olinadigan variant'),
      powder: t('For big, heavily soiled loads', 'Katta va qattiq kirlangan yuklama uchun'),
      gel: t('Dissolves fully in cold water', 'Sovuq suvda to‘liq eriydi'),
      stain: t('Treat the spot before the wash', 'Yuvishdan oldin dog‘ni oling')
    } as Record<string, Entry>,
    detail: {
      amethyst: t(
        'Deep berry and floral. The strongest of the three on dried food, grease and collar marks.',
        'Boy rezavor va gul ifori. Uchtasi ichida qurib qolgan ovqat, yog‘ va yoqa izlariga eng kuchlisi.'
      ),
      crystal: t(
        'Clean water and blue florals. Built for white and light loads, where greying shows first.',
        'Toza suv va moviy gul ifori. Oq va och ranglar uchun — kulrangga o‘tish birinchi shu yerda ko‘rinadi.'
      ),
      original: t(
        'Botanical and neutral. Gentle enough for sensitive skin, strong enough for a full family load.',
        'Tabiiy va neytral. Sezgir teriga yumshoq, oilaviy yuklamaga yetarli darajada kuchli.'
      ),
      powder: t(
        'Bulk washing where capsules get expensive — workwear, bedding, towels.',
        'Kapsula qimmatga tushadigan katta hajm uchun — ish kiyimi, choyshab, sochiq.'
      ),
      gel: t(
        'No undissolved residue in the drum or on dark fabric, even on a 20 °C short cycle.',
        '20 °C qisqa rejimda ham barabanda yoki to‘q matoda erimagan qoldiq qolmaydi.'
      ),
      stain: t(
        'Target the mark, wait a minute, then wash as normal. No second cycle.',
        'Dog‘ga suring, bir daqiqa kuting, so‘ng odatdagidek yuving. Ikkinchi marta yuvish shart emas.'
      )
    } as Record<string, Entry>
  },

  formula: {
    kicker: t('The platform', 'Platforma'),
    title: t('One formula, four deliveries', 'Bitta formula, to‘rt yetkazish'),
    lede: t(
      'The same enzymes and surfactants sit behind every format. What changes is how they reach the fabric — and that is what you choose between.',
      'Har bir format ortida bir xil ferment va yuza-faol moddalar turadi. Faqat ularning matoga yetib borish usuli o‘zgaradi — tanlov ham shunda.'
    ),
    pillars: [
      {
        n: '01',
        h: t('Works at 20 °C', '20 °C da ishlaydi'),
        p: t(
          'Enzymes stay active in cold water, so a short cold cycle cleans as well as a long hot one — and costs less to run.',
          'Fermentlar sovuq suvda ham faol qoladi: qisqa sovuq rejim uzoq issiq rejim kabi tozalaydi, elektr esa kamroq ketadi.'
        )
      },
      {
        n: '02',
        h: t('Colour and fibre guards', 'Rang va tola himoyasi'),
        p: t(
          'Every format carries the same anti-redeposition and fibre-protection package, so repeat washes do not dull the fabric.',
          'Har bir formatda bir xil himoya to‘plami bor — takroriy yuvish matoni xiralashtirmaydi.'
        )
      },
      {
        n: '03',
        h: t('Dosing you cannot get wrong', 'Dozani xato qilib bo‘lmaydi'),
        p: t(
          'Capsules are pre-measured; powder and gel are scaled to the same dose chart. One system, one set of instructions.',
          'Kapsula oldindan o‘lchangan; poroshok va gel ham xuddi shu doza jadvaliga moslangan. Bitta tizim, bitta yo‘riqnoma.'
        )
      }
    ]
  },

  lifestyle: {
    kicker: t('Result', 'Natija'),
    title: t('Stains out. Fabric intact.', 'Dog‘ ketdi. Mato joyida.'),
    lede: t(
      'One cycle, no pre-soak, no hot water. Scroll to see the same shirt before and after.',
      'Bitta rejim — ivitish ham, issiq suv ham shart emas. Xuddi shu ko‘ylakni oldin va keyin ko‘ring.'
    ),
    before: t('Before', 'Yuvishdan oldin'),
    after: t('After', 'Yuvishdan keyin')
  },

  contact: {
    kicker: t('Partnership', 'Hamkorlik'),
    title: t('Bring Bärc to your market', 'Bärc’ni bozoringizga olib kiring'),
    lede: t(
      'We are signing distribution partners for 2026. Tell us the market and the volumes you handle, and we will come back with pricing, lead times and private-label options.',
      '2026 uchun distribyutor hamkorlar izlayapmiz. Bozor va hajmlaringizni yozing — narx, yetkazish muddati va private-label imkoniyatlarini yuboramiz.'
    ),
    name: t('Your name', 'Ismingiz'),
    namePh: t('e.g. Madina Karimova', 'Masalan, Madina Karimova'),
    company: t('Company and market', 'Kompaniya va bozor'),
    companyPh: t('e.g. Nordic Retail — Sweden', 'Masalan, Nordic Retail — Shvetsiya'),
    email: t('Email or phone', 'Email yoki telefon'),
    emailPh: t('hello@company.com', 'hello@company.com'),
    send: t('Send enquiry', 'So‘rov yuborish'),
    note: t('We reply within two working days.', 'Ikki ish kuni ichida javob beramiz.'),
    done: t('Thank you — your enquiry is with us.', 'Rahmat — so‘rovingiz bizga yetib keldi.'),
    again: t('Send another', 'Yana yuborish')
  },

  footer: {
    tag: t('Clean. Fresh. Dependable.', 'Toza. Yangi. Ishonchli.'),
    rights: t('Bärc — laundry care system', 'Bärc — kir yuvish tizimi')
  }
} as const

export function pick(entry: Entry, lang: Lang) {
  return entry[lang]
}
