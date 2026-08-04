import {
  FaServer,
  FaDatabase,
  FaShieldAlt,
  FaRobot,
  FaCloud,
} from "react-icons/fa";

import styles from "./SystemHealth.module.css";

const systems = [
  {
    name: "Backend API",
    status: "Online",
    icon: <FaServer />,
  },
  {
    name: "MongoDB",
    status: "Connected",
    icon: <FaDatabase />,
  },
  {
    name: "Authentication",
    status: "Running",
    icon: <FaShieldAlt />,
  },
  {
    name: "AI Engine",
    status: "Ready",
    icon: <FaRobot />,
  },
  {
    name: "Cloud Storage",
    status: "Healthy",
    icon: <FaCloud />,
  },
];

const SystemHealth = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>🟢 System Health</h2>
        <span>Live Status</span>
      </div>

      {systems.map((system, index) => (
        <div key={index} className={styles.item}>
          <div className={styles.left}>
            <div className={styles.icon}>
              {system.icon}
            </div>

            <span>{system.name}</span>
          </div>

          <div className={styles.status}>
            <span className={styles.dot}></span>
            {system.status}
          </div>
        </div>
      ))}

      <div className={styles.footer}>
        Last Checked • Just Now
      </div>
    </div>
  );
};

export default SystemHealth;