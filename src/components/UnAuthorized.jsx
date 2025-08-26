import { useEffect, useRef } from "react";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const UnAuthorized = () => {
  const particlesContainerRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    const createParticles = () => {
      if (!particlesContainerRef.current) return;
      particlesContainerRef.current.innerHTML = "";

      for (let i = 0; i < 50; i++) {
        const particle = document.createElement("div");
        particle.classList.add("particle");

        const size = Math.random() * 50 + 10;
        const posX = Math.random() * window.innerWidth;
        const posY = Math.random() * window.innerHeight;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;

        particlesContainerRef.current.appendChild(particle);
      }
    };

    createParticles();
    window.addEventListener("resize", createParticles);
    return () => window.removeEventListener("resize", createParticles);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden bg-gray-100">
      <div ref={particlesContainerRef} className="absolute inset-0 z-0"></div>

      {/* Gradient Background */}
      <motion.div
        className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl opacity-20 z-0"
        animate={{ x: ["-50%", "-40%", "-50%"], y: ["-50%", "-40%", "-50%"] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-20 z-0"
        animate={{ x: ["50%", "40%", "50%"], y: ["50%", "40%", "50%"] }}
        transition={{ duration: 15, repeat: Infinity, delay: 1 }}
      />

      <Card className="relative z-10 max-w-lg w-full border border-gray-200 shadow-lg">
        <CardContent className="p-8 md:p-12 flex flex-col items-center text-center">
          <motion.div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 p-5 rounded-full mb-6"
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ShieldAlert size={64} className="text-white" />
          </motion.div>

          <motion.h1
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Truy cập bị từ chối
          </motion.h1>

          <motion.p
            className="text-gray-600 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị
            viên hoặc đăng nhập với tài khoản có quyền phù hợp.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button variant="info" onClick={() => navigate("/")}>
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

          <motion.div
            className="mt-8 pt-6 border-t border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-gray-500 text-sm">
              Cần trợ giúp?{" "}
              <a
                href="#"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Liên hệ hỗ trợ
              </a>
            </p>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnAuthorized;
