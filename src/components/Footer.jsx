const Footer = ({ assetsBase }) => (
  <footer className="border-t border-white/8 px-5 py-8">
    <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <a href="#home" className="flex items-center gap-3">
        <img
          src={`${assetsBase}/icons/logo-braian.png`}
          className="h-9 w-9 rounded-lg border border-cyan-300/20"
          alt="Braian Barraza Logo"
        />
        <span className="font-display font-bold text-white">
          Braian Barraza
        </span>
      </a>

      <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
        <a
          href="mailto:Braian_019@hotmail.com"
          className="inline-flex items-center gap-2 transition-colors hover:text-cyan-200"
        >
          <i className="bx bx-envelope text-base"></i>
          Braian_019@hotmail.com
        </a>
        <a
          href="tel:+4917677668526"
          className="inline-flex items-center gap-2 transition-colors hover:text-cyan-200"
        >
          <i className="bx bx-phone text-base"></i>
          01767 7668526
        </a>
        <a
          href={`${assetsBase}/img/CV%20Braian%20Camilo%20Barraza.pdf`}
          download
          className="inline-flex items-center gap-2 transition-colors hover:text-cyan-200"
        >
          <i className="bx bx-download text-base"></i>
          Download CV
        </a>
      </div>

      <p className="text-sm text-slate-600">
        &copy; {new Date().getFullYear()} Braian Barraza. All Rights Reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
