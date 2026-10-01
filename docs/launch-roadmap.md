# Terry Time — Launch Roadmap & Marketing Plan

Proposed dates assume today is **Thu Oct 1, 2026**. Everything is adjustable;
the order matters more than the dates. Holiday anchors: Black Friday Fri Nov 27,
Cyber Monday Nov 30. Confirm Printful's holiday shipping cutoffs in the dashboard
(usually mid-December for Canada/US) and print the final order-by date on the site.

## Goal and measures

- **Primary:** 25 paid orders in the first 30 days (3 SKUs, ~$35 average order, so roughly $900 revenue). Adjust to your real target.
- **A/B question:** which storefront, Archive or Receipt, converts better. Metric: checkout sessions created ÷ unique visitors, and paid ÷ sessions. Stripe sessions already carry `store` and `ab_variant` metadata.
- **Audience:** 150 newsletter signups before launch day. Ask for this first; it's the cheapest launch day buyer list.
- Need ~300+ visitors per store to see anything but noise. Don't call the A/B winner before that, and don't change either store mid-test.

## Phase 0 — Make it real (Oct 1–9)

| Task | Owner | Done when |
| --- | --- | --- |
| Review + merge the launch-ab-stores PR | You | Merged to main |
| Add `PRINTFUL_API_KEY`, `STRIPE_SECRET_KEY` (test), `STRIPE_WEBHOOK_SECRET` to the host | You | `npm run verify:live` has no FAIL |
| Run `npm run verify:live -- --discover`, paste `printfulSyncVariantId` into `lib/products.ts` | Claude + you | Orders created from sync variants |
| Check margin output (retail + shipping vs Printful cost) | You | Every SKU margin > 0 after Stripe fees (2.9% + 30¢) |
| Set `SHIPPING_FLAT_CENTS` from real Printful rates (CA and US differ) | You | Shipping covers cost |
| Order one of each sample, shot-list ready | You | Samples in hand |
| Final copy pass (`docs/copy-deck.md`) | You | Edited deck returned |
| Buy domain/DNS, deploy to Vercel/Netlify (static GH Pages can't run checkout) | You | Site live on the real domain |

## Phase 1 — Test with real money (Oct 10–16)

1. Switch Stripe to live keys; register the live webhook (`/api/webhook`, event `checkout.session.completed`).
2. Place 3 real orders yourself (one per SKU), `PRINTFUL_AUTO_CONFIRM=false` so they land as drafts. Check address, quantity, artwork files and cost in the Printful dashboard, then confirm one and let it ship to a friend.
3. Test on iPhone Safari, Android Chrome, desktop; test both stores via `/?v=a` and `/?v=b`.
4. Test the cancel flow, an out-of-region address (should be refused) and a declined card.
5. Add analytics (Plausible or Vercel Analytics; cookie-free is on-brand) and confirm per-store events.
6. Run the `ux-black-hat` / accessibility pass; fix contrast on the blue-on-paper small mono text.

## Phase 2 — Content build (Oct 10–29, parallel with Phase 1)

- Photo shoot (see `docs/lifestyle-photo-assessment.md`); select, edit, add alt text.
- Required pages live: Shipping & Returns, Sizing, About, Contact, Privacy, Terms (`docs/site-pages.md`).
- Newsletter live (`RESEND_API_KEY` + audience) with a "drop day" signup line on both stores. Put the signup in the Archive footer and the receipt tape footer.
- Open Graph images for every page (1200×630), Instagram bio link, link-in-bio page.
- Write the launch article and 8 pre-launch posts (below). Batch-shoot 10 short videos.
- Press/influencer list of 25 East Van and Vancouver names: illustrators, skate/art shops, zine makers, local newsletters, podcasts.

## Phase 3 — Teaser (Oct 26–Nov 11)

| Date | Beat |
| --- | --- |
| Oct 26 | "Terry is coming back" — the graffiti-face photo, no copy except the date. Newsletter signup. |
| Oct 29 | Soft launch to the collective / friends: unlisted URL, 20 early orders, collect feedback and photos from real buyers. |
| Nov 2–9 | Daily teaser: embroidery macro, hat on the utility box, polo reveal, hoodie reveal. 3 posts/week + stories daily. |
| Nov 10 | Countdown email: "Thursday." Early access for subscribers (private link `?v=` pinned to the winning store, or just a code). |

## Phase 4 — Launch (Thu Nov 12)

- **9:00 PT** email to the list; Instagram, TikTok, Threads, Bluesky posts and stories; pin the launch article.
- **Launch day offer:** free shipping over $60, or a first-50 numbered-edition note ("No. 07/50" in the order email). Pick one; don't stack discounts. Never discount below Printful cost + fees.
- Post a photo of the first real order (with permission) as social proof.
- Reply to every comment within the hour. Be at your phone.
- Check Printful draft orders twice a day and confirm them; check Stripe for failed webhooks.

## Phase 5 — Sustain and sell through holiday (Nov 13–Dec 20)

| Week | Beat |
| --- | --- |
| Nov 13–19 | Customer photos + UGC repost; first behind-the-design article; review A/B data (don't call it before ~300 visitors per store). |
| Nov 20–26 | Black Friday teaser: "no sale, just a drop": hoodie colourway or a sticker pack as an add-on (needs a new Printful SKU and its own photography). |
| Nov 27–30 | Black Friday / Cyber Monday: free shipping weekend, countdown to the order-by date. |
| Dec 1–14 | Gift guide post ("for the person who has everything but a face on their hat"); gift note field; local pop-up or market table if possible. |
| Dec ~12 | Last-order-by banner for Christmas delivery (per Printful's cutoffs). |
| Dec 20 | Wrap, thank-you email, post-mortem. Pick the winning store; archive the other. |

## A/B decision rule

Run both stores until each has ≥300 unique visitors **and** the launch promotion is over, or until Dec 14, whichever is later. Winner = higher paid-orders per visitor; if within noise, pick the one with higher average order value, then the one you prefer to maintain. Then: set the winner as `/shop` in `middleware.ts`, move the loser to a branch, drop the cookie logic.

## Social content plan

**Channels:** Instagram (primary: visuals, Reels), TikTok (process, East Van walks), Threads/Bluesky (voice, behind the scenes), newsletter (owned audience). Skip the rest until these run.

**Pillars (rotate):**
1. *The face:* Terry on walls, hats, embroidery macros. Short, no talking.
2. *After hours:* the lifestyle series, one chapter per post, same timestamp format as the site (18:51, Dusk, 21:55).
3. *Making:* sketch to embroidery file to finished hat. 15–30s timelapse.
4. *East Van:* maps, corner stores, the receipt joke ("rung up at the corner store").
5. *Proof:* buyers wearing it, order notifications, packages.

**8 pre-launch post ideas**
1. The wall: graffiti-face photo, caption "He was here first." + date.
2. Embroidery macro on the hat, no caption but "Thread count: all of it."
3. Receipt joke: a real corner-store receipt photo with "Coming soon: the shop that works like this."
4. Polo reveal: quiet logo, "reads up close."
5. Hoodie reveal at dusk; "Built for East Van nights."
6. A sketch to stitch timelapse.
7. Poll: "Archive or Receipt?" (Instagram story). Don't reveal that the A/B is real, or do, as a fun beat: "We built two shops. You'll only see one." Either works; the second is a good hook.
8. Countdown graphic: "Thursday."

**Launch week reels:** (a) 20s walk-through wearing all three; (b) hat unboxing; (c) "how a Terry gets made"; (d) POV putting on the hoodie in the cold.

## Article and SEO plan

Publish on the main site/Substack (the classiccottrell.ca site already links Substack). Aim for one cornerstone and three supporting pieces by launch.

1. **Cornerstone: "Why we built two stores and let you pick without knowing."** The A/B story as a design-process essay. Shareable with designers/dev crowd; links to the shop.
2. **"After hours: three hours in East Van and what to wear for each."** Lifestyle page expanded as an article, with the photo series.
3. **"The story of the Terry face."** Origin of the character and the utility-box wall. The thing local press will link to.
4. **"How embroidered merch is made (print-on-demand, honestly)."** Transparency piece: Printful, made to order, why it ships in ~a week. Builds trust and pre-answers support questions.
5. Later: gift guide, care guide (how to wash embroidered cotton), customer-photo roundup.

Target keywords (low competition, local): "East Vancouver art apparel", "Vancouver artist embroidered hat", "East Van clothing brand", "organic dad hat Canada". Add `Product` JSON-LD (name, price, CAD, availability, image) to both stores and a sitemap + robots.

## Press, partnerships, community

- Pitch 10 local outlets/newsletters (Vancouver Is Awesome, Georgia Straight, Daily Hive, Scout, local art blogs): angle "an East Van artist's character, from utility box to embroidered merch". Include 3 photos and a 50-word blurb.
- Seed 8–10 free units to local creators who fit the vibe; no required posting, ask for honest content.
- Put stickers/postcards (cheap to print locally) with a QR to the shop in local cafés, record shops and skate shops.
- Pop-up: one market table in November (Eastside Flea, a studio open house) to turn the real-life wall into customers.
- Tag-and-win: post a photo wearing Terry gear → featured on the lifestyle page (this feeds the missing photography).

## Email sequence (Resend/Buttondown)

1. Welcome (immediate): who Terry is, what's coming, date.
2. Teaser (Nov 5): hat macro + polo reveal.
3. Early-access (Nov 10): "Thursday, 9am, you get in first."
4. Launch (Nov 12): links to the shop, shipping/return note, offer.
5. Reminder (Nov 14): "Still here" with a customer photo.
6. Post-purchase: thanks, "show us how you wear it", order-by dates.
7. Black Friday (Nov 26 + 29).

## Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Orders fail to reach Printful (webhook down) | Webhook logs loudly; add Stripe failed-delivery alerts and check Printful drafts daily. Add retry/queue if volume grows. |
| Shipping underpriced → loses money | Real rate review, `SHIPPING_FLAT_CENTS`, margin shown by `verify:live`. |
| Wrong item/size shipped | Variants today are single colour/size ("Black") with no size picker, which is a blocker: apparel needs sizes. **Add size variants before launch.** |
| Tax / duties | Canadian GST/HST/PST, US sales tax, customs. Turn on Stripe Tax and decide on DDP with Printful. |
| Copy that says "on the way" before it's printed | Fix per `copy-deck.md` §5. |
| A/B split can contaminate | Cookie pins visitors for 30 days; links with `?v=` are for paid/specific posts. |
| Few visitors → no A/B signal | Be honest about it; if traffic is low, choose by preference. |

## Pre-launch checklist (go/no-go)

- [ ] `npm run verify:live -- --site https://<domain>` has no FAIL
- [ ] Live Stripe keys, live webhook, one real end-to-end order shipped
- [ ] Size variants added; sizing guide linked from each product
- [ ] Shipping, Returns, Privacy, Terms pages live
- [ ] Taxes decided and configured
- [ ] Analytics tracking per store
- [ ] Newsletter capture working; welcome email sent
- [ ] OG images, favicon, sitemap, robots
- [ ] Customer-facing error text rewritten (no "set STRIPE_SECRET_KEY")
- [ ] Support inbox monitored; returns process written
