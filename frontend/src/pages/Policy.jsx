import { ArrowUpRight } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { buildGenericWa } from "../data/products";

const Section = ({ title, items }) => (
  <div className="rounded-[1.5rem] bg-white ring-1 ring-black/5 p-6 sm:p-7">
    <h2 className="font-display text-[20px] font-bold text-[#121212]">{title}</h2>
    <ul className="mt-4 space-y-2.5 text-[14px] leading-relaxed text-[#525252]">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8D5B4C]" />
          {it}
        </li>
      ))}
    </ul>
  </div>
);

export default function Policy() {
  const { lang } = useLang();

  const terms = lang === "id" ? [
    "Moobits menggunakan sistem pre-order. Same-day order belum tersedia.",
    "Ready stock hanya tersedia jika ada produksi lebih.",
    "Order dianggap sah setelah konfirmasi via WhatsApp.",
    "Pembayaran wajib dilakukan dalam 1x24 jam setelah invoice dikirim.",
    "Jika pembayaran tidak dilakukan dalam 1x24 jam, pesanan otomatis dibatalkan.",
    "Untuk bulk order, DP minimal 50%.",
    "Produk dibuat homemade — bentuk, topping, warna, dan tampilan akhir bisa sedikit berbeda dari foto.",
    "Produk mengandung telur, gluten, keju/dairy, dan beberapa varian mengandung almond.",
    "Pengiriman hanya untuk area Jakarta. Pickup hanya di area Sunter, Jakarta Utara.",
    "Detail alamat pickup diberikan via WhatsApp.",
    "Kerusakan akibat proses pengiriman oleh kurir berada di luar tanggung jawab Moobits.",
  ] : [
    "Moobits uses a pre-order system. Same-day orders are not available yet.",
    "Ready stock is only available when there is extra production.",
    "An order is confirmed once confirmed via WhatsApp.",
    "Payment must be completed within 1x24 hours after the invoice is sent.",
    "If payment is not completed within 1x24 hours, the order is automatically canceled.",
    "Bulk orders require a minimum 50% down payment.",
    "Products are homemade — shape, topping, color, and final look may slightly differ from photos.",
    "Products contain egg, gluten, cheese/dairy, and some variants contain almond.",
    "Delivery is available for Jakarta area only. Pickup is in Sunter, North Jakarta.",
    "Detailed pickup address is shared via WhatsApp.",
    "Damage caused during courier delivery is outside Moobits responsibility.",
  ];

  const refund = lang === "id" ? [
    "Order yang sudah diproduksi/in production tidak dapat di-refund.",
    "Pembatalan sebelum produksi: refund 100% jika sudah dibayar penuh.",
    "Bulk order: DP 50% tidak dapat dikembalikan jika order dibatalkan customer.",
    "Salah alamat adalah tanggung jawab customer, tetapi alamat masih bisa diubah sebelum kurir berangkat.",
    "Untuk komplain produk, kirim detail order + foto produk via WhatsApp dalam 24 jam setelah penerimaan.",
    "Refund/penggantian produk akibat kelalaian Moobits akan dikonfirmasi via WhatsApp.",
  ] : [
    "Orders already in production cannot be refunded.",
    "Cancellation before production: 100% refund if payment has been completed in full.",
    "Bulk orders: the 50% down payment is non-refundable if the customer cancels.",
    "Wrong address is the customer's responsibility, but the address can be updated before the courier departs.",
    "For product complaints, send the order details + photos via WhatsApp within 24 hours of receipt.",
    "Refunds or replacements due to Moobits negligence will be confirmed via WhatsApp.",
  ];

  return (
    <div data-testid="page-policy">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-20 h-[420px] w-[420px] rounded-full bg-[#8D5B4C]/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-5 sm:px-8 pt-12 md:pt-20 pb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8D5B4C]">
            <span className="h-1 w-6 rounded-full bg-[#8D5B4C]" />
            {lang === "id" ? "Kebijakan" : "Policy"}
          </div>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#121212]">
            {lang === "id" ? "Syarat & Ketentuan" : "Terms & Refund Policy"}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-[#525252]">
            {lang === "id"
              ? "Ketentuan ini menjelaskan bagaimana Moobits memproses, mengirim, dan menangani pembatalan order kamu."
              : "These terms cover how Moobits processes, delivers, and handles cancellations for your order."}
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Section
            title={lang === "id" ? "Syarat & Ketentuan" : "Terms & Conditions"}
            items={terms}
          />
          <Section
            title={lang === "id" ? "Refund & Pembatalan" : "Refund & Cancellation"}
            items={refund}
          />
        </div>
        <div className="mt-8 text-center">
          <a
            href={buildGenericWa(lang)}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="policy-wa-cta"
            className="inline-flex items-center gap-2 rounded-full bg-[#FCD34D] px-6 py-3.5 text-[14px] font-semibold text-[#121212] hover:bg-[#121212] hover:text-white transition-all"
          >
            {lang === "id" ? "Tanya via WhatsApp" : "Ask via WhatsApp"}
            <ArrowUpRight size={15} />
          </a>
        </div>
      </section>
    </div>
  );
}
