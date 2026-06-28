import styles from "./StatCard.module.css";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className={styles.card}>
      <div
        className={styles.icon}
        style={{ background: color }}
      >
        {icon}
      </div>

      <div>
        <h2>{value}</h2>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default StatCard;