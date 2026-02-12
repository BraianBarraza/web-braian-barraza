const Footer = ({ assetsBase }) => (
  <footer className="bg-gray-100 dark:bg-gray-800 p-5">
    <div className="text-gray-800 dark:text-white w-full max-w-screen-xl mx-auto md:py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-6">
        <a href="#home" className="flex items-center space-x-3 py-4 rtl:space-x-reverse">
          <img
            src={`${assetsBase}/icons/logo-braian.png`}
            className="h-8 rounded-2xl"
            alt="Braian Barraza Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            Braian Barraza
          </span>
        </a>
        <ul className="flex flex-col md:flex-row md:space-x-7 space-y-2 md:space-y-0 items-center text-base font-medium">
          <li>
            <p className="p-2">E-Mail: Braian_019@hotmail.com</p>
          </li>
          <li>
            <p className="p-2">Tel: 017677668526</p>
          </li>
          <li className="p-2">
            <a
              href={`${assetsBase}/img/CV%20Braian%20Camilo%20Barraza.pdf`}
              download
              className="py-2 px-4 rounded-md bg-primary text-white font-bold inline-block"
            >
              Download CV
            </a>
          </li>
        </ul>
      </div>
      <div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 text-center dark:text-gray-400">
          &copy; {new Date().getFullYear()}{" "}
          <a href="#home" className="hover:underline">
            Braian Barraza&trade;
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </div>
  </footer>
);

export default Footer;
