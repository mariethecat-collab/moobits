import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Info } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { products, CATEGORIES } from "../data/products";
import ProductCard from "../components/ProductCard";
import Disclaimer from "../components/Disclaimer";

export default function Menu() {
  const { t } = useLang();
  const location = useLocation();
  const [active, setActive] = useState("All");

  useEffect(() => {
    if (location.state?.category && CATEGORIES.includes(location.state.category)) {
      setActive(location.state.category);
    }
  }, [location.state]);

  const filtered = useMemo(() => {
    if (active === "All") return products;
    return products.filter((p) => p.category === active);
  }, [active]);

  return (
    <div data-testid="page-menu">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-[#FCD34D]/20 blur-3xl" />
          <div className="absolute top-1/2 -right-20 h-[360px] w-[360px] rounded-full bg-[#86A789]/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-12 md:pt-20 pb-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8D5B4C]">
            <span className="h-1 w-6 rounded-full bg-[#8D5B4C]" />
            {t.menu.eyebrow}
          </div>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#121212]">
            {t.menu.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] sm:text-[17px] leading-relaxed text-[#525252]">
            {t.menu.sub}
          </p>
        </div>
      </section>

      {/* Sticky-feel filter bar */}
      <section className="py-2">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div
            data-testid="menu-filter-bar"
            className="flex flex-wrap gap-2 rounded-full bg-[#FDFBF7] p-1.5 ring-1 ring-black/5 w-fit"
          >
            {t.menu.filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                data-testid={`filter-${f}`}
                className={`px-4 py-2 rounded-full text-[13.5px] font-semibold transition-all duration-200 ${
                  active === f
                    ? "bg-[#121212] text-white shadow-sm"
                    : "text-[#525252] hover:text-[#121212]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-testid="menu-grid"
          >
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Info section */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="rounded-[2.5rem] bg-[#FDFBF7] p-8 sm:p-10 lg:p-12 ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#8D5B4C]/15 text-[#8D5B4C] flex items-center justify-center">
                <Info size={18} />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#121212]">
                {t.menu.infoTitle}
              </h2>
            </div>
            <ul className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-[14.5px] leading-relaxed text-[#525252]">
              {t.menu.info.map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8D5B4C]" />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <Disclaimer />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
