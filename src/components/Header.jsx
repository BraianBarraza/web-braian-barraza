import { useEffect, useRef } from "react";

const NAV_LINKS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

const Header = ({
  assetsBase,
  isMenuOpen,
  isScrolled,
  isLight,
  activeSection,
  user,
  onToggleMenu,
  onToggleTheme,
  onSelectSection,
  onCloseMenu,
  onAuthAction,
}) => {
  const navRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        onCloseMenu();
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") onCloseMenu();
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen, onCloseMenu]);

  return (
    <header
      className={`fixed inset-x-0 top-0 transition-all duration-300 ${
        isScrolled
          ? isLight
            ? "border-b border-slate-900/10 bg-[#f6fbff]/85 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl"
            : "border-b border-white/8 bg-[#080c10]/85 shadow-[0_18px_60px_rgba(0,0,0,0.24)] backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <nav ref={navRef} className="section-wrap py-4">
        <div className="flex items-center justify-between gap-4">
          <a
            href="#home"
            onClick={() => onSelectSection("home")}
            className="group flex items-center gap-3"
            aria-label="Braian Barraza home"
          >
            <img
              src={`${assetsBase}/icons/logo-braian.png`}
              alt="Braian Barraza logo"
              className="h-10 w-10 rounded-lg border border-cyan-300/20 shadow-[0_0_24px_rgba(0,229,255,0.12)]"
            />
            <span className="font-display text-base font-bold text-white transition-colors group-hover:text-cyan-200">
              Braian Barraza
            </span>
          </a>

          <div className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={() => onSelectSection(link.id)}
                className={`nav-link ${
                  activeSection === link.id ? "active" : ""
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`${assetsBase}/img/CV%20Braian%20Camilo%20Barraza.pdf`}
              download
              className="btn-outline-modern hidden min-h-10 px-4 text-xs sm:inline-flex"
            >
              <i className="bx bx-download text-base"></i>
              CV
            </a>

            <button
              onClick={() => onToggleTheme(!isLight)}
              className="glass flex h-10 w-10 items-center justify-center rounded-lg text-lg text-slate-200 transition-colors hover:text-cyan-200"
              aria-label="Toggle theme accent"
            >
              <i className={`bx ${isLight ? "bx-sun" : "bx-moon"}`}></i>
            </button>

            <button
              onClick={onAuthAction}
              className="glass flex h-10 w-10 items-center justify-center rounded-lg text-lg text-slate-200 transition-colors hover:text-cyan-200"
              aria-label={user ? "Admin panel" : "Sign in"}
            >
              <i className={`bx ${user ? "bx-grid-alt" : "bx-log-in"}`}></i>
            </button>

            <button
              id="mobile-menu-button"
              className="glass flex h-10 w-10 items-center justify-center rounded-lg text-2xl text-white md:hidden"
              onClick={onToggleMenu}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation"
            >
              <i className={`bx ${isMenuOpen ? "bx-x" : "bx-menu"}`}></i>
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={`${
            isMenuOpen ? "grid" : "hidden"
          } glass-strong mt-4 gap-2 rounded-lg p-3 md:hidden`}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={() => onSelectSection(link.id)}
              className={`rounded-md px-4 py-3 font-display text-lg font-bold transition-colors ${
                activeSection === link.id
                  ? "bg-cyan-300/10 text-cyan-200"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href={`${assetsBase}/img/CV%20Braian%20Camilo%20Barraza.pdf`}
            download
            className="btn-outline-modern mt-2 sm:hidden"
          >
            <i className="bx bx-download text-base"></i>
            Download CV
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
