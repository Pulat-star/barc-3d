# Bärc — laundry care system

Showcase site for international trade shows. Built around the brand as a
**system of formats**, not a single hero product.

**Live:** https://pulat-star.github.io/barc-3d/

## Why it is built this way

- **Multi-product by construction.** Every section — hero cluster, pinned chain,
  catalogue — reads from `lib/products.ts`. Adding a new Bärc line means adding
  one entry to that array; nothing else changes.
- **One master timeline.** `lib/masterTimeline.ts` drives all six products from a
  single pinned `ScrollTrigger`. Each product's exit overlaps its successor's
  entrance, and that overlap window is the morph — so the sequence reads as one
  continuous motion instead of six separate ones.
- **One background surface.** `components/ui/BackgroundLayer.tsx` is a single
  fixed layer whose colour is interpolated from scroll progress. Sections never
  paint their own background, so there is no hard edge anywhere.
- **Real packaging, pink as the brand accent.** The three shipping capsules use
  their actual photography; pink carries the brand through CTAs, labels and the
  formats still in development, which are marked *In development*.

## Copy pattern

Every product and pillar follows the same three beats: a small category label,
a promise in plain words, then one concrete sentence about what it does.

## Stack

Next.js 14 (App Router, static export) · TypeScript · Tailwind · GSAP
ScrollTrigger · Lenis.

## Run

```bash
npm install
npm run dev          # http://localhost:3000/barc-3d
npm run build        # static export to ./out
npm run serve        # preview the export
```

`BASE_PATH= npm run build` builds for a domain root instead of the Pages subpath.

## Deploy

`out/` is pushed to the `gh-pages` branch.
