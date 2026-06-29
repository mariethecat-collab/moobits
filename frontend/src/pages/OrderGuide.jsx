import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { buildGenericWa } from "../data/products";
import LoyaltyCard from "../components/LoyaltyCard";

export default function OrderGuide() {
  const { t, lang } = useLang();
  const og = t.orderGuidePage;
  return (
    <div data-testid="page-order-guide">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-20 h-[420px] w-[420px] rounded-full bg-[#86A789]/15 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-5xl px-5 sm:px-8 pt-12 md:pt-20 pb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#86A789]">
            <span className="h-1 w-6 rounded-full bg-[#86A789]" />
            {og.eyebrow}
          </div>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#121212]">
            {og.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] sm:text-[17px] leading-relaxed text-[#525252]">
            {og.sub}
          </p>
        </div>
      </section>

      {/* Steps timeline */}
      <section className="py-8 md:py-12">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <ol className="relative" data-testid="order-steps">
            <div className="absolute left-[18px] top-2 bottom-2 w-px bg-black/10" />
            {og.steps.map((step, i) => (
              <li
                key={i}
                data-testid={`order-step-${i + 1}`}
                className="relative pl-14 pb-7 last:pb-0"
              >
                <div className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-[#121212] text-white font-display text-[14px] font-bold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="rounded-2xl bg-[#FDFBF7] ring-1 ring-black/5 px-5 py-4">
                  <p className="text-[15.5px] leading-relaxed text-[#121212]">
                    {step}
                  </p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10">
            <a
              href={buildGenericWa(lang)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="order-guide-cta"
              className="inline-flex items-center gap-2 rounded-full bg-[#FCD34D] px-6 py-3.5 text-[15px] font-semibold text-[#121212] hover:bg-[#121212] hover:text-white active:scale-[0.97] transition-all"
            >
              {t.nav.orderNow}
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Rules */}
      <section className="py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <div className="rounded-[2.5rem] bg-[#FDFBF7] p-8 sm:p-10 lg:p-12 ring-1 ring-black/5">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#9B2C2C]">
              <span className="h-1 w-6 rounded-full bg-[#FCD34D]" />
              Rules
            </div>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold text-[#121212]">
              {og.rulesTitle}
            </h2>
            <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-[14.5px] leading-relaxed text-[#525252]">
              {og.rules.map((rule, i) => (
                <li key={i} className="flex gap-3">
                  <CheckCircle2
                    size={16}
                    className="mt-1 shrink-0 text-[#86A789]"
                  />
                  {rule}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <LoyaltyCard compact />
    </div>
  );
}
