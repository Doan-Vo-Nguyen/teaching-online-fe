import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; 
const useAuthToken = () => {
  // Khởi tạo state với giá trị undefined để phân biệt trường hợp chưa tải và đã tải
  const [decodedToken, setDecodedToken] = useState(undefined);

  useEffect(() => {
    const tokenStr = localStorage.getItem("token");
    if (tokenStr) {
      try {
        const tokenObj = JSON.parse(tokenStr);
        if (tokenObj?.accessToken) {
          const decoded = jwtDecode(tokenObj.accessToken);
          setDecodedToken(decoded);
        } else {
          setDecodedToken(null);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setDecodedToken(null);
      }
    } else {
      setDecodedToken(null);
    }
  }, []);

  return decodedToken;
};

export default useAuthToken;

