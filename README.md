# TerryTime Shop

TerryTime's checkout-only site: a Next.js shop selling real Terry Store
merch from Printful, with Stripe checkout. Everything that isn't the
checkout flow (marketing pages, character pages, manifesto, community,
design system, and every experimental branch) has been moved to a separate
archive repo, https://github.com/Classiccottrell/terry-site-tryouts, so
nothing is lost — it's just not part of this repo anymore.

## Tech Stack

- **[Next.js 15](https://nextjs.org)** (App Router, React 19)
- **[TypeScript](https://www.typescriptlang.org)** end to end
- **[Tailwind CSS v4](https://tailwindcss.com)**, with a scoped `.shop-design`
  cobalt Brutal UX design system across the shop previews (`app/globals.css`) — ported
  from [Classiccottrell/Brutal-UX](https://github.com/Classiccottrell/Brutal-UX)

`/` and `/shop` run an **A/B split** between the two launch storefronts —
`/shop/archive` (A, Street Evidence Archive) and `/shop/receipt` (B, Corner Store
Receipt) — via `middleware.ts`: 50/50, pinned per visitor with a `tt_variant`
cookie, `?v=a|b` to force one. Each Stripe session records `store` and
`ab_variant` metadata. The other five storefront directions (City, Shrine, Grid,
Stencil, Kiosk) live on the `archive/unused-stores` branch. `/lifestyle` is a
shoppable lookbook ("After hours") linked from both stores. On a static export
(GitHub Pages) middleware is dropped and `/shop` redirects to Archive. Checkout runs on Next.js route handlers
(Node runtime); the site builds and runs with no secrets, and checkout turns
on the moment you add a Stripe key.

## Integrations

| Feature | Endpoint | Enable with |
| --- | --- | --- |
| Stripe checkout | `POST /api/checkout` | `STRIPE_SECRET_KEY` |
| Stripe webhook (fulfilment hook) | `POST /api/webhook` | `STRIPE_WEBHOOK_SECRET` |
| Newsletter signup | `POST /api/subscribe` | `RESEND_API_KEY` + `RESEND_AUDIENCE_ID`, or `NEWSLETTER_WEBHOOK_URL` |

- **Checkout** builds a Stripe Checkout Session from inline `price_data`, so
  no Stripe dashboard product setup is needed — just a secret key. Catalog
  and prices live in `lib/products.ts` (`priceCents`, CAD). Success →
  `/shop/success`, cancel → `/shop?canceled=1`.
- **Printful** — the Terry Store on Printful (store ID `18616880`) has more
  products than are listed here; `lib/products.ts` is deliberately trimmed
  to the 3 with approved local product photography (polo, hoodie, dad hat —
  `public/img/products/`). `PRINTFUL_API_KEY` (an all-access token) lives in
  `.env.local` (gitignored; see `.env.example` for the var name) and can pull
  the rest of the catalog when their photography is ready. Each variant
  carries a `printfulVariantId`, used by `lib/printful.ts` to create the
  fulfilment order on a completed checkout.
- **Webhook** verifies the signature, logs `checkout.session.completed`, and
  creates a matching Printful order via `lib/printful.ts` — as a **draft**
  (`confirm: false`), so it lands in the Printful dashboard for review and
  nothing ships automatically. Flip `confirm: true` there once the pipeline
  is trusted. A failed order-creation call is logged loudly (payment already
  succeeded by that point) rather than silently dropped.
- **Newsletter** adds the contact to a Resend audience, or POSTs `{ email }`
  to a generic webhook (Buttondown / ConvertKit / Zapier / Mailchimp).
- Without any of these set, the buttons show an honest "not live yet" message.

Copy `.env.example` → `.env.local` and fill in what you want to enable.
Then `npm run verify:live` (add `-- --discover`, `-- --draft-order`, `-- --site <url>`)
smoke-tests Printful and Stripe: auth, variants, margins, test checkout, webhook.

Shipping (CA + US): the buyer enters country / province-state / postal code; the server prices it from Printful's live `/shipping/rates` for that address (flat fallback per country if Printful is down) and Stripe is locked to that country. Sizes are S–XL for the polo and hoodie; the hat is one size.

Sizes: each size is its own variant, linked to Printful by `npm run sync:printful`
(writes `lib/printful-map.mjs`); unlinked sizes can't be bought.

Footers and error pages (404, `error.tsx`, `global-error.tsx`) use `components/TerryEngraving.tsx`, a canvas piece built on linefield's contour-grid that draws the Terry face as line weight. Customer pages (`/shipping`, `/sizing`, `/contact`, `/privacy`, `/terms`) are drafts with two options each (`/page` = A, `/page/b` = B).

Launch docs: `docs/golive-todo.md`, `docs/launch-roadmap.md`, `docs/copy-deck.md`,
`docs/site-pages.md`, `docs/lifestyle-photo-assessment.md`.

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
├── app/
│   ├── layout.tsx             # Minimal root layout
│   ├── globals.css            # Base tokens + scoped .shop-brutal cobalt system
│   ├── page.tsx                # Redirects to /shop
│   ├── shop/page.tsx          # Fallback redirect (middleware does the A/B split)
│   ├── shop/archive/page.tsx  # Store A — Street Evidence Archive
│   ├── shop/receipt/page.tsx  # Store B — Corner Store Receipt
│   ├── lifestyle/page.tsx     # After Hours lifestyle lookbook — timestamped photos + product kits
│   ├── shop/success/page.tsx
│   └── api/                    # checkout, subscribe, webhook route handlers
├── components/                 # Checkout controls, design navigation, visual effects
├── middleware.ts               # A/B split for / and /shop
├── scripts/verify-live.mjs     # Printful + Stripe go-live smoke test
├── lib/                        # Catalog, shop route registry, Stripe, site helpers
├── public/img/products/        # Approved local product photography (polo, hoodie, dad hat)
├── public/img/shop/            # Shop hero collage photos, terry-face.svg mascot asset
```

## Design System — Brutal UX (cobalt)

Both storefronts and the lifestyle page opt into `.shop-design`: `#1233c7` cobalt
ink on `#f7f6f1` warm paper, zero border radius and zero shadow. Archive uses
documentary contact sheets and product dossiers; Receipt prints the catalog as
one long thermal tape (line items, dot leaders, a shelf total, a torn edge).
Source of truth: [Classiccottrell/Brutal-UX](https://github.com/Classiccottrell/Brutal-UX).

## Deploy

Any Next.js host works. Easiest paths:

- **Vercel** — import the repo, zero config.
- **Netlify** — uses the official Next.js runtime, zero config.
