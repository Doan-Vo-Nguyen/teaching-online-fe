/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { Plus, X, Search, UserCircle, Loader2 } from "lucide-react";
import { getAllUsers, joinClass } from "@/api/userApi";
import { toast } from "react-toastify";
import { getClassDetail } from "@/api/classApi";
import { useParams } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

const AddStudentModal = ({ show, handleClose, fetchAllStudentInClass }) => {
  const { classId } = useParams();
  const [email, setEmail] = useState("");
  const [user, setUser] = useState(null);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [classDetail, setClassDetail] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingAddStudent, setLoadingAddStudent] = useState(false);
  useEffect(() => {
    fetchAllUsers();
    fetchDetailClass();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const res = await getAllUsers();
      setAllUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchDetailClass = async () => {
    try {
      let res = await getClassDetail(classId);
      if (res.success) {
        setClassDetail(res.data);
      }
    } catch (error) {
      console.error("Error fetching class details:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  const performSearch = () => {
    setLoading(true);
    setSearchAttempted(true);

    setTimeout(() => {
      if (!email.trim()) {
        setUser(null);
        setLoading(false);
        return;
      }

      const foundUser = allUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (
        foundUser &&
        (foundUser.role.toLowerCase() === "admin" ||
          foundUser.role.toLowerCase() === "teacher")
      ) {
        setUser(null);
      } else {
        setUser(foundUser || null);
        console.log("found user ", user);
      }
      setLoading(false);
    }, 500);
  };

  const handleCancel = () => {
    handleClose();
    setEmail(null);
    setUser(null);
    setSearchAttempted(false);
  };

  const addStudentJoinClass = async () => {
    setLoadingAddStudent(true);
    try {
      const res = await joinClass(user?.user_id, classDetail?.class_code);

      if (res.success) {
        toast.success(res.message);
        fetchAllStudentInClass();
        handleClose();
        setEmail(null);
        setUser(null);
        setSearchAttempted(false);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.details ||
        error.response?.data?.error?.message;
      toast.error(errorMessage);
    } finally {
      setLoadingAddStudent(false);
    }
  };

  return (
    <Dialog open={show} onClose={handleCancel} className="relative z-50">
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm"
        aria-hidden="true"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#020818] shadow-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <Dialog.Title className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                  Thêm Sinh Viên
                </Dialog.Title>
                <Dialog.Description className="mt-2 text-gray-500 dark:text-white">
                  Nhập email sinh viên để tìm kiếm và thêm vào lớp học
                </Dialog.Description>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập email sinh viên..."
                className="w-full px-4 py-3 pl-12 rounded-xl border dark:text-black border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all outline-none"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>

            {loading && (
              <div className="mt-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}

            {user && !loading && (
              <div className="mt-6">
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-violet-50 border border-blue-100">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <Avatar className="ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-300 transition-all">
                        {user?.profile_picture ? (
                          <AvatarImage
                            src={user.profile_picture}
                            className="object-cover"
                          />
                        ) : (
                          <UserCircle
                            size={40}
                            className="absolute inset-0 text-gray-400"
                          />
                        )}
                      </Avatar>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {user.fullname}
                      </h3>
                      <p className="text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center justify-between">
                      <span>Tên tài khoản:</span>
                      <span className="font-medium text-gray-900">
                        {user.username}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Vai trò:</span>
                      <span className="font-medium text-gray-900">
                        {user.role}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!user && searchAttempted && !loading && (
              <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100">
                <p className="text-red-600 text-center">
                  Không tìm thấy sinh viên với email này
                </p>
              </div>
            )}

            <div className="mt-8 flex items-center justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 dark:text-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 dark:hover:bg-blue-950 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                onClick={addStudentJoinClass}
                disabled={!user}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                  user
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                } transition-colors`}
              >
                {loadingAddStudent ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Thêm sinh viên
                  </>
                )}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddStudentModal;
