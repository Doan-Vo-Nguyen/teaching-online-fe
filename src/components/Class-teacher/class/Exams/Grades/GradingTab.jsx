/* eslint-disable react/prop-types */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle,
  XCircle,
  Search,
  Download,
  FileText,
  Clock,
  Eye,
  UserCircle,
  Image,
  PlayCircle,
  FileCodeIcon,
  Loader2,
  BookOpen,
  AlertCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { getUserById } from "@/api/userApi";
import moment from "moment";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  getAllFileSubmitForASpecificStudent,
  gradingForStudents,
} from "@/api/SubmissionApi";
import { useParams } from "react-router-dom";
import { viewFileOnline } from "../../../../../../constant";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { Progress } from "@/components/ui/progress";
import ScoreDistributionChart from "./ScoreDistributionChart";

const GradingTab = ({
  classDetail,
  exam,
  students,
  studentSumbmissions,
  fetchAllStudentSumbmissions,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { examId, classId } = useParams();
  const [studentDetails, setStudentDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionDialogOpen, setSubmissionDialogOpen] = useState(false);
  const [fileSubmits, setFileSubmits] = useState([]);
  const [modalGrade, setModalGrade] = useState("");
  const [modalFeedback, setModalFeedback] = useState("");

  useEffect(() => {
    fetchStudentDetails();
  }, [students]);

  useEffect(() => {
    if (selectedSubmission) {
      setModalGrade(selectedSubmission?.grade || "");
      setModalFeedback(selectedSubmission?.feed_back || "");
    }
  }, [selectedSubmission]);

  const fetchStudentDetails = async () => {
    if (students && students.length > 0) {
      try {
        const results = await Promise.all(
          students.map((student) => getUserById(student?.student_id))
        );
        const fetchedStudents = results
          .filter((res) => res.success)
          .map((res) => res.data);
        setStudentDetails(fetchedStudents);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    }
  };

  const filteredStudents = studentDetails.filter((student) => {
    const term = searchTerm.toLowerCase();
    return (
      student.fullname.toLowerCase().includes(term) ||
      student.user_id.toString().toLowerCase().includes(term)
    );
  });

  const fetchAllFileSubmitForASpecificStudent = async (
    examId,
    authId,
    classId
  ) => {
    try {
      const res = await getAllFileSubmitForASpecificStudent(
        examId,
        authId,
        classId
      );
      if (
        res.success &&
        Array.isArray(res.data.examSubmissionContents) &&
        res.data.examSubmissionContents.length > 0
      ) {
        const files = res.data.examSubmissionContents.reverse();
        setFileSubmits(files);
        return files;
      } else {
        console.error("Failed to fetch submitted files:", res.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching submitted files:", error);
      return [];
    }
  };

  const handleGradingForStudents = async (submission, student) => {
    const fileSubmitOfStudent = await fetchAllFileSubmitForASpecificStudent(
      examId,
      student.user_id,
      classId
    );
    setSelectedSubmission({
      ...submission,
      student,
      files: fileSubmitOfStudent,
    });
    setSubmissionDialogOpen(true);
  };

  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();

    switch (ext) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-600" />;
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-5 w-5 text-green-600" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-5 w-5 text-orange-600" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <Image className="h-5 w-5 text-blue-600" />;
      case "mp4":
      case "webm":
      case "ogg":
        return <PlayCircle className="h-5 w-5 text-purple-600" />;
      case "js":
      case "jsx":
      case "mjs":
        return <FileCodeIcon className="h-5 w-5 text-yellow-500" />;
      case "py":
        return <FileCodeIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  // Hàm xử lý xuất dữ liệu ra file CSV với mã hóa UTF-8
  const handleExportCSV = () => {
    // Header của CSV
    const header = [
      "STT",
      "Mã SV",
      "Sinh viên",
      "Trạng thái",
      "Ngày nộp",
      "Điểm",
      "Nhận xét",
    ];
    const csvRows = [];
    csvRows.push(header.join(","));

    filteredStudents.forEach((student, index) => {
      const submission = studentSumbmissions?.find(
        (sub) => sub.student_id === student.user_id
      );
      const hasSubmitted = !!submission;
      const status = hasSubmitted ? "Đã nộp" : "Chưa nộp";
      const submittedAt = hasSubmitted
        ? moment(submission.submitted_at).format("HH:mm - DD/MM/YYYY")
        : "Chưa có dữ liệu";
      const grade = submission?.grade ?? 0;
      const feedback = submission?.feed_back ?? "";
      const row = [
        index + 1,
        student.user_id,
        student.fullname,
        status,
        submittedAt,
        grade,
        feedback,
      ].map((field) => `"${field}"`);
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    // Thêm BOM cho UTF-8
    const blob = new Blob(["\uFEFF" + csvString], {
      type: "text/csv;charset=utf-8;",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `${classDetail.class_name} - ${exam.title}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSaveGrade = async () => {
    setIsLoading(true);
    try {
      let res = await gradingForStudents(
        selectedSubmission?.exam_submission_id,
        {
          grade: modalGrade,
          feed_back: modalFeedback,
        }
      );
      if (res.success) {
        toast.success(res.message);
        setSubmissionDialogOpen(false);
      }
      fetchAllStudentSumbmissions();
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.details || error?.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateCompletionRate = () => {
    if (!students.length) return 0;
    const totalPossibleSubmissions =
      studentSumbmissions.length / students.length;
    return Math.round(totalPossibleSubmissions * 100);
  };
  const calculateClassAverage = () => {
    if (!studentSumbmissions.length) return 0;

    const validGrades = studentSumbmissions.filter((g) => g.grade !== null);
    if (!validGrades.length) return 0;

    const sum = validGrades.reduce(
      (acc, grade) => acc + parseFloat(grade.grade),
      0
    );
    const average = (sum / validGrades.length).toFixed(1);
    return average;
  };

  const excellentSubmissions = studentSumbmissions.filter(
    (submission) => submission?.grade >= 8.5
  );

  const classAverage = calculateClassAverage();
  const completionRate = calculateCompletionRate();
  const excellentStudents = excellentSubmissions.length;
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Thống kê điểm số</h2>
          <p className="text-gray-500 text-sm">
            Tổng quan về kết quả học tập của lớp
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Điểm trung bình lớp
                </p>
                <h3 className="text-3xl font-bold text-blue-600">
                  {classAverage}
                </h3>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <Progress value={classAverage * 10} className="h-1.5 mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Tỷ lệ hoàn thành
                </p>
                <h3 className="text-3xl font-bold text-green-600">
                  {completionRate}%
                </h3>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <Progress value={completionRate} className="h-1.5 mt-4" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Sinh viên xuất sắc
                </p>
                <h3 className="text-3xl font-bold text-purple-600">
                  {excellentStudents}
                </h3>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <AlertCircle className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <Progress
              value={(excellentStudents / students.length) * 100}
              className="h-1.5 mt-4"
            />
          </CardContent>
        </Card>
      </div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Phân phối điểm số</CardTitle>
          <CardDescription>
            Tổng quan về phân bố điểm số của sinh viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScoreDistributionChart studentSumbmissions={studentSumbmissions} />
        </CardContent>
      </Card>
      <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg overflow-hidden mb-6 shadow-sm dark:shadow-none">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-gray-800 dark:text-gray-200">
              Danh sách sinh viên
            </h3>
            <Badge
              variant="outline"
              className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800"
            >
              {students.length} sinh viên
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc MSV..."
                className="pl-10 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:focus:border-blue-500 dark:focus:ring-blue-500/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="flex items-center space-x-2 dark:border-gray-600 dark:text-gray-200"
              onClick={handleExportCSV}
            >
              <Download className="h-4 w-4" />
              <span>Xuất bảng điểm</span>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 dark:bg-gray-800">
                <TableHead className="w-[50px] text-gray-700 dark:text-gray-300">
                  STT
                </TableHead>
                <TableHead className="w-[100px] text-gray-700 dark:text-gray-300">
                  Mã SV
                </TableHead>
                <TableHead className="w-[200px] text-gray-700 dark:text-gray-300">
                  Sinh viên
                </TableHead>
                <TableHead className="w-[150px] text-gray-700 dark:text-gray-300">
                  Trạng thái
                </TableHead>
                <TableHead className="w-[200px] text-gray-700 dark:text-gray-300">
                  Ngày nộp
                </TableHead>
                <TableHead
                  className="w-[150px] text-gray-700 dark:text-gray-300"
                  style={{ position: "relative", zIndex: 10 }}
                >
                  Điểm
                  <span className="text-gray-500 dark:text-gray-400 text-xs ml-1">
                    /{10}
                  </span>
                </TableHead>
                <TableHead className="w-[300px] text-gray-700 dark:text-gray-300">
                  Nhận xét
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student, index) => {
                const submission = studentSumbmissions?.find(
                  (sub) => sub.student_id === student.user_id
                );
                const hasSubmitted = !!submission;

                return (
                  <TableRow
                    key={student.user_id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700"
                  >
                    <TableCell className="font-medium text-gray-700 dark:text-gray-300">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 font-mono">
                      {student.user_id}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <span
                          className="font-medium text-gray-800 dark:text-gray-200"
                          onClick={() => {
                            if (hasSubmitted) {
                              handleGradingForStudents(submission, student);
                            }
                          }}
                        >
                          {student?.fullname}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      {hasSubmitted ? (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Badge
                              variant="student"
                              className="min-w-[100px] dark:bg-green-900/30 dark:text-green-300 cursor-pointer"
                              onClick={() =>
                                handleGradingForStudents(submission, student)
                              }
                            >
                              <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                              Đã nộp
                            </Badge>
                          </DialogTrigger>
                        </Dialog>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-none px-3 py-1"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1.5" />
                          Chưa nộp
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {hasSubmitted ? (
                        <div className="flex items-center space-x-1 text-gray-700 dark:text-gray-400">
                          <Clock className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                          <span>
                            {moment(submission.submitted_at).format(
                              "HH:mm - DD/MM/YYYY"
                            )}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 italic">
                          Chưa có dữ liệu
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        max={exam?.maxScore || 10}
                        step="0.1"
                        value={submission?.grade ?? 0}
                        className="w-20 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-100 disabled:bg-white dark:disabled:bg-gray-900 disabled:text-black dark:disabled:text-white"
                        disabled={true}
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={submission?.feed_back ?? ""}
                        disabled={true}
                        className="border-gray-300 dark:border-gray-600 w-full focus:ring-blue-500 focus:border-blue-500 disabled:bg-white dark:disabled:bg-gray-900 disabled:opacity-100 disabled:cursor-default disabled:text-black dark:disabled:text-white"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Modal hiển thị thông tin bài nộp */}
        <Dialog
          open={submissionDialogOpen}
          onOpenChange={setSubmissionDialogOpen}
        >
          <DialogContent className="max-w-4xl p-6 dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center dark:text-gray-200">
                Chi tiết bài nộp
                <Badge className="ml-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-none">
                  Đã nộp
                </Badge>
              </DialogTitle>
              <DialogDescription className="dark:text-gray-400">
                {selectedSubmission && (
                  <div className="mt-2 flex items-center space-x-4">
                    <Avatar className="ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-300">
                      {selectedSubmission.student?.profile_picture ? (
                        <AvatarImage
                          src={selectedSubmission.student?.profile_picture}
                          className="object-cover"
                        />
                      ) : (
                        <UserCircle
                          size={40}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-200">
                        {selectedSubmission.student?.fullname}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        MSV: {selectedSubmission.student?.user_id}
                      </div>
                    </div>
                  </div>
                )}
              </DialogDescription>
            </DialogHeader>

            {fileSubmits && (
              <div className="mt-6">
                <Tabs defaultValue="files" className="w-full">
                  <TabsContent value="files" className="space-y-4">
                    <div className="border dark:border-gray-700 rounded-md overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b dark:border-gray-700">
                        <h3 className="font-medium dark:text-gray-200">
                          Danh sách tệp đã nộp
                        </h3>
                      </div>
                      <div className="divide-y dark:divide-gray-700 max-h-60 overflow-y-auto">
                        {selectedSubmission?.files?.map((file) => {
                          const fileName = file.file_content
                            ? decodeURIComponent(
                                file.file_content.split("/").pop().split("?")[0]
                              )
                            : "Unnamed file";
                          return (
                            <div
                              key={file.id}
                              className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800"
                            >
                              <div className="flex items-center space-x-3">
                                {getFileIcon(fileName)}
                                <div>
                                  <div className="font-medium dark:text-gray-200">
                                    {exam.type_student === "it"
                                      ? `${selectedSubmission.student?.fullname} - ${exam.title} `
                                      : { fileName }}
                                  </div>
                                  <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Đã nộp:{" "}
                                    {moment(file.created_at).format(
                                      "HH:mm - DD/MM/YYYY"
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div>
                                {exam.type_student === "common" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-blue-600 dark:text-blue-400 dark:border-gray-600"
                                    onClick={() =>
                                      viewFileOnline(file.file_content)
                                    }
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Xem
                                  </Button>
                                )}
                                {exam.type_student === "it" && (
                                  <div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-blue-600 dark:text-blue-400 dark:border-gray-600"
                                      onClick={() => {
                                        const newWindow = window.open(
                                          "",
                                          "_blank"
                                        );
                                        newWindow.document.write(`
          <html>
            <head>
              <title>Xem nội dung file</title>
              <style>
                body {
                  background-color: #1e1e1e;
                  color: #d4d4d4;
                  font-family: monospace;
                  padding: 20px;
                  white-space: pre-wrap;
                }
                pre {
                  white-space: pre-wrap;
                  word-wrap: break-word;
                }
              </style>
            </head>
            <body>
              <h2>Nội dung file:</h2>
              <pre>${file.file_content
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")}</pre>
            </body>
          </html>
        `);
                                        newWindow.document.close();
                                      }}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      Xem
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            <DialogFooter className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-4">
              <div className="flex space-x-4">
                <Input
                  type="number"
                  min="0"
                  max={exam?.maxScore || 10}
                  step="0.1"
                  value={modalGrade}
                  onChange={(e) => setModalGrade(e.target.value)}
                  className="w-24 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
                  placeholder="Điểm"
                  disabled={isLoading}
                />
                <Textarea
                  placeholder="Nhập nhận xét..."
                  value={modalFeedback}
                  onChange={(e) => setModalFeedback(e.target.value)}
                  className="w-full sm:w-96 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
                  disabled={isLoading}
                />
              </div>
              <div className="flex space-x-4">
                <DialogClose asChild>
                  <Button
                    variant="outline"
                    className="px-4 py-2 dark:border-gray-600 dark:text-gray-200"
                  >
                    Đóng
                  </Button>
                </DialogClose>
                <Button
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white px-4 py-2 flex items-center"
                  onClick={handleSaveGrade}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Lưu đánh giá
                    </>
                  )}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default GradingTab;
