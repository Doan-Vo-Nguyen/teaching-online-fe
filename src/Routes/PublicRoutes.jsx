import Loading from "@/components/Loading";
import useAuthToken from "@/hooks/userAuthToken";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const auth = useAuthToken();
  // Nếu auth chưa load, hiển thị loading
  if (auth === undefined) {
    return (
    <Loading/>
    );
  }

  // Nếu đã đăng nhập, chuyển hướng về trang chủ
  if (auth) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
