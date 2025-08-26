/* eslint-disable react/prop-types */
import { useState } from "react";
import { Save, X, Clock, Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { v4 as uuidv4 } from "uuid";
import { createMeetingByClassId } from "@/api/MeetingApi";
const formSchema = z.object({
  roomName: z.string().min(1, "Tên phòng học không được để trống"),
});

const CreateMeeting = ({ open, onOpenChange, fetchAllMeetingList }) => {
  const { classId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomName: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const newRoomName = values.roomName;
      const newMeetLink = `https://meet.jit.si/class-meeting-${uuidv4().substring(
        0,
        8
      )}`;

      console.log("NewRoomName: " + newRoomName, newMeetLink);
      const response = await createMeetingByClassId(
        classId,
        newRoomName,
        newMeetLink
      );
      console.log("response", response);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (response.success) {
        form.reset({ roomName: "" });
        toast.success(response.message || "Tạo phòng học thành công");
        onOpenChange();
        fetchAllMeetingList(classId);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating lecture:", error);
      toast.error("Không thể tạo phòng học + mới: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset({ roomName: "" });
    onOpenChange();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Tạo mới phòng học
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-white">
                <Clock className="h-4 w-4" />
                <span>{new Date().toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Tiêu đề */}
            <FormField
              control={form.control}
              name="roomName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Tên phòng học
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tên phòng học"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleCancel()}
                disabled={isLoading}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Lưu </span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMeeting;
