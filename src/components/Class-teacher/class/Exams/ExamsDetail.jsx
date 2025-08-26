import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthToken from "@/hooks/userAuthToken";
import { getExamDetail, getAllExamContentByExamId } from "@/api/ExamApi";
import { getAllStudentJoinedByClassId, getClassDetail } from "@/api/classApi";
import DeleteExamContent from "./DeleteExamContent";
import AddFileOfExam from "./AddFileOfExam";
import ExamHeaderCard from "./ExamHeaderCard";
import AttachmentsCard from "./AttachmentsCard";
import NavigationBar from "../Lectures/NavigationBar";
import { FileCodeIcon, FileText, Image, PlayCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubmissionCard from "./Submissions/SubmissionCard";
import GradingTab from "./Grades/GradingTab";
import { getAllStudentSumbmissions } from "@/api/SubmissionApi";
import ListExamContentForIt from "./ExamContentForIT/ListExamContentForIt";

const ExamsDetail = () => {
  const auth = useAuthToken();
  const navigate = useNavigate();
  const { examId, classId } = useParams();
  const [exam, setExam] = useState(null);
  const [classDetail, setClassDetail] = useState("");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [examToDelete, setExamToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [studentInclass, setStudentInClass] = useState([]);
  const [studentSumbmissions, setStudentSumbmissions] = useState([]);
  useEffect(() => {
    fetchExamDetail();
    fetchClassDetail();
    fetchAllExamContentByExamId();
    fetchAllStudentInClass();
    fetchAllStudentSumbmissions();
  }, [classId, examId]);

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
  const fetchExamDetail = async () => {
    const res = await getExamDetail(examId);
    if (res.success) {
      setExam(res.data);
    }
  };

  const fetchClassDetail = async () => {
    const res = await getClassDetail(classId);
    if (res.data) {
      setClassDetail(res.data);
    }
  };

  const fetchAllExamContentByExamId = async () => {
    const res = await getAllExamContentByExamId(examId);
    if (res.success) {
      const examContentFile = res.data.reverse();
      setAttachments(examContentFile);
    }
  };

  const handleDeleteAttachment = (attachment) => {
    setExamToDelete(attachment);
    setShowDeleteModal(true);
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

  const viewFileOnline = (fileUrl) => {
    if (!fileUrl) return;
    const ext = fileUrl.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
      window.open(fileUrl, "_blank");
    } else if (["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(ext)) {
      window.open(fileUrl, "_blank");
    } else if (ext === "pdf") {
      try {
        const encodedUrl = encodeURIComponent(fileUrl);
        const viewerUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
        const newWindow = window.open("about:blank", "_blank");
        if (newWindow) {
          newWindow.document.write(`
          <html>
            <head>
              <title>Đang tải tài liệu...</title>
              <style>
                body, html { height: 100%; margin: 0; padding: 0; overflow: hidden; }
                .container { display: flex; flex-direction: column; height: 100%; }
                .loading { padding: 20px; text-align: center; }
                iframe { flex: 1; border: none; width: 100%; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="loading" id="loading">
                  <h2>Đang tải tài liệu...</h2>
                  <p>Nếu tài liệu không hiển thị, hãy <a href="${fileUrl}" download>tải xuống</a>.</p>
                </div>
                <iframe src="${viewerUrl}" onload="document.getElementById('loading').style.display='none'"></iframe>
              </div>
            </body>
          </html>
        `);
          newWindow.document.close();
        } else {
          window.open(fileUrl, "_blank");
        }
      } catch (error) {
        console.error("Lỗi khi mở file PDF:", error);
        window.open(fileUrl, "_blank");
      }
    } else if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)) {
      try {
        const encodedUrl = encodeURIComponent(fileUrl);
        window.open(
          `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`,
          "_blank"
        );
      } catch (error) {
        window.open(fileUrl, "_blank");
      }
    } else if (["js", "c", "cpp", "sql"].includes(ext)) {
      fetch(fileUrl)
        .then((res) => res.text())
        .then((text) => {
          const newWindow = window.open("about:blank", "_blank");
          if (newWindow) {
            newWindow.document.write(`
            <html>
              <head>
                <title>File ${ext.toUpperCase()} Viewer</title>
                <style>
                  body, html { margin: 0; padding: 0; }
                  pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    padding: 20px;
                    font-family: monospace;
                    background: #f7f7f7;
                  }
                </style>
              </head>
              <body>
                <pre>${text}</pre>
              </body>
            </html>
          `);
            newWindow.document.close();
          }
        })
        .catch((error) => {
          console.error("Error loading file", error);
          window.open(fileUrl, "_blank");
        });
    } else {
      window.open(fileUrl, "_blank");
    }
  };

  return (
    <div className="w-full dark:bg-[#020818] bg-gray-50 min-h-screen pb-10">
      <div className="mb-5">
        <NavigationBar
          title={exam?.title}
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          goBack={() => navigate(-1)}
        />
      </div>

      {auth?.role === "student" ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-3">
          <div className="lg:col-span-2">
            <ExamHeaderCard
              exam={exam}
              classDetail={classDetail}
              studentInclass={studentInclass}
              studentSumbmissions={studentSumbmissions}
            />
            {exam?.type_student === "common" && (
              <AttachmentsCard
                attachments={attachments}
                auth={auth}
                setIsUploadDialogOpen={setIsUploadDialogOpen}
                handleDeleteAttachment={handleDeleteAttachment}
                getFileIcon={getFileIcon}
                viewFileOnline={viewFileOnline}
              />
            )}
            {exam?.type_student === "it" && (
              <>
                <ListExamContentForIt />
              </>
            )}
          </div>
          <div className="space-y-6">
            <SubmissionCard
              getFileIcon={getFileIcon}
              viewFileOnline={viewFileOnline}
              exam={exam}
            />
          </div>
        </div>
      ) : (
        <div className="px-3">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="grading">Chấm điểm</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <ExamHeaderCard exam={exam} classDetail={classDetail} />
              {exam?.type_student === "common" && (
                <AttachmentsCard
                  attachments={attachments}
                  auth={auth}
                  setIsUploadDialogOpen={setIsUploadDialogOpen}
                  handleDeleteAttachment={handleDeleteAttachment}
                  getFileIcon={getFileIcon}
                  viewFileOnline={viewFileOnline}
                />
              )}
              {exam?.type_student === "it" && (
                <>
                  <ListExamContentForIt />
                </>
              )}
            </TabsContent>

            <TabsContent value="grading">
              <GradingTab
                classDetail={classDetail}
                exam={exam}
                students={studentInclass}
                studentSumbmissions={studentSumbmissions}
                fetchAllStudentSumbmissions={fetchAllStudentSumbmissions}
              />
            </TabsContent>
          </Tabs>
        </div>
      )}
      {exam?.type_student === "common" && (
        <>
          <AddFileOfExam
            open={isUploadDialogOpen}
            onOpenChange={setIsUploadDialogOpen}
            fetchAllExamContentByExamId={fetchAllExamContentByExamId}
            getFileIcon={getFileIcon}
          />
          {examToDelete && (
            <DeleteExamContent
              show={showDeleteModal}
              handleClose={() => setShowDeleteModal(false)}
              examToDelete={examToDelete}
              fetchAllExamContentByExamId={fetchAllExamContentByExamId}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ExamsDetail;
