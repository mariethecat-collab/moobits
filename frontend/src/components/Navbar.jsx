import { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useLang } from "../i18n/LanguageContext";
import { buildGenericWa, LOGO_URL } from "../data/products";

const NavItem = ({ to, children, onClick }) => (
  <NavLink
    to={to}
    end={to === "/"}
    onClick={onClick}
    data-testid={`nav-link-${to.replace("/", "") || "home"}`}
    className={({ isActive }) =>
      `relative px-1 py-2 text-[15px] font-medium transition-colors duration-200 ${
        isActive ? "text-[#121212]" : "text-[#525252] hover:text-[#121212]"
      } group`
    }
  >
    {({ isActive }) => (
      <>
        {children}
        <span
          className={`pointer-events-none absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-[#8D5B4C] transition-all duration-300 ${
            isActive ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </>
    )}
  </NavLink>
);

export default function Navbar() {
  const { t, lang, toggleLang } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/75 backdrop-blur-xl border-b border-black/5"
          : "bg-white/40 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 md:h-[72px] items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            data-testid="logo-link"
            className="flex items-center gap-2.5 group"
          >
            <div className="h-10 w-10 rounded-full overflow-hidden ring-1 ring-black/5 bg-black flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <img
                src={LOGO_URL}
                alt="Moobits"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="leading-none">
              <div className="font-display text-[18px] font-bold tracking-tight text-[#121212]">
                Moobits
              </div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-[#8D5B4C] mt-0.5">
                Sweet Treats
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8">
            <NavItem to="/">{t.nav.home}</NavItem>
            <NavItem to="/about">{t.nav.about}</NavItem>
            <NavItem to="/menu">{t.nav.menu}</NavItem>
            <NavItem to="/order-guide">{t.nav.orderGuide}</NavItem>
            <NavItem to="/faq">{t.nav.faq}</NavItem>
          </nav>

          {/* Right cluster */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language toggle */}
            <button
              type="button"
              onClick={toggleLang}
              data-testid="language-toggle"
              aria-label="Toggle language"
              className="hidden sm:flex items-center gap-1 rounded-full border border-black/10 bg-white/70 px-1 py-1 text-[12px] font-semibold"
            >
              <span
                className={`px-2.5 py-1 rounded-full transition-all ${
                  lang === "id"
                    ? "bg-[#121212] text-white"
                    : "text-[#525252] hover:text-[#121212]"
                }`}
              >
                ID
              </span>
              <span
                className={`px-2.5 py-1 rounded-full transition-all ${
                  lang === "en"
                    ? "bg-[#121212] text-white"
                    : "text-[#525252] hover:text-[#121212]"
                }`}
              >
                EN
              </span>
            </button>

            {/* Order CTA */}
            <a
              href={buildGenericWa(lang)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="navbar-order-cta"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-[#121212] px-4 lg:px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-[#2A2A2A] active:scale-[0.97]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#86A789] animate-pulse" />
              {t.nav.orderNow}
            </a>

            {/* Mobile menu trigger */}
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              data-testid="mobile-menu-toggle"
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white/70 text-[#121212]"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden overflow-hidden border-t border-black/5 transition-[max-height,opacity] duration-300 ease-out bg-white/95 backdrop-blur-xl ${
          open ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className="flex flex-col px-6 py-5 gap-1"
          data-testid="mobile-nav"
        >
          {[
            ["/", t.nav.home],
            ["/about", t.nav.about],
            ["/menu", t.nav.menu],
            ["/order-guide", t.nav.orderGuide],
            ["/faq", t.nav.faq],
          ].map(([to, label]) => (
            <Link
              key={to}
              to={to}
              data-testid={`mobile-nav-link-${to.replace("/", "") || "home"}`}
              className="py-3 text-[16px] font-medium text-[#121212] border-b border-black/5 last:border-0"
            >
              {label}
            </Link>
          ))}

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={toggleLang}
              data-testid="mobile-language-toggle"
              className="flex items-center gap-1 rounded-full border border-black/10 bg-white px-1 py-1 text-[12px] font-semibold"
            >
              <span
                className={`px-2.5 py-1 rounded-full ${
                  lang === "id"
                    ? "bg-[#121212] text-white"
                    : "text-[#525252]"
                }`}
              >
                ID
              </span>
              <span
                className={`px-2.5 py-1 rounded-full ${
                  lang === "en"
                    ? "bg-[#121212] text-white"
                    : "text-[#525252]"
                }`}
              >
                EN
              </span>
            </button>
            <a
              href={buildGenericWa(lang)}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="mobile-order-cta"
              className="inline-flex items-center gap-2 rounded-full bg-[#121212] px-4 py-2.5 text-sm font-semibold text-white"
            >
              {t.nav.orderNow}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
