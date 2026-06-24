# Moobits — PRD

## Original Problem Statement
Bilingual (ID default / ENG) website for **Moobits**, homemade sweet treats (Cookies, Bolu Mini, Bolu BIG, Brownies). Phase 1 = landing + catalog. Phase 2 = order builder + invoice + WhatsApp. Phase 3 = admin dashboard + DB + order management. Phase 4 = final polish (loyalty card, policy pages, disclaimers, SEO, image transparency, WhatsApp click tracking).

## Architecture
- **Frontend**: React 19 + React Router 7 + Tailwind. State via Context (Lang, Cart, Auth). Axios w/ `withCredentials`. html2canvas + jspdf for invoice export. qrcode.react for placeholder QR.
- **Backend**: FastAPI + Motor (MongoDB). JWT cookie auth (single seeded admin). CRUD for products / promos / FAQ / settings / orders. CSV export. Resend email notification on new order (no-op if RESEND_API_KEY empty).
- **Database**: MongoDB. Collections: users, products, promos, orders, faq, site_settings, invoice_settings, login_attempts.

## Pages
**Public**: `/` Home (Hero, About, New Menu, Bundle, Best Seller, Why, Categories, Promo, **Loyalty Card**, Final CTA), `/about`, `/menu` (+ Disclaimer card), `/order-guide` (+ Loyalty compact), `/faq`, `/order` (+ Disclaimer), `/bulk-order`, `/policy` (Terms + Refund — NEW Phase 4).
**Admin**: `/admin` (login), `/admin/dashboard|products|orders|promos|invoice-settings|faq|settings`.

## Phase Status (2025-12)
- **Phase 1**: 59/59 frontend tests passed.
- **Phase 2**: 97% passed; medium bug fixed (native `required` no longer blocked custom validator).
- **Phase 3**: full admin + DB shipped; CSV export route ordering bug FIXED (Phase 4).
- **Phase 4**: image transparency (`mix-blend-mode: screen` on all product images), loyalty stamp card section (Home + Order Guide), bilingual policy page (Terms & Refund), disclaimer card (allergen + homemade) on Menu / Order pages, SEO meta (title + description + OG + Twitter Card), WhatsApp click tracking (PostHog `whatsapp_click` event + gtag fallback), all bolu/brownies now use real photos.

## Backend API
- Auth: `/api/auth/login|logout|me|refresh`
- Public: `/api/products`, `/api/promos`, `/api/faq`, `/api/settings/site`, `/api/settings/invoice`, `POST /api/orders`
- Admin: `/api/admin/products|promos|orders|orders-export.csv|faq|settings/site|settings/invoice|stats` (all gated by JWT cookie)

## Defaults Seeded
- Admin: `admin@moobits.id / moobits2026` (env-overridable)
- 14 products + 2 promos + 12 FAQ + site/invoice settings.

## Test Credentials
See `/app/memory/test_credentials.md`.

## Prioritised Backlog
- **P0**: Dark mode (deferred — needs warm cream/brown theme CSS variables work).
- **P0**: Real Resend send (works once `RESEND_API_KEY` is set in `/app/backend/.env`).
- **P1**: Real QRIS image upload by admin (UI exists; needs final QRIS file from user).
- **P1**: XML sitemap + Google Search Console verification meta.
- **P2**: Customer-side order tracking via shareable invoice URL.

## Next Tasks
- Set `RESEND_API_KEY` env to activate email notifications.
- Add real QRIS image via Admin → Invoice Settings.
- Iterate on dark mode CSS when ready.
