import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Lock, EyeOff, Eye, Loader2, LogIn } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/api/userApi";
import { toast } from "react-toastify";
import { Button } from "../ui/button";
import { duplicateLoginManager } from "../../services/duplicateLoginService";
import { jwtDecode } from "jwt-decode";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/(?=.*[a-z])/, "Mật khẩu phải chứa ít nhất 1 chữ thường")
    .regex(/(?=.*[A-Z])/, "Mật khẩu phải chứa ít nhất 1 chữ hoa")
    .regex(/(?=.*\d)/, "Mật khẩu phải chứa ít nhất 1 số")
    .regex(
      /(?=.*[!@#$%^&*(),.?":{}|<>])/,
      "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt"
    ),
});

const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { email, password } = data;
      const res = await login(email, password);
      
      if (res.success) {
        localStorage.setItem("token", JSON.stringify(res.data));
        
        // Initialize duplicate login detection with the user's ID
        try {
          const token = res.data.accessToken;
          const decoded = jwtDecode(token);
          console.log("Login successful, initializing duplicate login detection:", decoded);
          
          // Get backend URL from environment variables
          const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:10000";
          
          // Initialize the duplicate login manager
          await duplicateLoginManager.initialize(decoded.id, backendUrl);
        } catch (error) {
          console.error("Error initializing duplicate login detection:", error);
        }
        
        toast.success(res.message);
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.details || error?.message;
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="custom-form w-[340px] max-w-sm p-6 space-y-6 shadow-lg bg-black bg-opacity-40 border-black border-opacity-40 rounded-lg">
      <h2 className="text-3xl font-bold text-center text-slate-100">
        Đăng nhập
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
              placeholder="Nhập email "
              className="w-full pl-10 pr-4 py-2 bg-transparent border border-slate-600 rounded-lg text-white focus:outline-none focus:border-slate-400"
              disabled={isLoading}
            />
          </div>
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-100">Mật khẩu</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-100" />
            <input
              {...form.register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu "
              className="w-full pl-10 pr-10 py-2 bg-transparent border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-slate-400"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-slate-100" />
              ) : (
                <Eye className="h-5 w-5 text-slate-100" />
              )}
            </button>
          </div>
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
        <div className="flex items-center justify-end">
          <Link
            to="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
          >
            Quên mật khẩu?
          </Link>
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
              <LogIn size={43} />
              <span>Đăng nhập</span>
            </>
          )}
        </Button>
      </form>

      <div className="space-y-4">
        <p className="text-sm text-center text-white">
          Bạn chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-500 hover:underline">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
