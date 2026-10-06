export type Lang = 'en' | 'uz' | 'ru' | 'ar'

export const LANGS: { code: Lang; label: string; dir: 'ltr' | 'rtl' }[] = [
  { code: 'en', label: 'EN', dir: 'ltr' },
  { code: 'uz', label: 'UZ', dir: 'ltr' },
  { code: 'ru', label: 'RU', dir: 'ltr' },
  { code: 'ar', label: 'AR', dir: 'rtl' }
]

type Entry = Record<Lang, string>
const t = (en: string, uz: string, ru: string, ar: string): Entry => ({ en, uz, ru, ar })

/**
 * One pattern everywhere: a small category label, a promise in plain words,
 * then one concrete sentence about what it actually does.
 */
export const COPY = {
  nav: {
    system: t('System', 'Tizim', 'Система', 'النظام'),
    range: t('Range', 'Assortiment', 'Ассортимент', 'المنتجات'),
    formula: t('Formula', 'Formula', 'Формула', 'التركيبة'),
    contact: t('Contact', 'Aloqa', 'Контакты', 'تواصل'),
    cta: t('Talk to us', 'Bog‘lanish', 'Связаться', 'تواصل معنا')
  },

  hero: {
    kicker: t('Laundry care system', 'Kir yuvish tizimi', 'Система ухода за бельём', 'نظام العناية بالغسيل'),
    line1: t('Win over any', 'Istalgan kir ustidan', 'Победа над любым', 'انتصر على أي'),
    line2: t('laundry', 'g‘alaba qozoning', 'пятном', 'غسيل'),
    sub: t(
      'Bärc is powerful results and careful care.',
      'Bärc bu kuchli natija va ehtiyotkor parvarish.',
      'Bärc — это мощный результат и бережный уход.',
      'بيرك قوة في النتيجة ولطف في العناية.'
    ),
    lede: t(
      'Capsules today. Powder, gel and stain remover next. One formula platform behind all of them — so every load gets the right format, and a retailer stocks one brand instead of four.',
      'Bugun kapsula. Keyin poroshok, gel va dog‘ ketkazuvchi. Barchasi ortida bitta formula platformasi — har bir yuvish uchun to‘g‘ri format, do‘kon uchun esa to‘rtta emas, bitta brend.',
      'Сегодня капсулы. Дальше — порошок, гель и пятновыводитель. За всеми одна формульная платформа: для каждой стирки свой формат, а в магазине — один бренд вместо четырёх.',
      'الكبسولات اليوم. ثم المسحوق والجل ومزيل البقع. جميعها تقوم على منصة تركيبة واحدة — لكل غسلة الشكل المناسب، وللمتجر علامة واحدة بدل أربع.'
    ),
    cta: t('See the range', 'Assortimentni ko‘rish', 'Весь ассортимент', 'كل المنتجات'),
    alt: t('For business', 'Biznes uchun', 'Для бизнеса', 'للشركات'),
    meta: t('Est. 2024 · Made in UK', '2024 dan · Buyuk Britaniyada', 'С 2024 · Сделано в Великобритании', 'منذ ٢٠٢٤ · صنع في بريطانيا')
  },

  stage: {
    prompt: t('Scroll to discover', 'Ko‘rish uchun suring', 'Прокрутите, чтобы узнать', 'مرّر للاكتشاف'),
    discover: t('Discover the product', 'Mahsulotni ko‘rish', 'Посмотреть продукт', 'اكتشف المنتج'),
    specs: t('At a glance', 'Qisqacha', 'Коротко', 'باختصار'),
    scent: t('Scent', 'Ifor', 'Аромат', 'الرائحة'),
    pack: t('Pack', 'Qadoq', 'Упаковка', 'العبوة'),
    temp: t('Temperature', 'Harorat', 'Температура', 'درجة الحرارة'),
    origin: t('Made in\nUnited Kingdom', 'Ishlab chiqarilgan\nBuyuk Britaniya', 'Произведено\nВеликобритания', 'صنع في\nالمملكة المتحدة'),
    ring: t('CLEAN · FRESH · DEPENDABLE · ', 'TOZA · YANGI · ISHONCHLI · ', 'ЧИСТО · СВЕЖО · НАДЁЖНО · ', 'نظيف · منعش · موثوق · '),
    menu: t('Menu', 'Menyu', 'Меню', 'القائمة'),
    close: t('Close', 'Yopish', 'Закрыть', 'إغلاق')
  },

  chain: {
    label: t('The system', 'Tizim', 'Система', 'النظام'),
    kicker: t('The range', 'Assortiment', 'Ассортимент', 'المنتجات'),
    title: t('Four formats, one formula', 'To‘rt format, bitta formula', 'Четыре формата, одна формула', 'أربعة أشكال، تركيبة واحدة'),
    rangeLede: t(
      'Each format exists because a different load needs it. Same cleaning platform, different way of getting it onto the fabric.',
      'Har bir format o‘z yuklamasi uchun kerak. Tozalash platformasi bir xil, matoga yetib borish usuli boshqacha.',
      'Каждый формат нужен под свою стирку. Платформа очистки одна — меняется только способ доставки на ткань.',
      'كل شكل موجود لأن نوع غسيل مختلف يحتاجه. منصة التنظيف واحدة، وطريقة وصولها إلى القماش هي ما يختلف.'
    ),
    soon: t('In development', 'Ishlab chiqilmoqda', 'В разработке', 'قيد التطوير'),
    available: t('Available now', 'Hozir mavjud', 'Уже в продаже', 'متوفر الآن'),
    categories: {
      pods: t('Capsules', 'Kapsula', 'Капсулы', 'كبسولات'),
      powder: t('Powder', 'Poroshok', 'Порошок', 'مسحوق'),
      gel: t('Gel', 'Gel', 'Гель', 'جل'),
      stain: t('Stain remover', 'Dog‘ ketkazuvchi', 'Пятновыводитель', 'مزيل البقع')
    } as Record<string, Entry>,
    promise: {
      amethyst: t('For stains that already set', 'Qotib qolgan dog‘lar uchun', 'Для засохших пятен', 'للبقع التي جفّت'),
      crystal: t('Keeps whites actually white', 'Oqni oq holida saqlaydi', 'Белое остаётся белым', 'يبقي الأبيض أبيض'),
      original: t('The one you reach for daily', 'Har kuni olinadigan variant', 'Выбор на каждый день', 'الخيار اليومي'),
      powder: t('For big, heavily soiled loads', 'Katta va qattiq kirlangan yuklama uchun', 'Для больших и сильно загрязнённых загрузок', 'للغسلات الكبيرة والشديدة الاتساخ'),
      gel: t('Dissolves fully in cold water', 'Sovuq suvda to‘liq eriydi', 'Полностью растворяется в холодной воде', 'يذوب تماماً في الماء البارد'),
      stain: t('Treat the spot before the wash', 'Yuvishdan oldin dog‘ni oling', 'Обработайте пятно до стирки', 'عالج البقعة قبل الغسل')
    } as Record<string, Entry>,
    detail: {
      amethyst: t(
        'Deep berry and floral. The strongest of the three on dried food, grease and collar marks.',
        'Boy rezavor va gul ifori. Uchtasi ichida qurib qolgan ovqat, yog‘ va yoqa izlariga eng kuchlisi.',
        'Насыщенный ягодно-цветочный аромат. Самый сильный из трёх против засохшей еды, жира и следов на воротнике.',
        'رائحة التوت والزهور. الأقوى بين الثلاثة على بقايا الطعام الجاف والدهون وآثار الياقة.'
      ),
      crystal: t(
        'Clean water and blue florals. Built for white and light loads, where greying shows first.',
        'Toza suv va moviy gul ifori. Oq va och ranglar uchun — kulrangga o‘tish birinchi shu yerda ko‘rinadi.',
        'Чистая вода и синие цветы. Для белого и светлого, где серость заметна в первую очередь.',
        'ماء نقي وزهور زرقاء. مخصص للأبيض والفاتح، حيث يظهر الاصفرار أولاً.'
      ),
      original: t(
        'Botanical and neutral. Gentle enough for sensitive skin, strong enough for a full family load.',
        'Tabiiy va neytral. Sezgir teriga yumshoq, oilaviy yuklamaga yetarli darajada kuchli.',
        'Травяной и нейтральный. Мягкий для чувствительной кожи и достаточно сильный для полной семейной загрузки.',
        'نباتي ومحايد. لطيف على البشرة الحساسة وقوي بما يكفي لغسلة عائلية كاملة.'
      ),
      powder: t(
        'Bulk washing where capsules get expensive — workwear, bedding, towels.',
        'Kapsula qimmatga tushadigan katta hajm uchun — ish kiyimi, choyshab, sochiq.',
        'Большие объёмы, где капсулы дороги: спецодежда, постельное, полотенца.',
        'للغسيل بكميات كبيرة حيث تصبح الكبسولات مكلفة — ملابس العمل والمفارش والمناشف.'
      ),
      gel: t(
        'No undissolved residue in the drum or on dark fabric, even on a 20 °C short cycle.',
        '20 °C qisqa rejimda ham barabanda yoki to‘q matoda erimagan qoldiq qolmaydi.',
        'Никаких нерастворённых следов в барабане и на тёмной ткани даже на коротком цикле 20 °C.',
        'لا تبقى رواسب في الحلة أو على الأقمشة الداكنة، حتى في دورة قصيرة عند ٢٠ °م.'
      ),
      stain: t(
        'Target the mark, wait a minute, then wash as normal. No second cycle.',
        'Dog‘ga suring, bir daqiqa kuting, so‘ng odatdagidek yuving. Ikkinchi marta yuvish shart emas.',
        'Нанесите на пятно, подождите минуту и стирайте как обычно. Второй цикл не нужен.',
        'ضعه على البقعة، انتظر دقيقة، ثم اغسل كالمعتاد. دون دورة ثانية.'
      )
    } as Record<string, Entry>
  },

  howto: {
    kicker: t('Easy to use', 'Foydalanish oson', 'Просто в использовании', 'سهل الاستخدام'),
    title: t('One pod, one load', 'Bitta pod — bitta yuklama', 'Одна капсула — одна стирка', 'كبسولة واحدة لغسلة واحدة'),
    lede: t(
      'No measuring, no spills, no second guessing. Three steps and the machine does the rest.',
      'O‘lchash yo‘q, to‘kilish yo‘q, ikkilanish yo‘q. Uch qadam — qolganini mashina qiladi.',
      'Ничего не отмерять, ничего не разливать, не гадать с дозой. Три шага — остальное сделает машина.',
      'لا قياس ولا انسكاب ولا تخمين. ثلاث خطوات والغسالة تتكفل بالباقي.'
    ),
    steps: [
      {
        n: '1',
        h: t('Take one pod', '1 podni oling', 'Возьмите одну капсулу', 'خذ كبسولة واحدة'),
        p: t('With dry hands — the film only dissolves in water.', 'Quruq qo‘l bilan — plyonka faqat suvda eriydi.', 'Сухими руками — плёнка растворяется только в воде.', 'بيدين جافتين — الغشاء يذوب في الماء فقط.')
      },
      {
        n: '2',
        h: t('Put it in the drum', 'Barabanga soling', 'Положите в барабан', 'ضعها في الحلة'),
        p: t('At the back, before the laundry — never in the detergent tray.', 'Kiyimdan oldin, orqa tomoniga — kukun bo‘limiga emas.', 'К задней стенке, до белья — не в лоток для порошка.', 'في الخلف قبل الغسيل — وليس في درج المسحوق.')
      },
      {
        n: '3',
        h: t('Run your normal cycle', 'Oddiy dasturda yuving', 'Запустите обычную программу', 'شغّل برنامجك المعتاد'),
        p: t('Cold and short is enough. No pre-soak needed.', 'Sovuq va qisqa rejim yetarli. Ivitish shart emas.', 'Холодной и короткой достаточно. Замачивать не нужно.', 'البارد والقصير يكفي. لا حاجة للنقع.')
      }
    ]
  },

  stats: {
    kicker: t('At a glance', 'Bir qarashda', 'Коротко о главном', 'لمحة سريعة'),
    items: [
      { v: '60', l: t('pods per pack', 'podlar har qadoqda', 'капсул в упаковке', 'كبسولة في العبوة') },
      { v: '3in1', l: t('clean · scent · care', 'tozalash · ifor · parvarish', 'очистка · аромат · уход', 'تنظيف · عطر · عناية') },
      { v: '20°', l: t('works from, celsius', 'dan ishlaydi, selsiy', 'работает от, цельсия', 'يعمل من، مئوية') },
      { v: '6', l: t('formats in the system', 'tizimdagi formatlar', 'форматов в системе', 'أشكال في النظام') }
    ]
  },

  formula: {
    kicker: t('The platform', 'Platforma', 'Платформа', 'المنصة'),
    title: t('One formula, four deliveries', 'Bitta formula, to‘rt yetkazish', 'Одна формула, четыре способа', 'تركيبة واحدة، أربع طرق'),
    lede: t(
      'The same enzymes and surfactants sit behind every format. What changes is how they reach the fabric — and that is what you choose between.',
      'Har bir format ortida bir xil ferment va yuza-faol moddalar turadi. Faqat ularning matoga yetib borish usuli o‘zgaradi — tanlov ham shunda.',
      'За каждым форматом — одни и те же ферменты и ПАВ. Меняется только то, как они попадают на ткань: именно из этого вы и выбираете.',
      'خلف كل شكل نفس الإنزيمات والمواد الفعالة. ما يتغير هو طريقة وصولها إلى القماش — وهذا هو خيارك.'
    ),
    pillars: [
      {
        n: '01',
        h: t('Works at 20 °C', '20 °C da ishlaydi', 'Работает при 20 °C', 'يعمل عند ٢٠ °م'),
        p: t(
          'Enzymes stay active in cold water, so a short cold cycle cleans as well as a long hot one — and costs less to run.',
          'Fermentlar sovuq suvda ham faol qoladi: qisqa sovuq rejim uzoq issiq rejim kabi tozalaydi, elektr esa kamroq ketadi.',
          'Ферменты остаются активными в холодной воде: короткий холодный цикл отстирывает не хуже долгого горячего и обходится дешевле.',
          'تبقى الإنزيمات نشطة في الماء البارد، فتنظّف الدورة القصيرة الباردة بقدر الدورة الساخنة الطويلة وبتكلفة أقل.'
        )
      },
      {
        n: '02',
        h: t('Colour and fibre guards', 'Rang va tola himoyasi', 'Защита цвета и волокон', 'حماية اللون والألياف'),
        p: t(
          'Every format carries the same anti-redeposition and fibre-protection package, so repeat washes do not dull the fabric.',
          'Har bir formatda bir xil himoya to‘plami bor — takroriy yuvish matoni xiralashtirmaydi.',
          'В каждом формате один и тот же пакет защиты: повторные стирки не тускнят ткань.',
          'كل شكل يحمل نفس حزمة الحماية، فلا تُبهت الغسلات المتكررة القماش.'
        )
      },
      {
        n: '03',
        h: t('Dosing you cannot get wrong', 'Dozani xato qilib bo‘lmaydi', 'Дозировку не ошибёшь', 'جرعة لا تُخطئ فيها'),
        p: t(
          'Capsules are pre-measured; powder and gel are scaled to the same dose chart. One system, one set of instructions.',
          'Kapsula oldindan o‘lchangan; poroshok va gel ham xuddi shu doza jadvaliga moslangan. Bitta tizim, bitta yo‘riqnoma.',
          'Капсулы уже отмерены, порошок и гель рассчитаны по той же таблице. Одна система — одна инструкция.',
          'الكبسولات مُقاسة مسبقاً، والمسحوق والجل وفق الجدول نفسه. نظام واحد وتعليمات واحدة.'
        )
      }
    ]
  },

  lifestyle: {
    kicker: t('Result', 'Natija', 'Результат', 'النتيجة'),
    title: t('Stains out. Fabric intact.', 'Dog‘ ketdi. Mato joyida.', 'Пятна ушли. Ткань цела.', 'زالت البقع. بقي القماش.'),
    lede: t(
      'One cycle, no pre-soak, no hot water. Scroll to see the same shirt before and after.',
      'Bitta rejim — ivitish ham, issiq suv ham shart emas. Xuddi shu ko‘ylakni oldin va keyin ko‘ring.',
      'Один цикл, без замачивания и горячей воды. Прокрутите, чтобы увидеть ту же рубашку до и после.',
      'دورة واحدة، دون نقع ودون ماء ساخن. مرّر لترى القميص نفسه قبل وبعد.'
    ),
    before: t('Before', 'Yuvishdan oldin', 'До', 'قبل'),
    after: t('After', 'Yuvishdan keyin', 'После', 'بعد')
  },

  contact: {
    kicker: t('Partnership', 'Hamkorlik', 'Партнёрство', 'الشراكة'),
    title: t('Bring Bärc to your market', 'Bärc’ni bozoringizga olib kiring', 'Приведите Bärc на свой рынок', 'أدخل Bärc إلى سوقك'),
    lede: t(
      'We are signing distribution partners for 2026. Tell us the market and the volumes you handle, and we will come back with pricing, lead times and private-label options.',
      '2026 uchun distribyutor hamkorlar izlayapmiz. Bozor va hajmlaringizni yozing — narx, yetkazish muddati va private-label imkoniyatlarini yuboramiz.',
      'Мы набираем дистрибьюторов на 2026 год. Напишите рынок и объёмы — вернёмся с ценами, сроками и вариантами private label.',
      'نتعاقد مع شركاء توزيع لعام ٢٠٢٦. أخبرنا بالسوق والكميات، وسنعود إليك بالأسعار ومدد التوريد وخيارات العلامة الخاصة.'
    ),
    name: t('Your name', 'Ismingiz', 'Ваше имя', 'اسمك'),
    namePh: t('e.g. Madina Karimova', 'Masalan, Madina Karimova', 'Например, Мадина Каримова', 'مثال: مدينة كريموفا'),
    company: t('Company and market', 'Kompaniya va bozor', 'Компания и рынок', 'الشركة والسوق'),
    companyPh: t('e.g. Nordic Retail — Sweden', 'Masalan, Nordic Retail — Shvetsiya', 'Например, Nordic Retail — Швеция', 'مثال: نورديك ريتيل — السويد'),
    email: t('Email or phone', 'Email yoki telefon', 'Email или телефон', 'البريد أو الهاتف'),
    emailPh: t('hello@company.com', 'hello@company.com', 'hello@company.com', 'hello@company.com'),
    tabRetail: t('I want to buy', 'Sotib olmoqchiman', 'Хочу купить', 'أريد الشراء'),
    tabTrade: t('I am a distributor', 'Men distribyutorman', 'Я дистрибьютор', 'أنا موزّع'),
    retailLede: t(
      'Tell us your city and we will point you to the nearest stockist — or send you a direct order link.',
      'Shahringizni yozing — eng yaqin sotuv nuqtasini aytamiz yoki to‘g‘ridan-to‘g‘ri buyurtma havolasini yuboramiz.',
      'Напишите город — подскажем ближайшую точку продаж или пришлём ссылку на прямой заказ.',
      'أخبرنا بمدينتك وسنرشدك إلى أقرب نقطة بيع أو نرسل رابط طلب مباشر.'
    ),
    cityPh: t('e.g. Tashkent', 'Masalan, Toshkent', 'Например, Ташкент', 'مثال: طشقند'),
    city: t('Your city', 'Shahringiz', 'Ваш город', 'مدينتك'),
    send: t('Send enquiry', 'So‘rov yuborish', 'Отправить запрос', 'إرسال الطلب'),
    note: t('We reply within two working days.', 'Ikki ish kuni ichida javob beramiz.', 'Отвечаем в течение двух рабочих дней.', 'نرد خلال يومي عمل.'),
    done: t('Thank you — your enquiry is with us.', 'Rahmat — so‘rovingiz bizga yetib keldi.', 'Спасибо — запрос получен.', 'شكراً — وصلنا طلبك.'),
    again: t('Send another', 'Yana yuborish', 'Отправить ещё', 'إرسال طلب آخر')
  },

  pack: {
    kicker: t('In the round', 'Har tomondan', 'Со всех сторон', 'من كل جانب'),
    title: t('Look at the pack itself', 'Qadoqning o‘ziga qarang', 'Рассмотрите упаковку', 'انظر إلى العبوة نفسها'),
    lede: t(
      'The real pack, scanned in 3D. Turn it, read the panel, check the child-lock strip — the same thing a buyer picks up off the shelf.',
      'Haqiqiy qadoq, 3D da skanerlangan. Aylantiring, yon tomonini o‘qing, bolalardan himoya chizig‘ini tekshiring — xaridor javondan oladigan aynan o‘sha narsa.',
      'Настоящая упаковка, отсканированная в 3D. Поверните её, прочитайте панель, проверьте защиту от детей — ровно то, что покупатель берёт с полки.',
      'العبوة الحقيقية ممسوحة ثلاثي الأبعاد. أدرها، اقرأ البيانات، تحقق من قفل الأطفال — نفس ما يلتقطه المشتري من الرف.'
    ),
    hint: t('Drag or scroll to turn', 'Aylantirish uchun suring', 'Поверните мышью или скроллом', 'اسحب أو مرّر للتدوير'),
    beats: [
      t('Child-lock seal', 'Bolalardan himoya', 'Защита от детей', 'قفل أمان الأطفال'),
      t('Sixty pods, resealable', 'Oltmish pod, qayta yopiladi', 'Шестьдесят капсул, закрывается', 'ستون كبسولة، قابل لإعادة الإغلاق'),
      t('Dose chart on the back', 'Orqasida doza jadvali', 'Таблица дозировки сзади', 'جدول الجرعات في الخلف')
    ]
  },

  footer: {
    tag: t('Clean. Fresh. Dependable.', 'Toza. Yangi. Ishonchli.', 'Чисто. Свежо. Надёжно.', 'نظيف. منعش. موثوق.'),
    rights: t('Bärc — laundry care system', 'Bärc — kir yuvish tizimi', 'Bärc — система ухода за бельём', 'Bärc — نظام العناية بالغسيل'),
    line1: t('Clean clothes.', 'Toza kiyimlar.', 'Чистая одежда.', 'ملابس نظيفة.'),
    line2: t('Good days.', 'Yoqimli kunlar.', 'Хорошие дни.', 'أيام طيبة.')
  },

  /* ------------------------------------------------------------------ site
     Everything the Figma frames spell out: header, gallery chrome, the
     products index, a product page and its two shared bands. */
  site: {
    nav: {
      products: t('Products', 'Mahsulotlar', 'Продукты', 'المنتجات'),
      usage: t('How to use', 'Foydalanish', 'Применение', 'الاستخدام'),
      about: t('About BÄRC', 'BÄRC haqida', 'О BÄRC', 'عن BÄRC'),
      menu: t('Menu', 'Menyu', 'Меню', 'القائمة'),
      close: t('Close', 'Yopish', 'Закрыть', 'إغلاق')
    },
    home: {
      eyebrow: t('BÄRC · LAUNDRY CAPSULES', 'BÄRC · KIR YUVISH KAPSULALARI', 'BÄRC · КАПСУЛЫ ДЛЯ СТИРКИ', 'BÄRC · كبسولات الغسيل'),
      /* the slogan is one sentence with one word lifted into italic grape */
      s1: t('Win over any', 'Istalgan kir ustidan', 'Победа над любым', 'انتصر على'),
      s2: t('stain', 'g‘alaba', 'пятном', 'أي بقعة'),
      s3: t(' you meet', ' qozoning', '', ''),
      promise: t(
        'Bärc — powerful results and careful care.',
        'Bärc — kuchli natija va ehtiyotkor parvarish.',
        'Bärc — мощный результат и бережный уход.',
        'بيرك — قوة في النتيجة ولطف في العناية.'
      ),
      rotate: t('Turn the\nproducts', 'Mahsulotlarni\naylantiring', 'Листайте\nпродукты', 'قلّب\nالمنتجات'),
      format: t('BÄRC 3in1 PODS', 'BÄRC 3in1 PODS', 'BÄRC 3in1 PODS', 'BÄRC 3in1 PODS'),
      all: t('All products', 'Barcha mahsulotlar', 'Все продукты', 'كل المنتجات'),
      discover: t('Discover the product', 'Mahsulot bilan tanishish', 'Узнать о продукте', 'تعرّف على المنتج')
    },
    products: {
      eyebrow: t('PRODUCTS', 'MAHSULOTLAR', 'ПРОДУКТЫ', 'المنتجات'),
      title: t('Three scents of clean.', 'Tozalikning uch xil ifori.', 'Три аромата чистоты.', 'ثلاث روائح للنظافة.'),
      sub: t(
        'The result is the same. The scent is your choice.',
        'Kuchli natija bir xil. Ifor — sizning tanlovingiz.',
        'Результат один. Аромат — ваш выбор.',
        'النتيجة واحدة. الرائحة اختيارك.'
      ),
      more: t('Learn more', 'Batafsil tanishish', 'Подробнее', 'اعرف المزيد'),
      units: t('60 pcs · 3in1 PODS', '60 dona · 3in1 PODS', '60 шт · 3in1 PODS', '٦٠ قطعة · 3in1 PODS')
    },
    product: {
      back: t('All products', 'Barcha mahsulotlar', 'Все продукты', 'كل المنتجات'),
      howto: t('How is it used?', 'Qanday foydalaniladi?', 'Как применять?', 'كيف يُستخدم؟'),
      spec1: t('3in1 PODS', '3in1 PODS', '3in1 PODS', '3in1 PODS'),
      spec2: t('60 pcs', '60 dona', '60 шт', '٦٠ قطعة'),
      spec3: t('Laundry capsules', 'Kir yuvish kapsulalari', 'Капсулы для стирки', 'كبسولات غسيل'),
      related: t('Discover another scent.', 'Yana bir iforni kashf eting.', 'Откройте другой аромат.', 'اكتشف رائحة أخرى.')
    },
    benefits: {
      eyebrow: t('3in1 PODS', '3in1 PODS', '3in1 PODS', '3in1 PODS'),
      t1: t('One capsule.', 'Bir kapsula.', 'Одна капсула.', 'كبسولة واحدة.'),
      t2: t('Three advantages.', 'Uchta afzallik.', 'Три преимущества.', 'ثلاث مزايا.'),
      items: [
        {
          title: t('Powerful cleaning', 'Kuchli tozalash', 'Мощная очистка', 'تنظيف قوي'),
          body: t(
            'Everyday stains and stubborn marks are lifted in one wash.',
            'Kundalik kir va qiyin dog‘lar bir yuvishda ketadi.',
            'Повседневные загрязнения и стойкие пятна уходят за одну стирку.',
            'تزول الأوساخ اليومية والبقع العنيدة في غسلة واحدة.'
          )
        },
        {
          title: t('Pleasant scent', 'Yoqimli ifor', 'Приятный аромат', 'رائحة منعشة'),
          body: t(
            'A fresh, long-lasting scent stays in the fabric after drying.',
            'Quritgandan keyin ham matoda yangi, uzoq saqlanadigan ifor qoladi.',
            'Свежий стойкий аромат остаётся в ткани после сушки.',
            'رائحة منعشة تدوم في القماش بعد التجفيف.'
          )
        },
        {
          title: t('Fabric care', 'Matoni asrash', 'Забота о ткани', 'عناية بالقماش'),
          body: t(
            'Colour and fibre are protected, so clothes keep their shape.',
            'Rang va tola himoyalanadi, kiyim shaklini yo‘qotmaydi.',
            'Цвет и волокно под защитой — одежда держит форму.',
            'يحمي اللون والألياف فيحافظ على شكل الملابس.'
          )
        }
      ]
    },
    usage: {
      eyebrow: t('EASY EVERY DAY', 'HAR KUNI OSON', 'ПРОСТО КАЖДЫЙ ДЕНЬ', 'سهل كل يوم'),
      t1: t('Three steps', 'Tozalik sari', 'Три шага', 'ثلاث خطوات'),
      t2: t('to clean.', 'uch qadam.', 'к чистоте.', 'إلى النظافة.'),
      p1: t(
        'No measuring, no spills. The capsule does the dosing for you.',
        'O‘lchash shart emas. Kapsula formati kir uvetini quyay va sodda qiladi.',
        'Не нужно отмерять и ничего не прольётся — капсула дозирует сама.',
        'لا قياس ولا انسكاب. الكبسولة تتكفّل بالجرعة.'
      ),
      p2: t(
        'Dry hands, capsule into the empty drum, laundry on top, then your usual cycle.',
        'Qo‘lingiz quruq bo‘lsin, kapsulani bo‘sh barabanga soling, kirni ustiga joylang va odatdagi dasturni tanlang.',
        'Сухими руками положите капсулу в пустой барабан, сверху бельё, затем обычный режим.',
        'بيدين جافتين، ضع الكبسولة في الحلة الفارغة، ثم الغسيل فوقها، ثم برنامجك المعتاد.'
      ),
      steps: [
        {
          title: t('Take a capsule', 'Kapsulani oling', 'Возьмите капсулу', 'خذ كبسولة'),
          body: t(
            'With dry hands — the film only dissolves in water.',
            'Qo‘l quruq bo‘lsin: plyonka faqat suvda eriydi.',
            'Руки должны быть сухими: плёнка растворяется только в воде.',
            'بيدين جافتين — الغشاء يذوب في الماء فقط.'
          )
        },
        {
          title: t('Put it in the drum', 'Barabanga joylashtiring', 'Положите в барабан', 'ضعها في الحلة'),
          body: t(
            'At the back, before the laundry — never in the detergent tray.',
            'Kapsulani bo‘sh barabanga soling, keyin kirni joylashtiring.',
            'В пустой барабан, до белья — не в отсек для порошка.',
            'في الخلف قبل الغسيل — وليس في درج المسحوق.'
          )
        },
        {
          title: t('Run your normal cycle', 'Mos dasturni tanlang', 'Запустите обычный режим', 'شغّل برنامجك المعتاد'),
          body: t(
            'Cold and short is enough. No pre-soak needed.',
            'Kiyim yorlig‘i va mahsulot qo‘riqnomasiga mos dasturni yoqing.',
            'Холодной и короткой программы достаточно. Замачивание не нужно.',
            'البارد والقصير يكفي. لا حاجة للنقع.'
          )
        }
      ]
    },
    about: {
      eyebrow: t('ABOUT BÄRC', 'BÄRC HAQIDA', 'О BÄRC', 'عن BÄRC'),
      title: t('Strong results, careful care.', 'Kuchli natija, ehtiyotkor parvarish.', 'Сильный результат, бережный уход.', 'نتيجة قوية وعناية لطيفة.'),
      p1: t(
        'Bärc is a laundry care brand built on one formula platform. Capsules first, with powder, gel and a stain remover following the same standard.',
        'Bärc — bitta formula platformasiga qurilgan kir parvarishi brendi. Avval kapsula, keyin shu standart bo‘yicha poroshok, gel va dog‘ ketkazuvchi.',
        'Bärc — бренд ухода за бельём на одной формульной платформе. Сначала капсулы, затем по тому же стандарту порошок, гель и пятновыводитель.',
        'بيرك علامة للعناية بالغسيل قائمة على منصة تركيبة واحدة. الكبسولات أولاً، ثم المسحوق والجل ومزيل البقع بالمعيار نفسه.'
      ),
      p2: t(
        'Three scents, one standard of clean — choose by scent, not by strength.',
        'Uch xil ifor, bitta tozalik standarti — kuch bo‘yicha emas, ifor bo‘yicha tanlang.',
        'Три аромата, один стандарт чистоты — выбирайте по аромату, а не по силе.',
        'ثلاث روائح ومعيار نظافة واحد — اختر بالرائحة لا بالقوة.'
      )
    },
    scent: {
      amethyst: t('Berry and floral scent', 'Rezavorlar va gullar ifori', 'Ягодно-цветочный аромат', 'رائحة التوت والزهور'),
      crystal: t('Clean water and blue florals', 'Toza suv va moviy gullar ifori', 'Чистая вода и синие цветы', 'ماء نقي وزهور زرقاء'),
      original: t('Natural botanical scent', 'Tabiiy o‘simliklar ifori', 'Природный травяной аромат', 'رائحة نباتية طبيعية'),
      powder: t('Fresh linen scent', 'Yangi choyshab ifori', 'Аромат свежего белья', 'رائحة الكتان المنعش'),
      gel: t('Soft cotton scent', 'Yumshoq paxta ifori', 'Аромат мягкого хлопка', 'رائحة القطن الناعم'),
      stain: t('Unscented', 'Ifursiz', 'Без аромата', 'بدون رائحة')
    } as Record<string, Entry>
  }
} as const

export function pick(entry: Entry, lang: Lang) {
  return entry[lang]
}
