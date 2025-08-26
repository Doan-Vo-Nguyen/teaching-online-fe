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
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteMeetingById } from "@/api/MeetingApi";
import { Button } from "@/components/ui/button";

const DeleteMeeting = ({
  show,
  handleClose,
  meetingData,
  fetchAllMeetingList,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const confirmDelete = async () => {
    setIsLoading(true);

    try {
      const res = await deleteMeetingById(meetingData?.id);
      if (res.success) {
        toast.success(res.message);
        fetchAllMeetingList();
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
      <DialogContent className="bg-white dark:bg-[#020818] rounded-lg shadow-lg p-6 w-full max-w-lg mx-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-900">
            <Trash size={20} className="text-red-600" />
            <span className="dark:text-white">
              Xác nhận xóa lớp {meetingData.room_name}!
            </span>
          </DialogTitle>
          <DialogDescription className="mt-4 text-gray-700 dark:text-white">
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

export default DeleteMeeting;
