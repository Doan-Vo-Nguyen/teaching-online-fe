/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
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
import { createNotify, updateNotify } from "@/api/NotifyApi";
import { getClassDetail } from "@/api/classApi";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề bài giảng không được để trống"),
  content: z.string().min(1, "Tiêu đề bài giảng không được để trống"),
});

const UpdateNotify = ({
  open,
  onOpenChange,
  notifyToEdit,
  fetchtAllNotifyInClass,
}) => {
  const { classId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [classDetails, setClassDetails] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    fetchClassDetails();
  }, [classId]);

  useEffect(() => {
    form.reset({
      title: notifyToEdit?.title,
      content: notifyToEdit?.content,
    });
  }, [notifyToEdit]);
  const fetchClassDetails = async () => {
    try {
      const res = await getClassDetail(classId);
      setClassDetails(res.data);
    } catch (error) {
      console.error("Error fetching class details:", error);
    }
  };
  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const notifyData = {
        title: values.title,
        content: values.content,
      };
      const response = await updateNotify(
        notifyToEdit?.notification_id,
        notifyData
      );
      console.log("response", response);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (response.success) {
        toast.success(response.message || "Cập nhật thông báo thành công");
        onOpenChange();
        fetchtAllNotifyInClass(classId);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating lecture:", error);
      toast.error("Không thể cập nhật thông báo " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset({
      title: "",
    });
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
                    Chỉnh sửa thông báo
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Tiêu đề
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tiêu đề thông báo"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Nội dung
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Nhập nội dung thông báo"
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

export default UpdateNotify;
