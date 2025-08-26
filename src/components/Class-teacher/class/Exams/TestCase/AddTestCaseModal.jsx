/* eslint-disable react/prop-types */
import * as z from "zod";
import { useForm, useFieldArray } from "react-hook-form";
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
  Plus,
  Trash2,
  Loader2,
  Save,
  X,
  AlertTriangle,
  Code,
  FileOutput,
  Star,
} from "lucide-react";
import { useState } from "react";
import { createTestcaseForExam } from "@/api/testcaseApi";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const testCaseSchema = z.object({
  testCases: z
    .array(
      z.object({
        input: z.string().min(1, "Input không được để trống"),
        expected_output: z
          .string()
          .min(1, "Expected Output không được để trống"),
        score: z
          .number({ invalid_type_error: "Score phải là số" })
          .min(0, "Score không được âm"),
      })
    )
    .min(1, "Cần ít nhất một test case"),
});

const AddTestCaseModal = ({
  open,
  onOpenChange,
  fetchAllTestCaseForExamContent,
}) => {
  const { examContentId } = useParams();
  const [isLoading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(testCaseSchema),
    defaultValues: {
      testCases: [{ input: "", expected_output: "", score: 10 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "testCases",
  });

  const addTestCase = () => {
    append({ input: "", expected_output: "", score: 10 });
  };

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const { testCases } = values;
      let successCount = 0;
      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const response = await createTestcaseForExam(examContentId, testCase);
        if (response.success) {
          successCount++;
        } else {
          throw new Error(`Lỗi khi tạo test case thứ ${i + 1}`);
        }
      }
      toast.success(`Tạo ${successCount} test case thành công`);
      fetchAllTestCaseForExamContent();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error("Error:", error);
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
        <DialogHeader className="px-6 py-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-b dark:border-gray-700">
          <DialogTitle className="text-xl font-bold text-gray-800 dark:text-white flex items-center">
            <Code className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-300" />
            Thêm Test Case
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 p-2 dark:bg-gray-900"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Danh sách Test Case
                </h3>
                <Button
                  type="button"
                  onClick={addTestCase}
                  className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/50 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 border border-blue-200 dark:border-blue-700 px-3 py-2 rounded-lg transition-all shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm test case
                </Button>
              </div>
              {form.formState.errors.testCases?.message && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/30 p-4 flex items-center space-x-3 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-700 shadow-sm">
                  <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                  <span className="font-medium">
                    {form.formState.errors.testCases?.message}
                  </span>
                </div>
              )}

              <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-6 custom-scrollbar">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-xl p-5 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex justify-between items-center mb-5 pb-2 border-b border-gray-100 dark:border-gray-700">
                      <h4 className="font-semibold text-blue-700 dark:text-blue-300 flex items-center">
                        <span className="flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 h-6 w-6 rounded-full mr-2 text-sm">
                          {index + 1}
                        </span>
                        Test Case #{index + 1}
                      </h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-white hover:bg-red-500 dark:hover:bg-red-600 rounded-full transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name={`testCases.${index}.input`}
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                              <Code className="h-4 w-4 mr-2 text-blue-600 dark:text-blue-400" />
                              Input
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Nhập dữ liệu input cho test case"
                                className="font-mono text-sm border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 min-h-[150px] rounded-lg resize-y shadow-inner bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`testCases.${index}.expected_output`}
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel className="flex items-center text-gray-700 dark:text-gray-300 font-medium">
                              <FileOutput className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
                              Expected Output
                            </FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Nhập kết quả output mong muốn"
                                className="font-mono text-sm border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-600 min-h-[150px] rounded-lg resize-y shadow-inner bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="text-red-500 dark:text-red-400" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`testCases.${index}.score`}
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
                                  className="text-sm border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-amber-500 dark:focus:ring-amber-600 rounded-lg h-10 shadow-inner bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
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
                ))}
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

export default AddTestCaseModal;
