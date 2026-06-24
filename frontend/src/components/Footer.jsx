import { Link } from "react-router-dom";
import { Instagram, Mail, MapPin, Clock, Phone } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { LOGO_URL } from "../data/products";

export default function Footer() {
  const { t } = useLang();
  return (
    <footer
      data-testid="site-footer"
      className="border-t border-black/5 bg-[#FDFBF7] mt-24"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand block */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full overflow-hidden bg-black ring-1 ring-black/5">
                <img
                  src={LOGO_URL}
                  alt="Moobits"
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="font-display text-xl font-bold text-[#121212]">
                  Moobits
                </div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-[#8D5B4C]">
                  {t.footer.tagline}
                </div>
              </div>
            </div>
            <p className="mt-5 text-[15px] leading-relaxed text-[#525252] max-w-md">
              {t.footer.brandLine}
            </p>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <div className="text-xs uppercase tracking-[0.2em] text-[#8D5B4C] font-bold mb-4">
              {t.footer.explore}
            </div>
            <ul className="space-y-2.5 text-[15px]">
              {[
                ["/", t.nav.home],
                ["/about", t.nav.about],
                ["/menu", t.nav.menu],
                ["/order-guide", t.nav.orderGuide],
                ["/faq", t.nav.faq],
                ["/bulk-order", t.nav.bulkOrder],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-[#525252] hover:text-[#121212] transition-colors"
                    data-testid={`footer-link-${to.replace("/", "") || "home"}`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <div className="text-xs uppercase tracking-[0.2em] text-[#8D5B4C] font-bold mb-4">
              {t.footer.contact}
            </div>
            <ul className="space-y-3 text-[15px] text-[#525252]">
              <li className="flex items-start gap-3">
                <Phone size={16} className="mt-1 text-[#121212]" />
                <a
                  href="https://wa.me/6283894855149"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#121212]"
                  data-testid="footer-whatsapp"
                >
                  083894855149
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={16} className="mt-1 text-[#121212]" />
                <a
                  href="mailto:moodinabites@gmail.com"
                  className="hover:text-[#121212]"
                  data-testid="footer-email"
                >
                  moodinabites@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Instagram size={16} className="mt-1 text-[#121212]" />
                <a
                  href="https://instagram.com/mooobits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#121212]"
                  data-testid="footer-instagram"
                >
                  @mooobits
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 text-[#121212]" />
                <span>
                  <span className="block text-xs uppercase tracking-wider text-[#8D5B4C] font-bold">
                    {t.footer.area}
                  </span>
                  Sunter, Jakarta Utara
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="mt-1 text-[#121212]" />
                <span>
                  <span className="block text-xs uppercase tracking-wider text-[#8D5B4C] font-bold">
                    {t.footer.hours}
                  </span>
                  07.00 – 17.00
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#8C8C8C]">
          <div>
            © {new Date().getFullYear()} Moobits. {t.footer.rights}
          </div>
          <div className="italic">Treat Yourself, Fix Your Mood.</div>
        </div>
      </div>
    </footer>
  );
}
