import {useEffect, useRef, useState} from "react";

const NAV_LINKS = [
    {id: "home", label: "Home"},
    {id: "about", label: "About"},
    {id: "projects", label: "Projects"},
    {id: "contact", label: "Contact"},
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
    const linkRefs = useRef({});
    const navRef = useRef(null);
    const [indicatorStyle, setIndicatorStyle] = useState({
        left: 0,
        width: 0,
        opacity: 0,
    });

    useEffect(() => {
        const updateIndicator = () => {
            const activeEl = linkRefs.current[activeSection];
            if (!activeEl) {
                setIndicatorStyle((prev) => ({...prev, opacity: 0}));
                return;
            }
            const parent = activeEl.parentElement;
            if (!parent) return;
            const parentRect = parent.getBoundingClientRect();
            const linkRect = activeEl.getBoundingClientRect();
            setIndicatorStyle({
                left: linkRect.left - parentRect.left,
                width: linkRect.width,
                opacity: 1,
            });
        };

        updateIndicator();
        window.addEventListener("resize", updateIndicator);
        return () => window.removeEventListener("resize", updateIndicator);
    }, [activeSection]);

    useEffect(() => {
        if (!isMenuOpen) return;

        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                onCloseMenu();
            }
        };

        const handleEscape = (e) => {
            if (e.key === "Escape") onCloseMenu();
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
            className={`fixed top-0 right-0 left-0 transition-all duration-300 ${
                isScrolled
                    ? "bg-white/90 dark:bg-black/80 backdrop-blur"
                    : "bg-transparent"
            }`}
        >
            <nav ref={navRef} className="max-w-7xl mx-auto p-5">
                <div className="flex items-center justify-between">
                    <a
                        href="#home"
                        className="text-gray-900 dark:text-white font-bold text-lg flex items-center gap-3"
                    >
                        <img
                            src={`${assetsBase}/icons/logo-braian.png`}
                            alt="Braian Barraza logo"
                            className="w-10 h-10 rounded-2xl"
                        />
                        Web portafolio
                    </a>

                    <div className="hidden md:flex items-center gap-10">
                        <div className="relative flex items-center gap-10 pb-2">
              <span
                  className="absolute bottom-0 h-1 rounded-full bg-primary/80 shadow-[0_0_12px_var(--color-primary-glow)] transition-all duration-300"
                  style={indicatorStyle}
                  aria-hidden="true"
              />
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.id}
                                    href={`#${link.id}`}
                                    ref={(node) => {
                                        if (node) linkRefs.current[link.id] = node;
                                    }}
                                    onClick={() => onSelectSection(link.id)}
                                    className={`transition-colors ${
                                        activeSection === link.id
                                            ? "text-primary"
                                            : "text-gray-800 dark:text-white hover:text-gray-500"
                                    }`}
                                >
                                    {link.label}
                                </a>
                            ))}
                        </div>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                id="themeButton"
                                type="checkbox"
                                className="sr-only peer"
                                checked={isLight}
                                onChange={(event) => onToggleTheme(event.target.checked)}
                                aria-label="Toggle light mode"
                            />
                            <div
                                className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        </label>
                        <button
                            onClick={onAuthAction}
                            className="text-gray-800 dark:text-white hover:text-primary transition-colors text-2xl"
                            aria-label={user ? "Admin panel" : "Sign in"}
                        >
                            <i className={`bx ${user ? "bx-grid-alt" : "bx-log-in"}`}></i>
                        </button>
                    </div>

                    <div className="md:hidden flex items-center gap-4">
                        <button
                            onClick={onAuthAction}
                            className="text-gray-900 dark:text-white hover:text-primary transition-colors text-2xl"
                            aria-label={user ? "Admin panel" : "Sign in"}
                        >
                            <i className={`bx ${user ? "bx-grid-alt" : "bx-log-in"}`}></i>
                        </button>
                        <button
                            id="mobile-menu-button"
                            className="text-gray-900 dark:text-white text-2xl"
                            onClick={onToggleMenu}
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                            aria-label="Toggle navigation"
                        >
                            <i className="bx bx-menu"></i>
                        </button>
                    </div>
                </div>

                <div
                    id="mobile-menu"
                    className={`${
                        isMenuOpen ? "block" : "hidden"
                    } md:hidden mt-2 rounded-lg bg-white/95 dark:bg-gray-900`}
                >
                    {NAV_LINKS.map((link) => (
                        <a
                            key={link.id}
                            href={`#${link.id}`}
                            onClick={() => onSelectSection(link.id)}
                            className={`block py-2 px-4 ${
                                activeSection === link.id
                                    ? "text-primary"
                                    : "text-gray-900 dark:text-white"
                            } hover:bg-gray-100 dark:hover:bg-gray-800`}
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            </nav>
        </header>
    );
};

export default Header;
