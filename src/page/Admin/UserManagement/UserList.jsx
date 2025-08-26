import { useState, useEffect } from "react";
import { Loader, Trash, Eye, Search, UserPlus2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DeleteUser from "./DeleteUser";
import Pagination from "@/components/Pagination";
import { getAllUsers, updateUserRole } from "@/api/userApi";
import RoleUpdate from "@/components/RoleUpdate";
import { toast } from "react-toastify";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import UserStatistics from "./UserStatistics";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showRoleMenu, setShowRoleMenu] = useState(null);
  const [roleFilter, setRoleFilter] = useState("");
  const navigate = useNavigate();

  const roles = [
    { id: "admin", label: "ADMIN" },
    { id: "teacher", label: "TEACHER" },
    { id: "student", label: "STUDENT" },
  ];

  const handleRoleClick = (user) => {
    setShowRoleMenu(user.user_id);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      const reversedUsers = response.data.reverse();
      setUsers(reversedUsers);
      setLoading(false);
    } catch (err) {
      setError("Error fetching users");
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullname?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const endIndex = currentPage * pageSize;
  const startIndex = endIndex - pageSize;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handleDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleRoleUpdate = async (user, newRole) => {
    try {
      const updatedUsers = await updateUserRole(user.user_id, newRole.id);
      if (updatedUsers.success) {
        toast.success(updatedUsers.message);
        fetchUsers();
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.error?.details ||
        error.response?.data?.error?.message;
      toast.error(errorMessage);
      console.error("Error message:", errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 space-y-6 bg-gray-50 dark:bg-gray-900">
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Quản lý người dùng
            </h1>
            <p className="text-gray-600 dark:text-gray-300 my-2">
              Quản lý và theo dõi người dùng
            </p>
            <UserStatistics users={users} />
          </div>
          {/* Actions Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex space-x-4 mb-4 md:mb-0">
              <div>
                <select
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-6 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Tất cả</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex space-x-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-none">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <Button
                variant="info"
                onClick={() => navigate("/admin/users/create")}
              >
                <UserPlus2 className="w-5 h-5" />
                Thêm người dùng
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase">
                <tr>
                  <th className="px-4 py-2">Id</th>
                  <th className="px-4 py-2">Họ tên</th>
                  <th className="px-4 py-2">Giới tính</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Role</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr
                    key={user.user_id}
                    className="border-b dark:border-gray-600"
                  >
                    <td className="px-4 py-2">{user?.user_id}</td>
                    <td className="px-4 py-2">{user?.fullname || "N/A"}</td>
                    <td className="px-4 py-2">{user?.gender || "N/A"}</td>
                    <td className="px-4 py-2">{user?.email || "N/A"}</td>
                    <td className="py-2 relative">
                      <div
                        onClick={() => handleRoleClick(user)}
                        className="cursor-pointer"
                      >
                        <Badge
                          className="min-w-[80px]"
                          variant={
                            user.role === "student"
                              ? "student"
                              : user.role === "teacher"
                              ? "teacher"
                              : user.role === "admin"
                              ? "admin"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {roles.find((role) => role.id === user.role)?.label ||
                            "N/A"}
                        </Badge>
                      </div>

                      <RoleUpdate
                        user={user}
                        showRoleMenu={showRoleMenu === user.user_id}
                        roles={roles}
                        onRoleClick={setShowRoleMenu}
                        onRoleUpdate={handleRoleUpdate}
                        onClose={() => setShowRoleMenu(null)}
                      />
                    </td>

                    <td className="px-4 py-2 flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          navigate(`/admin/users/${user?.user_id}`)
                        }
                      >
                        <Eye size={16} className="mr-2" />
                        View
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user)}
                      >
                        <Trash size={16} className="mr-2" />
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              showingFrom={startIndex + 1}
              showingTo={Math.min(endIndex, filteredUsers.length)}
              totalItems={filteredUsers.length}
              itemName="users"
            />
          )}
        </CardContent>
      </Card>

      {/* Modal Xác Nhận Xóa */}
      {userToDelete && (
        <DeleteUser
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          userData={userToDelete}
          fetchAllListUser={fetchUsers}
        />
      )}
    </div>
  );
};

export default UserList;
