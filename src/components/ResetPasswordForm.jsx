import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Mail,
  Loader2,
  Lock,
  CheckCircle,
  Eye,
  EyeOff,
  CheckIcon,
  KeyRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "@/api/userApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email không được để trống")
      .email("Email không hợp lệ"),
    code: z.string().length(6, "Mã xác nhận phải có 6 chữ số"),
    newPassword: z
      .string()
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
      .regex(/(?=.*[a-z])/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
      .regex(/(?=.*[A-Z])/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
      .regex(/(?=.*\d)/, "Mật khẩu phải chứa ít nhất 1 số")
      .regex(
        /(?=.*[!@#$%^&*(),.?":{}|<>])/,
        "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"
      ),
    confirmPassword: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
 useEffect(() => {
   const storedEmail = localStorage.getItem("resetEmail");
   if (storedEmail) {
     form.setValue("email", storedEmail);
   }
 }, []);
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { email, code, newPassword } = data;
      const res = await resetPassword(email, code, newPassword);
      if (res.success) {
        toast.success(res.message || "Mật khẩu đã được khôi phục thành công.");
        navigate("/login");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error?.message ||
          "Có lỗi xảy ra, vui lòng thử lại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="custom-form  w-[340px] max-w-md p-6 space-y-6 shadow-lg bg-black bg-opacity-40 rounded-lg">
      <h2 className="text-3xl font-bold text-center text-slate-100">
        Khôi phục mật khẩu
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          {/* Full Name */}

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm text-slate-100">Email</FormLabel>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-100" />
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nhập email"
                      className="w-full pl-10 pr-4 py-2 bg-transparent border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-slate-400"
                      disabled={isLoading}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm text-slate-100">
                  Mã xác nhận
                </FormLabel>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-100" />
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Nhập mã xác nhận"
                      className="w-full pl-10 pr-4 py-2 bg-transparent border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-slate-400"
                      disabled={isLoading}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm text-slate-100">
                  Mật khẩu mới
                </FormLabel>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-100" />
                  <FormControl>
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Nhập mật khẩu mới"
                      className="w-full pl-10 pr-10 py-2 bg-transparent border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-slate-400"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-100" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-100" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm text-slate-100">
                  Xác nhận mật khẩu
                </FormLabel>
                <div className="relative">
                  <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-100" />
                  <FormControl>
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Xác nhận mật khẩu"
                      className="w-full pl-10 pr-10 py-2 bg-transparent border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-slate-400"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-100" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-100" />
                    )}
                  </button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 flex items-center justify-center space-x-2 hover:bg-black hover:text-white transition duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <CheckIcon />
                <span>Xác nhận</span>
              </>
            )}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-white">
        Nhớ mật khẩu?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Đăng nhập ngay
        </Link>
      </p>
    </div>
  );
};

export default ResetPasswordForm;
