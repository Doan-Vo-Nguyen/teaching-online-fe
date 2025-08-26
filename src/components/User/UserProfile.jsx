import { useEffect, useState } from "react";
import {
  UserCircle,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  X,
  User2Icon,
  EyeOff,
  Eye,
  Loader2,
  Camera,
  Check,
} from "lucide-react";
import axios from "axios";
import { getUserById, updateUser } from "@/api/userApi";
import moment from "moment";
import useAuthToken from "@/hooks/userAuthToken";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userSlice";

const UserProfile = () => {
  const location = useLocation();
  const params = useParams();
  const auth = useAuthToken();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isProfilePath = location.pathname.includes("profile");
  const userId = params.userId ? params.userId : auth?.id;
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
    dob: "",
    gender: "",
    phone: "",
    address: "",
    profile_picture: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  const fetchUserProfile = async () => {
    try {
      const res = await getUserById(userId);
      if (res && res.success) {
        const userData = res.data;
        setUserData(userData);
        setAvatar(userData.profile_picture || "");

        // Set form data
        setFormData({
          fullname: userData.fullname || "",
          username: userData.username || "",
          email: userData.email || "",
          password: "",
          dob: userData.dob ? moment(userData.dob).format("YYYY-MM-DD") : "",
          gender: userData.gender || "",
          phone: userData.phone || "",
          address: userData.address || "",
          profile_picture: userData.profile_picture || "",
        });
      }
    } catch (error) {
      console.error("Error fetching user profile", error);
      toast.error("Không thể tải thông tin người dùng");
    }
  };

  const handleAvatarChange = async (e) => {
    const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env
      .VITE_CLOUDINARY_UPLOAD_PRESET;
    const CLOUDINARY_DB = import.meta.env.VITE_CLOUDINARY_DB;
    const file = e.target.files[0];
    if (!file) return;

    setAvatar(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("api_key", CLOUDINARY_API_KEY);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_DB}/image/upload`,
        formData
      );
      setAvatarUrl(response.data.secure_url);
    } catch (error) {
      console.error("Upload ảnh thất bại:", error);
      toast.error("Lỗi khi tải ảnh lên");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullname.trim())
      newErrors.fullname = "Họ và tên không được để trống";
    if (!formData.username.trim())
      newErrors.username = "Tên người dùng không được để trống";
    if (!formData.email.trim()) newErrors.email = "Email không được để trống";
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email không hợp lệ";
    // Kiểm tra số điện thoại không được để trống
    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^\d{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const updateData = {
        ...formData,
        profile_picture: avatarUrl || avatar,
      };

      const response = await updateUser(userId, updateData);
      if (response.success) {
        await fetchUserProfile();
        toast.success("Cập nhật thông tin thành công");
        setIsEditing(false);
        dispatch(setUser(response.data));
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.details || "Đã xảy ra lỗi khi cập nhật";
      toast.error(errorMessage);
      console.error("Error message:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (userData) {
      setFormData({
        fullname: userData.fullname || "",
        username: userData.username || "",
        email: userData.email || "",
        password: "",
        dob: userData.dob ? moment(userData.dob).format("YYYY-MM-DD") : "",
        gender: userData.gender || "",
        phone: userData.phone || "",
        address: userData.address || "",
        profile_picture: userData.profile_picture || "",
      });
    }
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 mt-5">
      <div className="max-w-4xl dark:bg-[#020828] mx-auto bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="relative h-64 bg-gradient-to-r from-blue-600 to-indigo-700 dark:bg-gradient-to-r dark:from-blue-800 dark:to-indigo-900">
          <div className="absolute -bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="relative group">
              {avatar ? (
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="w-40 h-40 z-20 rounded-full border-4 border-white object-cover shadow-lg transition-all duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="w-40 h-40 rounded-full border-4 border-white bg-gray-200 dark:bg-gray-700 flex items-center justify-center shadow-lg">
                  <UserCircle size={80} className="text-gray-400" />
                </div>
              )}

              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Camera size={40} className="text-white" />
                    </div>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="pt-24 px-8 pb-8 space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Chỉnh sửa thông tin
              </h2>
              <button
                type="button"
                onClick={cancelEdit}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={24} className="text-gray-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fullname field */}
              <div className="space-y-2">
                <label
                  htmlFor="fullname"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="fullname"
                  name="fullname"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.fullname ? "border-red-500" : "border-gray-300"
                  } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
                {errors.fullname && (
                  <p className="text-sm text-red-500">{errors.fullname}</p>
                )}
              </div>

              {/* Username field */}
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Tên người dùng
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">{errors.username}</p>
                )}
              </div>

              {/* Email field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              {/* Password field (only for admin) */}
              {!isProfilePath && (
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      placeholder="Nhập để đổi mật khẩu"
                      className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-500" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Date of Birth field */}
              <div className="space-y-2">
                <label
                  htmlFor="dob"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Ngày sinh
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.dob ? "border-red-500" : "border-gray-300"
                  } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
              </div>

              {/* Gender field */}
              <div className="space-y-2">
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Giới tính
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.gender ? "border-red-500" : "border-gray-300"
                  } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              {/* Phone field */}
              <div className="space-y-2">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  placeholder="Nhập số điện thoại"
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Address field */}
              <div className="space-y-2 md:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Địa chỉ
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } dark:bg-gray-700 dark:border-gray-600 dark:text-white`}
                />
              </div>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={cancelEdit}
                disabled={isLoading}
                className="flex flex-1 items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors duration-300 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                <X />
                Huỷ
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Check size={25} className="mx-4" /> Lưu thay đổi
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <>
            <div className="pt-24 pb-8 px-6 text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-1 dark:text-white">
                {userData?.fullname || "Chưa cập nhật"}
              </h1>
              <p className="text-lg font-medium text-blue-600">
                {userData?.role === "admin"
                  ? "Quản trị viên"
                  : userData?.role === "teacher"
                  ? "Giáo viên"
                  : userData?.role === "student"
                  ? "Sinh viên"
                  : "Người dùng"}
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100">
                  @{userData?.username}
                </span>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Mail,
                    label: "Email",
                    value: userData?.email,
                  },
                  {
                    icon: Phone,
                    label: "Số điện thoại",
                    value: userData?.phone,
                  },
                  {
                    icon: Calendar,
                    label: "Ngày sinh",
                    value:
                      userData?.dob &&
                      moment(userData.dob).format("DD/MM/YYYY"),
                  },
                  {
                    icon: User,
                    label: "Giới tính",
                    value: userData?.gender,
                  },
                  {
                    icon: MapPin,
                    label: "Địa chỉ",
                    value: userData?.address,
                    fullWidth: true,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex flex-col p-4 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-300 ${
                      item.fullWidth ? "md:col-span-2" : ""
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                      <item.icon className="h-4 w-4 mr-2 text-blue-500" />
                      {item.label}
                    </span>
                    <span className="text-gray-900 dark:text-gray-200 font-medium break-words">
                      {item.value || "Chưa cập nhật"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {(userId === auth?.id || auth?.role === "admin") && (
              <div className="px-8 pb-8">
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg px-6 py-3.5 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <User2Icon className="h-5 w-5 mr-2" />
                  Chỉnh sửa thông tin cá nhân
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
