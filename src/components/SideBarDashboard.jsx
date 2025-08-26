import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Users, LogOut, MenuIcon, UserCircle } from "lucide-react";
import useAuthToken from "@/hooks/userAuthToken";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

// Menu items configuration cho Admin
const menuAdmin = [
  { title: "Trang chủ", icon: Home, path: "/" },
  { title: "User", icon: Users, path: "/admin/users" },
  {
    title: "Đăng xuất",
    icon: LogOut,
    action: "logout", // Dùng action để nhận biết mục đăng xuất
  },
];

// Nếu bạn muốn bỏ menu của teacher, bạn chỉ cần sử dụng menuAdmin khi URL bắt đầu bằng "/admin"
export const SideBarDashboard = () => {
  const auth = useAuthToken();
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Chọn menu dựa trên URL hiện tại: chỉ sử dụng menuAdmin khi URL bắt đầu bằng "/admin"
  const menuItems = location.pathname.startsWith("/admin") ? menuAdmin : [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div
        className={`fixed left-0 top-0 h-full bg-card border-r transition-all duration-300 ${
          open ? "w-64" : "w-20"
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {open ? (
            <div className="flex items-center gap-3">
              <Avatar className="ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-300 transition-all">
                {auth?.profile_picture ? (
                  <AvatarImage
                    src={auth.profile_picture}
                    className="object-cover"
                  />
                ) : (
                  <UserCircle
                    size={40}
                    className="absolute inset-0 text-gray-400"
                  />
                )}
              </Avatar>
              <div>
                <div className="font-bold leading-none inline-block h-[20px]">
                  {auth?.role ? auth.role.toUpperCase() : ""}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Avatar className="ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-300 transition-all">
                {auth?.profile_picture ? (
                  <AvatarImage
                    src={auth.profile_picture}
                    className="object-cover"
                  />
                ) : (
                  <UserCircle
                    size={40}
                    className="absolute inset-0 text-gray-400"
                  />
                )}
              </Avatar>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setOpen(!open)}>
            <MenuIcon className="w-6 h-6 ml-1" />
          </Button>
        </div>

        <nav className="mt-4">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            // Nếu mục có action là logout, render button thay vì Link
            if (item.action === "logout") {
              return (
                <button
                  key={index}
                  onClick={handleLogout}
                  className="flex w-full items-center gap-4 px-4 py-3 transition-colors hover:bg-accent"
                >
                  <Icon className="w-5 h-5" />
                  {open && <span>{item.title}</span>}
                </button>
              );
            }

            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 transition-colors ${
                  isActive ? "bg-accent" : "hover:bg-accent"
                }`}
              >
                <Icon className="w-5 h-5" />
                {open && <span>{item.title}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      <div
        className={`flex-1 transition-all duration-300 ${
          open ? "ml-64" : "ml-20"
        }`}
      >
        {/* Nội dung chính của Dashboard */}
      </div>
    </div>
  );
};
