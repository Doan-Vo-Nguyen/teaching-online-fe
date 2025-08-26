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
import { createNewLectureByClassId } from "@/api/LectureApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const formSchema = z.object({
  title: z.string().min(1, "Tiêu đề bài giảng không được để trống"),
});

const CreateLecture = ({ open, onOpenChange, fetchAllLecturesByClassId }) => {
  const { classId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const onSubmit = async (values) => {
    setIsLoading(true);

    try {
      const lectureData = {
        title: values.title,
      };
      const response = await createNewLectureByClassId(classId, lectureData);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (response.success) {
        toast.success(response.message || "Tạo bài giảng thành công");
        onOpenChange();
        fetchAllLecturesByClassId(classId);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating lecture:", error);
      toast.error("Không thể tạo bài giảng mới: " + error.message);
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
                    Tạo mới bài giảng
                  </h1>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
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
                    Tiêu đề bài giảng
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập tiêu đề bài giảng"
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
                    <span>Lưu bài giảng</span>
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

export default CreateLecture;
