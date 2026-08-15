import {
  FaArrowTrendUp,
  FaChartLine,
} from "react-icons/fa6";

import "./TrackProgress.css";

const chartPoints = [
  60,
  72,
  68,
  85,
  82,
  96,
];

const TrackProgress = () => {
  const progress = 76;

  return (
    <section className="progress-card">

      <div className="progress-header">

        <div>

          <span className="progress-tag">
            Analytics
          </span>

          <h2>Track Progress</h2>

          <p>
            Monitor your interview performance
            over time.
          </p>

        </div>

        <select className="progress-select">

          <option>This Month</option>

          <option>Last Month</option>

          <option>Last 6 Months</option>

        </select>

      </div>

      <div className="progress-body">

        <div className="progress-circle-wrapper">

          <svg width="170" height="170">

            <circle
              cx="85"
              cy="85"
              r="68"
              className="progress-bg"
            />

            <circle
              cx="85"
              cy="85"
              r="68"
              className="progress-fill"
              style={{
                strokeDasharray: 427,
                strokeDashoffset:
                  427 -
                  (427 * progress) / 100,
              }}
            />

          </svg>

          <div className="progress-center">

            <h1>{progress}%</h1>

            <span>Overall</span>

          </div>

        </div>

        <div className="progress-info">

          <div className="progress-stat">

            <FaChartLine />

            <div>

              <strong>12</strong>

              <span>Interviews</span>

            </div>

          </div>

          <div className="progress-stat">

            <FaArrowTrendUp />

            <div>

              <strong>+18%</strong>

              <span>This Month</span>

            </div>

          </div>

        </div>

      </div>

      <div className="mini-chart">

        {chartPoints.map((point, index) => (

          <div
            key={index}
            className="chart-column"
          >

            <div
              className="chart-bar"
              style={{
                height: `${point}px`,
              }}
            ></div>

            <span>

              {["Jan","Feb","Mar","Apr","May","Jun"][index]}

            </span>

          </div>

        ))}

      </div>

    </section>
  );
};

export default TrackProgress;