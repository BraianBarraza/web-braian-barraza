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

  const openProject = (project) => setSelectedProject(project);
  const closeProject = () => setSelectedProject(null);

  return (
    <section className="px-5 my-32 mx-auto max-w-7xl" id="projects">
      <div className="text-center">
        <h3 className="text-3xl font-bold mb-5">
          Recent <span className="text-primary">Projects</span>
        </h3>
        <p className="mb-6 md:w-3/4 mx-auto text-gray-700 dark:text-gray-200">
          This project is a showcase of my work and my dedication to continuous
          learning. My goal is to develop innovative and efficient solutions.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="mx-auto mt-12 max-w-xl rounded-lg border border-dashed border-gray-300 dark:border-gray-700 px-6 py-12 text-center">
          <i className="bx bx-folder-open text-5xl text-gray-300 dark:text-gray-700 mb-4 block"></i>
          <p className="text-gray-600 dark:text-gray-300">
            Projects added from the admin panel will appear here.
          </p>
        </div>
      ) : (
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project) => {
            const imageSrc = getImageSrc(project);
            return (
              <Card
                key={getProjectKey(project)}
                className="group h-[460px] rounded-lg overflow-hidden cursor-pointer transition-transform duration-300 hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary"
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
                  <div className="h-52 w-full bg-gray-100 dark:bg-gray-900">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={project.alt || project.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <i className="bx bx-image text-5xl text-gray-300 dark:text-gray-700"></i>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="mb-3 text-2xl font-bold">{project.title}</h2>
                    <p className="mb-4 flex-1 overflow-hidden text-gray-700 dark:text-gray-200">
                      {project.description}
                    </p>
                    <p className="text-sm font-medium text-primary">
                      View details
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
          onClose={closeProject}
        />
      )}
    </section>
  );
};

const ProjectDetails = ({ project, imageSrc, onClose }) => (
  <div
    className="fixed inset-0 z-[10004] bg-black/70 backdrop-blur-sm p-4 md:p-8"
    onClick={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}
  >
    <div className="relative mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl dark:bg-gray-950 xl:grid xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-2xl text-gray-800 shadow-lg transition-colors hover:bg-white dark:bg-gray-900/90 dark:text-white dark:hover:bg-gray-900"
        aria-label="Close project details"
      >
        <i className="bx bx-x"></i>
      </button>

      <div className="min-h-[38vh] bg-gray-100 dark:bg-gray-900 xl:min-h-0">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={project.alt || project.title}
            className="h-full w-full object-contain xl:object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <i className="bx bx-image text-6xl text-gray-300 dark:text-gray-700"></i>
          </div>
        )}
      </div>

      <div className="overflow-y-auto px-6 py-8 md:px-10 xl:px-12 xl:py-14">
        <h2 className="mb-5 pr-12 text-3xl font-bold md:text-4xl">
          {project.title}
        </h2>

        <p className="mb-6 text-lg leading-8 text-gray-700 dark:text-gray-200">
          {project.description}
        </p>

        {project.technologies && (
          <div className="mb-6">
            <h3 className="mb-2 text-sm font-bold uppercase tracking-widest text-primary">
              Technologies
            </h3>
            <p className="text-gray-700 dark:text-gray-200">
              {project.technologies}
            </p>
          </div>
        )}

        {project.features?.length > 0 && (
          <div className="mb-8">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
              Features
            </h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-200">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-3">
                  <i className="bx bx-check mt-1 text-primary"></i>
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
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-medium text-white transition-colors hover:bg-primary/90"
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
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-800 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900"
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
