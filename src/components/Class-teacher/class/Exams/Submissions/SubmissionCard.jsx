/* eslint-disable react/prop-types */
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Upload, X, Loader2 } from "lucide-react";
import ExamSubmission from "./ExamSubmission";
import SubmittedFiles from "./SubmittedFiles";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import {
  getAllFileSubmitForASpecificStudent,
  submitExams,
} from "@/api/SubmissionApi";
import useAuthToken from "@/hooks/userAuthToken";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const SubmissionCard = ({ getFileIcon, viewFileOnline, exam }) => {
  const auth = useAuthToken();
  const { examId, classId } = useParams();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [fileSubmits, setFileSubmits] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const isOverdue = new Date(exam?.due_date) < new Date();

  const userId = auth?.id;

  useEffect(() => {
    if (userId) {
      fetchAllFileSubmitForASpecificStudent(examId, userId, classId);
    }
  }, [examId, userId, classId]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFileSelect = (filesList) => {
    const filesArray = Array.from(filesList);
    const validFileObjs = [];

    filesArray.forEach((file) => {
      // Kiểm tra dung lượng file
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} vượt quá kích thước cho phép (100MB)`);
        return;
      }
      const fileObj = {
        file,
        name: file.name,
        size: formatFileSize(file.size),
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
        id: Date.now() + Math.random().toString(36).substring(2, 9),
      };
      validFileObjs.push(fileObj);
    });

    // Nếu có file hợp lệ thì thêm vào state
    if (validFileObjs.length > 0) {
      setSelectedFiles((prevFiles) => [...prevFiles, ...validFileObjs]);
    }
  };

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
        setSubmitted(true);
        const fileSubmits = res.data.examSubmissionContents.reverse();
        setFileSubmits(fileSubmits);
      } else {
        console.error("Failed to fetch submitted files:", res.message);
      }
    } catch (error) {
      console.error("Error fetching submitted files:", error);
    }
  };

  const handleDeletedFile = (fileId) => {
    setFileSubmits((prevFiles) =>
      prevFiles.filter((file) => file.id !== fileId)
    );
  };

  // Xoá file khỏi danh sách file chọn (chưa submit)
  const removeFile = (fileId) => {
    setSelectedFiles((prevFiles) =>
      prevFiles.filter((file) => file.id !== fileId)
    );
  };

  const uploadToCloudinary = async (fileObj) => {
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env
      .VITE_CLOUDINARY_UPLOAD_PRESET;
    const CLOUDINARY_DB = import.meta.env.VITE_CLOUDINARY_DB;
    const fileId = fileObj.id;

    setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

    // Xác định resource_type dựa trên loại file
    let resourceType = "raw";

    if (fileObj.file.type.startsWith("image/")) {
      resourceType = "image";
    } else if (fileObj.file.type.startsWith("video/")) {
      resourceType = "video";
    }
    const formData = new FormData();
    formData.append("file", fileObj.file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("resource_type", resourceType);

    try {
      const xhr = new XMLHttpRequest();
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100);
          setUploadProgress((prev) => ({ ...prev, [fileId]: progress }));
        }
      };

      const uploadPromise = new Promise((resolve, reject) => {
        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_DB}/${resourceType}/upload`
        );
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(JSON.parse(xhr.responseText));
          } else {
            reject(new Error("Upload failed"));
          }
        };
        xhr.onerror = () => reject(new Error("Upload failed"));
        xhr.send(formData);
      });

      const result = await uploadPromise;
      setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));
      return {
        url: result.secure_url,
        originalName: fileObj.name,
        fileSize: fileObj.size,
      };
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      toast.error(`Upload thất bại: ${fileObj.name}`);
      throw error;
    }
  };

  const handleSubmitExam = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 file để nộp bài");
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      const uploadResults = [];
      for (let fileObj of selectedFiles) {
        const result = await uploadToCloudinary(fileObj);
        uploadResults.push(result);
      }

      const submitPromises = uploadResults.map((uploadResult) => {
        const content = uploadResult.url;
        return submitExams({
          examId: examId,
          student_id: auth?.id,
          class_id: classId,
          file_content: content,
        });
      });
      const responses = await Promise.all(submitPromises);

      let successCount = 0;
      responses.forEach((response) => {
        if (response.success) {
          successCount++;
        }
      });

      if (successCount > 0) {
        toast.success(`Đã nộp ${successCount} file thành công`);
      }

      // Chỉ gọi fetch một lần sau khi tất cả đã hoàn thành
      if (auth?.id) {
        await fetchAllFileSubmitForASpecificStudent(examId, auth?.id, classId);
      }

      setSelectedFiles([]);
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("Có lỗi xảy ra khi nộp bài");
    } finally {
      setIsSubmitting(false);
    }
  };
  const getStatusClass = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);

    if (submitted) return "bg-green-100 text-green-800";
    if (now > due) return "bg-red-100 text-red-800";

    // Check if due date is within 24 hours
    const timeDiff = due - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff <= 24) return "bg-orange-100 text-orange-800";
    return "bg-blue-100 text-blue-800";
  };
  const getStatusText = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);

    if (submitted) return "Đã hoàn thành";
    if (now > due) return "Quá hạn";
    const timeDiff = due - now;
    const hoursDiff = timeDiff / (1000 * 60 * 60);

    if (hoursDiff <= 24) return "Sắp đến hạn";
    return "Đang mở";
  };

  return (
    <Card className="shadow-sm border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Nộp bài</CardTitle>
          <CardTitle className="text-lg font-semibold">
            <span
              className={`text-xs px-2 py-1 rounded-full ${getStatusClass(
                exam?.due_date
              )}`}
            >
              {getStatusText(exam?.due_date)}
            </span>
          </CardTitle>
        </div>

        <CardDescription>Tải lên file bài làm của bạn</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Danh sách các file đã nộp */}
        <div className="mb-4">
          <SubmittedFiles
            files={fileSubmits}
            getFileIcon={getFileIcon}
            onFileDeleted={handleDeletedFile}
            fetchAllFileSubmits={fetchAllFileSubmitForASpecificStudent}
            viewFileOnline={viewFileOnline}
            isOverdue={isOverdue}
          />
        </div>

        {/* Danh sách file đang chọn để nộp */}
        {selectedFiles.length > 0 && (
          <div className="border rounded-lg p-3 max-h-60 overflow-y-auto">
            <h3 className="text-sm font-medium mb-2">File đã chọn</h3>
            <div className="space-y-2">
              {selectedFiles.map((file) => {
                return (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <div className="flex items-center gap-2 overflow-hidden flex-grow">
                      {file.preview ? (
                        <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        getFileIcon(file.name)
                      )}
                      <div className="min-w-0 flex-grow">
                        <p
                          className="text-sm font-medium truncate"
                          title={file.name}
                        >
                          <span className="font-semibold text-md  text-blue-600 ">
                            {file.name}
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                        {uploadProgress[file.id] > 0 && (
                          <div className="w-full mt-1">
                            <div className="bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-600 h-1.5 rounded-full"
                                style={{
                                  width: `${uploadProgress[file.id]}%`,
                                }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {uploadProgress[file.id]}%
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-500 hover:text-red-500"
                      onClick={() => removeFile(file.id)}
                      disabled={isSubmitting}
                      type="button"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {!isSubmitting && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsUploadDialogOpen(true)}
              disabled={isSubmitting || isOverdue}
            >
              <Plus className="mr-2 text-blue-600" />
              <span className="text-blue-600">Thêm </span>
            </Button>
          )}

          <Button
            variant="default"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleSubmitExam}
            disabled={isSubmitting || selectedFiles.length === 0 || isOverdue}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang nộp bài...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Nộp bài
              </>
            )}
          </Button>
        </div>

        <ExamSubmission
          open={isUploadDialogOpen}
          onOpenChange={setIsUploadDialogOpen}
          onFilesSelected={handleFileSelect}
          getFileIcon={getFileIcon}
        />
      </CardContent>
    </Card>
  );
};

export default SubmissionCard;
