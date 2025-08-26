/* eslint-disable react/prop-types */
import { X, Trash, Loader2, Save, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const ConfirmSubmit = ({ show, handleClose, submitCode }) => {
  const [isLoading, setLoading] = useState(false);
  const handleSubmitCode = () => {
    setLoading(true);
    try {
      setTimeout(() => {
        submitCode();
        setLoading(false);
        handleClose();
      }, 1500);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white">
            <Trash size={20} className="text-red-600" />
            <span>Xác nhận nộp bài!</span>
          </DialogTitle>
          <DialogDescription className="mt-4 text-gray-700 dark:text-gray-300">
            Bạn có chắc chắn muốn thực hiện thao tác này không?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex justify-end space-x-4">
          <Button
            variant="outline"
            onClick={() => handleClose()}
            className="dark:text-white"
          >
            <X size={16} className="mr-2" />
            Đóng
          </Button>
          <Button
            onClick={() => {
              handleSubmitCode();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 "
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4" />
                <span>Xác nhận</span>
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmSubmit;
