import {skills} from "../data/skills";
import Card from "./Card";

const About = ({assetsBase}) => (
    <section className="max-w-7xl mx-auto px-5 my-6" id="about">
        <div className="text-center">
            <p className="mb-3 font-montserrat font-medium text-gray-700 dark:text-gray-200">
                About me
            </p>
            <h3 className="text-primary text-3xl font-bold mb-16">My Know How</h3>
        </div>
        <div className="my-16 flex flex-col md:flex-row justify-around items-center gap-12">
            {skills.map((skill) => (
                <Card key={skill.title} className="w-[354px] min-h-135 px-5 py-8 rounded-lg cursor-pointer">
                    <h5 className="text-center my-5 text-2xl">{skill.title}</h5>
                    <img
                        src={`${assetsBase}${skill.image}`}
                        alt={skill.alt}
                        className="w-[196px] mb-15 mx-auto"
                        loading="lazy"
                    />
                    {skill.items ? (
                        <ul className="text-center text-gray-700 dark:text-gray-200">
                            {skill.items.map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-gray-700 dark:text-gray-200">
                            {skill.description}
                        </p>
                    )}
                </Card>
            ))}
        </div>
    </section>
);

export default About;
