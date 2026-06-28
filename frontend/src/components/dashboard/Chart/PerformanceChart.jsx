import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import styles from "./PerformanceChart.module.css";

const data = [
  { week: "Week 1", score: 45 },
  { week: "Week 2", score: 58 },
  { week: "Week 3", score: 62 },
  { week: "Week 4", score: 75 },
  { week: "Week 5", score: 81 },
  { week: "Week 6", score: 90 },
];

const PerformanceChart = () => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2>Performance Overview</h2>
        <p>Last 6 Weeks</p>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={data}>
          <CartesianGrid stroke="#f1f5f9" />

          <XAxis dataKey="week" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#6C4CF1"
            strokeWidth={4}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;