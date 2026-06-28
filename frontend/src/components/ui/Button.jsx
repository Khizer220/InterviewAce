import "./Button.css";

const Button = ({
  children,
  variant = "primary",
  onClick,
  type = "button",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn ${variant}`}
    >
      {children}
    </button>
  );
};

export default Button;