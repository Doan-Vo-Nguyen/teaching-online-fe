/* eslint-disable react/prop-types */
import { X, Trash, Loader2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { deleteExamContent } from "@/api/ExamApi";

const DeleteExamContent = ({
  show,
  handleClose,
  examToDelete,
  fetchAllExamContentByExamId,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { examId } = useParams();
  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const res = await deleteExamContent(examToDelete?.id);
      if (res.success) {
        toast.success(res.message);
        handleClose();
        fetchAllExamContentByExamId(examId);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.details ||
        error.response?.data?.error?.message;
      toast.error(errorMessage);
      console.error("Error message:", errorMessage);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
            <Trash size={20} className="text-red-600" />
            <span>Xác nhận xóa {examToDelete?.title}!</span>
          </DialogTitle>
          <DialogDescription className="mt-4 text-gray-700">
            Bạn có chắc chắn muốn thực hiện thao tác này không?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" onClick={handleClose}>
            <X size={16} className="mr-2" />
            Đóng
          </Button>
          <Button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Check size={16} className="mr-2" />
                Xác nhận
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteExamContent;
