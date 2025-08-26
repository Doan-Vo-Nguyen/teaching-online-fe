import { Outlet } from "react-router-dom";
import styles from "./AdminDashboard.module.css"
import { SidebarAdmin } from "@/components/Admin/SidebarAdmin";
const AdminDashboard = () => {
  return (
    <>
  
      <div className={styles.adminLayout}>
        <SidebarAdmin />
        <div className={styles.mainContent}>
          <Outlet />
        </div>
      </div>
     
    </>
  );
};

export default AdminDashboard;
