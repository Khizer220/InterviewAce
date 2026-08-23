import { useEffect, useState } from "react";

import AdminLayout from "../../../components/admin/common/AdminLayout/AdminLayout";

import DashboardHeader from "../../../components/admin/dashboard/DashboardHeader/DashboardHeader";
import OverviewCards from "../../../components/admin/dashboard/OverviewCards/OverviewCards";
import QuickActions from "../../../components/admin/dashboard/QuickActions/QuickActions";
import RecentActivity from "../../../components/admin/dashboard/RecentActivity/RecentActivity";
import TopPerformingQuestions from "../../../components/admin/dashboard/TopPerformingQuestions/TopPerformingQuestions";
import InterviewsOverview from "../../../components/admin/dashboard/InterviewsOverview/InterviewsOverview";
import PendingApprovals from "../../../components/admin/dashboard/PendingApprovals/PendingApprovals";

import { getDashboardOverview, getPendingUsers } from "../../../services/adminService";

import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [topQuestions, setTopQuestions] = useState([]);
  const [interviewsOverview, setInterviewsOverview] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const [overviewResult, pendingResult] = await Promise.all([
          getDashboardOverview(),
          getPendingUsers(),
        ]);

        setOverview(overviewResult.overview);
        setRecentActivity(overviewResult.recentActivity || []);
        setTopQuestions(overviewResult.topQuestions || []);
        setInterviewsOverview(overviewResult.interviewsOverview || null);
        setPendingUsers(pendingResult.users || []);
        setPendingCount(pendingResult.count || 0);
      } catch (err) {
        console.error("Get Dashboard Overview Error:", err);
        setError("Couldn't load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <AdminLayout>
      <div className={styles.dashboard}>

        <DashboardHeader />

        {loading ? (
          <p>Loading overview...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <>
            <OverviewCards overview={overview} />

            {/* Row 1 — Quick Actions + Pending Approvals stacked on the
                left (filling the space under Quick Actions), Recent
                Activity on the right */}
            <div className={styles.topGrid}>
              <div className={styles.left}>
                <QuickActions />
                <PendingApprovals users={pendingUsers} count={pendingCount} />
              </div>

              <div className={styles.center}>
                <RecentActivity items={recentActivity} />
              </div>
            </div>

            {/* Row 2 — Top Performing Questions + Interviews Overview */}
            <div className={styles.bottomGrid}>
              <div className={styles.left}>
                <TopPerformingQuestions questions={topQuestions} />
              </div>

              <div className={styles.right}>
                <InterviewsOverview data={interviewsOverview} />
              </div>
            </div>
          </>
        )}

        <footer className={styles.footer}>
          © 2026 InterviewAce. All Rights Reserved.
        </footer>

      </div>
    </AdminLayout>
  );
};

export default Dashboard;
