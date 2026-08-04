import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./CandidateDashboard.css";

import DashboardHeader from "./components/DashboardHeader/DashboardHeader";
import StatisticsCards from "./components/StatisticsCards/StatisticsCards";
import AvailableInterviews from "./components/AvailableInterviews/AvailableInterviews";

const API = "http://localhost:5000/api";

const CandidateDashboard = () => {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await axios.get(
        `${API}/interview-templates`
      );

      const active = res.data.templates.filter(
        (item) => item.status === true
      );

      setInterviews(active);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="candidate-page">

      {/* =========================
          DASHBOARD HEADER
      ========================== */}

      <DashboardHeader user={user} />

      {/* =========================
          STATISTICS
      ========================== */}

      <StatisticsCards interviews={interviews} />

      {/* =========================
          AVAILABLE INTERVIEWS
      ========================== */}

      <AvailableInterviews
  interviews={interviews}
  loading={loading}
  onStartInterview={(interview) =>
    navigate(`/candidate/mock-interview/${interview._id}`)
  }
/>

    </div>
  );
};

export default CandidateDashboard;