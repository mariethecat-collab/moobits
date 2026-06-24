import { ArrowUpRight } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { buildWaLink, formatIDR } from "../data/products";
import CategoryIllustration from "./CategoryIllustration";

const LabelBadge = ({ kind, children }) => {
  const styles = {
    "New Menu": "bg-[#FCD34D] text-[#3A2A0E]",
    "Best Seller": "bg-[#9B2C2C] text-white",
    Recommended: "bg-white/15 text-white backdrop-blur",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
        styles[kind] || "bg-white/15 text-white backdrop-blur"
      }`}
    >
      {children}
    </span>
  );
};

export default function ProductCard({ product, featured = false }) {
  const { t, lang } = useLang();
  const desc = lang === "id" ? product.descId : product.descEn;
  const textures = lang === "id" ? product.textureId : product.textureEn;
  const hasDiscount = product.discountPct > 0;
  const discounted = Math.round(
    product.price * (1 - product.discountPct / 100)
  );

  return (
    <article
      data-testid={`product-card-${product.id}`}
      className="group relative flex flex-col rounded-[2rem] bg-[#0A0A0A] text-white overflow-hidden ring-1 ring-white/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]"
    >
      {/* Image / Illustration */}
      <div className="relative aspect-square bg-black overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <CategoryIllustration
            type={product.illustration}
            className="h-full w-full"
          />
        )}

        {/* Labels */}
        <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 max-w-[80%]">
          {product.labels?.map((lbl) => (
            <LabelBadge key={lbl} kind={lbl}>
              {lbl}
            </LabelBadge>
          ))}
        </div>

        {/* Discount tag */}
        {hasDiscount && (
          <div className="absolute top-4 right-4">
            <div className="flex flex-col items-center justify-center h-12 w-12 rounded-full bg-[#9B2C2C] text-white text-[10px] font-bold leading-none shadow-lg">
              <span className="text-base leading-none">
                -{product.discountPct}%
              </span>
              <span className="mt-0.5 text-[9px] uppercase tracking-wider opacity-80">
                {t.common.disc}
              </span>
            </div>
          </div>
        )}

        {/* Accent glow strip at bottom of image */}
        <div
          className="absolute -bottom-1 left-0 right-0 h-px"
          style={{ background: product.accent, opacity: 0.7 }}
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-center justify-between gap-3">
          <span
            className="text-[10px] uppercase tracking-[0.22em] font-bold"
            style={{ color: product.accent }}
          >
            {product.category}
          </span>
          {product.size && (
            <span className="text-[11px] text-white/55">{product.size}</span>
          )}
        </div>

        <h3
          className={`mt-3 font-display font-semibold text-white leading-tight ${
            featured ? "text-[22px]" : "text-[18px]"
          }`}
        >
          {product.name}
        </h3>

        <p className="mt-2 text-[13.5px] leading-relaxed text-white/65 line-clamp-3">
          {desc}
        </p>

        {/* Textures */}
        {textures?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {textures.map((tx) => (
              <span
                key={tx}
                className="inline-flex rounded-full bg-white/8 px-2.5 py-1 text-[10.5px] font-medium text-white/75 ring-1 ring-white/10"
              >
                {tx}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-6 flex items-end justify-between gap-3 pt-5 border-t border-white/10">
          <div>
            {hasDiscount && (
              <div className="text-[11px] text-white/40 line-through leading-none">
                {formatIDR(product.price)}
              </div>
            )}
            <div className="mt-1 font-display text-[22px] font-bold text-white leading-none">
              {formatIDR(hasDiscount ? discounted : product.price)}
            </div>
          </div>

          <a
            href={buildWaLink(product.name, lang)}
            target="_blank"
            rel="noopener noreferrer"
            data-testid={`order-wa-${product.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2.5 text-[13px] font-semibold text-[#121212] transition-all duration-200 hover:bg-[#FCD34D] active:scale-95"
          >
            {t.common.orderViaWa}
            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>
    </article>
  );
}
