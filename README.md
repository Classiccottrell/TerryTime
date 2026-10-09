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
cookie, `?v=a|b` to force one. In dev and Vercel previews a corner switcher
(`components/DevStoreSwitch.tsx`) jumps between A, B and Lifestyle; it never
renders in production. Each Stripe session records `store` and
`ab_variant` metadata. The other five storefront directions (City, Shrine, Grid,
Stencil, Kiosk) live on the `archive/unused-stores` branch. `/lifestyle` is a
shoppable lookbook ("After hours") linked from both stores. Hosted on Vercel only
(the GitHub Pages copy was retired Oct 2026). Checkout runs on Next.js route handlers
(Node runtime); without a Stripe key the site builds with an empty shop.

## Integrations

| Feature | Endpoint | Enable with |
| --- | --- | --- |
| Stripe checkout | `POST /api/checkout` | `STRIPE_SECRET_KEY` |
| Stripe webhook (fulfilment hook) | `POST /api/webhook` | `STRIPE_WEBHOOK_SECRET` |
| Newsletter signup | `POST /api/subscribe` | `RESEND_API_KEY` + `RESEND_AUDIENCE_ID`, or `NEWSLETTER_WEBHOOK_URL` |

- **Catalog = Stripe.** Products and prices are managed in the Stripe dashboard
  (Product catalog). The site reads them via `lib/catalog.ts` (cached, pages
  revalidate every 5 minutes); the data model is documented in
  `lib/catalog-core.ts`. A TerryTime product is a Stripe Product with
  `metadata.shop = terrytime` plus `slug`, `order`, `color`, `voice`,
  `fulfillment` (`printful` | `manual`) and optional `shipping_cents`; each size
  is an active one-time CAD Price whose **description (nickname) is the size**
  (`S`, `M`, `One size`) for the default colour (`metadata.color`), or
  **`Colour / Size`** (`White / M`) for other colours; the product card then
  shows a colour picker and swaps the photo (`image_<colour>` metadata,
  filled with Printful's mockup by `sync:printful` until you upload a photo). Products without the tag (other projects in the same
  Stripe account) are ignored. `npm run import:catalog` seeds the launch
  products into a fresh account (idempotent — use it for live mode).
- **Checkout** receives only a Stripe Price id; the server re-reads the price
  from Stripe and accepts it only for an active one-time CAD price on an active
  TerryTime product (`checkPrice`). The line item shows the size; the catalog
  price id is kept in session metadata. Success → `/shop/success`,
  cancel → `/shop?canceled=1`.
- **Printful** — the Terry Store on Printful (store ID `18616880`). `npm run
  sync:printful` links each size of every `fulfillment=printful` product to its
  Printful sync variant, writing `printful_<colour>_<size>="<sync>:<catalog>"` into the
  Stripe product metadata; unlinked sizes can't be bought.
  `PRINTFUL_API_KEY` lives in `.env.local` (gitignored) and on Vercel.
- **Manual products** (not print on demand): set `fulfillment=manual` (and
  `shipping_cents` if Printful can't quote it); paid orders are logged by the
  webhook for you to fulfil by hand.
- **Webhook** verifies the signature, looks up what was paid in the Stripe
  catalog, and for Printful items creates a matching order via `lib/printful.ts` — as a **draft**
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

Shipping (CA + US): the product card is size → Buy; Stripe's hosted page collects the address (Canada or US). Stripe's hosted page can't re-price by address, so checkout charges one shipping line per order: the higher of Printful's live Canadian rate and the US rate + `SHIPPING_UPCHARGE_US_CENTS` (Printful shipping is flat within each country). Flat fallback per country if Printful is down. Sizes are S–XL for the polo and hoodie; the hat is one size.

Footers and error pages (404, `error.tsx`, `global-error.tsx`) use `components/TerrySymbols.tsx`: the Terry face drawing (`public/img/terry-face-drawing.png`) set in a constantly switching grid of type symbols (WebGL2, with a canvas-2D still for browsers without it and a still frame under reduced motion). Unused explorations are on the `archive/unused-stores` branch in `archive/footer-graphics/`. Customer pages (`/shipping`, `/sizing`, `/contact`, `/privacy`, `/terms`) are drafts with two options each (`/page` = A, `/page/b` = B).

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
├── scripts/                    # verify-live, sync-printful, import-catalog (+ _shared.mjs)
├── lib/                        # Stripe catalog, shipping, shop route registry, Stripe/Printful clients
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

Vercel (project `terrytime`): `main` deploys to production at
terryterrylarryberry.com; PRs get preview deploys. Env vars: `STRIPE_SECRET_KEY`
(from the Vercel–Stripe integration), `STRIPE_WEBHOOK_SECRET` (Production),
`PRINTFUL_API_KEY`, `NEXT_PUBLIC_SITE_URL`.
