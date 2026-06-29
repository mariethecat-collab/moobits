import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Leaf,
  Heart,
  Cookie,
  Package,
  Check,
} from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import {
  products,
  CATEGORIES,
  COOKIE_BUNDLE,
  buildGenericWa,
  buildWaLink,
  LOGO_URL,
  formatIDR,
} from "../data/products";
import ProductCard from "../components/ProductCard";
import CategoryIllustration from "../components/CategoryIllustration";
import LoyaltyCard from "../components/LoyaltyCard";
import { useCart } from "../cart/CartContext";

const Eyebrow = ({ children, color = "#8D5B4C" }) => (
  <div
    className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em]"
    style={{ color }}
  >
    <span className="h-1 w-6 rounded-full" style={{ background: color }} />
    {children}
  </div>
);

const SectionTitle = ({ eyebrow, title, sub, color, align = "left" }) => (
  <div
    className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""
      }`}
  >
    {eyebrow && <Eyebrow color={color}>{eyebrow}</Eyebrow>}
    <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#121212]">
      {title}
    </h2>
    {sub && (
      <p className="mt-4 text-[16px] sm:text-[17px] leading-relaxed text-[#525252]">
        {sub}
      </p>
    )}
  </div>
);

export default function Home() {
  const { t, lang } = useLang();
  const { addItem } = useCart();
  const cookies = products.filter((p) => p.category === "Cookies");
  const bestSellers = products.filter(
    (p) =>
      (p.id === "bm-ketan-hitam-lumer" || p.id === "bm-pandan-lumer")
  );

  // Pick one representative image per category
  const getProductImage = (id) => products.find((p) => p.id === id)?.image;
  const categoryReps = {
    Cookies: { type: "image", src: getProductImage("classic-og"), accent: "#8D5B4C" },
    "Bolu Mini": { type: "image", src: getProductImage("bm-ketan-hitam-lumer"), accent: "#86A789" },
    "Bolu BIG": { type: "image", src: getProductImage("bb-pandan-lumer"), accent: "#3A2A2E" },
    Brownies: { type: "image", src: getProductImage("br-keju-full"), accent: "#3F2418" },
  };

  return (
    <div data-testid="page-home">
      {/* ===================== HERO ===================== */}
      <section className="relative overflow-hidden">
        {/* Soft cream backdrop blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-[#FCD34D]/15 blur-3xl" />
          <div className="absolute top-1/3 -left-20 h-[360px] w-[360px] rounded-full bg-[#8D5B4C]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-10 md:pt-20 pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Copy */}
            <div className="lg:col-span-6">
              <Eyebrow>{t.hero.eyebrow}</Eyebrow>
              <h1 className="mt-5 font-display text-[40px] sm:text-5xl lg:text-[64px] leading-[1.05] font-bold tracking-tight text-[#121212]">
                Treat Yourself,{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Fix Your Mood.</span>
                  <span className="absolute left-0 bottom-1 h-3 w-full bg-[#FCD34D]/60 rounded-md -z-0" />
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-[16px] sm:text-[17px] leading-relaxed text-[#525252]">
                {t.hero.sub}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a
                  href={buildGenericWa(lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="hero-primary-cta"
                  className="inline-flex items-center gap-2 rounded-full bg-[#FCD34D] px-6 py-3.5 text-[15px] font-semibold text-[#121212] transition-all duration-200 hover:bg-[#121212] hover:text-white active:scale-[0.97] shadow-sm"
                >
                  {t.hero.primaryCta}
                  <ArrowUpRight size={16} />
                </a>
                <Link
                  to="/menu"
                  data-testid="hero-secondary-cta"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-[#121212] ring-1 ring-black/10 transition-all duration-200 hover:bg-[#FCD34D] active:scale-[0.97]"
                >
                  {t.hero.secondaryCta}
                  <ArrowRight size={16} />
                </Link>
              </div>

              <div className="mt-6 inline-flex items-center gap-2 text-[12.5px] text-[#737373]">
                <Sparkles size={14} className="text-[#8D5B4C]" />
                {t.common.preOrderNote}
              </div>
            </div>

            {/* Visual: Cookie showcase */}
            <div className="lg:col-span-6 relative">
              <div className="relative aspect-square sm:aspect-[5/4] lg:aspect-square w-full max-w-[560px] mx-auto">
                <div className="absolute inset-0 rounded-[2.5rem] bg-white overflow-hidden ring-1 ring-black/5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]">
                  {/* 2x2 Cookie Grid */}
                  <div className="absolute inset-0 p-6 grid grid-cols-2 gap-4">
                    {cookies.slice(0, 4).map((cookie, index) => (
                      <div
                        key={cookie.id}
                        className="flex items-center justify-center overflow-visible"
                      >
                        <img
                          src={cookie.image}
                          alt={cookie.name}
                          className={`w-full h-full object-contain float-${(index % 4) + 1
                            }`}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Floating tag */}
                  <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#9B2C2C]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#9B2C2C]" />
                    20% Off · Cookies
                  </div>

                  <div className="absolute bottom-5 right-5 rounded-2xl bg-white/95 px-4 py-3 text-left max-w-[60%]">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#8D5B4C] font-bold">
                      4 New Variants
                    </div>
                    <div className="mt-1 font-display text-[15px] font-semibold text-[#121212] leading-tight">
                      Chewy. Bold. Playful.
                    </div>
                  </div>
                </div>

                {/* Floating cookie chip badge */}
                <div className="absolute -bottom-6 -left-3 sm:-left-6 rounded-[1.5rem] bg-white ring-1 ring-black/5 shadow-lg p-3 pl-2 pr-4 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-transperent">
                    <img
                      src={LOGO_URL}
                      alt="logo"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#8D5B4C] font-bold">
                      Homemade
                    </div>
                    <div className="font-display font-semibold text-[14px] text-[#121212] leading-tight">
                      Fresh by Order
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ABOUT PREVIEW ===================== */}
      <section className="relative py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-7">
              <Eyebrow>{t.aboutPreview.eyebrow}</Eyebrow>
              <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#121212]">
                {t.aboutPreview.title}
              </h2>
              <p className="mt-5 text-[16px] sm:text-[17px] leading-relaxed text-[#525252] max-w-2xl">
                {t.aboutPreview.body}
              </p>
              <Link
                to="/about"
                data-testid="about-preview-cta"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[14px] font-semibold text-[#121212] ring-1 ring-black/10 hover:bg-[#FCD34D] transition-colors"
              >
                {t.aboutPreview.cta}
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="md:col-span-5">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { t: "Homemade", a: "#8D5B4C" },
                  { t: "Fresh by Order", a: "#86A789" },
                  { t: "Daily Treats", a: "#FCD34D" },
                  { t: "Mood Booster", a: "#9B2C2C" },
                ].map((c) => (
                  <div
                    key={c.t}
                    className="rounded-2xl bg-[#FDFBF7] p-4 ring-1 ring-black/5"
                  >
                    <span
                      className="block h-1.5 w-8 rounded-full"
                      style={{ background: c.a }}
                    />
                    <div className="mt-3 font-display font-semibold text-[15px] text-[#121212]">
                      {c.t}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== NEW MENU: COOKIES ===================== */}
      <section className="py-16 md:py-24 bg-transparent">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <SectionTitle
              eyebrow={t.newMenu.eyebrow}
              title={t.newMenu.title}
              sub={t.newMenu.sub}
            />
            <Link
              to="/menu"
              className="hidden md:inline-flex items-center gap-2 text-sm font-semibold text-[#121212] hover:text-[#8D5B4C] transition-colors"
              data-testid="new-menu-see-all"
            >
              {lang === "id" ? "Lihat semua" : "See all"}
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cookies.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== BUNDLE PROMO ===================== */}
      <section className="py-12 md:py-20 bg-[#FDFBF7]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="rounded-[2.5rem] bg-[#FCD34D] text-white overflow-hidden ring-1 ring-black/5 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-7 p-8 sm:p-10 lg:p-14 bg-[#0A0A0A]">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#FCD34D]">
                  <Package size={13} />
                  {t.bundle.eyebrow}
                </div>
                <h2 className="mt-5 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  {t.bundle.title}
                </h2>
                <p className="mt-4 max-w-xl text-white/70 text-[16px] leading-relaxed">
                  {t.bundle.sub}
                </p>

                <div className="mt-6 text-[11px] uppercase tracking-[0.18em] font-bold text-white/55">
                  {t.bundle.includes}
                </div>
                <ul className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 text-[13.5px] text-white/85">
                  {COOKIE_BUNDLE.contents.map((cid) => {
                    const c = products.find((p) => p.id === cid);
                    return (
                      <li key={cid} className="flex items-center gap-2">
                        <Check size={13} className="text-[#86A789]" />
                        {c?.name}
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-7 flex flex-wrap items-end gap-x-5 gap-y-2">
                  <div className="text-[12px] text-white/45 line-through leading-none">
                    {formatIDR(COOKIE_BUNDLE.originalPrice)}
                  </div>
                  <div className="font-display text-[36px] sm:text-[42px] font-bold leading-none">
                    {formatIDR(COOKIE_BUNDLE.bundlePrice)}
                  </div>
                  <div className="rounded-full bg-[#FCD34D] text-[#3A2A0E] px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                    -{COOKIE_BUNDLE.bundleDiscountPct}% Bundle
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => addItem(COOKIE_BUNDLE.id, 1)}
                    data-testid="bundle-add-cta"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[14.5px] font-semibold text-[#121212] hover:bg-[#FCD34D] active:scale-[0.97] transition-all"
                  >
                    <Package size={15} />
                    {t.bundle.addCta}
                  </button>
                  <Link
                    to="/order"
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-3.5 text-[14.5px] font-semibold text-white hover:bg-white/15 transition-all"
                    data-testid="bundle-view-order"
                  >
                    {lang === "id" ? "Lihat Order" : "View Order"}
                    <ArrowRight size={15} />
                  </Link>
                </div>

                <p className="mt-5 text-[11.5px] text-white/45 leading-relaxed max-w-md">
                  {t.bundle.note}
                </p>
              </div>
              <div className="lg:col-span-5 relative bg-[#FCD34D] overflow-hidden min-h-[260px]">
                <div className="absolute inset-0 bg-[#FCD34D]" />

                <div className="relative z-10 grid grid-cols-2 gap-0 p-6 h-full">
                  {cookies.map((c, index) => (
                    <div
                      key={c.id}
                      className="aspect-square flex items-center justify-center bg-[#FCD34D] overflow-visible"
                    >
                      <img
                        src={c.image}
                        alt={c.name}
                        className={`block h-full w-full object-contain bg-transparentfloat-${(index % 4) + 1}`}
                      />
                    </div>
                  ))}
                </div>
                <div className="absolute z-20 bottom-4 right-4 rounded-full bg-white text-[#121212] px-3 py-1.5 text-[10.5px] font-bold uppercase tracking-wider shadow-lg">
                  4 Variants · 1 Bundle
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BEST SELLER ===================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionTitle
            eyebrow={t.bestSeller.eyebrow}
            title={t.bestSeller.title}
            sub={t.bestSeller.sub}
            color="#9B2C2C"
          />

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {bestSellers.map((p) => (
              <ProductCard key={p.id} product={p} featured />
            ))}
          </div>
        </div>
      </section>

      {/* ===================== WHY MOOBITS ===================== */}
      <section className="py-16 md:py-24 bg-[#FDFBF7]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionTitle
            eyebrow={t.why.eyebrow}
            title={t.why.title}
            color="#86A789"
            align="center"
          />

          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7">
            {[
              {
                icon: Leaf,
                color: "#86A789",
                t: t.why.cards[0].title,
                b: t.why.cards[0].body,
              },
              {
                icon: Cookie,
                color: "#8D5B4C",
                t: t.why.cards[1].title,
                b: t.why.cards[1].body,
              },
              {
                icon: Heart,
                color: "#9B2C2C",
                t: t.why.cards[2].title,
                b: t.why.cards[2].body,
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={i}
                  data-testid={`why-card-${i}`}
                  className="group rounded-[2rem] bg-white p-8 ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <div
                    className="inline-flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: `${card.color}1A`, color: card.color }}
                  >
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <h3 className="mt-6 font-display text-[20px] font-semibold text-[#121212]">
                    {card.t}
                  </h3>
                  <p className="mt-3 text-[14.5px] leading-relaxed text-[#525252]">
                    {card.b}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== CATEGORY PREVIEW ===================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <SectionTitle
            eyebrow={t.explore.eyebrow}
            title={t.explore.title}
            sub={t.explore.sub}
            color="#8D5B4C"
          />

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CATEGORIES.map((cat) => {
              const rep = categoryReps[cat];
              return (
                <Link
                  key={cat}
                  to="/menu"
                  state={{ category: cat }}
                  data-testid={`category-card-${cat}`}
                  className="group flex flex-col rounded-[2rem] bg-white ring-1 ring-black/5 overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.35)] hover:shadow-[0_24px_70px_-34px_rgba(0,0,0,0.45)]"
                >
                  <div className="relative aspect-[4/3] bg-white overflow-hidden flex items-center justify-center p-6">
                    {rep.type === "image" ? (
                      <img
                        src={rep.src}
                        alt={cat}
                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <CategoryIllustration
                        type={rep.key}
                        className="h-full w-full"
                      />
                    )}
                    <div
                      className="absolute -bottom-px left-0 right-0 h-px"
                      style={{ background: rep.accent }}
                    />
                  </div>
                  <div className="p-6 text-[#121212] border-t border-black/5">
                    <div
                      className="text-[10px] uppercase tracking-[0.22em] font-bold"
                      style={{ color: rep.accent }}
                    >
                      Category
                    </div>
                    <div className="mt-2 font-display text-[19px] font-semibold">
                      {cat}
                    </div>
                    <p className="mt-2 text-[13px] leading-relaxed text-black/65">
                      {t.explore.categories[cat]}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#121212] group-hover:text-[#FCD34D] transition-colors">
                      {t.explore.cta} <ArrowUpRight size={13} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===================== PROMO BANNER ===================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div
            data-testid="promo-banner"
            className="relative overflow-hidden rounded-[2.5rem] bg-[#9B2C2C] text-white p-8 sm:p-12 lg:p-16"
          >
            <div className="pointer-events-none absolute -top-24 -right-24 h-[300px] w-[300px] rounded-full bg-[#FCD34D]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-[300px] w-[300px] rounded-full bg-white/5 blur-3xl" />

            <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FCD34D]" />
                  {t.promo.tag}
                </div>
                <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  {t.promo.title}
                </h2>
                <p className="mt-4 text-[17px] sm:text-[18px] text-white/85 max-w-xl">
                  {t.promo.body}
                </p>
                <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-white/10 backdrop-blur px-4 py-2.5 text-[13.5px] font-medium">
                  <Sparkles size={15} className="text-[#FCD34D]" />
                  {t.promo.extra}
                </div>

                <div className="mt-8">
                  <a
                    href={buildGenericWa(lang)}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-testid="promo-cta"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-[#121212] hover:bg-[#FCD34D] active:scale-[0.97] transition-all transition-all duration-200 active:scale-[0.97]"
                  >
                    {t.promo.cta}
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="grid grid-cols-2 gap-3">
                  {cookies.map((c, index) => (
                    <div
                      key={c.id}
                      className="rounded-2xl overflow-visible bg-transparent"
                    >
                      <img
                        src={c.image}
                        alt={c.name}
                        className={`h-full w-full object-cover float-${(index % 4) + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== LOYALTY CARD ===================== */}
      <LoyaltyCard />

      {/* ===================== FINAL CTA ===================== */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
          <Eyebrow>Order Now</Eyebrow>
          <h2 className="mt-4  font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#121212]">
            {t.finalCta.title}
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-[#525252]">
            {t.finalCta.sub}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={buildGenericWa(lang)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="final-cta-order"
              className="inline-flex items-center gap-2 rounded-full bg-[#FCD34D] px-7 py-3.5 text-[15px] font-semibold text-[#121212] hover:bg-[#121212] hover:text-white active:scale-[0.97] transition-all"
            >
              {t.finalCta.cta}
              <ArrowUpRight size={16} />
            </a>
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-[#121212] ring-1 ring-black/10 hover:bg-[#FCD34D] transition-colors"
              data-testid="final-cta-menu"
            >
              {t.common.viewMenu}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
