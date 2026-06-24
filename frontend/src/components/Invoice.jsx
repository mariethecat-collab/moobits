import { forwardRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { LOGO_URL, formatIDR } from "../data/products";
import { useLang } from "../i18n/LanguageContext";

/**
 * Invoice — branded printable invoice, rendered into a ref'd DOM node
 * so it can be captured with html2canvas and exported to PDF / image.
 */
const Invoice = forwardRef(function Invoice(
  { invoiceData, lines, totals, status },
  ref
) {
  const { t, lang } = useLang();
  const inv = t.invoice;

  const statusOptions = t.orderPage.fields.statusOptions;
  const statusIdx = ["Belum Dibayar", "Sudah Dibayar", "DP 50%", "Unpaid", "Paid", "50% Down Payment"].includes(
    status
  )
    ? null
    : null;
  // Map raw status to current-lang label
  const statusLabelMap = {
    Unpaid: statusOptions[0],
    Paid: statusOptions[1],
    "DP 50%": statusOptions[2],
  };
  const statusLabel = statusLabelMap[status] || status;
  const statusColor =
    status === "Paid"
      ? "#86A789"
      : status === "DP 50%"
      ? "#FCD34D"
      : "#9B2C2C";

  return (
    <div
      ref={ref}
      data-testid="invoice-printable"
      className="bg-white text-[#121212] mx-auto w-full"
      style={{
        width: "640px",
        maxWidth: "100%",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      <div className="rounded-[28px] ring-1 ring-black/5 overflow-hidden">
        {/* Header */}
        <div className="relative bg-[#FDFBF7] px-8 py-7">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8D5B4C] via-[#FCD34D] to-[#9B2C2C]" />
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-full overflow-hidden bg-black ring-1 ring-black/5">
                <img
                  src={LOGO_URL}
                  alt="Moobits"
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div>
                <div
                  className="font-bold text-[22px] text-[#121212] leading-none"
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  Moobits
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-[#8D5B4C] font-bold">
                  {inv.tagline}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#737373] font-bold">
                {inv.title}
              </div>
              <div
                className="mt-1 font-bold text-[15px] text-[#121212]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {invoiceData.invoiceNumber}
              </div>
              <div className="mt-2 inline-block text-[10px] font-bold uppercase tracking-[0.15em] rounded-full px-2.5 py-1"
                style={{ background: statusColor, color: "#fff" }}
              >
                {statusLabel}
              </div>
            </div>
          </div>
        </div>

        {/* Customer */}
        <div className="px-8 py-6 grid grid-cols-2 gap-x-6 gap-y-4 text-[12px]">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-bold">
              {inv.date}
            </div>
            <div className="mt-1 font-semibold text-[#121212]">
              {invoiceData.orderDate}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-bold">
              {inv.method}
            </div>
            <div className="mt-1 font-semibold text-[#121212]">
              {invoiceData.method}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-bold">
              {inv.customer}
            </div>
            <div className="mt-1 font-semibold text-[#121212]">
              {invoiceData.customerName || "—"}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-bold">
              {inv.whatsapp}
            </div>
            <div className="mt-1 font-semibold text-[#121212]">
              {invoiceData.customerWa || "—"}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-bold">
              {inv.deliveryDate}
            </div>
            <div className="mt-1 font-semibold text-[#121212]">
              {invoiceData.deliveryDate || "—"}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-bold">
              {inv.paymentMethod}
            </div>
            <div className="mt-1 font-semibold text-[#121212]">
              {invoiceData.paymentMethod || "—"}
            </div>
          </div>
          {invoiceData.method === t.orderPage.fields.delivery && (
            <div className="col-span-2">
              <div className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-bold">
                {inv.address}
              </div>
              <div className="mt-1 font-semibold text-[#121212]">
                {invoiceData.address || inv.noAddress}
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        <div className="px-8 pb-6">
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#8D5B4C] font-bold mb-3">
            {inv.orderDetails}
          </div>
          <div className="rounded-2xl bg-[#FDFBF7] ring-1 ring-black/5 divide-y divide-black/5">
            {lines.map((l) => (
              <div
                key={l.id}
                className="flex gap-3 p-3"
                data-testid={`invoice-line-${l.id}`}
              >
                <div className="h-16 w-16 shrink-0 rounded-xl overflow-hidden bg-black">
                  {l.product.image && (
                    <img
                      src={l.product.image}
                      alt={l.product.name}
                      className="product-img-blend h-full w-full object-cover"
                      crossOrigin="anonymous"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9.5px] uppercase tracking-wider font-bold"
                    style={{ color: l.product.accent }}
                  >
                    {l.product.category}
                  </div>
                  <div
                    className="text-[13px] font-semibold text-[#121212] leading-tight"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    {l.product.name}
                  </div>
                  {l.note && (
                    <div className="mt-0.5 text-[11px] text-[#525252] italic">
                      {inv.note}: {l.note}
                    </div>
                  )}
                  <div className="mt-1 flex items-center justify-between text-[11.5px] text-[#525252]">
                    <span>
                      {l.qty} × {formatIDR(l.unit)}
                    </span>
                    <span className="font-bold text-[#121212]">
                      {formatIDR(l.lineTotal)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-5 space-y-1.5 text-[12.5px]">
            <div className="flex justify-between text-[#525252]">
              <span>{inv.subtotal}</span>
              <span>{formatIDR(totals.subtotalOriginal)}</span>
            </div>
            {totals.discount > 0 && (
              <div className="flex justify-between text-[#9B2C2C]">
                <span>{inv.discount}</span>
                <span>− {formatIDR(totals.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-[#525252]">
              <span>{inv.delivery}</span>
              <span className="italic">{inv.deliveryNote}</span>
            </div>
            <div className="flex justify-between items-center pt-2.5 mt-2.5 border-t border-black/10">
              <span
                className="font-bold text-[14px]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {inv.total}
              </span>
              <span
                className="font-bold text-[22px] text-[#121212]"
                style={{ fontFamily: "'Outfit', sans-serif" }}
                data-testid="invoice-grand-total"
              >
                {formatIDR(totals.subtotalAfterDiscount)}
              </span>
            </div>
          </div>
        </div>

        {/* QR section */}
        <div className="mx-8 mb-6 rounded-2xl bg-[#0A0A0A] text-white p-5">
          <div className="flex items-center gap-4">
            <div className="h-[120px] w-[120px] shrink-0 rounded-xl bg-white p-2 flex items-center justify-center">
              <QRCodeSVG
                value={`MOOBITS|${invoiceData.invoiceNumber}|${totals.subtotalAfterDiscount}|Isagizz Store`}
                size={104}
                level="M"
                bgColor="#FFFFFF"
                fgColor="#0A0A0A"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#FCD34D] font-bold">
                {inv.qrTitle}
              </div>
              <div
                className="mt-1 font-bold text-[15px] leading-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Isagizz Store
              </div>
              <div className="mt-2 text-[11.5px] text-white/70 leading-relaxed">
                {inv.qrPlaceholder}
              </div>
              <div className="mt-2 text-[10.5px] text-white/55">
                BCA · QRIS · E-wallet · Cash · COD
              </div>
            </div>
          </div>
        </div>

        {/* Extras */}
        <div className="px-8 pb-5 grid grid-cols-2 gap-4 text-[11.5px]">
          {invoiceData.greeting && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-bold">
                {inv.greeting}
              </div>
              <div className="mt-0.5 text-[#121212]">{invoiceData.greeting}</div>
            </div>
          )}
          {invoiceData.custom && (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-bold">
                {inv.custom}
              </div>
              <div className="mt-0.5 text-[#121212]">{invoiceData.custom}</div>
            </div>
          )}
          {invoiceData.notes && (
            <div className="col-span-2">
              <div className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-bold">
                {inv.notes}
              </div>
              <div className="mt-0.5 text-[#121212]">{invoiceData.notes}</div>
            </div>
          )}
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-bold">
              {inv.paymentDeadline}
            </div>
            <div className="mt-0.5 text-[#121212]">{inv.paymentDeadlineValue}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider text-[#8C8C8C] font-bold">
              {inv.adminWa}
            </div>
            <div className="mt-0.5 text-[#121212]">083894855149</div>
          </div>
        </div>

        {/* Footer note */}
        <div className="bg-[#FDFBF7] px-8 py-5 text-center">
          <div
            className="text-[12px] text-[#525252] italic"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            {inv.thanks}
          </div>
          <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#8D5B4C] font-bold">
            Moobits · @mooobits · Sunter, Jakarta Utara
          </div>
        </div>
      </div>
    </div>
  );
});

export default Invoice;
