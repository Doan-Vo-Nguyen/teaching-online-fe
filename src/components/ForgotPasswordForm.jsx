import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { forgotPassword } from "@/api/userApi";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
});

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { email } = data;
      const res = await forgotPassword(email);
      if (res.success) {
         localStorage.setItem("resetEmail", email);
        toast.success(
          res.message || "Email đã được gửi, vui lòng kiểm tra hộp thư của bạn."
        );
        navigate("/reset-password");

      }
    } catch (error) {
            console.error("Error message:", error);
      const errorMessage =
        error.response?.data?.error?.details ||
        error.response?.data?.error?.message ||
        "Có lỗi xảy ra, vui lòng thử lại.";
      toast.error(errorMessage);
      console.error("Error message:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="custom-form  w-[340px] max-w-sm p-6 space-y-6 shadow-lg bg-black bg-opacity-40 border-black border-opacity-40 rounded-lg">
      <h2 className="text-3xl font-bold text-center text-slate-100">
        Quên mật khẩu
      </h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-100">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-100" />
            <input
              {...form.register("email")}
              type="email"
              placeholder="Nhập email của bạn"
              className="w-full pl-10 pr-4 py-2 bg-transparent border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-slate-400"
              disabled={isLoading}
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

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
              <Mail />
              <span>Gửi Email</span>
            </>
          )}
        </Button>
      </form>

      <div className="space-y-4">
        <p className="text-sm text-center text-white">
          Nhớ mật khẩu?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
