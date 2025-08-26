import { useNavigate } from "react-router-dom";
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
import { createClass } from "@/api/classApi";
import { getAllUsers } from "@/api/userApi";

import { toast } from "react-toastify";
import { Loader2, Plus, X } from "lucide-react";
import useAuthToken from "@/hooks/userAuthToken";
import { ComboBox } from "../custom/ComboBox";

const formSchema = z.object({
  class_name: z.string().min(1, "Tên lớp học không được để trống"),
  teacher_id: z.coerce.string().min(1, "Tên giáo viên không được để trống"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
});

const CreateClass = () => {
  const auth = useAuthToken();
  const [teachers, setTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      class_name: "",
      teacher_id: auth?.role === "teacher" ? String(auth.id) : "",
      description: "",
    },
  });

  // Nếu auth.role là teacher thì set teacher_id tự động bằng auth.id
  useEffect(() => {
    if (auth?.role === "teacher") {
      form.setValue("teacher_id", auth.id);
    }
  }, [auth, form]);

  // Nếu không phải teacher thì mới fetch danh sách giáo viên
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

  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
      const res = await createClass(values);
      if (res.success) {
        backHome();
        toast.success(res.message);
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
                  <h1 className="text-3xl font-bold bg-gradient-to-r dark:text-white from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Tạo mới lớp học
                  </h1>
                  <p className="text-gray-500 mt-2 dark:text-white">
                    Điền các thông tin để tạo mới một lớp học
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="class_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên lớp học</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tên lớp học"
                            {...field}
                            disabled={isLoading}
                            className="dark:text-white"
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
                          <FormLabel>Giáo viên</FormLabel>
                          <FormControl>
                            <Input value={auth.fullname} disabled />
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
                          <FormLabel>Giáo viên</FormLabel>
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
                      <FormLabel>Mô tả lớp học</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Nhập mô tả chi tiết về lớp học..."
                          className="h-32"
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
                  disabled={isLoading}
                >
                  <X />
                  Hủy
                </Button>
                <Button variant="info" type="submit">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <Plus size={43} />
                      <span>Tạo mới</span>
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

export default CreateClass;
