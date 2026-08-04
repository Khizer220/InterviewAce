import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";
import styles from "./AdminLayout.module.css";

const AdminLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Sidebar />

      <main className={styles.main}>
        <Topbar />
        {children}
      </main>
    </div>
  );
};

export default AdminLayout; 