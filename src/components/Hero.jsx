import {socialLinks} from "../data/socialLinks";

const Hero = ({assetsBase, isLight}) => {
    const heroImage = isLight
        ? `${assetsBase}/img/3d_character_orange_nobg.png`
        : `${assetsBase}/img/3d_character_blue_nobg.png`;

    return (
        <section className="max-w-7xl mx-auto pt-10 px-5" id="home">
            <div className="flex md:flex-row flex-col justify-between items-center gap-4 py-10">
                <div className="md:w-1/2 pt-10">
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
                    <a
                        href="#contact"
                        className="py-4 px-10 rounded-md bg-primary text-white font-bold inline-block"
                    >
                        Contact me
                    </a>
                    <div className="mt-12 mb-8 flex gap-4 items-center">
                        <p className="text-gray-700 dark:text-gray-200">Check out My:</p>
                        <div className="flex space-x-3">
                            {socialLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <img
                                        src={`${assetsBase}${link.icon}`}
                                        alt={link.name}
                                        className="w-8 h-8"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="md:w-1/2 order-first md:order-none">
                    <img
                        src={heroImage}
                        alt="Braian Barraza"
                        className="w-2/3 pt-10 mx-auto"
                        loading="lazy"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;
