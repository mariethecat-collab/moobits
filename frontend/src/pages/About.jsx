import { ArrowUpRight } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { buildGenericWa, LOGO_URL } from "../data/products";

export default function About() {
  const { t, lang } = useLang();
  return (
    <div data-testid="page-about">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -right-24 h-[420px] w-[420px] rounded-full bg-[#8D5B4C]/10 blur-3xl" />
          <div className="absolute top-1/2 -left-20 h-[360px] w-[360px] rounded-full bg-[#FCD34D]/15 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl px-5 sm:px-8 pt-12 md:pt-20 pb-12">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8D5B4C]">
            <span className="h-1 w-6 rounded-full bg-[#8D5B4C]" />
            {t.about.eyebrow}
          </div>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#121212]">
            {t.about.title}
          </h1>
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-7 space-y-5 text-[16px] sm:text-[17px] leading-relaxed text-[#525252]">
              <p>{t.about.body1}</p>
              <p>{t.about.body2}</p>

              <div className="pt-2">
                <a
                  href={buildGenericWa(lang)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="about-order-cta"
                  className="inline-flex items-center gap-2 rounded-full bg-[#121212] px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-[#2A2A2A] active:scale-[0.97] transition-all"
                >
                  {t.nav.orderNow}
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-[2.5rem] bg-[#0A0A0A] aspect-square overflow-hidden ring-1 ring-black/5 flex items-center justify-center">
                <img
                  src={LOGO_URL}
                  alt="Moobits logo"
                  className="w-[88%] h-[88%] object-contain rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-24 bg-[#FDFBF7]">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#86A789]">
              <span className="h-1 w-6 rounded-full bg-[#86A789]" />
              Values
            </div>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#121212]">
              {t.about.valuesTitle}
            </h2>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {t.about.values.map((v, i) => {
              const colors = ["#8D5B4C", "#86A789", "#FCD34D", "#9B2C2C", "#3B82F6"];
              const c = colors[i % colors.length];
              return (
                <div
                  key={v.t}
                  data-testid={`value-card-${i}`}
                  className="rounded-[2rem] bg-white p-7 ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                >
                  <span
                    className="block h-1.5 w-10 rounded-full"
                    style={{ background: c }}
                  />
                  <div className="mt-5 font-display text-[20px] font-semibold text-[#121212]">
                    {v.t}
                  </div>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-[#525252]">
                    {v.b}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
