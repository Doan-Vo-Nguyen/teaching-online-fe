/* eslint-disable react/prop-types */
import { useState } from "react";
import { AlertCircle, Loader2, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { deleteFileSubmission } from "@/api/SubmissionApi";
import moment from "moment";

const SubmittedFiles = ({
  files,
  getFileIcon,
  onFileDeleted,
  fetchAllFileSubmits,
  viewFileOnline,
  isOverdue,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [fileToDelete, setFileToDelete] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Format date function
  const handleDeleteFile = async () => {
    if (!fileToDelete) return;
    console.log("fileToDelete", fileToDelete);
    try {
      setIsDeleting(true);
      const response = await deleteFileSubmission(
        fileToDelete.exam_submission_id,
        fileToDelete.id
      );

      if (response.success) {
        toast.success(response.message || "Xóa file thành công");
        onFileDeleted(fileToDelete.id);
        fetchAllFileSubmits();
      } else {
        toast.error(response.message || "Không thể xóa file");
      }
    } catch (error) {
      console.error("Delete file error:", error);
      toast.error("Đã xảy ra lỗi khi xóa file");
    } finally {
      setIsDeleting(false);
      setConfirmDialogOpen(false);
      setFileToDelete(null);
    }
  };

  const openDeleteConfirmDialog = (file) => {
    console.log("fileToDelete", file);

    setFileToDelete(file);
    setConfirmDialogOpen(true);
  };

  if (files.length === 0) {
    if (isOverdue) {
      return (
        <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed rounded-lg bg-gray-50">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
          <h3 className="text-sm font-medium text-gray-600">
            Đã quá hạn nộp bài
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Bạn đã quá hạn nộp bài. Vui lòng liên hệ giáo viên nếu có thắc mắc.
          </p>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col items-center justify-center py-6 text-center border border-dashed rounded-lg bg-gray-50">
          <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
          <h3 className="text-sm font-medium text-gray-600">Chưa có bài nộp</h3>
          <p className="text-xs text-gray-500 mt-1">
            Hãy chọn file và nhấn nút &ldquo;Nộp bài&rdquo; để gửi bài làm của
            bạn.
          </p>
        </div>
      );
    }
  }

  return (
    <div className="space-y-1">
      <div className="border rounded-lg overflow-hidden">
        <div className="bg-gray-50 px-4 py-2 border-b">
          <h3 className="text-sm font-medium">Bài nộp của bạn</h3>
        </div>
        <ul className="divide-y divide-gray-200 max-h-60 overflow-y-auto">
          {files.map((file) => {
            const fileName = file.file_content
              ? decodeURIComponent(
                  file.file_content.split("/").pop().split("?")[0]
                )
              : "Unnamed file";

            return (
              <li
                key={file.id}
                className="px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center">
                  <div className="mr-3 flex-shrink-0">
                    {getFileIcon(fileName)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      title={fileName}
                    >
                      <button
                        onClick={() => viewFileOnline(file.file_content)}
                        className="font-semibold text-md line-clamp-1 text-blue-600 hover:underline"
                      >
                        {fileName}
                      </button>
                    </p>
                    <p className="text-xs text-gray-500">
                      Đã nộp:{" "}
                      {moment(file.created_at).format("HH:mm - DD/MM/YYYY")}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-500 hover:text-red-600"
                      onClick={() => openDeleteConfirmDialog(file)}
                      title="Xóa file"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa !</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa file{" "}
              <span className="font-semibold">
                {fileToDelete
                  ? decodeURIComponent(
                      fileToDelete.file_content.split("/").pop().split("?")[0]
                    )
                  : ""}
              </span>
              ? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialogOpen(false)}
              disabled={isDeleting}
            >
              <X size={16} className="mr-2" /> Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteFile}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                <>
                  <Check size={16} className="mr-2" />
                  Xác nhận
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubmittedFiles;
