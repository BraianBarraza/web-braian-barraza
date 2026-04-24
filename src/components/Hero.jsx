import { socialLinks } from "../data/socialLinks";

const Hero = ({ assetsBase, isLight }) => {
  const heroImage = isLight
    ? `${assetsBase}/img/3d_character_orange_nobg.png`
    : `${assetsBase}/img/3d_character_blue_nobg.png`;

  return (
    <section id="home" className="section-wrap min-h-screen pt-28">
      <div className="grid min-h-[calc(100vh-7rem)] items-center gap-12 py-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div>
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-emerald-300/20 bg-emerald-300/5 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]"></span>
            <span className="section-label text-emerald-300">
              Available for work
            </span>
          </div>

          <h1 className="font-display mb-5 text-[clamp(3rem,8vw,5.8rem)] font-extrabold leading-[0.98] text-white">
            Hello, I'm
            <br />
            <span className="grad-text">Braian Barraza</span>
          </h1>

          <p className="mb-4 text-lg text-slate-400">
            Application Developer Apprentice @ SHD Andernach
          </p>

          <p className="mb-9 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
            Passionate about both frontend and backend development, with
            experience in JavaScript, Vue, React, PHP, Symfony, Java, and SQL
            databases. I enjoy building modern, reliable web applications and
            working with tools such as IntelliJ IDEA, PhpStorm, GitHub, GitLab,
            and Jira.
          </p>

          <div className="mb-10 flex flex-wrap gap-4">
            <a href="#contact" className="btn-primary-modern">
              Contact me
              <i className="bx bx-right-arrow-alt text-lg"></i>
            </a>
            <a href="#projects" className="btn-outline-modern">
              See Projects
            </a>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-500">Find me on</span>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="glass flex h-11 w-11 items-center justify-center rounded-lg transition-all hover:border-cyan-300/40 hover:bg-cyan-300/10"
                  aria-label={link.name}
                >
                  <img
                    src={`${assetsBase}${link.icon}`}
                    alt=""
                    className="h-5 w-5"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[25rem] lg:max-w-[30rem]">
          <div className="glass relative overflow-hidden rounded-lg p-6 shadow-[0_30px_80px_rgba(0,0,0,0.28)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-cyan-300 via-violet-500 to-transparent"></div>
            <img
              src={heroImage}
              alt="Braian Barraza 3D character"
              className="mx-auto aspect-square w-full object-contain"
              loading="lazy"
            />
            <div className="glass-strong absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-lg px-4 py-2 font-display text-sm font-bold text-cyan-200">
              <i className="bx bx-code-alt text-lg"></i>
              Open to opportunities
            </div>
          </div>

          <div className="glass absolute -right-4 top-8 rounded-lg px-4 py-2 font-display text-sm font-bold text-cyan-200">
            React
          </div>
          <div className="glass absolute -left-4 bottom-16 rounded-lg px-4 py-2 font-display text-sm font-bold text-lime-200">
            Tailwind
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
