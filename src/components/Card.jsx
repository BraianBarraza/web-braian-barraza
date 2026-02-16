const Card = ({ children, className = "" }) => (
  <div
    className={`border border-primary shadow-[0_4px_20px_var(--color-primary-shadow)] bg-white/70 dark:bg-transparent ${className}`}
  >
    {children}
  </div>
);

export default Card;
