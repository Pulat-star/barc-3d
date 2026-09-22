const BASE = import.meta.env.BASE_URL

export const asset = (p) => `${BASE}${p.replace(/^\//, '')}`

export const PRODUCTS = [
  {
    key: 'amethyst',
    n: '01',
    name: 'Amethyst',
    tag: 'BOY REZAVOR VA GULLAR',
    accent: '#8E3FB0',
    model: asset('models/pack-amethyst.glb'),
    image: asset('products/amethyst.webp'),
    desc: 'Qiyin dog‘larga qarshi eng kuchli formula. Amethyst ifori shkafda ham, kiyganingizda ham uzoq saqlanadi.',
    short: 'Boy rezavorlar va gullar ifori',
    specs: [['IFOR', 'Amethyst · gulli'], ['QADOQ', '60 dona · 3 in 1'], ['HARORAT', '20–40 °C']]
  },
  {
    key: 'crystal',
    n: '02',
    name: 'Crystal Bloom',
    tag: 'TOZA SUV VA MOVIY GULLAR',
    accent: '#2F7BEA',
    model: asset('models/pack-crystal.glb'),
    image: asset('products/crystal.webp'),
    desc: 'Yengil va toza ifor. Oq va och rangli kiyimlar uchun — ranglarni yorqin, tolalarni yumshoq saqlaydi.',
    short: 'Toza suv va moviy gullar ifori',
    specs: [['IFOR', 'Crystal Bloom · toza'], ['QADOQ', '60 dona · 3 in 1'], ['HARORAT', '20–40 °C']]
  },
  {
    key: 'original',
    n: '03',
    name: 'Original',
    tag: 'TABIIY O‘SIMLIKLAR',
    accent: '#2E9E4F',
    model: asset('models/pack-original.glb'),
    image: asset('products/original.webp'),
    desc: 'Har kuni uchun klassik tanlov. Sezgir teri uchun mos, kundalik yuvishda barqaror natija beradi.',
    short: 'Tabiiy o‘simliklar ifori',
    specs: [['IFOR', 'Original · tabiiy'], ['QADOQ', '60 dona · 3 in 1'], ['HARORAT', '20–40 °C']]
  }
]

export const SCENES = {
  machine: asset('scenes/machine.jpg'),
  room: asset('scenes/room.jpg'),
  towels: asset('scenes/towels.jpg'),
  studio: asset('scenes/studio.jpg')
}

export const DRACO_PATH = asset('draco/gltf/')

export const NAV_LINKS = [
  { label: 'Katalog', href: '#katalog' },
  { label: 'Afzalliklar', href: '#afzalliklar' },
  { label: 'Qo‘llash', href: '#qollash' },
  { label: 'Aloqa', href: '#sorov' }
]
