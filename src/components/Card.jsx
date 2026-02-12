const Card = ({ children, className = "" }) => (
  <div
    className={`border border-primary shadow-xl shadow-[#5dadec3b] bg-white/70 dark:bg-transparent ${className}`}
  >
    {children}
  </div>
);

export default Card;
