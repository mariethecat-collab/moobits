import { useEffect, useState } from "react";
import { useCart } from "../cart/CartContext";

export default function StickyOrderBar() {
  const { items, setIsOpen } = useCart();
  const [visible, setVisible] = useState(false);

  const count = items?.reduce((sum, item) => sum + (item.qty || 1), 0) || 0;

  useEffect(() => {
    if (count > 0) {
      setVisible(true);

      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [count]);

  if (count === 0) return null;

  return (
    <div
      className={`fixed left-1/2 top-4 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-2xl bg-[#3A2417] px-4 py-3 text-white shadow-xl transition-all duration-300 ${
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-8 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{count} item dipilih</p>
          <p className="text-xs opacity-80">Mood booster kamu sudah masuk order 🍪</p>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#3A2417]"
        >
          Lihat Order
        </button>
      </div>
    </div>
  );
}