# Terry Terry Larry Berry

An East Van underground art collective masquerading as a sticker brand. Four voices —
**Terry the Sketcher**, **Terry the Philosopher**, **Larry the Documentarian**, and
**Berry the Editor** — that must blend, never reduce.

This repo is the brand's website, rebuilt on a modern stack.

## Tech Stack

- **[Next.js 15](https://nextjs.org)** (App Router, React 19, static-export friendly)
- **[TypeScript](https://www.typescriptlang.org)** end to end
- **[Tailwind CSS v4](https://tailwindcss.com)** with the brand design tokens encoded in
  `app/globals.css`
- **`next/font`** for the brand type stack (Bebas Neue, Crimson Text, IBM Plex Mono, Space Mono)

No backend is required to run the site — it builds to fully static HTML.

## Getting Started

```bash
npm install      # install dependencies
npm run dev      # start the dev server at http://localhost:3000
npm run build    # production build
npm start        # serve the production build
```

> Requires Node.js 18.18+ (tested on Node 22).

## Project Structure

```text
TerryTime/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout: fonts, nav, ticker, footer
│   ├── globals.css           # Tailwind v4 theme + brand design tokens
│   ├── page.tsx              # Home / the studio
│   ├── characters/           # The Four — listing + dynamic [slug] profiles
│   ├── shop/                 # Sticker shop (free + paid funnel)
│   ├── manifesto/            # The brand manifesto
│   ├── community/            # Join the collective + signup
│   ├── not-found.tsx         # 404, edited out of existence by Berry
│   └── icon.svg              # Favicon
├── components/               # Nav, Footer, Ticker, CharacterCard, Reveal, SignupForm
├── lib/                      # Data: characters.ts, products.ts
└── .agents/skills/           # Brand source of truth (design system + character voices)
```

## The Source of Truth

The `.agents/skills/` folder is the canonical brand documentation — the design system,
the four character voices, and the community strategy. The site's colors, type, copy, and
components all derive from it. When extending the site, read those files first so new pages
stay in voice.

## Design System (at a glance)

| Voice | Primary | Accent |
| --- | --- | --- |
| Terry — Sketcher | `#1A1A1A` | `#FFE135` electric yellow |
| Terry — Philosopher | `#2C2C2C` | `#808080` gray |
| Larry — Documentarian | `#0F0F0F` | `#CC0000` documentary red |
| Berry — Editor | `#3D3D3D` | `#2D5F2E` forest green |

Sharp corners, an 8px spacing grid, restrained motion, and the gradient "shouting match"
divider tie it together.

## Deploy

Any Next.js host works. Easiest paths:

- **Vercel** — import the repo, zero config.
- **Netlify** — uses the official Next.js runtime, zero config.

---

_One sticker. Infinite hustle. #eastvan_
