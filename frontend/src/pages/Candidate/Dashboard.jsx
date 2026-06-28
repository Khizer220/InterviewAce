import Sidebar from "../../components/dashboard/Sidebar/Sidebar";
import Topbar from "../../components/dashboard/Topbar/Topbar";
import StatCard from "../../components/dashboard/StatCard/StatCard";
import PerformanceChart from "../../components/dashboard/Chart/PerformanceChart";
import UpcomingInterviews from "../../components/dashboard/UpcomingInterviews/UpcomingInterviews";
import AISuggestions from "../../components/dashboard/AISuggestions/AISuggestions";

import {
  FaUserTie,
  FaChartLine,
  FaCode,
  FaFileAlt,
} from "react-icons/fa";

import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <div className={styles.dashboard}>
      <Sidebar />

      <main className={styles.main}>
        <Topbar />

        <div className={styles.cards}>
          <StatCard title="Mock Interviews" value="12" icon={<FaUserTie />} color="#6C4CF1" />
          <StatCard title="Average Score" value="85%" icon={<FaChartLine />} color="#10B981" />
          <StatCard title="Coding Solved" value="08" icon={<FaCode />} color="#F59E0B" />
          <StatCard title="Resume" value="Uploaded" icon={<FaFileAlt />} color="#EF4444" />
        </div>

        <div className={styles.grid}>
          <PerformanceChart />
          <UpcomingInterviews />

          <AISuggestions />

          <div className={styles.activity}>
            <h2>Recent Activity</h2>

            <p>✅ Completed Java Interview</p>
            <p>✅ Resume Updated</p>
            <p>✅ Solved 5 Coding Problems</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;