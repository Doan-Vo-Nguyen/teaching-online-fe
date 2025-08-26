/* eslint-disable react/prop-types */
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { X, Save, Loader2, Clock } from "lucide-react";
import { useState } from "react";
import MDEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import "react-markdown-editor-lite/lib/index.css";
import { Input } from "@/components/ui/input";
import { createExamContentByExamId } from "@/api/ExamApi";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const mdParser = new MarkdownIt();

const examContentSchema = z.object({
  title: z.string().min(1, "Tiêu đề không được để trống"),
  description: z.string().min(1, "Mô tả không được để trống"),
});

const AddExamContentPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(examContentSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const onSubmit = async (values) => {
    try {
      const { title, description } = values;
      setLoading(true);
      const res = await createExamContentByExamId(examId, {
        title,
        description,
      });
      if (res.success) {
        toast.success(res.message);
        form.reset();
        navigate(-1);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.details || error?.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.reset();
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <Card>
          <CardHeader className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="flex flex-col">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Tạo chi tiết bài tập
                  </h1>
                  <p className="text-gray-600 mt-2">
                    Tạo chi tiết bài tập cho sinh viên IT
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{new Date().toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6 bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">
                        Tiêu đề
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Nhập tiêu đề"
                          className="w-full bg-white border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg px-4 py-2 transition-all duration-200"
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-gray-700 font-medium">
                        Mô tả bài tập
                      </FormLabel>
                      <FormControl>
                        <div
                          className="editor-wrapper"
                          style={{ height: "300px" }}
                        >
                          <MDEditor
                            value={field.value}
                            onChange={({ text }) => field.onChange(text)}
                            renderHTML={(text) => mdParser.render(text)}
                            style={{ height: "100%" }}
                            config={{
                              view: { menu: true, md: true, html: true },
                              canView: {
                                menu: true,
                                md: true,
                                html: true,
                                fullScreen: true,
                              },
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="w-full sm:w-auto border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4 py-2 transition-all"
                    disabled={isLoading}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2 rounded-lg px-5 py-2.5 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Lưu</span>
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

export default AddExamContentPage;
