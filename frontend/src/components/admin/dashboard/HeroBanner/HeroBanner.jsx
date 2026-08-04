import {
  FaRobot,
  FaUserCheck,
  FaFile,
  FaArrowTrendUp,
  FaChartPie,
} from "react-icons/fa6";

import styles from "./HeroBanner.module.css";

const HeroBanner = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <section className={styles.banner}>
      <div className={styles.content}>
        <span className={styles.badge}>
          AI Powered Interview Platform
        </span>

        <h1>
          Welcome back,
          <br />
          {user?.fullName} 👋
        </h1>

        <p>
          Manage AI interviews, coding assessments,
          resume reviews and candidate analytics
          from one intelligent platform.
        </p>

        <div className={styles.stats}>

          <div className={styles.stat}>
            <h2>124</h2>
            <span>Interviews</span>
          </div>

          <div className={styles.stat}>
            <h2>82%</h2>
            <span>Success Rate</span>
          </div>

          <div className={styles.stat}>
            <h2>256</h2>
            <span>AI Reports</span>
          </div>

        </div>
      </div>

      <div className={styles.analytics}>

        <div className={styles.bigCircle}>
          <FaRobot />
        </div>

        <div className={styles.progressCard}>
          <FaChartPie />

          <div>
            <strong>AI Accuracy</strong>
            <span>94%</span>
          </div>
        </div>

        <div className={styles.usersCard}>
          <FaUserCheck />

          <div>
            <strong>48 Active</strong>
            <span>Candidates</span>
          </div>
        </div>

        <div className={styles.reportCard}>
          <FaFile />

          <div>
            <strong>132</strong>
            <span>Resume Reviews</span>
          </div>
        </div>

        <div className={styles.trend}>
          <FaArrowTrendUp />
          +18% This Week
        </div>

      </div>
    </section>
  );
};

export default HeroBanner;