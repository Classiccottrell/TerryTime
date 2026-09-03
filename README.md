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

`/` redirects straight to the `/shop` design chooser. Five live storefront
directions share the same catalog and checkout: `/shop/city`, `/shop/archive`,
`/shop/shrine`, `/shop/grid`, and `/shop/stencil`. Checkout runs on Next.js route handlers
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
│   ├── shop/page.tsx          # Storefront design chooser
│   ├── shop/city/page.tsx     # Kinetic Cobalt Relay City storefront
│   ├── shop/archive/page.tsx  # Street Evidence Archive storefront
│   ├── shop/shrine/page.tsx   # Minimal Signal Shrine storefront
│   ├── shop/grid/page.tsx     # Terminal Grid — dense, edge-to-edge catalog
│   ├── shop/stencil/page.tsx  # Wheatpaste Stencil — street posters / flyers
│   ├── shop/success/page.tsx
│   └── api/                    # checkout, subscribe, webhook route handlers
├── components/                 # Checkout controls, design navigation, visual effects
├── lib/                        # Catalog, shop route registry, Stripe, site helpers
├── public/img/products/        # Approved local product photography (polo, hoodie, dad hat)
└── public/img/shop/            # Shop hero collage photos, terry-face.svg mascot asset
```

## Design System — Brutal UX (cobalt)

The shop chooser and all five storefront directions opt into `.shop-design`:
monospace type, `#1233c7` cobalt ink on `#f7f6f1` warm paper, zero border
radius and zero shadow. City, Archive, Shrine, Grid, and Stencil intentionally use
separate compositions while sharing catalog, checkout, and preview
navigation — Grid (`supreme.com`-inspired) skips the collage/hero flourish
entirely for a dense, edge-to-edge product grid; Stencil treats each product as a
wheatpaste flyer with stacked poster sheets. Source of truth for the
underlying system:
[Classiccottrell/Brutal-UX](https://github.com/Classiccottrell/Brutal-UX).

## Deploy

Any Next.js host works. Easiest paths:

- **Vercel** — import the repo, zero config.
- **Netlify** — uses the official Next.js runtime, zero config.
