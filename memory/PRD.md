# Moobits — PRD (Phase 1)

## Original Problem Statement
Build a polished bilingual (ID default / ENG toggle) landing + catalog website for **Moobits**, a homemade sweet treats brand (Cookies, Bolu Mini, Bolu BIG, Brownies). Premium, playful, warm, iOS-inspired bakery aesthetic. No checkout/cart/admin in Phase 1.

## Architecture
- **Frontend**: React 19 + React Router 7 + Tailwind CSS + shadcn Accordion. Static catalog from `/app/frontend/src/data/products.js`. Bilingual via `LanguageContext` (localStorage `moobits_lang`).
- **Backend**: FastAPI scaffolding kept untouched (not used in Phase 1).
- **Database**: MongoDB scaffolding kept untouched.

## Pages & Sections (Implemented · 2025-12)
- `/` Home — Hero · About Preview · New Menu (4 cookie cards w/ 20% discount + strikethrough) · Best Seller (2 bolu mini) · Why Moobits (3 cards) · Category Preview (4 cards) · Promo Banner · Final CTA.
- `/about` About — story, 5 value cards, Order CTA.
- `/menu` Catalog — filter tabs (All/Cookies/Bolu Mini/Bolu BIG/Brownies), 14 products grid, "Good to know" info block.
- `/order-guide` Order Guide — 7-step timeline + Pre-Order Rules.
- `/faq` FAQ — 12 accordion items + "Still curious?" WA CTA.
- Footer — contact (WA 083894855149, email, IG @mooobits, area Sunter, hours 07.00–17.00).

## Core Requirements (Static)
- Bilingual ID/EN toggle (default ID); localStorage persistence.
- WhatsApp CTAs everywhere → `https://wa.me/6283894855149` with prefilled bilingual message.
- Cookies-only 20% discount; bolu/brownies no discount.
- All uploaded product images used as-is; bolu/brownies use inline SVG illustrations (no stock photos).
- iOS-inspired Outfit + Plus Jakarta Sans fonts, white bg with cookie-accent palette, "Dark Jewel Box" product cards.

## User Personas
- Indonesian sweet-treat customer browsing on mobile, ordering via WhatsApp pre-order.
- English-speaking visitor (expat / gift sender) exploring Moobits catalog.

## What's Been Implemented (2025-12)
- Phase 1 MVP complete; 59/59 frontend tests passed.
- All 14 products listed, prices correct, discounts applied only to cookies.
- Sticky glassmorphism navbar with language switcher & mobile drawer.
- Fully bilingual (Home, About, Menu, Order Guide, FAQ, Footer, product cards).

## Prioritised Backlog (Phase 2+)
- **P0**: WhatsApp order builder (multi-item summary auto-message), greeting card request field.
- **P1**: Real product photography for Bolu Mini, Bolu BIG, Brownies. Bundling 4-cookie variant SKU.
- **P1**: Cart + Stripe/Midtrans checkout. Invoice/admin dashboard.
- **P2**: Hampers / gift packaging product line, customer testimonials (real), legal/halal certificate display once obtained.
- **P2**: Production-schedule banner (next pre-order open date), pickup/delivery cut-off countdown.
- **P2**: SEO meta + Open Graph for shareability.

## Next Tasks
- Collect remaining product photography.
- Phase 2 scoping: cart/checkout + admin order management.
