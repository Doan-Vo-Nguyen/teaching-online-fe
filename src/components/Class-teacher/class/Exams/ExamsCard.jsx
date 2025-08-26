/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import useAuthToken from "@/hooks/userAuthToken";
import {
  Book,
  BookOpen,
  Calendar,
  CheckSquare,
  Code2,
  Edit,
  FileText,
  MoreHorizontal,
  Trash,
} from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DeleteExams from "./DeleteExams";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const ExamCard = ({ exam, fetchAllExamByClassId }) => {
  const auth = useAuthToken();
  const navigate = useNavigate();
  const { classId } = useParams();
  const [examToDelete, setExamToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getExamTypeIcon = (type) => {
    switch (type) {
      case "test":
        return <CheckSquare className="h-8 w-8 text-orange-500" />;
      case "quiz":
        return <FileText className="h-8 w-8 text-green-500" />;
      case "midterm":
        return <BookOpen className="h-8 w-8 text-blue-500" />;
      case "final":
        return <Book className="h-8 w-8 text-purple-500" />;
      default:
        return <FileText className="h-8 w-8 text-gray-500" />;
    }
  };
  const handleViewAssignemtDetail = () => {
    navigate(`/classes/${classId}/exams/${exam.exam_id}`);
  };
  const handleDeleteExam = (exam) => {
    setExamToDelete(exam);
    setShowDeleteModal(true);
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
      case "assignment":
        return "Bài tập";
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

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer ">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="p-2 bg-slate-50 rounded-lg">
            {getExamTypeIcon(exam.type)}
          </div>
          {auth?.role !== "student" && (
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
                    className="flex items-center justify-start hover:bg-gray-100 dark:hover:bg-blue-950 rounded px-2 py-1 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/teacher/classes/${exam.class_id}/exams/update/${exam.exam_id}`
                      );
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    <span className="font-normal">Chỉnh sửa </span>
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex items-center justify-start hover:bg-gray-100 dark:hover:bg-blue-950  rounded px-2 py-1 text-sm text-red-500"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteExam(exam);
                    }}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    <span className="font-normal">Xóa </span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
        <CardTitle
          className="text-md mt-3 line-clamp-2"
          onClick={() => handleViewAssignemtDetail()}
        >
          {exam.title}
        </CardTitle>
        <CardDescription>
          <div className="flex justify-between">
            <Badge className={getBadgeColor(exam.type)}>
              {mapExamType(exam.type)}
            </Badge>
            <div>
              {exam.type_student === "common" ? (
                <Badge className="bg-green-500 text-white flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                </Badge>
              ) : exam.type_student === "it" ? (
                <Badge className="bg-blue-500 text-white flex items-center gap-1">
                  <Code2 className="h-4 w-4" />
                </Badge>
              ) : (
                ""
              )}
            </div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span className="flex items-center dark:text-white">
            <Calendar className="h-4 w-4 mr-1" />
            Hạn nộp:
          </span>
          <span className="dark:text-white">
            {moment(exam.due_date).format("HH:mm - DD/MM/YYYY")}
          </span>
        </div>
      </CardContent>

      {examToDelete && (
        <DeleteExams
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          examToDelete={examToDelete}
          fetchAllExamByClassId={fetchAllExamByClassId}
        />
      )}
    </Card>
  );
};

export default ExamCard;
