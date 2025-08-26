/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAllStudentJoinedByClassId } from "@/api/classApi";
import {
  getAllFileSubmitForASpecificStudent,
  getAllStudentSumbmissions,
} from "@/api/SubmissionApi";
import { Badge } from "@/components/ui/badge";
import useAuthToken from "@/hooks/userAuthToken";

const ExamHeaderCard = ({ exam, classDetail }) => {
  const { examId, classId } = useParams();
  const [studentInclass, setStudentInClass] = useState([]);
  const [studentSumbmissions, setStudentSumbmissions] = useState([]);
  const [grades, setGrade] = useState("");
  const auth = useAuthToken();

  useEffect(() => {
    fetchAllStudentInClass();
    fetchAllStudentSumbmissions();
    if (auth?.id) {
      getGradesOfStudent(examId, auth?.id, classId);
    }
  }, [examId, classId, auth?.id]);

  const fetchAllStudentInClass = async () => {
    try {
      const res = await getAllStudentJoinedByClassId(classId);
      if (res.success) {
        setStudentInClass(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllStudentSumbmissions = async () => {
    try {
      const res = await getAllStudentSumbmissions(examId, classId);
      if (res.success) {
        setStudentSumbmissions(res.data);
      }
    } catch (error) {
      console.log(error);
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

  const getGradesOfStudent = async (examId, authId, classId) => {
    try {
      const res = await getAllFileSubmitForASpecificStudent(
        examId,
        authId,
        classId
      );
      if (res?.success) {
        setGrade(res.data);
      }
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-2xl">
          <div className="font-bold">{exam?.title}</div>
          <div className="mt-2">
            <Badge className={getBadgeColor(exam?.type)}>
              {mapExamType(exam?.type)}
            </Badge>
          </div>
        </CardTitle>
        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center text-sm text-gray-500 dark:text-white">
            <Clock className="mr-1 h-4 w-4" />
            <span>{new Date(exam?.due_date).toLocaleTimeString("vi-VN")}</span>
            <Calendar className="ml-4 mr-1 h-4 w-4" />
            <span>{new Date(exam?.due_date).toLocaleDateString("vi-VN")}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-white">
            <Users className="mr-2 h-4 w-4" />
            <span>Lớp {classDetail?.class_name}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="description" className="space-y-4">
          <TabsList>
            <TabsTrigger value="description">Mô tả</TabsTrigger>
            <TabsTrigger value="submissions">Bài nộp</TabsTrigger>
            {auth?.role === "student" && (
              <TabsTrigger value="grades">Điểm thi</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="description">
            <div className="prose max-w-none text-sm dark:text-white text-gray-500">
              {exam?.description || "Không có mô tả"}
            </div>
          </TabsContent>

          <TabsContent value="submissions">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-white">
                    Tiến độ nộp bài
                  </p>
                  <p className="text-lg font-semibold">
                    {studentSumbmissions?.length || 0}/
                    {studentInclass?.length || 0} bài đã nộp
                  </p>
                </div>
                <Progress
                  value={
                    studentInclass?.length
                      ? (studentSumbmissions?.length / studentInclass?.length) *
                        100
                      : 0
                  }
                  className="w-64"
                />
              </div>
            </div>
          </TabsContent>
          {auth?.role === "student" && (
            <TabsContent value="grades">
              {(grades && grades.grade) || grades.feed_back ? (
                <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto flex flex-row space-x-6">
                  {/* Cột hiển thị điểm số */}
                  <div className="flex-1 border-r pr-6 flex flex-col justify-center">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                      Điểm số
                    </h2>
                    <span className="text-4xl font-extrabold text-blue-500">
                      {grades.grade}
                    </span>
                  </div>
                  {/* Cột hiển thị nhận xét */}
                  <div className="flex-1 pl-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Nhận xét
                    </h3>
                    <p className="text-sm text-gray-600">{grades.feed_back}</p>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto flex flex-row space-x-6 dark:bg-blue-950 ">
                  <h2 className="text-xl font-bold text-gray-800 mb-2 dark:text-white">
                    Chưa có điểm
                  </h2>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExamHeaderCard;
