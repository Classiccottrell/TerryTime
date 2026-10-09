# Go-Live To-Do List

Ordered by dependency. **You** = needs your accounts, keys, money or decisions.
**Claude** = I can do it once the input is there. Check items off as you go.
Companion docs: `launch-roadmap.md` (timeline and marketing), `copy-deck.md` (text),
`site-pages.md` (new pages), `lifestyle-photo-assessment.md` (shot list).

## A. Blockers: nothing can be sold until these are done

- [ ] **Merge PR #11** into main (A/B stores, sizes, favicon, tooling). — You
- [x] **Deploy to a server host, not GitHub Pages.** Vercel serves terryterrylarryberry.com; the GitHub Pages copy and its workflow were removed Oct 8. — Done
- [x] **Catalog in Stripe.** Products and prices live in the Stripe Product catalog (sandbox "ClassicCottrell sandbox" seeded Oct 8 by `npm run import:catalog`: polo/hoodie S–XL, hat). Edit them in the dashboard; the site picks changes up within 5 minutes. Each price's description must be its size. For live mode, run `npm run import:catalog` then `npm run sync:printful` with the live key. — Done (test mode)
- [ ] **Colour options (White).** Site supports colours (price description `White / M`, colour picker, photo swap). After merge: `npm run import:catalog` adds White polo S–XL, White hoodie S/M/XL and the Oyster hat, then `npm run sync:printful` links them and stores Printful mockups as their photos. To do: add White L to the hoodie in Printful (then add a `White / L` price in Stripe and re-run sync); real photos of the white pieces. — Claude + You
- [x] **Env vars on Vercel:** `STRIPE_SECRET_KEY` (Vercel–Stripe integration, sandbox), `STRIPE_WEBHOOK_SECRET` (Production, endpoint "charismatic-victory"), `PRINTFUL_API_KEY`, `NEXT_PUBLIC_SITE_URL`. Still to do: newsletter keys; scope `NEXT_PUBLIC_SITE_URL` to Production only; swap to live keys at launch. — Done (test mode)
- [ ] **Create every size in the Printful store.** The Terry Store needs Polo S–XL, Hoodie S–XL and Dad Hat (one size) as sync products with the Terry face artwork on each. Product names must contain "Pique Polo", "Hoodie" and "Dad Hat". — You
- [x] **Run `npm run sync:printful`** (Oct 8: all 9 sizes linked; ids now live in the Stripe product metadata). Re-run after adding a Printful product or size in Stripe. Any ✗ is a naming mismatch between the Stripe and Printful product names, or a size the blank doesn't come in.
- [ ] **Run `npm run verify:live`** and get zero FAIL. It checks auth, every size is linked, stock, per-size margin, a test Checkout Session, and the webhook. — Claude + You
- [x] **Stripe webhook registered** (sandbox): `https://www.terryterrylarryberry.com/api/webhook`, `checkout.session.completed`, secret on Vercel; verified with a signed test event Oct 8. Old ClassicCottrellShop endpoint disabled. Redo for live mode. — Done (test mode)

## B. Money: get these right before real customers

- [x] **Shipping is location-based (built).** No address on the site: Stripe collects it (CA or US). Checkout charges one shipping line, the higher of Printful's live CA rate and US rate + $2 (rates are flat within each country; Stripe's hosted page can't re-price per address). Falls back to flat $11.95 CA / $15.95 US only if Printful's rates API is down. Still to do: **confirm it against the real API** (`verify:live` shows charged vs. Printful cost to Vancouver, St. John's, New York and Los Angeles). — You + Claude
- [x] **Shipping policy on top of the live rate:** Printful rate at cost; Canada's $5 is built into listed prices (polo $37.83, hoodie $47.58, hat $36.53), US pays +$2 on the shipping line (`SHIPPING_UPCHARGE_US_CENTS`). Covers the sales tax Printful bills us. Buy flow: size → Buy → Stripe. `verify:live` PASS/FAIL is the repeat-order margin; Printful's one-time $9.60 embroidery digitization fee (first order per design) is shown per line and WARNs when it makes that first order negative (Oct 2: up to −$6.40, about $28.80 total across 3 designs). Accept as launch cost or price it in. — Done
- [x] **Quote vs. address risk.** Gone by design: shipping is the highest per-country rate, so any CA/US address is covered. The webhook only fulfils sessions with `payment_status: paid`. Prices and shipping are always set server-side (the client sends only product id and quantity). — Done
- [ ] **Margins per size.** `verify:live` prints margin after Stripe fees for each size. XL can cost more at Printful on some garments; add a size upcharge if any size is thin (the model supports per-variant `priceCents`). — You decide, Claude builds
- [ ] **Taxes.** Turn on Stripe Tax (GST/HST/PST for Canada; US sales tax if you ship there). Decide whether prices are tax-inclusive. Check whether you must register for GST/HST (the $30k small-supplier threshold). — You
- [ ] **US duties and taxes.** US shipping is on. Confirm with Printful how duties/taxes are handled for CA→US and US→CA orders (Printful ships from facilities in both countries) and whether you must collect state sales tax (economic nexus thresholds). — You
- [ ] **Stripe account:** business details, payout bank account, statement descriptor ("TERRY TIME"), receipt emails with your branding, live-mode keys. — You
- [ ] **Printful account:** payment method on file (it bills you when an order is confirmed), packing slip branding (your logo, return address), "Terry Time" as the store name. — You

## C. Real-money test (before announcing anything)

- [ ] Place **3 real orders** (one hoodie, one polo, one hat; mixed sizes) with `PRINTFUL_AUTO_CONFIRM` off, so orders land as Printful drafts. Check: right size, artwork present, address, quantity, cost. — You
- [ ] Confirm one order and let it ship to a friend; time production plus delivery for the site copy. — You
- [ ] Test the declined card, the cancel (lands back on the store you were on), and a US address. — You
- [ ] Refund a test order in Stripe and cancel the matching Printful order. — You
- [ ] Test the **Stripe webhook failing** (turn off the secret briefly): confirm you'd notice and can recover a paid-but-unfulfilled order. Set up Stripe email alerts for failed webhook deliveries. — You + Claude
- [ ] Set `PRINTFUL_AUTO_CONFIRM=true` only once these pass. — You

## D. Content and pages the store legally or practically needs

- [ ] Final copy from `copy-deck.md`. Rewrite the customer-facing "set STRIPE_SECRET_KEY" error, the "on the way" success text and the old "sticker and merch" meta text. — You edit, Claude applies
- [ ] **Shipping & Returns, Sizing guide, Privacy, Terms, Contact** pages (`site-pages.md`). Sizing needs real garment measurements from Printful's size guides. — Claude drafts, You review
- [ ] Footer links to those pages on both stores and Lifestyle. — Claude
- [ ] **Individual product pages** (fabric, fit, care, more photos, size guide link). Highest-value addition after the legal pages. — Claude
- [ ] Newsletter live and a signup form on both stores; welcome email written. — Claude + You
- [ ] Support inbox and a returns/reship policy you can actually honour. — You

## E. Photography and assets

- [ ] **Lifestyle shoot** using the shot list (6 must-have shots). — You
- [ ] Order a sample of each product first (also needed for the shoot and for checking quality). — You
- [ ] Open Graph / social share image (1200×630) per store. — Claude, with your photos
- [ ] Drop the new photos in and I'll expand `/lifestyle` from 3 to 6 chapters. — Claude
- [ ] Favicon check on real devices (tab, iOS home screen, Android). — You

## F. Analytics, SEO, quality

- [ ] **Cookie-free analytics** (Plausible or Vercel Analytics) with per-store events: store viewed, size selected, checkout started, purchase. The A/B test needs this to mean anything. — Claude, with your account
- [ ] Sitemap, robots, canonical URLs, `Product` JSON-LD on product pages. — Claude
- [ ] **Domain: terryterrylarryberry.com (root).** Add it to the Vercel project, set DNS (A record to Vercel, plus `www` redirecting to the root), confirm HTTPS, set `NEXT_PUBLIC_SITE_URL` in Production. `metadataBase`, robots.txt and sitemap.xml already point at it. — You
- [ ] Accessibility pass: contrast of the small blue mono text, focus rings, size picker with a screen reader. — Claude
- [ ] Mobile pass on real phones (the size picker and receipt layout especially). — You + Claude
- [ ] Rate limiting / bot protection on `/api/checkout` and `/api/subscribe` (Vercel firewall or a simple limiter) so nobody can spam Stripe sessions. — Claude

## G. Launch day and after

- [ ] Final `npm run verify:live -- --site https://<domain>` with no FAIL. — You
- [ ] Switch Stripe to live keys and re-register the live webhook (test and live have separate secrets). — You
- [ ] Schedule the email, posts and launch article (`launch-roadmap.md`). — You
- [ ] Watch Printful drafts and Stripe payments twice a day for the first week. — You
- [ ] After enough traffic (about 300+ visitors per store and the promo over), read the A/B result and pick a winner. Then I'll make the winner the default and remove the split. — You + Claude

## Decisions (answered Oct 1)

- Ship to **Canada and the US**, shipping priced per location.
- Sizes: **S–XL** (no 2XL+). Hat is one size with no picker.
- Production domain: **terryterrylarryberry.com** (root).

## Still open

1. Shipping on top of Printful's rate: at cost, with a buffer, or free over a threshold?
2. Launch discount, or none (recommended: none)?
3. Sales tax approach (Stripe Tax on or off, GST/HST registration status).
