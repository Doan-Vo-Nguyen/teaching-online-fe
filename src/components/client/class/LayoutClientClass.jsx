import { useState } from "react";
import { Outlet } from "react-router-dom";
import SidebarClass from "./SidebarClass";

const LayoutClientClass = () => {
  // State collapsed quản lý chiều rộng của sidebar
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 mt-20  transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <SidebarClass collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div
        className={`flex-1 transition-all duration-300 p-4 ${
          collapsed ? "ml-16" : "ml-64"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default LayoutClientClass;
