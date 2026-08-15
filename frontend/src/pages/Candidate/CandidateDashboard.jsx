import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./CandidateDashboard.css";

import Sidebar from "./components/Sidebar/Sidebar";
import TopHeader from "./components/TopHeader/TopHeader";
import StatisticsCards from "./components/StatisticsCards/StatisticsCards";
import AvailableInterviews from "./components/AvailableInterviews/AvailableInterviews";
import RecentReports from "./components/RecentReports/RecentReports";
import ImproveSkills from "./components/ImproveSkills/ImproveSkills";
import TrackProgress from "./components/TrackProgress/TrackProgress";

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
    <div className="candidate-dashboard">

      <Sidebar />

      <main className="dashboard-main">

        <TopHeader user={user} />

        <StatisticsCards interviews={interviews} />

        <section className="dashboard-content">

          <div className="dashboard-interviews">

            <AvailableInterviews
              interviews={interviews}
              loading={loading}
              onStartInterview={(interview) =>
                navigate(
                  `/candidate/mock-interview/${interview._id}`
                )
              }
            />

          </div>

          <div className="dashboard-reports">

            <RecentReports />

          </div>

          <div className="dashboard-skills">

            <ImproveSkills />

          </div>

          <div className="dashboard-progress">

            <TrackProgress />

          </div>

        </section>

      </main>

    </div>
  );
};

export default CandidateDashboard;