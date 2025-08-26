/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  getClassesStudentByStudentId,
  getAllClassesByTeacherId,
  getClassDetail,
  getAllClasses,
} from "@/api/classApi";
import useAuthToken from "@/hooks/userAuthToken";
import { setLoading, setJoinedClasses } from "../../../store/classSlice";

// Hàm tạo màu ngẫu nhiên
const getRandomColor = () => {
  const colors = [
    "#4285F4",
    "#0F9D58",
    "#DB4437",
    "#F4B400",
    "#673AB7",
    "#3F51B5",
    "#2196F3",
    "#03A9F4",
    "#00BCD4",
    "#009688",
    "#4CAF50",
    "#8BC34A",
    "#CDDC39",
    "#FFC107",
    "#FF9800",
    "#FF5722",
    "#795548",
    "#607D8B",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getClassInitial = (className) => {
  if (!className) return "📚";
  return className.charAt(0).toUpperCase();
};

const ClassItem = ({ classData, active, onClick, collapsed }) => {
  const initial = getClassInitial(classData.class_name);
  const color = classData.color || getRandomColor();

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer",
        active
          ? "bg-slate-100 dark:bg-slate-800 font-medium"
          : "text-slate-500 dark:text-slate-400",
        collapsed ? "justify-center" : ""
      )}
      onClick={onClick}
      title={collapsed ? classData.class_name : ""}
    >
      <div
        className="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-white font-bold"
        style={{ backgroundColor: color }}
      >
        {initial}
      </div>
      {!collapsed && (
        <div className="flex-1 truncate">
          <div className="font-medium text-slate-900 dark:text-slate-100 truncate">
            {classData.class_name}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {classData.teacher}
          </div>
        </div>
      )}
    </div>
  );
};

const SidebarClass = ({ collapsed, setCollapsed }) => {
  const auth = useAuthToken();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { updateCounter, joinedClasses, loading } = useSelector(
    (state) => state.class
  );

  const [activeItem, setActiveItem] = useState("home");

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith("/classes/") || path.startsWith("/teacher/classes/")) {
      const classId = path.split("/")[2];
      setActiveItem(`class-${classId}`);
    }
  }, [location]);

  useEffect(() => {
    if (auth?.id) {
      fetchClasses();
    }
  }, [auth, updateCounter]);

  const fetchClasses = async () => {
    try {
      dispatch(setLoading(true));
      let res;
      if (auth?.role === "student") {
        res = await getClassesStudentByStudentId(auth.id);
      } else if (auth?.role === "teacher") {
        res = await getAllClassesByTeacherId(auth.id);
      } else if (auth?.role === "admin") {
        res = await getAllClasses();
      }
      if (res.success && res.data) {
        fetchClassesDetails(res.data);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const fetchClassesDetails = async (classesData) => {
    try {
      const details = await Promise.all(
        classesData.map(async (classItem) => {
          if (auth?.role === "student") {
            const res = await getClassDetail(classItem.class_id);
            return { ...res.data, color: getRandomColor() };
          } else {
            return { ...classItem, color: getRandomColor() };
          }
        })
      );
      dispatch(setJoinedClasses(details));
    } catch (error) {
      console.error("Error fetching class details:", error);
    }
  };

  const handleNavigation = (classId) => {
    navigate(`/classes/${classId}`);
  };

  return (
    <div
      className={cn(
        "flex  flex-col z-20  bg-white dark:bg-slate-950 transition-all duration-300 border-r border-gray-200 dark:border-slate-800 h-full",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-14 items-center px-4 justify-between border-b border-gray-200 dark:border-slate-800">
        {!collapsed && <div className="text-sm font-semibold">Lớp học</div>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className={cn("h-8 w-8", collapsed ? "mx-auto" : "")}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-[calc(100vh-150px)]">
          <div className={cn(collapsed ? "px-1" : "px-3", "py-3")}>
            {loading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : joinedClasses.length > 0 ? (
              joinedClasses.map((classItem) => (
                <ClassItem
                  key={classItem.class_id}
                  classData={classItem}
                  active={activeItem === `class-${classItem.class_id}`}
                  onClick={() => handleNavigation(classItem.class_id)}
                  collapsed={collapsed}
                />
              ))
            ) : (
              <div
                className={cn(
                  "text-center py-2 text-sm text-slate-500",
                  collapsed ? "px-1" : ""
                )}
              >
                {!collapsed && "Chưa có lớp học nào"}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default SidebarClass;
