import AdminLayout from "../../../components/admin/common/AdminLayout/AdminLayout";

import DashboardHeader from "../../../components/admin/dashboard/DashboardHeader/DashboardHeader";
import OverviewCards from "../../../components/admin/dashboard/OverviewCards/OverviewCards";
import QuickActions from "../../../components/admin/dashboard/QuickActions/QuickActions";
import RecentActivity from "../../../components/admin/dashboard/RecentActivity/RecentActivity";
import SystemHealth from "../../../components/admin/dashboard/SystemHealth/SystemHealth";

import styles from "./Dashboard.module.css";

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className={styles.dashboard}>

        <DashboardHeader />

        <OverviewCards
          categories={8}
          questions={120}
          users={45}
          interviews={12}
        />

        <div className={styles.bottomGrid}>

          <div className={styles.left}>
            <QuickActions />
          </div>

          <div className={styles.center}>
            <RecentActivity />
          </div>

          <div className={styles.right}>
            <SystemHealth />
          </div>

        </div>

        <footer className={styles.footer}>
          © 2026 InterviewAce. All Rights Reserved.
        </footer>

      </div>
    </AdminLayout>
  );
};

export default Dashboard;