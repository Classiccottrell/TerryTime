# Go-Live To-Do List

Ordered by dependency. **You** = needs your accounts, keys, money or decisions.
**Claude** = I can do it once the input is there. Check items off as you go.
Companion docs: `launch-roadmap.md` (timeline and marketing), `copy-deck.md` (text),
`site-pages.md` (new pages), `lifestyle-photo-assessment.md` (shot list).

## A. Blockers: nothing can be sold until these are done

- [ ] **Merge PR #11** into main (A/B stores, sizes, favicon, tooling). — You
- [ ] **Deploy to a server host, not GitHub Pages.** Vercel already builds previews; point the production domain at it. Checkout, the webhook and the A/B middleware need a server. — You
- [ ] **Add env vars on the host:** `PRINTFUL_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`, `SHIPPING_FLAT_CENTS`, `RESEND_API_KEY` + `RESEND_AUDIENCE_ID`. Start with **Stripe test keys**. — You
- [ ] **Create every size in the Printful store.** The Terry Store needs Polo S–2XL, Hoodie S–2XL and Dad Hat (one size) as sync products with the Terry face artwork on each. Product names must contain "Pique Polo", "Hoodie" and "Dad Hat". — You
- [ ] **Run `npm run sync:printful`**, commit the generated `lib/printful-map.mjs`. Until then every size is unsellable (checkout refuses with "That size isn't available"). Any ✗ it prints is a naming or size mismatch to fix in Printful. — Claude + You
- [ ] **Run `npm run verify:live`** and get zero FAIL. It checks auth, every size is linked, stock, per-size margin, a test Checkout Session, and the webhook. — Claude + You
- [ ] **Register the Stripe webhook** at `https://<domain>/api/webhook` for `checkout.session.completed`, put the signing secret in `STRIPE_WEBHOOK_SECRET`. — You

## B. Money: get these right before real customers

- [ ] **Shipping price.** Default is a flat $12.95 CAD for everyone. Compare against real Printful rates for CA and US (they differ) and for hoodies vs hats; consider per-country rates or free shipping over a threshold. — You decide, Claude builds
- [ ] **Margins per size.** `verify:live` prints margin after Stripe fees for each size. 2XL costs more at Printful on most garments; add a size upcharge if any size is thin (the model supports per-variant `priceCents`). — You decide, Claude builds
- [ ] **Taxes.** Turn on Stripe Tax (GST/HST/PST for Canada; US sales tax if you ship there). Decide whether prices are tax-inclusive. Check whether you must register for GST/HST (the $30k small-supplier threshold). — You
- [ ] **US shipping and duties.** Decide whether to keep selling to the US (Printful can bill duties; US buyers may owe import fees). Otherwise restrict to Canada. — You
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
- [ ] Domain: pick the production domain (the code assumes terryterrylarryberry.com in `metadataBase`), set DNS and HTTPS. — You
- [ ] Accessibility pass: contrast of the small blue mono text, focus rings, size picker with a screen reader. — Claude
- [ ] Mobile pass on real phones (the size picker and receipt layout especially). — You + Claude
- [ ] Rate limiting / bot protection on `/api/checkout` and `/api/subscribe` (Vercel firewall or a simple limiter) so nobody can spam Stripe sessions. — Claude

## G. Launch day and after

- [ ] Final `npm run verify:live -- --site https://<domain>` with no FAIL. — You
- [ ] Switch Stripe to live keys and re-register the live webhook (test and live have separate secrets). — You
- [ ] Schedule the email, posts and launch article (`launch-roadmap.md`). — You
- [ ] Watch Printful drafts and Stripe payments twice a day for the first week. — You
- [ ] After enough traffic (about 300+ visitors per store and the promo over), read the A/B result and pick a winner. Then I'll make the winner the default and remove the split. — You + Claude

## Decisions I need from you

1. Ship to the US as well as Canada? (affects shipping, duties and taxes)
2. Flat shipping or per-country rates? What number?
3. Sizes: stop at 2XL, or add 3XL+ (Printful offers more on the hoodie)?
4. Launch discount, or none (recommended: none, free-shipping threshold instead)?
5. Which domain is production?
