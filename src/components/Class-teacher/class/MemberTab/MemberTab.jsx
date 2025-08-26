/* eslint-disable react/prop-types */
import { getUserById } from "@/api/userApi";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Input } from "@/components/ui/input";
import useAuthToken from "@/hooks/userAuthToken";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  MoreHorizontal,
  Plus,
  Search,
  Trash,
  UserCircle,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeaveClass from "./LeaveClass";
import AddStudentModal from "./AddStudentModal";

const MemberTab = ({ studentInclass, teacher, fetchAllStudentInClass }) => {
  const auth = useAuthToken();
  const navigate = useNavigate();
  const [teacherDetail, setTeacherDetail] = useState(null);
  const [studentDetails, setStudentDetails] = useState([]);
  const [studentToLeave, setStudentToLeave] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  useEffect(() => {
    if (teacher) {
      getUserById(teacher)
        .then((res) => {
          if (res.success) {
            setTeacherDetail(res.data);
          }
        })
        .catch((error) =>
          console.error("Error fetching teacher detail:", error)
        );
    }
  }, [teacher]);

  // Lấy thông tin chi tiết của các học viên từ prop studentInclass
  const fetchStudentDetails = async () => {
    if (studentInclass && studentInclass.length > 0) {
      try {
        const results = await Promise.all(
          studentInclass.map((student) => getUserById(student?.student_id))
        );
        const fetchedStudents = results
          .filter((res) => res.success)
          .map((res) => res.data);
        setStudentDetails(fetchedStudents);
      } catch (error) {
        console.error("Error fetching student details:", error);
      }
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [studentInclass]);

  // Lọc danh sách học viên theo tên hoặc email
  const filteredStudents = studentDetails.filter((student) => {
    const term = searchTerm.toLowerCase();
    return (
      student.fullname.toLowerCase().includes(term) ||
      student.email.toLowerCase().includes(term)
    );
  });

  const handleLeaveStudentInClass = (student) => {
    setStudentToLeave(student);
    setShowDeleteModal(true);
  };
  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setStudentToLeave(null);
  };

  return (
    <TabsContent value="members" className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center dark:text-white">
          <Users className="mr-2 h-6 w-6 text-blue-600" />
          Thành viên lớp học
        </h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64 ">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-white" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc email..."
              className="pl-9 dark:bg-[#020818]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {auth?.role !== "student" && (
            <Button variant="info" onClick={() => setShowAddModal(true)}>
              <Plus />
              Thêm
            </Button>
          )}
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Giáo viên</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-blue-950"
            onClick={() => navigate(`/profile/${teacher}`)}
          >
            <Avatar className="ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-300 transition-all">
              {teacherDetail?.profile_picture ? (
                <AvatarImage
                  src={teacherDetail.profile_picture}
                  className="object-cover"
                />
              ) : (
                <UserCircle
                  size={40}
                  className="absolute inset-0 text-gray-400"
                />
              )}
            </Avatar>
            <div>
              <p
                className="font-medium"
                onClick={() => navigate(`/profile/${teacher}`)}
              >
                {teacherDetail?.fullname}
              </p>
              <p
                className="text-sm text-gray-500 "
                onClick={() => navigate(`/profile/${teacher}`)}
              >
                {teacherDetail?.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Học viên ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 ">
          {filteredStudents.map((member) => (
            <div
              key={member?.user_id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-blue-950"
            >
              <div
                className="flex items-center gap-4"
                onClick={() => navigate(`/profile/${member?.user_id}`)}
              >
                <Avatar className="ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-300 transition-all">
                  {member?.profile_picture ? (
                    <AvatarImage
                      src={member?.profile_picture}
                      className="object-cover"
                    />
                  ) : (
                    <UserCircle
                      size={40}
                      className="absolute inset-0 text-gray-400"
                    />
                  )}
                </Avatar>
                <div>
                  <p className="font-medium">{member?.fullname}</p>
                  <p className="text-sm text-gray-500">{member?.email}</p>
                </div>
              </div>
              {auth?.role !== "student" && (
                <div className="ml-auto">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="end"
                      sideOffset={4}
                      className="w-32 rounded-md p-2 shadow-md ring-1 ring-gray-200 transition-all bg-white dark:bg-blue-950 "
                    >
                      <Button
                        variant="ghost"
                        className="flex items-center justify-start hover:bg-gray-100 dark:hover:bg-blue-950 w-full rounded px-2 py-1 text-sm text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeaveStudentInClass(member);
                        }}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        <span className="font-normal">Xóa </span>
                      </Button>
                    </PopoverContent>
                  </Popover>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      {studentToLeave && (
        <LeaveClass
          show={showDeleteModal}
          handleClose={handleCloseModal}
          studentToLeave={studentToLeave}
          fetchAllStudentInClass={fetchAllStudentInClass}
        />
      )}
      <AddStudentModal
        show={showAddModal}
        handleClose={() => setShowAddModal(false)}
        fetchAllStudentInClass={fetchAllStudentInClass}
      />
    </TabsContent>
  );
};

export default MemberTab;
