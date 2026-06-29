import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "./CartContext";
import { useLang } from "../i18n/LanguageContext";
import { formatIDR } from "../data/products";

export default function CartDrawer() {
  const { isOpen, setIsOpen, lines, totals, updateQty, updateNote, removeItem, addItem } =
    useCart();
  const { t, lang } = useLang();

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

const cookieIds = ["classic-og", "velvet-crush", "matcha-cookies", "blue-monstiez"];
const hasIndividualCookie = lines.some((l) => cookieIds.includes(l.id));
const hasBundle = lines.some((l) => l.id === "bundle-cookies-4-varian");
const showBundleUpsell = hasIndividualCookie && !hasBundle;

const addCookieBundle = () => {
  addItem(
    "bundle-cookies-4",
    1,
    "Bundle berisi The Classic OG, The Velvet Crush, The Matcha Cookies, dan The Blue Monstiez."
  );
};

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        data-testid="cart-backdrop"
        className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <aside
        data-testid="cart-drawer"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 z-[70] h-full w-full sm:w-[420px] max-w-full bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-black/5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-[#FDFBF7] text-[#8D5B4C] flex items-center justify-center">
              <ShoppingBag size={17} />
            </div>
            <div>
              <div className="font-display text-[17px] font-bold text-[#121212]">
                {lang === "id" ? "Order Kamu" : "Your Order"}
              </div>
              <div className="text-[11px] text-[#737373]">
                {totals.totalItems} {lang === "id" ? "item" : "items"}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            data-testid="cart-close"
            aria-label="Close cart"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FDFBF7] hover:bg-black hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5">
          {lines.length === 0 ? (
            <div
              data-testid="cart-empty"
              className="flex flex-col items-center justify-center h-full text-center px-4"
            >
              <div className="h-16 w-16 rounded-3xl bg-[#FDFBF7] flex items-center justify-center text-[#8D5B4C]">
                <ShoppingBag size={26} />
              </div>
              <h3 className="mt-4 font-display text-[19px] font-semibold text-[#121212]">
                {lang === "id" ? "Order kamu masih kosong" : "Your order is empty"}
              </h3>
              <p className="mt-2 text-[14px] text-[#525252] leading-relaxed max-w-[260px]">
                {t.cart.empty}
              </p>
              <Link
                to="/menu"
                onClick={() => setIsOpen(false)}
                data-testid="cart-empty-cta"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#121212] px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-[#2A2A2A]"
              >
                {lang === "id" ? "Lihat Menu" : "View Menu"}
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {lines.map((l) => (
                <li
                  key={l.id}
                  data-testid={`cart-line-${l.id}`}
                  className="flex gap-3 rounded-2xl bg-[#FDFBF7] p-3 ring-1 ring-black/5"
                >
                  <div className="h-20 w-20 shrink-0 rounded-xl bg-tranparent overflow-visible ">
                    {l.product.image ? (
                      <img
                        src={l.product.image}
                        alt={l.product.name}
                        className="product-img-blend h-full w-full object-containt"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-white/60 text-xs">
                        Moobits
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div
                          className="text-[10px] uppercase tracking-[0.18em] font-bold"
                          style={{ color: l.product.accent }}
                        >
                          {l.product.category}
                        </div>
                        <div className="mt-0.5 font-display text-[14px] font-semibold text-[#121212] truncate">
                          {l.product.shortName || l.product.name}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(l.id)}
                        data-testid={`cart-remove-${l.id}`}
                        aria-label="Remove"
                        className="h-7 w-7 shrink-0 rounded-full bg-white text-[#9B2C2C] hover:bg-[#9B2C2C] hover:text-white transition-colors flex items-center justify-center"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={l.note || ""}
                      onChange={(e) => updateNote(l.id, e.target.value)}
                      placeholder={
                        lang === "id" ? "Catatan item..." : "Item note..."
                      }
                      data-testid={`cart-note-${l.id}`}
                      className="mt-2 w-full rounded-lg bg-white px-2.5 py-1.5 text-[12px] text-[#121212] placeholder:text-[#A3A3A3] ring-1 ring-black/5 focus:ring-[#8D5B4C] outline-none"
                    />

                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full bg-white ring-1 ring-black/5">
                        <button
                          type="button"
                          onClick={() => updateQty(l.id, l.qty - 1)}
                          data-testid={`cart-decr-${l.id}`}
                          className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-[#FDFBF7]"
                          aria-label="Decrease"
                        >
                          <Minus size={12} />
                        </button>
                        <span
                          className="px-2 min-w-[28px] text-center text-[13px] font-bold text-[#121212]"
                          data-testid={`cart-qty-${l.id}`}
                        >
                          {l.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(l.id, l.qty + 1)}
                          data-testid={`cart-incr-${l.id}`}
                          className="h-7 w-7 rounded-full flex items-center justify-center hover:bg-[#FDFBF7]"
                          aria-label="Increase"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="text-right">
                        {l.unit !== l.original && (
                          <div className="text-[10px] text-[#A3A3A3] line-through leading-none">
                            {formatIDR(l.lineOriginal)}
                          </div>
                        )}
                        <div className="mt-0.5 font-display text-[14px] font-bold text-[#121212] leading-none">
                          {formatIDR(l.lineTotal)}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

{showBundleUpsell && (
  <div className="mx-5 mb-3 rounded-2xl border border-[#F3D7A6] bg-[#FFF7E8] p-4">
    <p className="font-display text-sm font-bold text-[#5A3825]">
      Lengkapi jadi Bundling Cookies 4 Varian 🍪
    </p>
    <p className="mt-1 text-xs text-[#7A5A43]">
      Tambahkan semua varian cookies dan hemat 10% untuk bundle lengkap.
    </p>
    <button
      type="button"
      onClick={addCookieBundle}
      className="mt-3 rounded-full bg-[#8D5B4C] px-4 py-2 text-xs font-bold text-white"
    >
      Tambahkan Bundle
    </button>
  </div>
)}

        {/* Footer */}
        {lines.length > 0 && (
          <div className="border-t border-black/5 px-5 sm:px-6 py-4 bg-white">
            <div className="space-y-1.5 text-[13.5px]">
              <div className="flex items-center justify-between text-[#525252]">
                <span>{lang === "id" ? "Subtotal" : "Subtotal"}</span>
                <span data-testid="cart-subtotal">
                  {formatIDR(totals.subtotalOriginal)}
                </span>
              </div>
              {totals.discount > 0 && (
                <div className="flex items-center justify-between text-[#9B2C2C]">
                  <span>{lang === "id" ? "Diskon" : "Discount"}</span>
                  <span data-testid="cart-discount">
                    − {formatIDR(totals.discount)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1.5 mt-1.5 border-t border-black/5">
                <span className="font-display text-[15px] font-bold text-[#121212]">
                  Total
                </span>
                <span
                  className="font-display text-[18px] font-bold text-[#121212]"
                  data-testid="cart-total"
                >
                  {formatIDR(totals.subtotalAfterDiscount)}
                </span>
              </div>
            </div>

            <Link
              to="/order"
              onClick={() => setIsOpen(false)}
              data-testid="cart-checkout-cta"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#121212] px-5 py-3.5 text-[14px] font-semibold text-white hover:bg-[#2A2A2A] active:scale-[0.98] transition-all"
            >
              {lang === "id"
                ? "Lanjut ke Detail Order"
                : "Continue to Order Details"}
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </aside>
    </>
  );
}
