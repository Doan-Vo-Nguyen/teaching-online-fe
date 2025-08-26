import { Outlet } from "react-router-dom";
import { SideBarDashboard } from "./SideBarDashboard";

const LayoutDashboard = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar cố định bên trái */}
      <div className="fixed top-0 left-0 w-64 h-full bg-gray-800">
        <SideBarDashboard />
      </div>
      {/* Nội dung bên phải, có margin-left bằng với độ rộng sidebar */}
      <div className="flex-1 ml-64 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutDashboard;
