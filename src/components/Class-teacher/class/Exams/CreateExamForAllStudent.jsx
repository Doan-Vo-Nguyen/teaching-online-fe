import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  title: z.string().min(1, "Vui lòng nhập tiêu đề"),
  type: z.enum(["quiz", "test", "midterm", "final"]),
  due_date: z.date({ required_error: "Vui lòng chọn hạn nộp" }),
  description: z.string().optional(),
});

const CreateExamForAllStudent = () => {
  const navigate = useNavigate();
  const { classId } = useParams();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      due_date: undefined,
      description: "",
    },
  });

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const examData = {
        class_id: classId,
        title: values.title,
        type: values.type,
        due_date: values.due_date.toISOString(),
        description: values.description || "",
        type_student: "common",
      };

      const response = await createExam(examData);
      await new Promise((resolve) => setTimeout(resolve, 3000));

      if (response.success) {
        toast.success(response.message || "Tạo bài kiểm tra thành công");
        navigate(-1);
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error.response?.data?.error?.details || error?.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-blue-950 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="flex flex-col">
                  <h1 className="text-3xl dark:text-white font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Tạo bài tập mới
                  </h1>
                  <p className="text-gray-600 mt-2 dark:text-white">
                    Điền thông tin để tạo một bài tập mới
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
                        <FormLabel className="font-medium">
                          Tiêu đề bài kiểm tra
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tiêu đề bài kiểm tra"
                            className="border-gray-200"
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
                    name="due_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Hạn nộp</FormLabel>
                        <DateTimePicker field={field} disabled={isLoading} />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Loại bài kiểm tra
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="border-gray-200">
                              <SelectValue placeholder="Chọn loại bài kiểm tra" />
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="font-medium">
                          Mô tả bài kiểm tra
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Nhập mô tả bài kiểm tra (không bắt buộc)"
                            className="border-gray-200 resize-none"
                            rows={4}
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="border-gray-200 gap-2"
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
                        <span>Lưu bài kiểm tra</span>
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

export default CreateExamForAllStudent;
