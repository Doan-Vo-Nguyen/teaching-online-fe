import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, Save, X, Clock } from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import { DateTimePicker } from "@/components/DateTimePicker";
import { toast } from "react-toastify";
import { createExam } from "@/api/ExamApi";

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  type: z.enum(["quiz", "test", "midterm", "final"]),
  due_date: z.date({ required_error: "Vui lòng chọn hạn nộp" }),
  description: z.string().min(1, "Vui lòng nhập mô tả bài tập"),
});

const CreateExamForIT = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      description: "",
      due_date: undefined,
    },
  });

  const onSubmit = async (values) => {
    try {
      setIsLoading(true);

      const examData = {
        class_id: classId,
        title: values.title,
        type: values.type,
        description: values.description,
        due_date: values.due_date.toISOString(),
        type_student: "it",
      };

      const response = await createExam(examData);
      if (response.success) {
        toast.success(response.message || "Tạo bài tập thành công");
        navigate(-1);
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error?.details || error?.message;
      toast.error(errorMessage || "Có lỗi xảy ra khi tạo bài tập");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen dark:bg-blue-950 bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-lg overflow-hidden border-0">
          <CardHeader className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex flex-col">
                  <h1 className="text-3xl dark:text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Tạo bài tập mới
                  </h1>
                  <p className="text-gray-600 mt-2 dark:text-white">
                    Tạo bài tập mới cho sinh viên IT
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm dark:text-white text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{new Date().toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium dark:text-white text-gray-700">
                          Tiêu đề bài tập
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tiêu đề bài tập"
                            className="border-gray-200 focus:ring-2 focus:ring-blue-500"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium dark:text-white text-gray-700">
                          Hạn nộp
                        </FormLabel>
                        <DateTimePicker field={field} disabled={isLoading} />
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium dark:text-white text-gray-700">
                        Loại bài tập
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={isLoading}
                      >
                        <FormControl>
                          <SelectTrigger className="border-gray-200 focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Chọn loại bài tập" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="quiz">
                            Câu hỏi trắc nghiệm
                          </SelectItem>
                          <SelectItem value="test">
                            Bài kiểm tra thường xuyên
                          </SelectItem>
                          <SelectItem value="midterm">Giữa kì</SelectItem>
                          <SelectItem value="final">Cuối kì</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium dark:text-white text-gray-700">
                        Mô tả bài tập
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập mô tả chi tiết về bài tập, yêu cầu, ràng buộc, v.v."
                          className="border-gray-200 focus:ring-2 focus:ring-blue-500 min-h-[150px]"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="border-gray-200 gap-2 hover:bg-gray-50 dark:hover:bg-blue-950"
                  >
                    <X className="h-4 w-4" />
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2 shadow-md"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Lưu bài tập</span>
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateExamForIT;
