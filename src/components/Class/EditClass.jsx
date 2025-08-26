import { useNavigate, useParams } from "react-router-dom";
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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { getClassDetail, updateClass } from "@/api/classApi";
import { getAllUsers } from "@/api/userApi";

import { toast } from "react-toastify";
import { Check, Loader2, X } from "lucide-react";
import useAuthToken from "@/hooks/userAuthToken";
import { ComboBox } from "../custom/ComboBox";

const formSchema = z.object({
  class_name: z.string().min(1, "Tên lớp học không được để trống"),
  teacher_id: z.coerce.string().min(1, "Tên giáo viên không được để trống"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
});

const EditClass = () => {
  const { classId } = useParams();
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuthToken();
  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class_name: "",
      teacher_id: "",
      description: "",
    },
  });

  useEffect(() => {
    if (classId) {
      fetchClassDetails();
    }
  }, [classId]);

  const fetchClassDetails = async () => {
    try {
      const response = await getClassDetail(classId);
      if (response.success) {
        form.reset({
          class_name: response.data.class_name,
          teacher_id: String(response.data.teacher_id),
          description: response.data.description,
        });
      }
    } catch (error) {
      console.log("error", error.message);
      backHome();
    }
  };

  // Chỉ fetch danh sách giáo viên nếu không phải teacher
  useEffect(() => {
    if (auth?.role !== "teacher") {
      fetchListTeacher();
    }
  }, [auth]);

  const fetchListTeacher = async () => {
    try {
      const response = await getAllUsers();
      const teachersOnly = response.data.filter(
        (user) => user.role === "teacher"
      );
      const reversedTeachers = teachersOnly.reverse();
      setTeachers(reversedTeachers);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (auth?.role === "teacher") {
      form.setValue("teacher_id", auth.id);
    }
  }, [auth, form]);

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const classEdit = await updateClass(classId, values);
      if (classEdit.success) {
        backHome();
        toast.success(classEdit.message);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.details || error?.message;
      toast.error(errorMessage);
      console.error("Error message:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const backHome = () => {
    navigate("/classes");
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-blue-950 p-8">
      <div className="max-w-4xl mx-auto">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white dark:bg-[#020818] rounded-xl shadow-sm p-8"
          >
            <div className="space-y-8">
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:text-white">
                    Chỉnh sửa thông tin lớp học
                  </h1>
                  <p className="text-gray-500 dark:text-white mt-2">
                    Điền các thông tin để chỉnh sửa lớp học
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="class_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 dark:text-white">
                          Tên lớp học
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tên lớp học"
                            {...field}
                            disabled={isLoading}
                            className="dark:bg-[#020818] dark:text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {auth?.role === "teacher" ? (
                    <FormField
                      control={form.control}
                      name="teacher_id"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-gray-200">
                            Giáo viên
                          </FormLabel>
                          <FormControl>
                            <Input
                              value={auth.fullname}
                              disabled
                              className="dark:bg-gray-600 dark:text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="teacher_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 dark:text-white">
                            Giáo viên
                          </FormLabel>
                          <FormControl>
                            <ComboBox
                              options={
                                teachers?.map((teacher) => ({
                                  label: `${teacher.user_id} - ${teacher.fullname}`,
                                  value: String(teacher.user_id),
                                })) || []
                              }
                              value={field.value}
                              onChange={field.onChange}
                              disabled={isLoading}
                              placeholder="Chọn giáo viên"
                              className="dark:bg-gray-600 dark:text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 dark:text-white">
                        Mô tả lớp học
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập mô tả chi tiết về lớp học..."
                          className="h-32 dark:bg-[#020818] dark:text-white"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={backHome}
                  className="dark:text-gray-300"
                >
                  <X />
                  Hủy
                </Button>
                <Button
                  variant="info"
                  type="submit"
                  className="dark:text-gray-300"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <Check size={43} />
                      <span className="dark:text-white">Cập nhật</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default EditClass;
