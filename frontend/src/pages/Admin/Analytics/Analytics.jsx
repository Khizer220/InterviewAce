import { useEffect, useMemo, useState } from "react";
import {
  FaUsers,
  FaClipboardList,
  FaCheckCircle,
  FaStar,
  FaLayerGroup,
  FaUserClock,
  FaArrowUp,
  FaArrowDown,
  FaTrophy,
  FaExclamationTriangle,
  FaDownload,
} from "react-icons/fa";

import AdminLayout from "../../../components/admin/common/AdminLayout/AdminLayout";
import { getAnalytics } from "../../../services/adminService";

import "./Analytics.css";

const DONUT_COLORS = ["#6546ef", "#3b82f6", "#16a34a", "#f97316", "#ef4444", "#eab308", "#06b6d4"];

// ==========================================
// KPI CARD
// ==========================================

const KpiCard = ({ icon, iconClass, label, value, deltaPercent }) => {
  const hasDelta = typeof deltaPercent === "number";
  const isUp = hasDelta && deltaPercent >= 0;

  return (
    <div className="analytics-kpi-card">
      <div className={`analytics-kpi-icon ${iconClass}`}>{icon}</div>
      <div className="analytics-kpi-body">
        <strong>{value}</strong>
        <span>{label}</span>
        {hasDelta && (
          <p className={isUp ? "analytics-delta up" : "analytics-delta down"}>
            {isUp ? <FaArrowUp /> : <FaArrowDown />}
            {Math.abs(deltaPercent)}% vs last period
          </p>
        )}
      </div>
    </div>
  );
};

// ==========================================
// LINE CHART (Average Score Over Time)
// ==========================================

const LineChart = ({ data }) => {
  const width = 640;
  const height = 220;
  const padding = { top: 10, right: 10, bottom: 26, left: 36 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const points = data.filter((d) => d.avgScore !== null);

  if (points.length === 0) {
    return <div className="analytics-chart-empty">No evaluated interviews in this period yet.</div>;
  }

  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;
  const yFor = (score) => padding.top + innerH - (score / 100) * innerH;

  const linePath = data
    .map((d, i) => {
      if (d.avgScore === null) return null;
      const x = padding.left + i * stepX;
      const y = yFor(d.avgScore);
      return `${x},${y}`;
    })
    .filter(Boolean)
    .join(" L ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="analytics-line-chart">
      {[0, 25, 50, 75, 100].map((tick) => (
        <g key={tick}>
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={yFor(tick)}
            y2={yFor(tick)}
            stroke="#eef0f4"
          />
          <text x={4} y={yFor(tick) + 4} className="analytics-axis-label">
            {tick}%
          </text>
        </g>
      ))}

      {linePath && <path d={`M ${linePath}`} fill="none" stroke="#6546ef" strokeWidth="2.5" />}

      {data.map((d, i) => {
        if (d.avgScore === null) return null;
        const x = padding.left + i * stepX;
        const y = yFor(d.avgScore);
        return (
          <circle key={i} cx={x} cy={y} r="4" fill="#6546ef">
            <title>{`${d.label}: ${d.avgScore}%`}</title>
          </circle>
        );
      })}

      {data.map((d, i) => (
        <text
          key={d.label + i}
          x={padding.left + i * stepX}
          y={height - 6}
          className="analytics-axis-label"
          textAnchor="middle"
        >
          {d.label}
        </text>
      ))}
    </svg>
  );
};

// ==========================================
// GROUPED BAR CHART (Interview Activity)
// ==========================================

const GroupedBarChart = ({ data }) => {
  const width = 640;
  const height = 220;
  const padding = { top: 10, right: 10, bottom: 26, left: 30 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const maxValue = Math.max(1, ...data.flatMap((d) => [d.started, d.completed, d.evaluated]));
  const groupWidth = data.length > 0 ? innerW / data.length : innerW;
  const barWidth = Math.min(14, groupWidth / 5);

  const yFor = (value) => padding.top + innerH - (value / maxValue) * innerH;

  const series = [
    { key: "started", color: "#8b5cf6" },
    { key: "completed", color: "#3b82f6" },
    { key: "evaluated", color: "#16a34a" },
  ];

  if (data.length === 0) {
    return <div className="analytics-chart-empty">No interview activity in this period yet.</div>;
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="analytics-bar-chart">
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1={padding.left}
          x2={width - padding.right}
          y1={yFor(maxValue * f)}
          y2={yFor(maxValue * f)}
          stroke="#eef0f4"
        />
      ))}

      {data.map((d, groupIndex) => {
        const groupX = padding.left + groupIndex * groupWidth + groupWidth / 2 - (barWidth * 1.5 + 6);

        return (
          <g key={d.label + groupIndex}>
            {series.map((s, i) => {
              const value = d[s.key];
              const x = groupX + i * (barWidth + 3);
              const y = yFor(value);
              const h = padding.top + innerH - y;

              return (
                <rect
                  key={s.key}
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(0, h)}
                  fill={s.color}
                  rx="2"
                >
                  <title>{`${s.key}: ${value}`}</title>
                </rect>
              );
            })}

            <text
              x={padding.left + groupIndex * groupWidth + groupWidth / 2}
              y={height - 6}
              className="analytics-axis-label"
              textAnchor="middle"
            >
              {d.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

// ==========================================
// DONUT CHART
// ==========================================

const DonutChart = ({ segments, centerValue, centerLabel }) => {
  const size = 160;
  const stroke = 22;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  let cumulativePercent = 0;

  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="analytics-donut-wrap">
      <svg viewBox={`0 0 ${size} ${size}`} className="analytics-donut">
        {total === 0 ? (
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#eef0f4" strokeWidth={stroke} />
        ) : (
          segments.map((seg, i) => {
            const percent = total > 0 ? seg.value / total : 0;
            const dash = percent * circumference;
            const offset = circumference * (1 - cumulativePercent);
            cumulativePercent += percent;

            return (
              <circle
                key={seg.label + i}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              >
                <title>{`${seg.label}: ${seg.value}`}</title>
              </circle>
            );
          })
        )}
      </svg>
      <div className="analytics-donut-center">
        <strong>{centerValue}</strong>
        <span>{centerLabel}</span>
      </div>
    </div>
  );
};

// ==========================================
// MAIN PAGE
// ==========================================

const RANGE_OPTIONS = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "Last 3 months", days: 90 },
  { label: "Last 6 months", days: 180 },
  { label: "This year", days: 365 },
];

const Analytics = () => {
  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getAnalytics(days);
        if (!cancelled) setData(result);
      } catch (err) {
        console.error("Get Analytics Error:", err);
        if (!cancelled) setError(err?.response?.data?.message || "Failed to load analytics.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [days]);

  const technologyDonutSegments = useMemo(() => {
    if (!data) return [];
    return data.technologies.map((t, i) => ({
      label: t.category,
      value: t.attempts,
      color: DONUT_COLORS[i % DONUT_COLORS.length],
    }));
  }, [data]);

  const scoreDonutSegments = useMemo(() => {
    if (!data) return [];
    return data.scoreDistribution
      .filter((b) => b.count > 0)
      .map((b, i) => ({
        label: b.label,
        value: b.count,
        color: DONUT_COLORS[i % DONUT_COLORS.length],
      }));
  }, [data]);

  const handleExport = () => {
    if (!data) return;

    const lines = [
      ["Metric", "Value", "Change vs last period"],
      ["Total Candidates", data.kpis.totalCandidates.value, `${data.kpis.totalCandidates.deltaPercent}%`],
      ["Total Interviews", data.kpis.totalInterviews.value, `${data.kpis.totalInterviews.deltaPercent}%`],
      ["Completed Interviews", data.kpis.completedInterviews.value, `${data.kpis.completedInterviews.deltaPercent}%`],
      ["Average Score", data.kpis.averageScore.value ?? "N/A", `${data.kpis.averageScore.deltaPercent ?? "N/A"}%`],
      ["Questions Answered", data.kpis.questionsAnswered.value, `${data.kpis.questionsAnswered.deltaPercent}%`],
      ["Active Candidates", data.kpis.activeCandidates.value, `${data.kpis.activeCandidates.deltaPercent}%`],
    ];

    const csv = lines.map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `analytics-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="analytics-page">
        {/* HEADER */}
        <div className="analytics-header">
          <div>
            <span className="analytics-badge">Platform Insights</span>
            <h1>Analytics</h1>
            <p>Track platform performance and candidate insights.</p>
          </div>

          <div className="analytics-header-actions">
            <div className="analytics-select">
              <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
                {RANGE_OPTIONS.map((opt) => (
                  <option key={opt.days} value={opt.days}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <button type="button" className="analytics-export-btn" onClick={handleExport} disabled={!data}>
              <FaDownload />
              Export Report
            </button>
          </div>
        </div>

        {loading ? (
          <div className="analytics-state">Loading analytics...</div>
        ) : error ? (
          <div className="analytics-state error">{error}</div>
        ) : (
          <>
            {/* KPI CARDS */}
            <div className="analytics-kpi-grid">
              <KpiCard
                icon={<FaUsers />}
                iconClass="purple"
                label="Total Candidates"
                value={data.kpis.totalCandidates.value}
                deltaPercent={data.kpis.totalCandidates.deltaPercent}
              />
              <KpiCard
                icon={<FaClipboardList />}
                iconClass="blue"
                label="Total Interviews"
                value={data.kpis.totalInterviews.value}
                deltaPercent={data.kpis.totalInterviews.deltaPercent}
              />
              <KpiCard
                icon={<FaCheckCircle />}
                iconClass="green"
                label="Completed Interviews"
                value={data.kpis.completedInterviews.value}
                deltaPercent={data.kpis.completedInterviews.deltaPercent}
              />
              <KpiCard
                icon={<FaStar />}
                iconClass="orange"
                label="Average Score"
                value={data.kpis.averageScore.value === null ? "—" : `${data.kpis.averageScore.value}%`}
                deltaPercent={data.kpis.averageScore.deltaPercent}
              />
              <KpiCard
                icon={<FaLayerGroup />}
                iconClass="indigo"
                label="Questions Answered"
                value={data.kpis.questionsAnswered.value}
                deltaPercent={data.kpis.questionsAnswered.deltaPercent}
              />
              <KpiCard
                icon={<FaUserClock />}
                iconClass="teal"
                label="Active Candidates"
                value={data.kpis.activeCandidates.value}
                deltaPercent={data.kpis.activeCandidates.deltaPercent}
              />
            </div>

            {/* CHARTS */}
            <div className="analytics-charts-row">
              <div className="analytics-card">
                <h3>Average Score Over Time</h3>
                <LineChart data={data.scoreOverTime} />
              </div>

              <div className="analytics-card">
                <h3>
                  Interview Activity
                  <span className="analytics-legend">
                    <span><i className="dot" style={{ background: "#8b5cf6" }} />Started</span>
                    <span><i className="dot" style={{ background: "#3b82f6" }} />Completed</span>
                    <span><i className="dot" style={{ background: "#16a34a" }} />Evaluated</span>
                  </span>
                </h3>
                <GroupedBarChart data={data.interviewActivity} />
              </div>
            </div>

            {/* TECH / CATEGORY / DISTRIBUTION */}
            <div className="analytics-three-col">
              <div className="analytics-card">
                <h3>Most Practiced Technologies</h3>
                {data.technologies.length === 0 ? (
                  <p className="analytics-empty">No interviews attempted in this period yet.</p>
                ) : (
                  <div className="analytics-donut-row">
                    <DonutChart
                      segments={technologyDonutSegments}
                      centerValue={data.technologies.reduce((s, t) => s + t.attempts, 0)}
                      centerLabel="Total"
                    />
                    <div className="analytics-legend-list">
                      {data.technologies.map((t, i) => (
                        <div className="analytics-legend-row" key={t.category}>
                          <i className="dot" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                          <span>{t.category}</span>
                          <strong>
                            {t.percent}% ({t.attempts})
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="analytics-card">
                <h3>Performance by Category</h3>
                {data.categoryPerformance.length === 0 ? (
                  <p className="analytics-empty">No data yet.</p>
                ) : (
                  <div className="analytics-perf-table">
                    <div className="analytics-perf-header">
                      <span>Category</span>
                      <span>Attempts</span>
                      <span>Avg Score</span>
                    </div>
                    {data.categoryPerformance.map((c) => (
                      <div className="analytics-perf-row" key={c.category}>
                        <span>{c.category}</span>
                        <span>{c.attempts}</span>
                        <span className="analytics-perf-bar-cell">
                          <span className="analytics-perf-bar-track">
                            <span
                              className="analytics-perf-bar-fill"
                              style={{ width: `${c.avgScore ?? 0}%` }}
                            />
                          </span>
                          {c.avgScore === null ? "—" : `${c.avgScore}%`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="analytics-card">
                <h3>Score Distribution</h3>
                {data.scoreDistribution.every((b) => b.count === 0) ? (
                  <p className="analytics-empty">No evaluated interviews in this period yet.</p>
                ) : (
                  <div className="analytics-donut-row">
                    <DonutChart
                      segments={scoreDonutSegments}
                      centerValue={data.scoreDistribution.reduce((s, b) => s + b.count, 0)}
                      centerLabel="Evaluated"
                    />
                    <div className="analytics-legend-list">
                      {data.scoreDistribution.map((b, i) => (
                        <div className="analytics-legend-row" key={b.label}>
                          <i className="dot" style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                          <span>{b.label}</span>
                          <strong>
                            {b.percent}% ({b.count})
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PERFORMERS + ACTIVITY */}
            <div className="analytics-three-col">
              <div className="analytics-card">
                <h3>
                  <FaTrophy className="analytics-title-icon gold" />
                  Top Performing Candidates
                </h3>
                {data.topPerformers.length === 0 ? (
                  <p className="analytics-empty">No evaluated interviews yet.</p>
                ) : (
                  <div className="analytics-rank-list">
                    {data.topPerformers.map((c, i) => (
                      <div className="analytics-rank-row" key={c.candidateId}>
                        <span className="analytics-rank-index">{i + 1}</span>
                        <span className="analytics-rank-name">{c.name}</span>
                        <span className="analytics-rank-bar-track">
                          <span className="analytics-rank-bar-fill good" style={{ width: `${c.avgScore}%` }} />
                        </span>
                        <strong>{c.avgScore}%</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="analytics-card">
                <h3>
                  <FaExclamationTriangle className="analytics-title-icon warn" />
                  Candidates Needing Improvement
                </h3>
                {data.needsImprovement.length === 0 ? (
                  <p className="analytics-empty">No evaluated interviews yet.</p>
                ) : (
                  <div className="analytics-rank-list">
                    {data.needsImprovement.map((c, i) => (
                      <div className="analytics-rank-row" key={c.candidateId}>
                        <span className="analytics-rank-index">{i + 1}</span>
                        <span className="analytics-rank-name">{c.name}</span>
                        <span className="analytics-rank-bar-track">
                          <span className="analytics-rank-bar-fill bad" style={{ width: `${c.avgScore}%` }} />
                        </span>
                        <strong>{c.avgScore}%</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="analytics-card">
                <h3>Recent Activity</h3>
                {data.recentActivity.length === 0 ? (
                  <p className="analytics-empty">No activity yet.</p>
                ) : (
                  <div className="analytics-activity-list">
                    {data.recentActivity.map((item, i) => (
                      <div className="analytics-activity-row" key={i}>
                        <span className="analytics-activity-dot" />
                        <span className="analytics-activity-message">{item.message}</span>
                        <span className="analytics-activity-time">
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default Analytics;
