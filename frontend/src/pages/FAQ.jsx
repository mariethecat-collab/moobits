import { ArrowUpRight } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/ui/accordion";
import { useLang } from "../i18n/LanguageContext";
import { buildGenericWa } from "../data/products";

export default function FAQ() {
  const { t, lang } = useLang();
  return (
    <div data-testid="page-faq">
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-20 h-[420px] w-[420px] rounded-full bg-[#FCD34D]/20 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-4xl px-5 sm:px-8 pt-12 md:pt-20 pb-10">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#8D5B4C]">
            <span className="h-1 w-6 rounded-full bg-[#8D5B4C]" />
            {t.faq.eyebrow}
          </div>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#121212]">
            {t.faq.title}
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] sm:text-[17px] leading-relaxed text-[#525252]">
            {t.faq.sub}
          </p>
        </div>
      </section>

      <section className="pb-16 md:pb-24">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <Accordion
            type="single"
            collapsible
            className="w-full rounded-[2rem] bg-[#FDFBF7] ring-1 ring-black/5 overflow-hidden"
            data-testid="faq-accordion"
          >
            {t.faq.items.map(([q, a], i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="border-b border-black/5 last:border-0 px-5 sm:px-7"
              >
                <AccordionTrigger
                  data-testid={`faq-trigger-${i}`}
                  className="text-left text-[15.5px] sm:text-[16px] font-semibold text-[#121212] hover:no-underline py-5"
                >
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-[14.5px] leading-relaxed text-[#525252] pb-5">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-10 rounded-[2rem] bg-[#0A0A0A] text-white p-8 sm:p-10 text-center">
            <div className="text-[11px] uppercase tracking-[0.22em] font-bold text-[#FCD34D]">
              Still curious?
            </div>
            <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold">
              {lang === "id"
                ? "Tanya langsung ke admin Moobits."
                : "Ask Moobits admin directly."}
            </h2>
            <p className="mt-3 text-white/70 text-[14.5px]">
              {lang === "id"
                ? "Kami siap bantu kamu lewat WhatsApp."
                : "We're ready to help via WhatsApp."}
            </p>
            <a
              href={buildGenericWa(lang)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="faq-wa-cta"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-[#121212] hover:bg-[#FCD34D] transition-colors"
            >
              {t.nav.orderNow}
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
