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

The marketing pages are static; checkout and newsletter signup run on Next.js
route handlers (Node runtime). Everything degrades gracefully — the site builds
and runs with no secrets, and the live features turn on the moment you add keys.

## Integrations

| Feature | Endpoint | Enable with |
| --- | --- | --- |
| Stripe checkout (paid packs) | `POST /api/checkout` | `STRIPE_SECRET_KEY` |
| Stripe webhook (fulfilment hook) | `POST /api/webhook` | `STRIPE_WEBHOOK_SECRET` |
| Newsletter signup | `POST /api/subscribe` | `RESEND_API_KEY` + `RESEND_AUDIENCE_ID`, or `NEWSLETTER_WEBHOOK_URL` |

- **Checkout** builds a Stripe Checkout Session from inline `price_data`, so no
  Stripe dashboard product setup is needed — just a secret key. Prices live in
  `lib/products.ts` (`priceCents`, CAD). Success → `/shop/success`, cancel →
  `/shop?canceled=1`.
- **Webhook** verifies the signature and logs `checkout.session.completed`;
  drop your Printful (or other) fulfilment call where the `TODO` is in
  `app/api/webhook/route.ts`.
- **Newsletter** adds the contact to a Resend audience, or POSTs `{ email }` to a
  generic webhook (Buttondown / ConvertKit / Zapier / Mailchimp).
- Without any of these set, the buttons show an honest "not live yet" message.

Copy `.env.example` → `.env.local` and fill in what you want to enable.

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
│   ├── shop/                 # Sticker shop (free + paid funnel) + /success
│   ├── manifesto/            # The brand manifesto
│   ├── community/            # Join the collective + signup
│   ├── api/                  # Route handlers: checkout, subscribe, webhook
│   ├── not-found.tsx         # 404, edited out of existence by Berry
│   └── icon.svg              # Favicon
├── components/               # Nav, Footer, Ticker, CharacterCard, Reveal,
│                             #   SignupForm, BuyButton
├── lib/                      # Data + clients: characters.ts, products.ts, stripe.ts
├── public/downloads/         # Free downloadable SVG sticker sheets
└── .agents/skills/           # Brand source of truth (design system + character voices)
```

## The Source of Truth

The `.agents/skills/` folder is the canonical brand documentation — the design system,
the four character voices, and the community strategy. The site's colors, type, copy, and
components all derive from it. When extending the site, read those files first so new pages
stay in voice.

## Design System — v3 "Moody Teal"

There's a **living design-system library at [`/design-system`](/design-system)** —
palette, type, the four voices, iconography, components, spacing, and motion, all in
one place. Start there. Tokens live in `app/globals.css` (`@theme`) and are mirrored
as data in `lib/design-tokens.ts` (which drives that page).

The palette + feeling are pulled from three source works (in `public/img/characters`):
an outsider-art painting (teal ground, terracotta figure, red halo, star·eye·key
talismans), a B&W East-Van graffiti-bin photo, and a raw ballpoint sketch on bone
paper. Those images double as the placeholder art for the Philosopher, Larry, and the
Sketcher.

**Canvas alternation** — pages breathe on warm bone (`--color-paper #EAE3D2`) and punch
into deep teal-black blocks (`--color-ink #122E36`), with a brighter feature teal
(`--color-teal #1E4E5F`).

**Accents** keep the electric yellow `#FFE135` as the signature pop, surrounded by an
earthy cast: vermilion `#E23B2E`, terracotta `#B25A2B`, magenta `#E84C92`, indigo
`#2B2E77`, ochre `#C6A02C`, coral `#E39B82` (forest `#1F6F43` reserved for "free").
The gradient "shouting match" divider still ties sections together.

**Iconography** — a hand-drawn talisman set (star · eye · key + voice motifs) lives in
`components/icons.tsx`; render with `<Icon name="eye" />`.

**Type roles**

| Token | Face | Used for |
| --- | --- | --- |
| `--font-display` | Bebas Neue | Huge brand statements, character names, ticker |
| `--font-grotesk` | Space Grotesk | Editorial headlines, nav, buttons |
| `--font-serif` | Crimson Text | Long-form body |
| `--font-mono` | IBM Plex Mono | Category eyebrows, meta labels |
| `--font-spacemono` | Space Mono | Ticker fine print |

Sharp corners, an 8px spacing grid, mono category eyebrows, and restrained
scroll-reveal motion complete the system. Reusable utilities: `.ed-card`,
`.eyebrow`, `.rule` / `.rule-ink`, `.divider-line`, `.grain` / `.grain-ink`.

## Deploy

Any Next.js host works. Easiest paths:

- **Vercel** — import the repo, zero config.
- **Netlify** — uses the official Next.js runtime, zero config.

---

_One sticker. Infinite hustle. #eastvan_
