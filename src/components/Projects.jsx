import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Card from "./Card";

const Projects = ({ assetsBase }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(
          collection(db, "projects"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        setProjects(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error loading projects:", err);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!selectedProject) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") setSelectedProject(null);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [selectedProject]);

  const getImageSrc = (project) => {
    if (project.imageUrl) return project.imageUrl;
    if (project.image) return `${assetsBase}${project.image}`;
    return null;
  };

  const getProjectKey = (project) => project.id || project.title;
  const getTechList = (technologies = "") =>
    technologies
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean);

  const openProject = (project) => setSelectedProject(project);
  const closeProject = () => setSelectedProject(null);

  return (
    <section className="section-wrap py-16" id="projects">
      <div className="mb-14 flex flex-col gap-5 border-t border-white/8 pt-14 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="section-label mb-3">Portfolio</p>
          <h2 className="font-display text-[clamp(2.25rem,5vw,3.4rem)] font-extrabold text-white">
            Web Development <span className="grad-text">Projects</span>
          </h2>
        </div>
        <p className="max-w-md text-md leading-7 text-slate-400">
          React, Vue, PHP, Symfony, Java, and database projects that
          show practical problem solving, responsive interfaces, and efficient
          application development.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="glass mx-auto max-w-xl rounded-lg border-dashed px-6 py-12 text-center">
          <i className="bx bx-folder-open mb-4 block text-5xl text-slate-600"></i>
          <p className="text-slate-400">
            Projects added from the admin panel will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const imageSrc = getImageSrc(project);
            const techList = getTechList(project.technologies);
            return (
              <Card
                key={getProjectKey(project)}
                className="project-card group h-[500px] overflow-hidden rounded-lg focus-within:ring-2 focus-within:ring-cyan-300/60"
              >
                <article
                  role="button"
                  tabIndex={0}
                  onClick={() => openProject(project)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openProject(project);
                    }
                  }}
                  className="flex h-full flex-col outline-none"
                >
                  <div className="h-56 w-full overflow-hidden border-b border-white/8 bg-[#0d1117]">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={project.alt || project.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <i className="bx bx-image text-5xl text-slate-700"></i>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display mb-3 text-xl font-bold text-white">
                      {project.title}
                    </h3>
                    <p className="mb-5 flex-1 overflow-hidden text-sm leading-7 text-slate-400">
                      {project.description}
                    </p>
                    {techList.length > 0 && (
                      <div className="mb-5 flex flex-wrap gap-2">
                        {techList.slice(0, 4).map((tech) => (
                          <span key={tech} className="tech-tag">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-200">
                      View details
                      <i className="bx bx-right-arrow-alt text-lg"></i>
                    </p>
                  </div>
                </article>
              </Card>
            );
          })}
        </div>
      )}

      {selectedProject && (
        <ProjectDetails
          project={selectedProject}
          imageSrc={getImageSrc(selectedProject)}
          techList={getTechList(selectedProject.technologies)}
          onClose={closeProject}
        />
      )}
    </section>
  );
};

const ProjectDetails = ({ project, imageSrc, techList, onClose }) => (
  <div
    className="fixed inset-0 z-[10004] bg-black/75 p-4 backdrop-blur-sm md:p-8"
    onClick={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}
  >
    <div className="glass-strong relative mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-lg shadow-2xl xl:grid xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]">
      <button
        type="button"
        onClick={onClose}
        className="glass absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-lg text-2xl text-white transition-colors hover:text-cyan-200"
        aria-label="Close project details"
      >
        <i className="bx bx-x"></i>
      </button>

      <div className="min-h-[38vh] bg-[#0d1117] xl:min-h-0">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={project.alt || project.title}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <i className="bx bx-image text-6xl text-slate-700"></i>
          </div>
        )}
      </div>

      <div className="overflow-y-auto px-6 py-8 md:px-10 xl:px-12 xl:py-14">
        <p className="section-label mb-3">Project details</p>
        <h2 className="font-display mb-5 pr-12 text-3xl font-extrabold text-white md:text-4xl">
          {project.title}
        </h2>

        <p className="mb-7 text-lg leading-8 text-slate-300">
          {project.description}
        </p>

        {techList.length > 0 && (
          <div className="mb-6">
            <h3 className="font-display mb-3 text-sm font-bold uppercase tracking-widest text-cyan-200">
              Technologies
            </h3>
            <div className="flex flex-wrap gap-2">
              {techList.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {project.features?.length > 0 && (
          <div className="mb-8">
            <h3 className="font-display mb-3 text-sm font-bold uppercase tracking-widest text-cyan-200">
              Features
            </h3>
            <ul className="space-y-2 text-slate-300">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <i className="bx bx-check mt-1 text-cyan-300"></i>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(project.demoUrl || project.githubUrl) && (
          <div className="flex flex-wrap gap-3">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                className="btn-primary-modern"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bx bx-link-external"></i>
                View Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                className="btn-outline-modern"
                target="_blank"
                rel="noreferrer"
              >
                <i className="bx bxl-github"></i>
                GitHub
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default Projects;
