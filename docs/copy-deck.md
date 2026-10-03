# Terry Time — Launch Copy Deck

Every user-facing string on the two launch stores, as it ships today. Edit the
**Your edit** column (or overwrite the current text) and hand the file back;
each string maps 1:1 to a spot in the code. `{…}` marks live data.

Store A = **Street Evidence Archive** (`/shop/archive`). Store B = **Corner Store
Receipt** (`/shop/receipt`). Visitors are split 50/50 and never see the other store.

---

## 0. Shared

| Where | Current | Your edit |
| --- | --- | --- |
| Browser title (default) | TerryTime Shop | |
| Title template | {page} · TerryTime | |
| Meta description | TerryTime sticker and merch shop — real Printful stock, Stripe checkout. | |
| Nav brand | Terry Time / {Archive or Receipt} | |
| Nav links | Shop · Lifestyle | |
| Buy button | Buy — {price} | |
| Buy button (loading) | Starting… | |
| Buy button (static preview) | Checkout runs on the live site. | |
| Error: checkout down | Checkout isn't live yet — set STRIPE_SECRET_KEY to enable it. Drops are announced to the collective first. *(customer-facing: rewrite before launch)* | |
| Error: Stripe failure | Couldn't start checkout. Try again in a moment. | |
| Error: network | Network error. Try again. | |
| Canceled banner | **Checkout canceled.** No charge — take your time. | |
| Shipping option label (Stripe) | Standard shipping · est. {n–m} business days | |
| Size picker label | Size · S / M / L / XL (hat: none) | |
| Shipping quote line | Shipping {$} · est. {n–m} business days · Total {$} CAD | |
| Buy button states | Select a size → Buy — {price} → Starting… (then Stripe, which shows shipping) | |
| Size not linked | That size isn't available right now. Try another or check back soon. | |

> The meta description still says "sticker and merch"; the catalog is apparel only now.
> Suggested: "Embroidered East Van apparel. Polo, hoodie and dad hat. Printed to order."

## 1. Products (used by both stores and Lifestyle)

| Product | Name | Blurb (current) | Your edit |
| --- | --- | --- | --- |
| Polo — $37.83 CAD | Unisex Pique Polo Shirt | Pique-knit, black. The face rides quiet until someone gets close enough to read it. | |
| Hoodie — $47.58 CAD | Unisex Hoodie | Heavyweight, black. Built for East Van nights, not the studio. | |
| Dad hat — $36.53 CAD | Organic Dad Hat | Organic cotton, black. Low profile, permanent signal. | |

Design credit on every product: "Terry the Sketcher".

## 2. Store A — Street Evidence Archive

| Section | Current | Your edit |
| --- | --- | --- |
| Page title | Street Evidence Archive | |
| Meta description | A documentary Terry Time catalog from East Vancouver. | |
| Masthead, left | Municipal file / public circulation · Department of recurring faces | |
| H1 | Street Evidence Archive | |
| Masthead, right | CASE 003 · STATUS / ACTIVE · ORIGIN / EAST VAN | |
| Section A heading | A / Source Material | |
| Section A sub | Collected without polish. Filed without permission. | |
| Photo 1 | EV-210820-A — Uncommissioned wall face, East Vancouver | |
| Photo 2 | EV-210720-B — Hedge portrait, subject known locally | |
| Photo 3 | EV-SKY-003 — Dusk line, observed from the neighbourhood | |
| Photo footer | AUTHENTICITY / UNDISPUTED | |
| Section B heading | B / Material Exhibits | |
| Section B sub | Three approved objects. Local photography retained as evidence. | |
| Exhibit label | EXHIBIT 001 / 002 / 003 | |
| Object line | Object / {product id} | |
| Spec rows | Condition: Ready for circulation · Marking: Embroidered Terry face · Finish: {Black} · Value: {$} CAD | |
| Stamp | CLEARED TO WEAR | |
| Footer | File remains open. Terry keeps appearing. | |
| Footer link | After hours ↗ | |

## 3. Store B — Corner Store Receipt

| Section | Current | Your edit |
| --- | --- | --- |
| Page title | Corner Store Receipt | |
| Meta description | Terry Time goods rung up on one long thermal receipt from East Vancouver. | |
| Kicker | Store 07 / East Van *(the "07" is left over from the 7-store round; suggest "Corner store / East Van")* | |
| H1 | Rung up in East Van. | |
| Lede | Thermal paper fades in a week. The list on it stays honest: what you took, what it cost, nothing else. So this store is one long receipt. Tear off what you want. | |
| Link | Read the tape ↓ | |
| Sign | Open · Printed to order | |
| Printer strip | REG 07 · 80MM | |
| Receipt header | Terry Time Corner Store · East Vancouver, BC · Reg 07 / Cashier: Terry | |
| Line item meta | {Black} / Design: Terry the Sketcher | |
| Totals | Items on the shelf: 3 · Whole shelf: ${sum} | |
| Note | Each item checks out on its own. Prices in CAD. | |
| Sign-off | Thank you. Come again. | |
| Footer | Paper fades. The face stays. | |
| Footer, right | Terry Terry Larry Berry · After hours ↗ | |

## 4. Lifestyle — "After hours" (`/lifestyle`, linked from both stores)

| Section | Current | Your edit |
| --- | --- | --- |
| Page title / meta | Lifestyle — After hours in East Vancouver: three hours from the camera roll, and what to wear for each. | |
| Kicker | Lifestyle / After hours | |
| H1 | After hours. | |
| Lede | The shift ends. The phone goes in the pocket. East Van gets quieter and the walls get louder. Terry Time is the hours after the day job, when the making happens. Here are three of those hours, pulled from the camera roll, and what to wear for each. | |
| 18:51 "Clock out." → Polo | Golden hour on the east side. The hedges are taller than you and still holding the day's heat. Nobody is watching, which is the point. Wear something that doesn't need to explain itself. | |
| Dusk "Last light." → Hoodie | The towers switch on one floor at a time and the clouds do most of the work. The temperature drops fast. A shirt stops being enough, so you reach for the heavy layer. | |
| 21:55 "Walls." → Dad hat | Street lights on. Someone drew a face on the utility box at the corner, somebody else tagged over it, and the hedge grew into both. Nobody planned the layers. Add a hat and keep walking. | |
| Kit label | Kit for {18:51 / dusk / 21:55} | |
| Coda | Clock out. Make something. · Back to the shop ↗ | |
| Footer | Terry Terry Larry Berry · Photographed in East Vancouver | |

## 5. Order confirmation (`/shop/success`)

| Current | Your edit |
| --- | --- |
| Order confirmed (kicker) | |
| It's yours. (H1) | |
| Your {item} is on the way. / Your order's in. It's on the way. | |
| A receipt is headed to your inbox. | |
| Back to the shop ↗ | |

> Accuracy flag: "on the way" is true only once Printful ships. Items are made to
> order, so suggest: "Your order's in. It's printed to order and ships in about a week."

## 6. Error pages (one template, Terry engraving on the right)

| Page | Current | Your edit |
| --- | --- | --- |
| 404 | Error 404 · **Nothing on this wall.** · This page got painted over, or it never went up. Terry's still around. · Back to the shop ↗ · After hours ↗ | |
| Runtime error (500) | Error 500 · **The ink ran.** · Something broke on our side, not yours. Try again; if it keeps happening, tell us. · Ref {code} · Try again ↻ · Back to the shop ↗ · Contact ↗ | |
| Whole-site failure | Error 500 · **The whole wall came down.** · The site hit an error it couldn't recover from. Reload, or come back in a minute. · Try again ↻ · Reload the shop ↗ | |
| Footer links (all pages) | Shipping & returns · Sizing · Contact · Privacy · Terms | |

## 7. Customer-information pages (two options each, drafts)

Each page exists twice: **Option A "Ledger"** at `/shipping`, `/sizing`, `/contact`,
`/privacy`, `/terms` (numbered clauses, case-file voice, matches Archive) and
**Option B "Plain talk"** at the same path plus `/b` (short Q&A, conversational,
matches Receipt). A draft bar at the top of each switches between them. Every
highlighted **TBD** is a fact I didn't have (email, legal name, duties, measurements,
policy decisions). Pick A or B per page (or mix), fill the TBDs, and I'll delete
the loser, remove the draft bar and add the page to the sitemap. Privacy and Terms
are templates, not legal advice: get them reviewed.

## 8. Copy that doesn't exist yet (needed before launch)

Shipping & returns · Sizing guide · Product detail (fabric, fit, care) · About /
the collective · Contact · Privacy & Terms · Newsletter signup line. Outlines in
`docs/site-pages.md`.
