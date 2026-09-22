# BÄRC — 3 in 1 kir yuvish kapsulalari

Deep-purple, 3D scroll-driven marketing site for BÄRC laundry pods.

**Live:** https://pulat-star.github.io/barc-3d/

## Nima bor

- **Real 3D mahsulotlar** — har bir qadoq `image_to_3d` orqali GLB model (Draco bilan 5.5 MB → ~440 KB).
- **Scroll bilan bog‘langan sahna** — realistik xonada kir mashinasi ustida turgan qadoq; scroll qilganda mahsulot va uning ma’lumotlari almashadi.
- **Siliq kamera** — damped lerp (`1 - 0.0015^dt`), kadr chastotasidan mustaqil, sakrashsiz.
- **iOS-xavfsiz scroll** — `dvh` ishlatilmaydi (`svh`), `visualViewport` resize’da qayta o‘lchanadi, video scrub yo‘q.
- **Responsiv** — mobil (390), planshet (834), desktop (1440).

## Ishga tushirish

```bash
npm install
npm run dev        # http://localhost:5173/barc-3d/
npm run build
npm run preview
```

`BASE_PATH=/ npm run build` — boshqa domenda root’ga joylashtirish uchun.

## Nashr

`dist` `gh-pages` branch’iga yuklanadi:

```bash
npm run build
npx gh-pages -d dist      # yoki qo'lda: git subtree / worktree
```

> GitHub Actions workflow qo'shilmadi — joriy token’da `workflow` scope yo'q.
> Kerak bo'lsa `gh auth refresh -s workflow` qilib, `.github/workflows/deploy.yml` qo'shsa bo'ladi.

## Dizayn

Figma: `v5 — BÄRC 3D` sahifasi — desktop, planshet va mobil kadrlar.
Shriftlar: Fraunces (sarlavha), Manrope (matn), DM Mono (yorliq), Unbounded (logo).
