import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { projects as staticProjects } from "../data/projects";
import Card from "./Card";

const Projects = ({ assetsBase }) => {
  const [projects, setProjects] = useState(staticProjects);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const q = query(
          collection(db, "projects"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          setProjects(
            snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
          );
        }
      } catch {
        // keep static projects on error
      }
    };
    fetchProjects();
  }, []);

  const getImageSrc = (project) => {
    if (project.imageUrl) return project.imageUrl;
    if (project.image) return `${assetsBase}${project.image}`;
    return null;
  };

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

      <div className="container mx-auto flex flex-wrap gap-12 justify-center">
        {projects.map((project) => {
          const imageSrc = getImageSrc(project);
          return (
            <Card
              key={project.id || project.title}
              className="max-w-sm w-full rounded-2xl p-8"
            >
              <h2 className="text-2xl font-bold mb-3">{project.title}</h2>
              {imageSrc && (
                <img
                  src={imageSrc}
                  alt={project.alt || project.title}
                  className="w-full h-auto rounded-lg mb-4"
                  loading="lazy"
                />
              )}
              <p className="mb-3 text-gray-700 dark:text-gray-200">
                {project.description}
              </p>
              <p>
                <strong>Technologies Used:</strong> {project.technologies}
              </p>
              {project.features?.length > 0 && (
                <>
                  <p className="mt-3">
                    <strong>Features:</strong>
                  </p>
                  <ul className="list-disc list-inside mb-3 text-gray-700 dark:text-gray-200">
                    {project.features.map((feature) => (
                      <li key={feature}>{feature}</li>
                    ))}
                  </ul>
                </>
              )}
              {(project.demoUrl || project.githubUrl) && (
                <p>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      View Demo
                    </a>
                  )}
                  {project.demoUrl && project.githubUrl && " | "}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      GitHub
                    </a>
                  )}
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
