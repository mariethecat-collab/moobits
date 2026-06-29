import { useState } from "react";
import { Plus, Minus, ShoppingBag, Check } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { formatIDR } from "../data/products";
import CategoryIllustration from "./CategoryIllustration";
import { useCart } from "../cart/CartContext";

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
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const desc = lang === "id" ? product.descId : product.descEn;
  const textures = lang === "id" ? product.textureId : product.textureEn;
  const hasDiscount = product.discountPct > 0;
  const discounted = Math.round(
    product.price * (1 - product.discountPct / 100)
  );

  const handleAdd = () => {
    addItem(product.id, qty);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <article
      data-testid={`product-card-${product.id}`}
      className="group relative flex flex-col rounded-[2rem] bg-white/70 backdrop-blur-md text-[#121212] overflow-hidden ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]"
    >
      {/* Image / Illustration */}
      <div className="relative aspect-square bg-transparent overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="product-img-blend h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
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
            <span className="text-[11px] text-black/55">{product.size}</span>
          )}
        </div>

        <h3
          className={`mt-3 font-display font-semibold text-[#121212] leading-tight ${
            featured ? "text-[22px]" : "text-[18px]"
          }`}
        >
          {product.name}
        </h3>

        <p className="mt-2 text-[13.5px] leading-relaxed text-black/60 line-clamp-3">
          {desc}
        </p>

        {textures?.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {textures.map((tx) => (
              <span
                key={tx}
                className="inline-flex rounded-full bg-black/10 px-2.5 py-1 text-[10.5px] font-medium text-black/75 ring-1 ring-black/10"
              >
                {tx}
              </span>
            ))}
          </div>
        )}
        {product.bestFor?.length > 0 && (
  <div className="mt-2 flex flex-wrap gap-1.5">
    {product.bestFor.map((tag) => (
      <span
        key={tag}
        className="inline-flex rounded-full bg-[#FDFBF7] px-2.5 py-1 text-[10px] font-medium text-[#8D5B4C] ring-1 ring-[#8D5B4C]/20"
      >
        {tag}
      </span>
    ))}
  </div>
)}

        {/* Price */}
        <div className="flex-1 min-h-6" />
        <div className="pt-5 border-t border-black/10">
          <div className="flex items-end justify-between gap-3">
            <div>
              {hasDiscount && (
                <div className="text-[11px] text-black/40 line-through leading-none">
                  {formatIDR(product.price)}
                </div>
              )}
              <div className="mt-1 font-display text-[22px] font-bold text-[#121212] leading-none">
                {formatIDR(hasDiscount ? discounted : product.price)}
              </div>
            </div>

            {/* Qty selector */}
            <div className="inline-flex items-center rounded-full bg-black/50 ring-1 ring-black/100">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                data-testid={`qty-decr-${product.id}`}
                aria-label="Decrease"
                className="h-8 w-8 rounded-full flex items-center justify-center text-white/80 hover:text-white"
              >
                <Minus size={13} />
              </button>
              <span
                className="px-1 min-w-[28px] text-center text-[13.5px] font-bold text-white"
                data-testid={`qty-value-${product.id}`}
              >
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                data-testid={`qty-incr-${product.id}`}
                aria-label="Increase"
                className="h-8 w-8 rounded-full flex items-center justify-center text-white/80 hover:text-white"
              >
                <Plus size={13} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            data-testid={`add-to-order-${product.id}`}
            className={`mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-[13.5px] font-semibold transition-all duration-200 active:scale-[0.97] ${
              justAdded
                ? "bg-[#86A789] text-white"
                : "bg-[#FCD34D] text-[#121212]"
            }`}
          >
            {justAdded ? (
              <>
                <Check size={15} />
                {lang === "id" ? "Ditambahkan" : "Added"}
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                {lang === "id" ? "Tambahkan ke Order" : "Add to Order"}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
