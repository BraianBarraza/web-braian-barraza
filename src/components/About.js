import React from "react";

const About = ({ assetsBase }) => (
  <section className="max-w-7xl mx-auto px-5 my-6" id="services">
    <div className="text-center">
      <p className="mb-3 font-montserrat font-medium text-gray-700 dark:text-gray-200">
        About me
      </p>
      <h3 className="text-primary text-3xl font-bold mb-16">My Know How</h3>
    </div>
    <div className="my-16 flex flex-col md:flex-row justify-around items-center gap-12">
      <div className="w-[354px] px-5 py-8 rounded-lg border border-primary shadow-[#5dadec3b] cursor-pointer shadow-xl bg-white/70 dark:bg-transparent">
        <h5 className="text-center my-5 text-2xl">Soft skills</h5>
        <img
          src={`${assetsBase}/img/soft-skills (2).png`}
          alt="Soft skills"
          className="w-[196px] mb-15 mx-auto"
        />
        <ul className="text-center text-gray-700 dark:text-gray-200">
          <li>Effective</li>
          <li>Communicative</li>
          <li>Teamworker</li>
          <li>Attention to Detail</li>
          <li>Stress Management</li>
          <li>Continuous Learning</li>
        </ul>
      </div>
      <div className="w-[354px] px-5 py-8 rounded-lg border border-primary shadow-[#5dadec3b] cursor-pointer shadow-xl bg-white/70 dark:bg-transparent">
        <h5 className="text-center my-5 text-2xl">Hard skills</h5>
        <img
          src={`${assetsBase}/img/hard-skill.png`}
          alt="Hard skills"
          className="w-[196px] mb-15 mx-auto"
        />
        <ul className="text-center text-gray-700 dark:text-gray-200">
          <li>HTML</li>
          <li>CSS</li>
          <li>JavaScript</li>
          <li>React</li>
          <li>Github</li>
          <li>Visual Studio Code</li>
        </ul>
      </div>
      <div className="w-[354px] px-5 py-8 rounded-lg border border-primary shadow-[#5dadec3b] cursor-pointer shadow-xl bg-white/70 dark:bg-transparent">
        <h5 className="text-center my-5 text-2xl">Plans for my future</h5>
        <img
          src={`${assetsBase}/img/future-Plans.png`}
          alt="Future plans"
          className="w-[196px] mb-15 mx-auto"
        />
        <p className="text-center text-gray-700 dark:text-gray-200">
          I would like to enhance and complement my programing skills, also
          reach a diplom as "Fachinformatiker - Anwendungsentwicklung". and
          subsequently specialize me as front-end web designer.
        </p>
      </div>
    </div>
  </section>
);

export default About;
