# TerryTime Shop

TerryTime's checkout-only site: a Next.js shop selling the real Terry Store
catalog from Printful, with Stripe checkout. Everything that isn't the
checkout flow (marketing pages, character pages, manifesto, community,
design system, and every experimental branch) has been moved to a separate
archive repo, https://github.com/Classiccottrell/terry-site-tryouts, so
nothing is lost — it's just not part of this repo anymore.

## Tech Stack

- **[Next.js 15](https://nextjs.org)** (App Router, React 19)
- **[TypeScript](https://www.typescriptlang.org)** end to end
- **[Tailwind CSS v4](https://tailwindcss.com)**, with a scoped `.shop-brutal`
  cobalt Brutal UX design system on `/shop` (`app/globals.css`) — ported
  from [Classiccottrell/Brutal-UX](https://github.com/Classiccottrell/Brutal-UX)

`/` redirects straight to `/shop`. Checkout runs on Next.js route handlers
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
- **Printful** — the full catalog in `lib/products.ts` is pulled from the
  live Terry Store on Printful (store ID `18616880`) via the Printful API.
  `PRINTFUL_API_KEY` (an all-access token) lives in `.env.local` (gitignored;
  see `.env.example` for the var name). Each product/variant carries a
  `printfulVariantId` for future order-fulfilment wiring — `app/api/webhook`
  doesn't call Printful yet, that's a TODO.
- **Webhook** verifies the signature and logs `checkout.session.completed`;
  drop the Printful order-creation call where the `TODO` is in
  `app/api/webhook/route.ts`.
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
│   ├── shop/page.tsx          # The shop — cobalt Brutal UX, full Printful catalog
│   ├── shop/success/page.tsx
│   └── api/                    # checkout, subscribe, webhook route handlers
├── components/                 # BuyButton, CanceledBanner
├── lib/                        # products.ts (Printful catalog), stripe.ts, site.ts
└── public/img/shop/            # Shop hero collage photos, terry-face.svg mascot asset
```

## Design System — Brutal UX (cobalt)

`/shop` opts into a scoped cobalt Brutal UX variant (`.shop-brutal`,
`data-ink="cobalt"` in `app/shop/page.tsx`): monospace type, `#1233c7`
cobalt ink on `#f7f6f1` warm paper, zero border-radius/shadow/transition,
`.brutal-btn` / `.brutal-border` / `.brutal-divider` / `.brutal-input`
utilities. Source of truth for the full system:
[Classiccottrell/Brutal-UX](https://github.com/Classiccottrell/Brutal-UX).

## Deploy

Any Next.js host works. Easiest paths:

- **Vercel** — import the repo, zero config.
- **Netlify** — uses the official Next.js runtime, zero config.
