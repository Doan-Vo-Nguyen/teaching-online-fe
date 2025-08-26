import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 z-0 bg-[length:40px_40px] bg-[linear-gradient(to_right,rgba(229,231,235,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(229,231,235,0.2)_1px,transparent_1px)]" />

      {/* Animated background elements */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full blur-3xl opacity-50"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-purple-200 rounded-full blur-3xl opacity-50"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-28 h-28 bg-indigo-200 rounded-full blur-3xl opacity-50"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      />

      <Card className="relative z-10 max-w-4xl w-full border border-gray-200 shadow-xl mx-4">
        <CardContent className="p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center">
            {/* 404 Illustration */}
            <motion.div
              className="w-full md:w-1/2 mb-8 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <motion.svg
                className="w-full h-auto floating"
                viewBox="0 0 400 300"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <circle
                  cx="200"
                  cy="150"
                  r="120"
                  fill="#EFF6FF"
                  className="circle"
                />
                <circle
                  cx="200"
                  cy="150"
                  r="80"
                  fill="#DBEAFE"
                  className="circle"
                  style={{ animationDelay: "0.3s" }}
                />
                <text
                  x="200"
                  y="160"
                  fontSize="80"
                  fontWeight="bold"
                  fill="#3B82F6"
                  textAnchor="middle"
                  className="gradient-text"
                >
                  404
                </text>
              </motion.svg>
            </motion.div>

            {/* Text content */}
            <div className="w-full md:w-1/2 md:pl-4">
              <motion.h1
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                Không tìm thấy trang
              </motion.h1>
              <motion.p
                className="text-lg text-gray-600 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di
                chuyển.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Button
                  onClick={() => navigate("/")}
                  className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Về trang chủ
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="px-5 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Quay lại
                </Button>
              </motion.div>
            </div>
          </div>
          <motion.div
            className="mt-8 pt-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-500">
              <p>Có thể bạn muốn ghé thăm:</p>
              <div className="flex space-x-4 mt-2 sm:mt-0">
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Hỗ trợ
                </a>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Liên hệ
                </a>
                <a
                  href="#"
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Sitemap
                </a>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
