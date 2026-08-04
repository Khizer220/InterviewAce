import styles from "./Card.module.css";

const Card = ({
  children,
  className = "",
  hover = true,
}) => {
  return (
    <div
      className={`
        ${styles.card}
        ${hover ? styles.hover : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Card;