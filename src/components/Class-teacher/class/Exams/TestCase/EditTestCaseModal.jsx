/* eslint-disable react/prop-types */
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Trash2,
  Loader2,
  Save,
  X,
  AlertTriangle,
  Code,
  FileOutput,
  Star,
} from "lucide-react";
import { useEffect, useState } from "react";
import { editTestCase } from "@/api/testcaseApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const testCaseSchema = z.object({
  input: z.string().min(1, "Input không được để trống"),
  expected_output: z.string().min(1, "Expected Output không được để trống"),
  score: z
    .number({ invalid_type_error: "Score phải là số" })
    .min(0, "Score không được âm"),
});

const EditTestCaseModal = ({
  open,
  onOpenChange,
  testCaseToEdit,
  fetchAllTestCaseForExamContent,
}) => {
  const [isLoading, setLoading] = useState(false);
  const { examContentId } = useParams();

  const form = useForm({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      input: "",
      expected_output: "",
      score: 10,
    },
  });

  useEffect(() => {
    form.reset({
      input: testCaseToEdit?.input || "",
      expected_output: testCaseToEdit?.expected_output || "",
      score: testCaseToEdit?.score ?? 10,
    });
  }, [testCaseToEdit, form]);

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const response = await editTestCase(
        testCaseToEdit?.id,
        examContentId,
        values
      );
      if (response.success) {
        toast.success(response.message);
        fetchAllTestCaseForExamContent();
        onOpenChange(false);
        form.reset();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.details || error?.message;
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-xl dark:border-gray-700">
        <DialogHeader className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/50 dark:to-indigo-900/50 border-b dark:border-gray-700">
          <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <Code className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Chỉnh sửa test case
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-2 dark:bg-gray-900"
          >
            <div className="space-y-4">
              {form.formState.errors.input && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/30 p-4 flex items-center space-x-3 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700 shadow-sm">
                  <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                  <span className="font-medium">
                    {form.formState.errors.input.message}
                  </span>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="input"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                        <Code className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                        Input
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập dữ liệu input cho test case"
                          className="font-mono text-sm border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 min-h-[150px] rounded-lg resize-y shadow-inner bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expected_output"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                        <FileOutput className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                        Expected Output
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập kết quả output mong muốn"
                          className="font-mono text-sm border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 min-h-[150px] rounded-lg resize-y shadow-inner bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="score"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                        <Star className="h-4 w-4 mr-2 text-amber-500 dark:text-amber-400" />
                        Score
                      </FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="10"
                            className="text-sm border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 rounded-lg h-10 shadow-inner bg-gray-50 dark:bg-gray-800 dark:text-gray-100"
                            {...field}
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? ""
                                  : Number(e.target.value);
                              field.onChange(value);
                            }}
                          />
                        </FormControl>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Điểm số cho test case này
                      </p>
                      <FormMessage className="text-red-500 dark:text-red-400" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="w-full sm:w-auto border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg px-4"
              >
                <X className="h-4 w-4 mr-2" />
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-700 dark:to-indigo-700 dark:hover:from-blue-800 dark:hover:to-indigo-800 text-white gap-2 rounded-lg px-5 py-2.5 shadow-md hover:shadow-lg transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Lưu test case</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #d1d5db;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #9ca3af;
          }
          @media (prefers-color-scheme: dark) {
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #374151;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #4b5563;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #6b7280;
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

export default EditTestCaseModal;
