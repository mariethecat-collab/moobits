# Moobits — PRD

## Original Problem Statement
Bilingual (ID default / ENG) website for **Moobits**, a homemade sweet treats brand (Cookies, Bolu Mini, Bolu BIG, Brownies). Premium, playful, warm, iOS-inspired bakery aesthetic. Phase 1 = landing + catalog. Phase 2 = lightweight order builder + branded invoice + QR placeholder + WhatsApp confirmation (no real checkout).

## Architecture
- **Frontend**: React 19 + React Router 7 + Tailwind + shadcn Accordion. State via Context (`LanguageContext`, `CartContext`). Static catalog from `/app/frontend/src/data/products.js`. Cart in localStorage `moobits_cart_v1`. Invoice number counter in localStorage `moobits_invoice_counter_YYYYMMDD`. PDF/Image export via `html2canvas` + `jspdf`. QR code via `qrcode.react`.
- **Backend**: FastAPI scaffolding kept (unused in Phase 1 + 2).
- **Database**: MongoDB scaffolding kept.

## Pages
- `/` Home — Hero · About Preview · New Menu (4 cookies, 20% off) · **Bundle (Rp41.400)** · Best Seller · Why Moobits · Category Preview · Promo · Final CTA.
- `/about`, `/menu` (filter tabs), `/order-guide`, `/faq`, `/bulk-order`, `/order` (new — Phase 2).
- Global cart drawer (slide-in from right), navbar cart badge, bilingual ID/EN toggle.

## Phase 2 Implementations (2025-12)
- ProductCard now has qty selector + **Add to Order** button (replaces single WA order).
- Cart drawer with images, qty controls, notes, remove, subtotal/discount/total.
- 4-Variant Cookie Bundle product (Rp41.400, 10% off, does NOT stack with 20%).
- `/order` page: review items, customer form (name, WA, pickup/delivery, address, date, payment method, greeting card, custom, notes, invoice status), order summary, 3 rule cards (Order/Delivery/Payment).
- Branded **Invoice** component: Moobits logo, tagline, MBT-YYYYMMDD-NNN number, status badge, per-item images, totals, QR code (placeholder for QRIS — "Isagizz Store"), payment deadline 1×24h, admin WA, thank-you note.
- Invoice actions: **Send to WhatsApp** (auto-fill multi-line message), **Download PDF**, **Download Image**.
- `/bulk-order`: form (name, WA, event type, qty, date, notes) → opens WA with bulk message; 8 rules sidebar.
- All Phase 2 copy fully bilingual.
- Validation: empty cart / missing required fields → custom error banner.

## Core Requirements (Static)
- Cookies-only 20% discount; bolu/brownies no discount; bundle 10% (non-stacking).
- WhatsApp number: `6283894855149`. All CTAs prefill bilingual messages.
- No real payment gateway, no admin dashboard, no auth, no checkout.
- 14 individual products + 1 cookie bundle.

## What's Been Implemented
- Phase 1 (59/59 tests passed)
- Phase 2 (97% pass — 1 medium bug fixed: native `required` no longer blocks JS validator).

## Prioritised Backlog (Phase 3+)
- **P0**: Admin dashboard for order management + invoice status updates + invoice numbering on server.
- **P0**: Real QRIS image upload (image swap path: `/app/frontend/src/components/Invoice.jsx` QR section).
- **P1**: Server-side persistent invoices (MongoDB) with shareable link.
- **P1**: Real Bolu BIG and Brownies product photography.
- **P1**: Loyalty card backend (currently manual via WhatsApp per user request).
- **P2**: SEO meta + Open Graph, hampers product line, customer testimonials when collected.

## Next Tasks
- Phase 3 scoping: admin dashboard + invoice DB + persistent loyalty + QRIS image upload UI.
