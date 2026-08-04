import styles from "./StatsCard.module.css";

const StatsCard = ({ title, value, icon, color }) => {
  return (
    <div className={styles.card}>
      <div
        className={styles.icon}
        style={{ backgroundColor: color }}
      >
        {icon}
      </div>

      <div>
        <h3>{value}</h3>
        <p>{title}</p>
      </div>
    </div>
  );
};

export default StatsCard;