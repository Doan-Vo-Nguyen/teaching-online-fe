/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import useAuthToken from "@/hooks/userAuthToken";
import { Edit, Trash } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ClassAvatar = ({
  className,
  classId,
  color,
  classInfo,
  onLeaveClass,
  onDeleteClass,
}) => {
  const auth = useAuthToken();
  const initial = getClassInitial(className);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigateEditClass = (classId) => {
    if (auth && auth.role) {
      if (auth.role === "admin") {
        navigate(`/admin/classes/update/${classId}`);
      } else if (auth.role === "teacher") {
        navigate(`/teacher/classes/update/${classId}`);
      }
    }
  };

  return (
    <div className="relative">
      <div
        className="w-full h-48 flex items-center justify-center rounded-t-lg cursor-pointer "
        style={{ backgroundColor: color }}
        onClick={() => navigate(`/classes/${classId}`)}
      >
        <div className="text-white text-8xl font-bold opacity-80">
          {initial}
        </div>

        <div className="absolute top-2 right-2">
          <button
            className="w-8 h-8 rounded-full bg-white  bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition duration-200"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {menuOpen && (
            <div
              className="absolute right-0 mt-1 w-48 rounded-md shadow-lg dark:bg-[#020818] bg-white ring-1 ring-black ring-opacity-5 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="py-1">
                {auth?.role !== "student" ? (
                  <>
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start w-full hover:bg-gray-100 dark:hover:bg-blue-950 rounded px-2 py-1 text-sm"
                      onClick={() => navigateEditClass(classInfo.class_id)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      <span className="">Chỉnh sửa</span>
                    </Button>
                    <Button
                      variant="ghosts"
                      className="flex items-center w-full justify-start hover:bg-gray-100 dark:hover:bg-blue-950 rounded px-2 py-1 text-sm text-red-500"
                      onClick={() => {
                        setMenuOpen(false);
                        onDeleteClass(classInfo);
                      }}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Xóa
                    </Button>
                  </>
                ) : (
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-white dark:hover:bg-blue-950"
                    onClick={() => {
                      setMenuOpen(false);
                      onLeaveClass(classInfo);
                    }}
                  >
                    Rời lớp học
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Lấy chữ cái đầu của tên lớp học
const getClassInitial = (className) => {
  if (!className) return "C";
  return className.charAt(0).toUpperCase();
};

export default ClassAvatar;
