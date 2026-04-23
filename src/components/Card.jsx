const Card = ({ children, className = "" }) => (
  <div
    className={`glass ${className}`}
  >
    {children}
  </div>
);

export default Card;
