import { useState } from "react";
import { ArrowUpRight, CheckCircle2, Users } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { WHATSAPP_NUMBER } from "../data/products";

const inputCls =
  "w-full rounded-2xl bg-white px-4 py-3 text-[14px] text-[#121212] placeholder:text-[#A3A3A3] ring-1 ring-black/10 focus:ring-[#8D5B4C] focus:outline-none transition";
const labelCls = "block text-[12px] font-semibold text-[#525252] mb-1.5";

export default function BulkOrder() {
  const { t, lang } = useLang();
  const b = t.bulkOrder;

  const [form, setForm] = useState({
    name: "",
    whatsapp: "",
    eventType: b.fields.eventTypeOptions[0],
    qty: "",
    date: "",
    notes: "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const buildMessage = () => {
    if (lang === "id") {
      return [
        "Halo Moobits, aku mau diskusi bulk order ya.",
        "",
        `Nama: ${form.name || "-"}`,
        `Nomor WhatsApp: ${form.whatsapp || "-"}`,
        `Tipe Acara: ${form.eventType}`,
        `Estimasi Jumlah: ${form.qty || "-"}`,
        `Tanggal Acara: ${form.date || "-"}`,
        `Catatan: ${form.notes || "-"}`,
        "",
        "Mohon dibantu konfirmasi ketersediaan dan harga ya. Thank you!",
      ].join("\n");
    }
    return [
      "Hello Moobits, I would like to discuss a bulk order.",
      "",
      `Name: ${form.name || "-"}`,
      `WhatsApp Number: ${form.whatsapp || "-"}`,
      `Event Type: ${form.eventType}`,
      `Estimated Quantity: ${form.qty || "-"}`,
      `Event Date: ${form.date || "-"}`,
      `Notes: ${form.notes || "-"}`,
      "",
      "Please confirm availability and pricing. Thank you!",
    ].join("\n");
  };

  const submit = (e) => {
    e.preventDefault();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      buildMessage()
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div data-testid="page-bulk-order">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-20 h-[420px] w-[420px] rounded-full bg-[#FCD34D]/15 blur-3xl" />
          <div className="absolute top-1/3 -right-20 h-[360px] w-[360px] rounded-full bg-[#9B2C2C]/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-5 sm:px-8 pt-12 md:pt-20 pb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#9B2C2C]">
            <span className="h-1 w-6 rounded-full bg-[#9B2C2C]" />
            {b.eyebrow}
          </div>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#121212]">
            {b.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] sm:text-[17px] leading-relaxed text-[#525252]">
            {b.sub}
          </p>
        </div>
      </section>

      <section className="py-6 md:py-10">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-7">
          {/* Form */}
          <form
            onSubmit={submit}
            data-testid="bulk-order-form"
            className="rounded-[2rem] bg-white ring-1 ring-black/5 p-6 space-y-5"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-[#9B2C2C]/10 text-[#9B2C2C] flex items-center justify-center">
                <Users size={18} />
              </div>
              <h2 className="font-display text-[19px] font-bold text-[#121212]">
                {lang === "id"
                  ? "Detail Acara Kamu"
                  : "Your Event Details"}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>{b.fields.name}</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder={b.placeholders.name}
                  className={inputCls}
                  data-testid="bulk-name"
                />
              </div>
              <div>
                <label className={labelCls}>{b.fields.whatsapp}</label>
                <input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => set("whatsapp", e.target.value)}
                  placeholder={b.placeholders.whatsapp}
                  className={inputCls}
                  data-testid="bulk-whatsapp"
                />
              </div>
              <div>
                <label className={labelCls}>{b.fields.eventType}</label>
                <select
                  value={form.eventType}
                  onChange={(e) => set("eventType", e.target.value)}
                  className={inputCls}
                  data-testid="bulk-event-type"
                >
                  {b.fields.eventTypeOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>{b.fields.qty}</label>
                <input
                  type="text"
                  value={form.qty}
                  onChange={(e) => set("qty", e.target.value)}
                  placeholder={b.placeholders.qty}
                  className={inputCls}
                  data-testid="bulk-qty"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>{b.fields.date}</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => set("date", e.target.value)}
                  className={inputCls}
                  data-testid="bulk-date"
                />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>{b.fields.notes}</label>
                <textarea
                  rows={3}
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder={b.placeholders.notes}
                  className={inputCls}
                  data-testid="bulk-notes"
                />
              </div>
            </div>

            <button
              type="submit"
              data-testid="bulk-submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#9B2C2C] px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-[#7e2222] active:scale-[0.98] transition-all"
            >
              {b.cta}
              <ArrowUpRight size={16} />
            </button>
          </form>

          {/* Rules */}
          <div className="rounded-[2rem] bg-[#FDFBF7] ring-1 ring-black/5 p-7">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#9B2C2C]">
              <span className="h-1 w-6 rounded-full bg-[#9B2C2C]" />
              {b.rulesTitle}
            </div>
            <ul className="mt-6 space-y-3 text-[14px] leading-relaxed text-[#525252]">
              {b.rules.map((r, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2
                    size={16}
                    className="mt-1 shrink-0 text-[#86A789]"
                  />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
