/* eslint-disable react/prop-types */
import { Check, Loader2, Trash, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { leaveClass } from "@/api/userApi";
import { useParams } from "react-router-dom";

const LeaveClass = ({
  show,
  handleClose,
  studentToLeave,
  fetchAllStudentInClass,
}) => {
  const { classId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const res = await leaveClass(studentToLeave?.user_id, classId);
      if (res.success) {
        toast.success(res.message);
        fetchAllStudentInClass();
        handleClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.details || error?.message;
      toast.error(errorMessage);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      open={show}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        }
      }}
    >
      {/* Overlay: đảm bảo che phủ toàn bộ màn hình */}
      <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
      <DialogContent className="bg-white dark:bg-[#020818] rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
            <Trash size={20} className="text-red-600" />
            <span className="dark:text-white">Xác nhận xóa sinh viên!</span>
          </DialogTitle>
          <DialogDescription className="mt-4 text-gray-700 dark:text-white">
            Bạn có chắc chắn muốn xóa sinh viên ({studentToLeave.fullname} -{" "}
            {studentToLeave.email}) ra khỏi lớp học này không!
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

export default LeaveClass;
