import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

const SECTIONS = ["home", "about", "projects", "contact"];

const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", !isLight);
  }, [isLight]);

  useEffect(() => {
    const sections = SECTIONS
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (sections.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSection(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const assetsBase = useMemo(
    () => (import.meta.env.BASE_URL || "/").replace(/\/$/, ""),
    []
  );

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <div className="bg-white text-gray-900 dark:bg-background dark:text-white min-h-screen transition-colors duration-300">
      <Header
        assetsBase={assetsBase}
        isMenuOpen={isMenuOpen}
        isScrolled={isScrolled}
        isLight={isLight}
        activeSection={activeSection}
        onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
        onToggleTheme={setIsLight}
        onSelectSection={(sectionId) => {
          setActiveSection(sectionId);
          setIsMenuOpen(false);
        }}
        onCloseMenu={closeMenu}
      />
      <Hero assetsBase={assetsBase} />
      <About assetsBase={assetsBase} />
      <Projects assetsBase={assetsBase} />
      <Contact />
      <Footer assetsBase={assetsBase} />
    </div>
  );
};

export default App;
