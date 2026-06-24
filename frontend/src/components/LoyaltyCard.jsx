import { Sparkles } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";

const STAMPS = 5;

export default function LoyaltyCard({ compact = false }) {
  const { lang } = useLang();
  const title = "Loyalty Card";
  const body =
    lang === "id"
      ? "Beli 5 kali, gratis 1 produk cookies atau bolu mini all varian."
      : "Buy 5 times, get 1 free cookie or bolu mini of any variant.";
  const note =
    lang === "id"
      ? "Reward loyalty akan dikonfirmasi melalui WhatsApp."
      : "Loyalty rewards will be confirmed through WhatsApp.";

  return (
    <section
      data-testid="loyalty-card"
      className={compact ? "py-10" : "py-16 md:py-20"}
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8">
        <div className="relative rounded-[2.5rem] bg-[#FDFBF7] ring-1 ring-black/5 p-7 sm:p-10 overflow-hidden">
          <div className="absolute -top-20 -right-16 h-[260px] w-[260px] rounded-full bg-[#FCD34D]/20 blur-3xl pointer-events-none" />
          <div className="relative grid grid-cols-1 md:grid-cols-12 gap-7 items-center">
            <div className="md:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.22em] text-[#8D5B4C] ring-1 ring-black/5">
                <Sparkles size={12} className="text-[#FCD34D]" />
                {title}
              </div>
              <h3 className="mt-4 font-display text-[26px] sm:text-[30px] font-bold tracking-tight text-[#121212] leading-tight">
                {body}
              </h3>
              <p className="mt-3 text-[13.5px] text-[#525252]">{note}</p>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-[1.75rem] bg-white ring-1 ring-black/5 p-5">
                <div className="text-[10px] uppercase tracking-[0.22em] font-bold text-[#737373]">
                  Moobits · Stamp Card
                </div>
                <div className="mt-4 grid grid-cols-5 gap-2.5">
                  {Array.from({ length: STAMPS }).map((_, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-full bg-[#FDFBF7] ring-1 ring-dashed ring-[#8D5B4C]/35 flex items-center justify-center"
                    >
                      <span className="font-display text-[14px] font-bold text-[#8D5B4C]/45">
                        {i + 1}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] text-[#737373]">
                  <span>Free reward</span>
                  <span className="font-bold text-[#9B2C2C]">1 free treat</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
