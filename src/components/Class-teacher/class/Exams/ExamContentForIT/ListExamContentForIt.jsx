/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, PlusCircle, Trash } from "lucide-react";
import useAuthToken from "@/hooks/userAuthToken";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate, useParams } from "react-router-dom";
import { getAllExamContentByExamId } from "@/api/ExamApi";
import DeleteExamContent from "./DeleteExamContent";

const ListExamContentForIt = () => {
  const navigate = useNavigate();
  const auth = useAuthToken();
  const { classId, examId } = useParams();
  const [examContent, setExamContent] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);

  useEffect(() => {
    fetchAllExamContentByExamId();
  }, [examId]);
  const fetchAllExamContentByExamId = async () => {
    const res = await getAllExamContentByExamId(examId);
    console.log("res", res);
    if (res.success) {
      setExamContent(res.data);
    }
  };

  const handleDeleteExamContent = (examContent) => {
    setExamToDelete(examContent);
    setShowDeleteModal(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Danh sách bài tập</CardTitle>
        {auth?.role !== "student" && (
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50"
            onClick={() =>
              navigate(
                `/teacher/classes/${classId}/exams/${examId}/create/exam-content`
              )
            }
          >
            <PlusCircle className="h-4 w-4" />
            Thêm bài tập mới
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {examContent.length > 0 ? (
          <ul className="space-y-4">
            {examContent.map((exam) => (
              <li
                key={exam.id}
                className="border p-4 rounded-lg hover:shadow flex justify-between items-start"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    navigate(
                      `/classes/${classId}/exams/${examId}/examContent/${exam.id}`,
                      { state: exam }
                    );
                  }}
                >
                  <h4 className="font-bold text-lg">{exam.title}</h4>
                </div>

                {auth?.role !== "student" && (
                  <div>
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
                                `/teacher/classes/${classId}/exams/${examId}/update/exam-content/${exam.id}`,
                                {
                                  state: exam,
                                }
                              );
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            <span className="font-normal">Chỉnh sửa</span>
                          </Button>
                          <Button
                            variant="ghost"
                            className="flex items-center justify-start hover:bg-gray-100 dark:hover:bg-blue-950 rounded px-2 py-1 text-sm text-red-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteExamContent(exam);
                            }}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            <span className="font-normal">Xóa</span>
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-gray-500">Không có bài tập</p>
          </div>
        )}
      </CardContent>

      {examToDelete && (
        <DeleteExamContent
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          examToDelete={examToDelete}
          fetchAllExamContentByExamId={fetchAllExamContentByExamId}
        />
      )}
    </Card>
  );
};

export default ListExamContentForIt;
