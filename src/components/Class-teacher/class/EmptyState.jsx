/* eslint-disable react/prop-types */
// src/components/class/EmptyState.jsx
import { Book } from "lucide-react";
import { Button } from "@/components/ui/button";

const EmptyState = ({ role, onJoinClass, onCreateClass }) => (
  <div className="flex flex-col items-center justify-center min-h-[400px] bg-white border-gray-200 rounded-lg border-2 border-dashed p-8 dark:bg-blue-950">
    <div className="bg-gray-50 rounded-full p-6 shadow-md mb-6">
      <Book className="w-12 h-12 text-blue-500" />
    </div>
    <h3 className="text-2xl font-semibold text-gray-900 mb-2 dark:text-white">
      {role !== "student" ? "Chưa có lớp học nào" : "Chưa tham gia lớp học nào"}
    </h3>
    <p className="text-center mb-6 max-w-md text-gray-600 dark:text-white">
      {role !== "student"
        ? "Bạn chưa tạo lớp học nào. Hãy tạo lớp học mới để bắt đầu quản lý lớp của mình!"
        : "Bạn chưa tham gia vào lớp học nào. Hãy tham gia ngay để bắt đầu học tập!"}
    </p>
    {role !== "student" ? (
      <Button
        onClick={onCreateClass}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
      >
        Tạo lớp học mới
      </Button>
    ) : (
      <Button
        onClick={onJoinClass}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
      >
        Tham gia lớp học
      </Button>
    )}
  </div>
);

export default EmptyState;
