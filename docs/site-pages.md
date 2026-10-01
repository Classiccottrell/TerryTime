# Suggested Additional Site Pages

Ordered by launch priority. **Must** = needed to sell legally/credibly; **Should** =
lifts conversion; **Later** = growth.

## Must have before launch

| Page | Route | Purpose / contents |
| --- | --- | --- |
| Shipping & Returns | `/shipping` | Made-to-order timeline (2–7 days production + 5–10 shipping), CA/US only, cost, duties/taxes, how to report a defect (Printful reprints misprints), no returns for wrong size unless you decide otherwise. State it plainly: apparel printed to order can't be resold. |
| Sizing guide | `/sizing` | Measurement tables for each garment (from Printful size guides), fit notes (hoodie runs oversized, polo regular). Link from every product. |
| Privacy Policy | `/privacy` | What Stripe, Printful, the newsletter provider and analytics collect (required under PIPEDA / CASL; Canada). |
| Terms of Sale | `/terms` | Prices in CAD, made-to-order, governing law (BC), liability. |
| Contact | `/contact` | Support email/form, response time, social links. |
| Product pages | `/shop/[slug]` | Today each store lists products only on the grid. Individual pages give fabric, fit, care, size picker, more photos, schema.org markup, and a share target for social posts. This is the highest value addition. |

## Should have (launch month)

| Page | Route | Purpose |
| --- | --- | --- |
| About / The Collective | `/about` | Who Terry is, the East Van story, why print-on-demand. Pairs with the "story of the face" article. |
| Journal | `/journal` | Home for the launch articles; feeds SEO and the newsletter. Could mirror Substack posts. |
| Newsletter signup page | `/join` | Dedicated link for bios and QR codes; the API route already exists (`/api/subscribe`). |
| FAQ | `/faq` | Shipping times, sizing, materials, "is it really made in…?", international, gifting. Cuts support emails. |
| Care guide | `/care` | Washing embroidered cotton. Good evergreen SEO and builds trust. |
| Order status | `/orders` | Lookup by email + order number, or link to Printful tracking. Reduces "where's my order" mail. |
| Gift page | `/gifts` | Bundles (hat + polo), gift note, last-order-by date for the holidays. |

## Later

| Page | Purpose |
| --- | --- |
| Wall map (`/walls`) | Interactive map of the East Van walls where Terry appears; ties lifestyle photography to location and local pride. |
| Customer gallery (`/worn`) | UGC wall with permission; solves the missing-lifestyle-photo problem over time. |
| Press kit (`/press`) | Logos, 3 photos, 50-word and 200-word bios, contact. Makes journalists' jobs easy. |
| Wholesale / collab (`/collab`) | Local shops and creators who want to stock or collaborate. |
| Stockists / pop-ups (`/find-us`) | Market dates, where to try things on. |
| Drops archive (`/drops`) | History of releases once there's more than three products. |
| Accessibility statement | Short page on keyboard/contrast support and how to report issues. |

## Site-level improvements that go with these

- Footer on both stores linking Shipping, Sizing, Privacy, Terms, Contact (currently the footers have no legal/support links).
- `sitemap.xml`, `robots.txt`, Open Graph/Twitter image per page, JSON-LD `Product` on product pages.
- Cookie-free analytics so no consent banner is needed.
- Optional: size and colour variants on products (blocker for apparel; see roadmap risks).
