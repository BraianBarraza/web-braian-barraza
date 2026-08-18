import { skills } from "../data/skills";

const About = ({ assetsBase }) => (
  <section className="section-wrap py-16" id="about">
    <div className="mx-auto mb-14 max-w-2xl text-center">
      <p className="section-label mb-3">About me</p>
      <h2 className="font-display text-[clamp(2.25rem,5vw,3.4rem)] font-extrabold text-white">
        Development <span className="grad-text">Skills</span>
      </h2>
      <p className="mt-5 text-slate-400">
        Alongside my application development apprenticeship, I also work as a
        freelance web developer, building real interactive tools and assessment
        platforms for clients. This experience complements my frontend,
        backend, database, and API skills with direct responsibility for
        delivering production-ready projects.
      </p>
    </div>

    <div className="grid gap-6 md:grid-cols-3">
      {skills.map((skill) => (
        <article
          key={skill.title}
          className="glass group relative overflow-hidden rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1"
        >
          <div
            className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${skill.accent} to-transparent`}
          ></div>

          <div className="mb-6 h-52 overflow-hidden rounded-lg bg-white/[0.03]">
            <img
              src={`${assetsBase}${skill.image}`}
              alt={skill.alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>

          <h3 className="font-display mb-2 text-xl font-bold text-white">
            {skill.title}
          </h3>
          <p className="mb-5 min-h-12 text-sm leading-6 text-slate-400">
            {skill.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {skill.items.map((item) => (
              <span key={item} className="skill-pill">
                {item}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default About;
