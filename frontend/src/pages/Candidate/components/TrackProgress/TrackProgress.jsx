import { useMemo } from "react";

import {
  FaArrowTrendUp,
  FaArrowTrendDown,
  FaChartLine,
} from "react-icons/fa6";

import "./TrackProgress.css";

const monthLabel = (date) =>
  date.toLocaleDateString(
    "en-US",
    {
      month: "short",
    }
  );

const TrackProgress = ({
  attempts = [],
}) => {

  const evaluated =
    attempts.filter(
      (attempt) =>
        attempt.status ===
        "Evaluated"
    );

  const progress =
    evaluated.length > 0
      ? Math.round(
          evaluated.reduce(
            (sum, attempt) =>
              sum +
              (Number(
                attempt.percentage
              ) || 0),
            0
          ) /
            evaluated.length
        )
      : 0;

  const monthlyBuckets =
    useMemo(() => {

      const map = new Map();

      evaluated.forEach(
        (attempt) => {

          const date =
            new Date(
              attempt.submittedAt ||
              attempt.createdAt
            );

          const key =
            `${date.getFullYear()}-${date.getMonth()}`;

          if (!map.has(key)) {
            map.set(key, {
              date,
              sum: 0,
              count: 0,
            });
          }

          const entry =
            map.get(key);

          entry.sum +=
            Number(
              attempt.percentage
            ) || 0;

          entry.count += 1;

        }
      );

      return Array.from(
        map.values()
      )
        .sort(
          (a, b) =>
            a.date - b.date
        )
        .slice(-6)
        .map((entry) => ({
          label:
            monthLabel(
              entry.date
            ),
          avg:
            Math.round(
              entry.sum /
                entry.count
            ),
        }));

    }, [attempts]);

  const monthDelta =
    useMemo(() => {

      const now =
        new Date();

      const thisKey =
        `${now.getFullYear()}-${now.getMonth()}`;

      const previousMonth =
        new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );

      const previousKey =
        `${previousMonth.getFullYear()}-${previousMonth.getMonth()}`;

      const byMonth = {};

      evaluated.forEach(
        (attempt) => {

          const date =
            new Date(
              attempt.submittedAt ||
              attempt.createdAt
            );

          const key =
            `${date.getFullYear()}-${date.getMonth()}`;

          if (!byMonth[key]) {
            byMonth[key] = {
              sum: 0,
              count: 0,
            };
          }

          byMonth[key].sum +=
            Number(
              attempt.percentage
            ) || 0;

          byMonth[key].count +=
            1;

        }
      );

      const thisAverage =
        byMonth[thisKey]
          ? byMonth[thisKey].sum /
            byMonth[thisKey].count
          : null;

      const previousAverage =
        byMonth[previousKey]
          ? byMonth[previousKey].sum /
            byMonth[previousKey].count
          : null;

      if (
        thisAverage === null ||
        previousAverage === null ||
        previousAverage === 0
      ) {
        return null;
      }

      return Math.round(
        ((thisAverage -
          previousAverage) /
          previousAverage) *
          100
      );

    }, [attempts]);

  const CIRCUMFERENCE = 427;

  const maxChartValue =
    Math.max(
      1,
      ...monthlyBuckets.map(
        (bucket) =>
          bucket.avg
      )
    );

  return (
    <section className="progress-card">

      <div className="progress-header">

        <div>

          <span className="progress-tag">
            Analytics
          </span>

          <h2>
            Track Progress
          </h2>

          <p>
            Monitor your interview performance
            over time.
          </p>

        </div>

      </div>

      <div className="progress-body">

        <div className="progress-circle-wrapper">

          <svg
            width="170"
            height="170"
          >

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
                strokeDasharray:
                  CIRCUMFERENCE,

                strokeDashoffset:
                  CIRCUMFERENCE -
                  (CIRCUMFERENCE *
                    progress) /
                    100,
              }}
            />

          </svg>

          <div className="progress-center">

            <h1>
              {progress}%
            </h1>

            <span>
              Overall
            </span>

          </div>

        </div>

        <div className="progress-info">

          <div className="progress-stat">

            <FaChartLine />

            <div>

              <strong>
                {attempts.length}
              </strong>

              <span>
                Interviews
              </span>

            </div>

          </div>

          <div className="progress-stat">

            {monthDelta === null ? (

              <>
                <FaChartLine />

                <div>

                  <strong>
                    —
                  </strong>

                  <span>
                    Not enough data yet
                  </span>

                </div>
              </>

            ) : (

              <>
                {monthDelta >= 0 ? (
                  <FaArrowTrendUp />
                ) : (
                  <FaArrowTrendDown />
                )}

                <div>

                  <strong>
                    {monthDelta >= 0
                      ? "+"
                      : ""}
                    {monthDelta}%
                  </strong>

                  <span>
                    vs Last Month
                  </span>

                </div>

              </>

            )}

          </div>

        </div>

      </div>

      {monthlyBuckets.length >
      0 ? (

        <div className="mini-chart">

          {monthlyBuckets.map(
            (
              bucket,
              index
            ) => (

              <div
                key={index}
                className="chart-column"
              >

                <div
                  className="chart-bar"
                  style={{
                    height:
                      `${Math.max(
                        4,
                        (bucket.avg /
                          maxChartValue) *
                          100
                      )}px`,
                  }}
                />

                <span>
                  {bucket.label}
                </span>

              </div>

            )
          )}

        </div>

      ) : (

        <div
          style={{
            textAlign: "center",
            color: "#9ca3af",
            padding: "20px 0",
            fontSize: 13,
          }}
        >
          Complete an AI-evaluated interview
          to see your progress chart.
        </div>

      )}

    </section>
  );
};

export default TrackProgress;