import "./DashboardPreview.css";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", score: 30 },
  { day: "Tue", score: 42 },
  { day: "Wed", score: 38 },
  { day: "Thu", score: 65 },
  { day: "Fri", score: 58 },
  { day: "Sat", score: 80 },
  { day: "Sun", score: 92 },
];

const DashboardPreview = () => {
  return (
    <div className="dashboard-preview">

      <div className="dashboard-header">
        <div>
          <h3>Welcome Back 👋</h3>
          <p>Demo Candidate</p>
        </div>

        <div className="avatar"></div>
      </div>

      <div className="dashboard-stats">

        <div className="stat-box">
          <h2>12</h2>
          <span>Interviews</span>
        </div>

        <div className="stat-box">
          <h2>87%</h2>
          <span>Score</span>
        </div>

        <div className="stat-box">
          <h2>8</h2>
          <span>Coding</span>
        </div>

      </div>

      <div className="chart-box">

        <h4>Performance Overview</h4>

        <div className="chart">

          <ResponsiveContainer width="100%" height={200}>

            <LineChart data={data}>

              <Tooltip />

              <Line
                type="monotone"
                dataKey="score"
                stroke="#6C4CF1"
                strokeWidth={4}
                dot={false}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

      <div className="skills">

        <h4>Top Skills</h4>

        <div className="skill">

          <div className="skill-head">
            <span>JavaScript</span>
            <span>90%</span>
          </div>

          <div className="progress">
            <div style={{ width: "90%" }}></div>
          </div>

        </div>

        <div className="skill">

          <div className="skill-head">
            <span>React</span>
            <span>82%</span>
          </div>

          <div className="progress">
            <div style={{ width: "82%" }}></div>
          </div>

        </div>

        <div className="skill">

          <div className="skill-head">
            <span>Node.js</span>
            <span>75%</span>
          </div>

          <div className="progress">
            <div style={{ width: "75%" }}></div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default DashboardPreview;