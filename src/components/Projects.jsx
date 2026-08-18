import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import Card from "./Card";
import Carousel from "./Carousel";

const getProjectKey = (project) => project.id || project.title;

const getTechList = (technologies = "") =>
  technologies
    .split(",")
    .map((tech) => tech.trim())
    .filter(Boolean);

const getProjectImages = (project, assetsBase) => {
  if (project.images?.length) {
    return project.images
      .map((image, index) => {
        if (typeof image === "string") {
          return {
            id: `${getProjectKey(project)}-image-${index}`,
            src: image,
            alt: `${project.title} preview ${index + 1}`,
          };
        }

        return {
          id: image.id || `${getProjectKey(project)}-image-${index}`,
          src: image.src || image.imageUrl,
          alt: image.alt || `${project.title} preview ${index + 1}`,
        };
      })
      .filter((image) => image.src);
  }

  const fallbackSrc = project.imageUrl
    ? project.imageUrl
    : project.image
      ? `${assetsBase}${project.image}`
      : null;

  return fallbackSrc
    ? [
        {
          id: `${getProjectKey(project)}-cover`,
          src: fallbackSrc,
          alt: project.alt || project.title,
        },
      ]
    : [];
};

const Projects = ({ assetsBase }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(
          collection(db, "projects"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        setProjects(
          snapshot.docs.map((document) => ({
            id: document.id,
            ...document.data(),
          }))
        );
      } catch (error) {
        console.error("Error loading projects:", error);
        setLoadError(true);
      } finally {
        setIsLoading(false);
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
          React, Vue, PHP, Symfony, Java, and database projects that show
          practical problem solving, responsive interfaces, and real client
          work.
        </p>
      </div>

      {isLoading ? (
        <div className="glass mx-auto max-w-xl rounded-lg border-dashed px-6 py-12 text-center">
          <i className="bx bx-loader-alt bx-spin mb-4 block text-5xl text-cyan-300"></i>
          <p className="text-slate-400">Loading projects...</p>
        </div>
      ) : loadError ? (
        <div className="glass mx-auto max-w-xl rounded-lg border-dashed px-6 py-12 text-center">
          <i className="bx bx-error-circle mb-4 block text-5xl text-amber-300"></i>
          <p className="text-slate-400">
            Projects could not be loaded. Please try again later.
          </p>
        </div>
      ) : projects.length === 0 ? (
        <div className="glass mx-auto max-w-xl rounded-lg border-dashed px-6 py-12 text-center">
          <i className="bx bx-folder-open mb-4 block text-5xl text-slate-600"></i>
          <p className="text-slate-400">
            Projects added from the admin panel will appear here.
          </p>
        </div>
      ) : (
        <Carousel
          items={projects}
          slidesPerView={1}
          desktopSlidesPerView={2}
          autoPlay={!selectedProject}
          interval={4500}
          showIndicators
          ariaLabel="Portfolio projects"
          previousLabel="Previous project"
          nextLabel="Next project"
          viewportClassName="-mx-3.5"
          slideClassName="px-3.5"
          renderItem={(project) => (
            <ProjectCard
              project={project}
              assetsBase={assetsBase}
              onOpen={() => setSelectedProject(project)}
            />
          )}
        />
      )}

      {selectedProject && (
        <ProjectDetailsCarousel
          key={getProjectKey(selectedProject)}
          projects={projects}
          initialProject={selectedProject}
          assetsBase={assetsBase}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
};

const ProjectCard = ({ project, assetsBase, onOpen }) => {
  const cover = getProjectImages(project, assetsBase)[0];
  const techList = getTechList(project.technologies);

  return (
    <Card className="project-card group h-[500px] overflow-hidden rounded-lg focus-within:ring-2 focus-within:ring-cyan-300/60">
      <article
        role="button"
        tabIndex={0}
        onClick={onOpen}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onOpen();
          }
        }}
        className="flex h-full flex-col outline-none"
      >
        <div className="h-56 w-full overflow-hidden border-b border-white/8 bg-[#0d1117]">
          {cover ? (
            <img
              src={cover.src}
              alt={cover.alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
            />
          ) : (
            <ProjectPlaceholder project={project} />
          )}
        </div>
        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-display mb-3 text-xl font-bold text-white">
            {project.title}
          </h3>
          {(project.engagement || project.client) && (
            <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-lime-200">
              <i className="bx bx-briefcase-alt-2 text-base"></i>
              {[project.engagement, project.client].filter(Boolean).join(" · ")}
            </p>
          )}
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
};

const ProjectDetailsCarousel = ({
  projects,
  initialProject,
  assetsBase,
  onClose,
}) => {
  const initialIndex = Math.max(
    0,
    projects.findIndex(
      (project) => getProjectKey(project) === getProjectKey(initialProject)
    )
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  return (
    <div
      className="fixed inset-0 z-[10004] bg-black/75 p-4 backdrop-blur-sm md:p-8"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <Carousel
        items={projects}
        initialIndex={initialIndex}
        autoPlay={false}
        onIndexChange={setActiveIndex}
        className="mx-auto h-full max-w-7xl"
        viewportClassName="h-full rounded-lg"
        trackClassName="h-full"
        slideClassName="h-full"
        ariaLabel="Project details"
        previousLabel="View previous project"
        nextLabel="View next project"
        renderItem={(project, projectIndex) => (
          <ProjectDetails
            project={project}
            images={getProjectImages(project, assetsBase)}
            techList={getTechList(project.technologies)}
            isActive={projectIndex === activeIndex}
            onClose={onClose}
          />
        )}
      />
    </div>
  );
};

const ProjectDetails = ({
  project,
  images,
  techList,
  isActive,
  onClose,
}) => (
  <div className="glass-strong relative flex h-full flex-col overflow-hidden rounded-lg shadow-2xl xl:grid xl:grid-cols-[minmax(0,1.15fr)_minmax(420px,0.85fr)]">
    <button
      type="button"
      onClick={onClose}
      className="glass absolute right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-lg text-2xl text-white transition-colors hover:text-cyan-200"
      aria-label="Close project details"
    >
      <i className="bx bx-x"></i>
    </button>

    <div className="min-h-[38vh] overflow-hidden bg-[#0d1117] xl:min-h-0">
      {images.length > 0 ? (
        <Carousel
          items={images}
          autoPlay={isActive && images.length > 1}
          interval={4500}
          showIndicators
          indicatorsInside
          navigationInside
          className="h-full"
          viewportClassName="h-full"
          trackClassName="h-full"
          slideClassName="h-full"
          ariaLabel={`${project.title} images`}
          previousLabel="Previous project image"
          nextLabel="Next project image"
          renderItem={(image) => (
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-contain"
            />
          )}
        />
      ) : (
        <div className="flex h-full items-center justify-center p-8">
          <ProjectPlaceholder project={project} expanded />
        </div>
      )}
    </div>

    <div className="overflow-y-auto px-6 py-8 md:px-10 xl:px-12 xl:py-14">
      <p className="section-label mb-3">Project details</p>
      <h2 className="font-display mb-5 pr-12 text-3xl font-extrabold text-white md:text-4xl">
        {project.title}
      </h2>

      {(project.engagement || project.client) && (
        <p className="mb-5 flex items-center gap-2 text-sm font-semibold text-lime-200">
          <i className="bx bx-briefcase-alt-2 text-lg"></i>
          {[project.engagement, project.client].filter(Boolean).join(" · ")}
        </p>
      )}

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
              {project.linkLabel ||
                (project.engagement || project.client
                  ? "View project"
                  : "View Demo")}
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
);

const ProjectPlaceholder = ({ project, expanded = false }) => (
  <div
    className={`project-placeholder flex h-full w-full flex-col items-center justify-center text-center ${
      expanded ? "max-h-[34rem] max-w-2xl rounded-lg" : ""
    }`}
  >
    <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10 text-2xl text-cyan-200">
      <i className="bx bx-pulse"></i>
    </span>
    <span className="section-label mb-2">
      {project.client || "Project preview"}
    </span>
    <span className="font-display max-w-xs text-lg font-bold text-white">
      {project.title}
    </span>
  </div>
);

export default Projects;
