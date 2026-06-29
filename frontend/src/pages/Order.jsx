import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Download,
  Image as ImageIcon,
  Send,
  CheckCircle2,
  AlertCircle,
  Info,
  Truck,
  CreditCard,
  ClipboardList,
} from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { useCart } from "../cart/CartContext";
import {
  formatIDR,
  generateInvoiceNumber,
  WHATSAPP_NUMBER,
} from "../data/products";
import api from "../lib/api";
import Invoice from "../components/Invoice";
import Disclaimer from "../components/Disclaimer";

const cleanInputCls =
  "w-full rounded-2xl bg-white px-4 py-3 text-[14px] text-[#121212] placeholder:text-[#A3A3A3] ring-1 ring-black/10 focus:ring-[#8D5B4C] focus:outline-none transition";

const fieldLabel = "block text-[12px] font-semibold text-[#525252] mb-1.5";

const todayISO = () => {
  const d = new Date();
  return d.toISOString().slice(0, 10);
};

const RuleCard = ({ title, items, color, Icon }) => (
  <div className="rounded-[2rem] bg-[#FDFBF7] ring-1 ring-black/5 p-7">
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 rounded-2xl flex items-center justify-center"
        style={{ background: `${color}1A`, color }}
      >
        <Icon size={18} />
      </div>
      <h3 className="font-display text-[19px] font-bold text-[#121212]">
        {title}
      </h3>
    </div>
    <ul className="mt-5 space-y-2.5 text-[13.5px] leading-relaxed text-[#525252]">
      {items.map((it, i) => (
        <li key={i} className="flex gap-2.5">
          <span
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: color }}
          />
          {it}
        </li>
      ))}
    </ul>
  </div>
);

export default function Order() {
  const { t, lang } = useLang();
  const { lines, totals, updateQty, updateNote, removeItem, clear } = useCart();
  const op = t.orderPage;

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    method: op.fields.pickup,
    address: "",
    deliveryDate: todayISO(),
    timeSlot: "",
    payment: op.fields.paymentOptions[0],
    greeting: "",
    custom: "",
    notes: "",
    status: "Unpaid",
  });

  const [invoiceData, setInvoiceData] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const invoiceRef = useRef(null);

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    if (lines.length === 0) {
      setError(op.empty);
      return false;
    }
    if (!form.name.trim() || !form.whatsapp.trim() || !form.deliveryDate) {
      setError(op.requiredError);
      return false;
    }
    if (form.method === op.fields.delivery && !form.address.trim()) {
      setError(op.requiredError);
      return false;
    }
    setError("");
    return true;
  };

  const handleGenerate = (e) => {
    e?.preventDefault?.();
    if (!validate()) return;
    const number = generateInvoiceNumber();
    const orderDate = new Date().toLocaleDateString(
      lang === "id" ? "id-ID" : "en-GB",
      { day: "2-digit", month: "long", year: "numeric" }
    );
    const data = {
      invoiceNumber: number,
      orderDate,
      customerName: form.name.trim(),
      customerWa: form.whatsapp.trim(),
      method: form.method,
      address: form.address.trim(),
      timeSlot: form.timeSlot,
      deliveryDate: form.deliveryDate,
      paymentMethod: form.payment,
      greeting: form.greeting.trim(),
      custom: form.custom.trim(),
      notes: form.notes.trim(),
    };
    setInvoiceData(data);
    setSuccess(true);

    // Persist order to backend (fire-and-forget; do NOT block UX)
    const payload = {
      invoiceNumber: number,
      customerName: data.customerName,
      customerWa: data.customerWa,
      method: data.method,
      address: data.address,
      deliveryDate: data.deliveryDate,
      paymentMethod: data.paymentMethod,
      greeting: data.greeting,
      custom: data.custom,
      notes: data.notes,
      items: lines.map((l) => ({
        productId: l.id,
        productName: l.product.name,
        category: l.product.category,
        qty: l.qty,
        unitPrice: l.unit,
        originalPrice: l.original,
        lineTotal: l.lineTotal,
        note: l.note || "",
        image: l.product.image || "",
      })),
      subtotalOriginal: totals.subtotalOriginal,
      discount: totals.discount,
      total: totals.subtotalAfterDiscount,
      paymentStatus: form.status,
      orderStatus: "New Order",
      lang,
    };
    api.post("/orders", payload).catch((err) => {
      // Order already saved client-side in localStorage; warn but do not block.
      // eslint-disable-next-line no-console
      console.warn("Order persistence failed:", err?.response?.data || err.message);
    });

    setTimeout(() => {
      document
        .getElementById("invoice-anchor")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const buildWaMessage = () => {
    if (!invoiceData) return "";
    const itemLines = lines
      .map(
        (l) =>
          `• ${l.product.name} — ${l.qty} × ${formatIDR(l.unit)} = ${formatIDR(
            l.lineTotal
          )}${l.note ? ` (note: ${l.note})` : ""}`
      )
      .join("\n");
    if (lang === "id") {
      return [
        "Halo Moobits, aku mau order ya.",
        "",
        `Nomor Invoice: ${invoiceData.invoiceNumber}`,
        `Nama: ${invoiceData.customerName}`,
        `Nomor WhatsApp: ${invoiceData.customerWa}`,
        `Metode Pengambilan/Pengiriman: ${invoiceData.method}`,
        `Tanggal Pengiriman/Pickup: ${invoiceData.deliveryDate}`,
        `Jam Pickup/Pengiriman: ${invoiceData.timeSlot || "-"}`,
        `Alamat: ${invoiceData.address || "-"}`,
        `Metode Pembayaran: ${invoiceData.paymentMethod}`,
        "",
        "Detail Pesanan:",
        itemLines,
        "",
        `Subtotal: ${formatIDR(totals.subtotalOriginal)}`,
        `Diskon: ${formatIDR(totals.discount)}`,
        `Ongkir: dikonfirmasi via WhatsApp`,
        `Total: ${formatIDR(totals.subtotalAfterDiscount)}`,
        "",
        `Catatan Tambahan: ${invoiceData.notes || "-"}`,
        `Request Greeting Card: ${invoiceData.greeting || "-"}`,
        `Request Custom: ${invoiceData.custom || "-"}`,
        "",
        "Mohon dikonfirmasi dan dibuatkan invoice finalnya ya. Thank you!",
        "(Invoice gambar/PDF akan saya kirim manual juga via WhatsApp)",
      ].join("\n");
    }
    return [
      "Hello Moobits, I would like to place an order.",
      "",
      `Invoice Number: ${invoiceData.invoiceNumber}`,
      `Name: ${invoiceData.customerName}`,
      `WhatsApp Number: ${invoiceData.customerWa}`,
      `Pickup/Delivery Method: ${invoiceData.method}`,
      `Delivery/Pickup Date: ${invoiceData.deliveryDate}`,
      `Address: ${invoiceData.address || "-"}`,
      `Payment Method: ${invoiceData.paymentMethod}`,
      "",
      "Order Details:",
      itemLines,
      "",
      `Subtotal: ${formatIDR(totals.subtotalOriginal)}`,
      `Discount: ${formatIDR(totals.discount)}`,
      `Delivery Fee: confirmed via WhatsApp`,
      `Total: ${formatIDR(totals.subtotalAfterDiscount)}`,
      "",
      `Additional Notes: ${invoiceData.notes || "-"}`,
      `Greeting Card Request: ${invoiceData.greeting || "-"}`,
      `Custom Request: ${invoiceData.custom || "-"}`,
      "",
      "Please confirm and send the final invoice. Thank you!",
      "(I will also send the invoice image/PDF manually via WhatsApp)",
    ].join("\n");
  };

  const sendToWa = () => {
    if (!invoiceData) return;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      buildWaMessage()
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const captureCanvas = async () => {
    if (!invoiceRef.current) return null;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(invoiceRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });
    return canvas;
  };

  const downloadImage = async () => {
    if (!invoiceData) return;
    const canvas = await captureCanvas();
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${invoiceData.invoiceNumber}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const downloadPdf = async () => {
    if (!invoiceData) return;
    const canvas = await captureCanvas();
    if (!canvas) return;
    const { jsPDF } = await import("jspdf");
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 24;
    const maxW = pageWidth - margin * 2;
    const ratio = canvas.height / canvas.width;
    let renderW = maxW;
    let renderH = renderW * ratio;
    if (renderH > pageHeight - margin * 2) {
      renderH = pageHeight - margin * 2;
      renderW = renderH / ratio;
    }
    const x = (pageWidth - renderW) / 2;
    const y = margin;
    pdf.addImage(imgData, "PNG", x, y, renderW, renderH);
    pdf.save(`${invoiceData.invoiceNumber}.pdf`);
  };

  const hasItems = lines.length > 0;

  const orderedDiscount = useMemo(() => totals.discount, [totals.discount]);

  return (
    <div data-testid="page-order">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-20 h-[420px] w-[420px] rounded-full bg-[#FCD34D]/15 blur-3xl" />
          <div className="absolute top-1/3 -right-20 h-[360px] w-[360px] rounded-full bg-[#86A789]/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 pt-12 md:pt-20 pb-8">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8D5B4C]">
            <span className="h-1 w-6 rounded-full bg-[#8D5B4C]" />
            {op.eyebrow}
          </div>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#121212]">
            {op.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] sm:text-[17px] leading-relaxed text-[#525252]">
            {op.sub}
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
            {/* LEFT: items + form */}
            <div className="lg:col-span-7 space-y-7">
              {/* Items review */}
              <div className="rounded-[2rem] bg-white ring-1 ring-black/5 p-5 sm:p-6">
                <h2 className="font-display text-[20px] font-bold text-[#121212]">
                  {op.reviewTitle}
                </h2>

                {!hasItems ? (
                  <div
                    data-testid="order-empty"
                    className="mt-5 rounded-2xl bg-[#FDFBF7] p-6 text-center"
                  >
                    <div className="mx-auto h-12 w-12 rounded-2xl bg-white text-[#8D5B4C] flex items-center justify-center">
                      <ShoppingBag size={18} />
                    </div>
                    <p className="mt-3 text-[14px] text-[#525252]">{op.empty}</p>
                    <Link
                      to="/menu"
                      data-testid="order-empty-cta"
                      className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#121212] px-5 py-2.5 text-[13.5px] font-semibold text-white hover:bg-[#2A2A2A]"
                    >
                      {op.backToMenu}
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <ul className="mt-5 space-y-4">
                    {lines.map((l) => (
                      <li
                        key={l.id}
                        data-testid={`order-line-${l.id}`}
                        className="flex gap-4 rounded-2xl bg-[#FDFBF7] p-3 ring-1 ring-black/5"
                      >
                        <div className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl overflow-hidden bg-muted">
                          {l.product.image && (
                            <img
                              src={l.product.image}
                              alt={l.product.name}
                              className="product-img-blend h-full w-full object-cover"
                            />
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
                              <div className="mt-0.5 font-display text-[14.5px] font-semibold text-[#121212]">
                                {l.product.name}
                              </div>
                              <div className="mt-0.5 text-[11px] text-[#737373]">
                                {formatIDR(l.unit)}{" "}
                                {l.unit !== l.original && (
                                  <span className="line-through ml-1">
                                    {formatIDR(l.original)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(l.id)}
                              data-testid={`order-remove-${l.id}`}
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
                            placeholder={op.addNote}
                            data-testid={`order-note-${l.id}`}
                            className="mt-2 w-full rounded-lg bg-white px-2.5 py-1.5 text-[12.5px] text-[#121212] placeholder:text-[#A3A3A3] ring-1 ring-black/5 focus:ring-[#8D5B4C] outline-none"
                          />

                          <div className="mt-2.5 flex items-center justify-between">
                            <div className="inline-flex items-center rounded-full bg-white ring-1 ring-black/5">
                              <button
                                type="button"
                                onClick={() => updateQty(l.id, l.qty - 1)}
                                data-testid={`order-decr-${l.id}`}
                                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-[#FDFBF7]"
                                aria-label="Decrease"
                              >
                                <Minus size={13} />
                              </button>
                              <span
                                className="px-2.5 min-w-[28px] text-center text-[13.5px] font-bold text-[#121212]"
                                data-testid={`order-qty-${l.id}`}
                              >
                                {l.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => updateQty(l.id, l.qty + 1)}
                                data-testid={`order-incr-${l.id}`}
                                className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-[#FDFBF7]"
                                aria-label="Increase"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <div className="font-display text-[15px] font-bold text-[#121212]">
                              {formatIDR(l.lineTotal)}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}

                {hasItems && (
                  <button
                    type="button"
                    onClick={clear}
                    data-testid="order-clear-cart"
                    className="mt-4 text-[12.5px] text-[#9B2C2C] hover:underline font-semibold"
                  >
                    {op.clearCart}
                  </button>
                )}
              </div>

              {/* Customer Form */}
              <form
                onSubmit={handleGenerate}
                data-testid="order-customer-form"
                className="rounded-[2rem] bg-white ring-1 ring-black/5 p-5 sm:p-6 space-y-5"
              >
                <h2 className="font-display text-[20px] font-bold text-[#121212]">
                  {op.customerTitle}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={fieldLabel}>{op.fields.name} *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      placeholder={op.placeholders.name}
                      className={cleanInputCls}
                      data-testid="form-name"
                    />
                  </div>
                  <div>
                    <label className={fieldLabel}>{op.fields.whatsapp} *</label>
                    <input
                      type="tel"
                      value={form.whatsapp}
                      onChange={(e) => setField("whatsapp", e.target.value)}
                      placeholder={op.placeholders.whatsapp}
                      className={cleanInputCls}
                      data-testid="form-whatsapp"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={fieldLabel}>{op.fields.method} *</label>
                    <div
                      className="inline-flex rounded-full bg-[#FDFBF7] p-1.5 ring-1 ring-black/5"
                      role="radiogroup"
                    >
                      {[op.fields.pickup, op.fields.delivery].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setField("method", opt)}
                          data-testid={`form-method-${opt}`}
                          className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                            form.method === opt
                              ? "bg-[#121212] text-white"
                              : "text-[#525252] hover:text-[#121212]"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                  {form.method === op.fields.delivery && (
                    <div className="sm:col-span-2">
                      <label className={fieldLabel}>
                        {op.fields.address} *
                      </label>
                      <textarea
                        rows={2}
                        value={form.address}
                        onChange={(e) => setField("address", e.target.value)}
                        placeholder={op.placeholders.address}
                        className={cleanInputCls}
                        data-testid="form-address"
                      />
                    </div>
                  )}
                  <div>
                    <label className={fieldLabel}>{op.fields.date} *</label>
                    <input
                      type="date"
                      value={form.deliveryDate}
                      onChange={(e) =>
                        setField("deliveryDate", e.target.value)
                      }
                      className={cleanInputCls}
                      data-testid="form-date"
                    />
                  </div>

                  <div>
                    <label className={fieldLabel}>Jam Pickup/Pengiriman *</label>
                    <select
                    value={form.timeSlot}
                    onChange={(e) => setField("timeSlot", e.target.value)}
                    className={cleanInputCls}
                    required
                       >
                    <option value="">Pilih jam</option>
                    <option value="09.00 - 11.00">09.00 - 11.00</option>
                    <option value="11.00 - 13.00">11.00 - 13.00</option>
                    <option value="13.00 - 15.00">13.00 - 15.00</option>
                    <option value="Request jam tertentu via WhatsApp">
                      Request jam tertentu via WhatsApp
                    </option>
                    </select>
                    <p className="mt-1 text-xs text-stone-500">
                      Pengiriman maksimal sampai jam 15.00.
                    </p>
                  </div>

                  <div>
                    <label className={fieldLabel}>{op.fields.payment}</label>
                    <select
                      value={form.payment}
                      onChange={(e) => setField("payment", e.target.value)}
                      className={cleanInputCls}
                      data-testid="form-payment"
                    >
                      {op.fields.paymentOptions.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className={fieldLabel}>{op.fields.greeting}</label>
                    <input
                      type="text"
                      value={form.greeting}
                      onChange={(e) => setField("greeting", e.target.value)}
                      placeholder={op.placeholders.greeting}
                      className={cleanInputCls}
                      data-testid="form-greeting"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={fieldLabel}>{op.fields.custom}</label>
                    <input
                      type="text"
                      value={form.custom}
                      onChange={(e) => setField("custom", e.target.value)}
                      placeholder={op.placeholders.custom}
                      className={cleanInputCls}
                      data-testid="form-custom"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={fieldLabel}>{op.fields.notes}</label>
                    <textarea
                      rows={2}
                      value={form.notes}
                      onChange={(e) => setField("notes", e.target.value)}
                      placeholder={op.placeholders.notes}
                      className={cleanInputCls}
                      data-testid="form-notes"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className={fieldLabel}>
                      {op.fields.invoiceStatus}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["Unpaid", "Paid", "DP 50%"].map((s, i) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setField("status", s)}
                          data-testid={`form-status-${s}`}
                          className={`px-4 py-2 rounded-full text-[12.5px] font-semibold transition ${
                            form.status === s
                              ? "bg-[#121212] text-white"
                              : "bg-[#FDFBF7] text-[#525252] ring-1 ring-black/5"
                          }`}
                        >
                          {op.fields.statusOptions[i]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {error && (
                  <div
                    data-testid="form-error"
                    className="flex items-center gap-2 rounded-2xl bg-[#9B2C2C]/10 text-[#9B2C2C] px-4 py-3 text-[13px] font-medium"
                  >
                    <AlertCircle size={15} />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  data-testid="generate-invoice-btn"
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#121212] px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-[#2A2A2A] active:scale-[0.98] transition-all"
                >
                  {invoiceData ? op.regenerateBtn : op.generateBtn}
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* Rule cards */}
              <div className="grid grid-cols-1 gap-5">
                <RuleCard
                  title={t.orderRules.title}
                  items={t.orderRules.items}
                  color="#8D5B4C"
                  Icon={ClipboardList}
                />
                <RuleCard
                  title={t.deliveryRules.title}
                  items={t.deliveryRules.items}
                  color="#86A789"
                  Icon={Truck}
                />
                <RuleCard
                  title={t.paymentRules.title}
                  items={t.paymentRules.items}
                  color="#9B2C2C"
                  Icon={CreditCard}
                />
                <Disclaimer />
              </div>
            </div>

            {/* RIGHT: summary sticky */}
            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-24 space-y-5">
                <div className="rounded-[2rem] bg-[#0A0A0A] text-white p-6 sm:p-7 ring-1 ring-white/5">
                  <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#FCD34D]">
                    {op.summary}
                  </div>
                  <h3 className="mt-2 font-display text-[20px] font-bold">
                    {totals.totalItems}{" "}
                    {lang === "id" ? "item dipilih" : "items in cart"}
                  </h3>

                  <div className="mt-5 space-y-2 text-[13.5px]">
                    <div className="flex justify-between text-white/70">
                      <span>{op.subtotal}</span>
                      <span data-testid="summary-subtotal">
                        {formatIDR(totals.subtotalOriginal)}
                      </span>
                    </div>
                    {orderedDiscount > 0 && (
                      <div className="flex justify-between text-[#FCD34D]">
                        <span>{op.discount}</span>
                        <span data-testid="summary-discount">
                          − {formatIDR(orderedDiscount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-white/70">
                      <span>{op.delivery}</span>
                      <span className="italic text-[12px] text-right max-w-[60%]">
                        {op.deliveryConfirmWa}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="font-display text-[15px] font-bold">
                      {op.total}
                    </span>
                    <span
                      className="font-display text-[24px] font-bold"
                      data-testid="summary-total"
                    >
                      {formatIDR(totals.subtotalAfterDiscount)}
                    </span>
                  </div>
                </div>

                {success && invoiceData && (
                  <div
                    data-testid="invoice-success"
                    className="rounded-2xl bg-[#86A789]/10 text-[#3F5C41] px-5 py-4 text-[13.5px] font-medium flex gap-2 items-start"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-[#86A789]"
                    />
                    <span>{op.invoiceCreated}</span>
                  </div>
                )}

                {invoiceData && (
                  <div className="rounded-[2rem] bg-white ring-1 ring-black/5 p-5 sm:p-6 space-y-3">
                    <button
                      type="button"
                      onClick={sendToWa}
                      data-testid="send-wa-btn"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#FCD34D] px-5 py-3.5 text-[14px] font-semibold text-white hover:bg-[#000000] transition-all"
                    >
                      <Send size={15} />
                      {op.sendWa}
                    </button>
                    <button
                      type="button"
                      onClick={downloadPdf}
                      data-testid="download-pdf-btn"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#121212] px-5 py-3.5 text-[14px] font-semibold text-white hover:bg-[#2A2A2A] transition-all"
                    >
                      <Download size={15} />
                      {op.downloadPdf}
                    </button>
                    <button
                      type="button"
                      onClick={downloadImage}
                      data-testid="download-img-btn"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#FDFBF7] px-5 py-3.5 text-[14px] font-semibold text-[#121212] ring-1 ring-black/10 hover:bg-white transition-all"
                    >
                      <ImageIcon size={15} />
                      {op.downloadImg}
                    </button>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Invoice preview */}
      {invoiceData && (
        <section
          id="invoice-anchor"
          className="py-12 md:py-20 bg-[#FDFBF7]"
        >
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <div className="text-center mb-7">
              <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8D5B4C]">
                <Info size={13} />
                {t.invoice.title}
              </div>
              <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-[#121212]">
                {invoiceData.invoiceNumber}
              </h2>
            </div>

            <Invoice
              ref={invoiceRef}
              invoiceData={invoiceData}
              lines={lines}
              totals={totals}
              status={form.status}
            />
          </div>
        </section>
      )}
    </div>
  );
}
