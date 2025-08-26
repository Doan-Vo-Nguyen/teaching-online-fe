/* eslint-disable react/prop-types */
import { X, Trash, Loader2, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { deleteUser } from "@/api/userApi";
import { toast } from "react-toastify";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const DeleteUser = ({ show, handleClose, userData, fetchAllListUser }) => {
  const [isLoading, setIsLoading] = useState(false);

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const res = await deleteUser(userData?.user_id);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (res.success) {
        toast.success(res.message);
        fetchAllListUser();
        handleClose();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.details ||
        error.response?.data?.error?.message;
      toast.error(errorMessage);
      console.error("Error message:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto border dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
            <Trash size={20} className="text-red-600" />
            <span>Xác nhận xóa {userData?.fullname}!</span>
          </DialogTitle>
          <DialogDescription className="mt-4 text-gray-700 dark:text-gray-300">
            Bạn có chắc chắn muốn thực hiện thao tác này không?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="border-gray-300 dark:border-gray-600 dark:text-gray-200"
          >
            <X size={16} className="mr-2" />
            Đóng
          </Button>
          <Button
            onClick={confirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
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

export default DeleteUser;
