import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  UserCircle,
  User,
  UserPlus,
  LogIn,
  LogOut,
  Shield,
  Key,
  Sun,
  Moon,
  Map,
  HomeIcon,
  FileText,
  Award,
  Menu,
  X,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"; // Replaced DropdownMenu with Popover
import useAuthToken from "@/hooks/userAuthToken";
import { useState, useEffect } from "react";
import ChangePassword from "../ChangePassword";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, setUser } from "@/store/userSlice";
import { getUserById } from "@/api/userApi";
import { duplicateLoginManager } from "@/services/duplicateLoginService";

const Header = () => {
  const auth = useAuthToken();
  const userData = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (auth?.id) {
      const fetchUserData = async () => {
        try {
          const res = await getUserById(auth.id);
          if (res && res.data) {
            dispatch(setUser(res.data));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
      fetchUserData();
    }
  }, [auth?.id, dispatch]);

  useEffect(() => {
    if (
      localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.documentElement.classList.contains("dark") ? "dark" : "light"
    );
  };

  const handleLogout = () => {
    try {
      // Handle duplicate login detection logout
      if (auth?.id) {
        console.log("Logging out user:", auth.id);
        duplicateLoginManager.logout(auth.id);
        duplicateLoginManager.cleanup();
      }
      
      // Standard logout process
      localStorage.removeItem("token");
      dispatch(clearUser());
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Proceed with standard logout anyway
      localStorage.removeItem("token");
      dispatch(clearUser());
      navigate("/login");
    }
  };

  // Close mobile menu when navigating
  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Hàm kiểm tra active route
  const isActive = (path) => location.pathname === path;
  const menuItems = [
    { path: "/", icon: HomeIcon, label: "Trang chủ" },
    { path: "/classes", icon: BookOpen, label: "Lớp học" },
    { path: "/roadmap", icon: Map, label: "Lộ trình" },
    { path: "/blog", icon: FileText, label: "Blog" },
    { path: "/ranking", icon: Award, label: "Xếp hạng" },
    { path: "/expert-system", icon: () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain"><circle cx="8.5" cy="7" r="4"/><circle cx="15.5" cy="7" r="4"/><path d="M5 22v-3a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3"/><path d="M18.6 15.9c.8-.8 2.9-.8 3.4 0 1 1 1 3 0 4-1.8 1.8-5.8 2-8 0"></path><path d="M5.4 15.9c-.8-.8-2.9-.8-3.4 0-1 1-1 3 0 4 1.8 1.8 5.8 2 8 0"></path><path d="M19 2a32.6 32.6 0 0 1-7 4 32.6 32.6 0 0 1-7-4"></path></svg>, label: "Trợ Lý Học Tập" },
  ];

  const displayName = userData?.fullname || auth?.fullname || "GUEST";
  const displayEmail = userData?.email || auth?.email || "guest@example.com";
  const profilePicture =
    userData?.profile_picture || auth?.profile_picture || "";

  return (
    <header
      className={`sticky top-0 z-50 shadow-lg backdrop-blur-md transition-colors ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white/80 text-gray-800"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 transition-transform hover:scale-105"
          >
            <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              EduNest
            </span>
          </Link>

          {/* Desktop Menu */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList className="flex space-x-2">
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      onClick={() => navigate(item.path)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all
                        ${
                          isActive(item.path)
                            ? "bg-blue-500 text-white"
                            : "hover:bg-blue-100 dark:hover:bg-gray-700"
                        }`}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </motion.div>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* User Controls */}
          <div className="flex items-center gap-2 md:gap-4">
            <span className="hidden md:block font-medium">{displayName}</span>

            {/* Dark Mode Toggle */}
            <div
              className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full shadow-lg cursor-pointer"
              onClick={toggleDarkMode}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-900" />
              )}
            </div>

            {/* User Menu */}
            <Popover>
              <PopoverTrigger
                className="focus:outline-none"
                aria-label="User menu"
              >
                <div className="group relative rounded-full p-1 transition-all hover:bg-blue-50 dark:hover:bg-gray-700">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10 ring-2 ring-offset-1 md:ring-offset-2 ring-blue-500 dark:ring-blue-300 transition-all">
                    {profilePicture ? (
                      <AvatarImage
                        src={profilePicture}
                        className="object-cover"
                        alt="avatar"
                      />
                    ) : (
                      <UserCircle
                        size={40}
                        className="absolute inset-0 text-gray-400"
                      />
                    )}
                  </Avatar>
                </div>
              </PopoverTrigger>
              <PopoverContent
                className="w-60 mr-5 rounded-md p-2 shadow-md ring-1 ring-gray-200
              transition-all bg-whitedark:bg-gray-800"
              >
                {userData || auth ? (
                  <>
                    <div className="flex flex-col space-y-1 p-2">
                      <p className="text-sm font-medium">Tài khoản của tôi</p>
                      <p className="text-xs text-gray-500 dark:text-gray-300">
                        {displayEmail || "guest@example.com"}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Hồ sơ
                    </button>
                    {userData?.role === "admin" && (
                      <button
                        onClick={() => navigate("/admin")}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700"
                      >
                        <Shield className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </button>
                    )}
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700"
                    >
                      <Key className="mr-2 h-4 w-4" />
                      Đổi mật khẩu
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg  hover:bg-red-50 dark:hover:bg-gray-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/login")}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700"
                    >
                      <LogIn className="mr-2 h-4 w-4" />
                      Đăng nhập
                    </button>
                    <button
                      onClick={() => navigate("/register")}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-700"
                    >
                      <UserPlus className="mr-2 h-4 w-4" />
                      Đăng ký
                    </button>
                  </>
                )}
              </PopoverContent>
            </Popover>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-gray-900 shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <motion.div key={item.path} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                      ${
                        isActive(item.path)
                          ? "bg-blue-500 text-white"
                          : "hover:bg-blue-100 dark:hover:bg-gray-700"
                      }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </motion.div>
              ))}
            </nav>
          </div>
        </div>
      )}

      <ChangePassword open={isModalOpen} onOpenChange={setIsModalOpen} />
    </header>
  );
};

export default Header;
