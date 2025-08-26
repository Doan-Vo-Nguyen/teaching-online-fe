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
import { deleleTestCase } from "@/api/testcaseApi";

const DeleteTestCase = ({
  show,
  handleClose,
  testCaseToDelete,
  fetchAllTestCaseForExamContent,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { examContentId } = useParams();
  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const res = await deleleTestCase(testCaseToDelete?.id);
      if (res.success) {
        toast.success(res.message);
        handleClose();
        fetchAllTestCaseForExamContent(examContentId);
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
      <DialogContent className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-xl dark:shadow-gray-900/30 p-6 w-full max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white">
            <Trash size={20} className="text-red-600 dark:text-red-500" />
            <span>Xác nhận xóa {testCaseToDelete?.title}!</span>
          </DialogTitle>
          <DialogDescription className="mt-4 text-gray-700 dark:text-gray-300">
            Bạn có chắc chắn muốn thực hiện thao tác này không?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <X size={16} className="mr-2" />
            Đóng
          </Button>
          <Button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition-colors duration-200"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Đang xử lý...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Check size={16} />
                <span>Xác nhận</span>
              </div>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTestCase;
