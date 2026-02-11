import React from "react";

const Hero = ({ assetsBase }) => (
  <section className="max-w-7xl mx-auto px-5 my-12" id="home">
    <div className="flex md:flex-row flex-col justify-between items-center gap-4 py-10">
      <div className="md:w-1/2">
        <p className="text-xl font-medium mb-4 text-gray-700 dark:text-gray-200">
          Hello, <span className="text-primary">I'm</span>
        </p>
        <h1 className="font-bold text-4xl tracking-[3.22px] mb-5">
          Braian Barraza
        </h1>
        <p className="text-2xl font-montserrat mb-5">
          Web developer in training
        </p>
        <p className="text-xl mb-12 md:w-3/4 text-justify leading-8 text-gray-700 dark:text-gray-200">
          I am a fan of programming with a good understanding of HTML and CSS,
          and I am currently expanding my skills in JavaScript, React, and
          GitHub.
        </p>
        <button className="py-4 px-10 rounded-md bg-primary text-white font-bold">
          Contact me
        </button>
        <div className="mt-12 mb-8 flex gap-4 items-center">
          <p className="text-gray-700 dark:text-gray-200">Check out My:</p>
          <div className="flex space-x-3">
            <a
              href="https://www.instagram.com/braianbarraza/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={`${assetsBase}/icons/instagram.svg`}
                alt="Instagram"
                className="w-8 h-8"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/braian-barraza-bengal-8071a322b/"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={`${assetsBase}/icons/linkedIn.svg`}
                alt="LinkedIn"
                className="w-8 h-8"
              />
            </a>
            <a
              href="https://github.com/BraianBarraza"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={`${assetsBase}/icons/github.svg`}
                alt="GitHub"
                className="w-8 h-8"
              />
            </a>
          </div>
        </div>
      </div>
      <div className="md:w-1/2 order-first md:order-none">
        <img
          src={`${assetsBase}/img/Braian-Barraza.png`}
          alt="Braian Barraza"
          className="md:ml-20 w-full"
        />
      </div>
    </div>
  </section>
);

export default Hero;
