/* eslint-disable react/prop-types */
import {
  Book,
  FileText,
  CheckSquare,
  MoreHorizontal,
  Edit,
  Trash,
  BookOpen,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import useAuthToken from "@/hooks/userAuthToken";
import DeleteExams from "./DeleteExams";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const ExamsItem = ({ exam, fetchAllExamByClassId }) => {
  const { classId } = useParams();
  const auth = useAuthToken();
  const [examToDelete, setExamToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  const getExamTypeIcon = (type) => {
    switch (type) {
      case "test":
        return <CheckSquare className="h-10 w-10 text-orange-500" />;
      case "quiz":
        return <FileText className="h-10 w-10 text-green-500" />;
      case "midterm":
        return <BookOpen className="h-10 w-10 text-blue-500" />;
      case "final":
        return <Book className="h-10 w-10 text-purple-500" />;
      default:
        return <FileText className="h-10 w-10 text-gray-500" />;
    }
  };

  const mapExamType = (type) => {
    switch (type) {
      case "test":
        return "Bài kiểm tra thường xuyên";
      case "quiz":
        return "Trắc nghiệm";
      case "midterm":
        return "Giữa kì";
      case "final":
        return "Cuối kì";
      default:
        return type;
    }
  };
  const getBadgeColor = (type) => {
    switch (type) {
      case "test":
        return "bg-blue-500 text-white";
      case "quiz":
        return "bg-green-500 text-white";
      case "midterm":
        return "bg-yellow-500 text-white";
      case "final":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  const handleViewAssignemtDetail = () => {
    navigate(`/classes/${classId}/exams/${exam.exam_id}`);
  };
  const handleDeleteExam = (Exam) => {
    setExamToDelete(Exam);
    setShowDeleteModal(true);
  };

  return (
    <div className="flex items-center space-x-4 p-4 border-b border-gray-100 hover:bg-slate-50  transition-colors cursor-pointer dark:bg-[#020818]">
      <div className="p-3 bg-white rounded-lg shadow-sm">
        {getExamTypeIcon(exam.type)}
      </div>
      <div
        className="w-[40%] ml-7 pl-2 "
        onClick={() => handleViewAssignemtDetail()}
      >
        <h3 className="text-md font-medium text-gray-900 truncate dark:text-white">
          {exam.title}
        </h3>
        <p className="text-sm text-gray-500">
          {" "}
          <Badge className={getBadgeColor(exam.type)}>
            {mapExamType(exam.type)}
          </Badge>
        </p>
      </div>
      <div className="hidden md:flex w-[20%] mx-2 text-gray-500">
        {exam?.type_student === "common" ? (
          <Badge className="bg-green-500 text-white">Bài tập thường</Badge>
        ) : exam?.type_student === "it" ? (
          <Badge className="bg-blue-500 text-white">Bài tập lập trình</Badge>
        ) : (
          <Badge className="bg-gray-500 text-white">Không xác định</Badge>
        )}
      </div>
      <div className="hidden md:flex w-[30%] mx-2 text-gray-500 dark:text-white">
        <Clock className="h-4 w-4 mr-1 mt-1" />
        {moment(exam.due_date).format("HH:mm - DD/MM/YYYY")}
      </div>

      {auth?.role !== "student" && (
        <div className="w-[10%] flex items-center justify-end pr-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              sideOffset={4}
              className="w-32 rounded-md p-2 shadow-md ring-1 ring-gray-200 transition-all"
            >
              <div className="flex flex-col space-y-1">
                <Button
                  variant="ghost"
                  className="flex items-center justify-start hover:bg-gray-100 dark:hover:bg-blue-950  rounded px-2 py-1 text-sm"
                  onClick={() =>
                    navigate(
                      `/teacher/classes/${exam.class_id}/exams/update/${exam.exam_id}`
                    )
                  }
                >
                  <Edit className="h-4 w-4 mr-2" />
                  <span className="font-normal">Chỉnh sửa </span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex items-center justify-start hover:bg-gray-100  dark:hover:bg-blue-950  rounded px-2 py-1 text-sm text-red-500"
                  onClick={() => handleDeleteExam(exam)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  <span className="font-normal">Xóa </span>
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}

      {examToDelete && (
        <DeleteExams
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          examToDelete={examToDelete}
          fetchAllExamByClassId={fetchAllExamByClassId}
        />
      )}
    </div>
  );
};
export default ExamsItem;
