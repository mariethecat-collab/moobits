import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products, COOKIE_BUNDLE, unitPrice } from "../data/products";

const CartContext = createContext(null);

const STORAGE_KEY = "moobits_cart_v1";

const findProduct = (id) =>
  id === COOKIE_BUNDLE.id
    ? COOKIE_BUNDLE
    : products.find((p) => p.id === id);

export const CartProvider = ({ children }) => {
  // items: [{ id, qty, note }]
  const [items, setItems] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      /* noop */
    }
  }, [items]);

  const addItem = useCallback((id, qty = 1, note = "") => {
    setItems((prev) => {
      const idx = prev.findIndex((it) => it.id === id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = {
          ...next[idx],
          qty: next[idx].qty + qty,
          note: note || next[idx].note,
        };
        return next;
      }
      return [...prev, { id, qty, note }];
    });
    setIsOpen(true);
  }, []);

  const updateQty = useCallback((id, qty) => {
    setItems((prev) =>
      prev
        .map((it) => (it.id === id ? { ...it, qty } : it))
        .filter((it) => it.qty > 0)
    );
  }, []);

  const updateNote = useCallback((id, note) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, note } : it)));
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  // Derived totals
  const lines = useMemo(() => {
    return items
      .map((it) => {
        const product = findProduct(it.id);
        if (!product) return null;
        const unit = unitPrice(product);
        const original = product.isBundle
          ? product.originalPrice
          : product.price;
        return {
          ...it,
          product,
          unit,
          original,
          lineTotal: unit * it.qty,
          lineOriginal: original * it.qty,
        };
      })
      .filter(Boolean);
  }, [items]);

  const totals = useMemo(() => {
    const subtotalOriginal = lines.reduce((s, l) => s + l.lineOriginal, 0);
    const subtotalAfterDiscount = lines.reduce((s, l) => s + l.lineTotal, 0);
    const discount = subtotalOriginal - subtotalAfterDiscount;
    const totalItems = lines.reduce((s, l) => s + l.qty, 0);
    return {
      subtotalOriginal,
      subtotalAfterDiscount,
      discount,
      totalItems,
    };
  }, [lines]);

  const value = {
    items,
    lines,
    totals,
    isOpen,
    setIsOpen,
    addItem,
    updateQty,
    updateNote,
    removeItem,
    clear,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
