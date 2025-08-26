/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Check, Loader2, Trash, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { deleteClass } from "@/api/classApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { triggerClassUpdate } from "@/store/classSlice";

const DeleteClass = ({ show, handleClose, classData, fetchAllClasses }) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const confirmDelete = async () => {
    setIsLoading(true);

    try {
      const res = await deleteClass(classData?.class_id);

      if (res.success) {
        toast.success(res.message);
        fetchAllClasses();
        dispatch(triggerClassUpdate());
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
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white">
            <Trash size={20} className="text-red-600 dark:text-red-500" />
            <span>Xác nhận xóa lớp {classData.class_name}!</span>
          </DialogTitle>
          <DialogDescription className="mt-4 text-gray-700 dark:text-gray-300">
            Bạn có chắc chắn muốn thực hiện thao tác này không?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={16} className="mr-2" />
            Đóng
          </Button>
          <Button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 transition-colors duration-200"
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

export default DeleteClass;
