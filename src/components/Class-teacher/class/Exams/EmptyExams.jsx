/* eslint-disable react/prop-types */
import { FolderPlus } from "lucide-react";

const EmptyExams = ({ role }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <FolderPlus className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-xl dark:text-white font-medium text-gray-700 mb-2">
        Chưa có bài tập nào
      </h3>
      {role !== "student" && (
        <>
          <p className="text-gray-500 dark:text-white max-w-md mb-6">
            Bắt đầu thêm bài tập cho lớp học của bạn để hỗ trợ sinh viên trong
            quá trình học tập.
          </p>
        </>
      )}
    </div>
  );
};

export default EmptyExams;
