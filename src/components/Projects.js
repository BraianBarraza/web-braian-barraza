import React from "react";

const Projects = ({ assetsBase }) => (
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
      <div className="border border-primary shadow-xl shadow-[#5dadec3b] rounded-2xl p-8 max-w-sm w-full bg-white/70 dark:bg-transparent">
        <h2 className="text-2xl font-bold mb-3">Coffee Blog</h2>
        <img
          src={`${assetsBase}/img/img-blogCafe 03.png`}
          alt="Coffee Blog project"
          className="w-full h-auto rounded-lg mb-4"
        />
        <p className="mb-3 text-gray-700 dark:text-gray-200">
          A small project made using just HTML and CSS, the main idea of this
          project was to strengthen my knowledge in these 2. and it is also
          completly Responsive.
        </p>
        <p>
          <strong>Technologies Used:</strong> HTML & CSS
        </p>
        <p className="mt-3">
          <strong>Features:</strong>
        </p>
        <ul className="list-disc list-inside mb-3 text-gray-700 dark:text-gray-200">
          <li>Responsive UI</li>
        </ul>
        <p>
          <a href="#" className="text-blue-600 hover:underline">
            View Demo
          </a>{" "}
          |{" "}
          <a href="#" className="text-blue-600 hover:underline">
            GitHub
          </a>
        </p>
      </div>
      <div className="border border-primary shadow-[#5dadec3b] rounded-2xl shadow-lg p-8 max-w-sm w-full bg-white/70 dark:bg-transparent">
        <h2 className="text-2xl font-bold mb-3">Simple Co-working</h2>
        <img
          src={`${assetsBase}/img/co-working.png`}
          alt="Simple Co-working project"
          className="w-full h-auto rounded-lg mb-4"
        />
        <p className="mb-3 text-gray-700 dark:text-gray-200">
          The project I am currently working on. the website of a coworking
          company, with an agenda system and purchase of plans.
        </p>
        <p>
          <strong>Technologies Used:</strong> HTML, CSS, Javascript and React
        </p>
        <p className="mt-3">
          <strong>Features:</strong>
        </p>
        <ul className="list-disc list-inside mb-3 text-gray-700 dark:text-gray-200">
          <li>Responsive UI</li>
        </ul>
        <p>
          <a href="#" className="text-blue-600 hover:underline">
            View Demo
          </a>{" "}
          |{" "}
          <a href="#" className="text-blue-600 hover:underline">
            GitHub
          </a>
        </p>
      </div>
    </div>
  </section>
);

export default Projects;
