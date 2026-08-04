import styles from "./PageHeader.module.css";

const PageHeader = ({
  title,
  subtitle,
  buttonText,
  onButtonClick,
}) => {
  return (
    <div className={styles.header}>
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <button
        className={styles.button}
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </div>
  );
};

export default PageHeader;