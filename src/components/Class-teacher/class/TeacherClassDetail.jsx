import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Users,
  ClipboardList,
  Bell,
  BookOpen,
  Book,
  Video,
} from "lucide-react";
import { useParams } from "react-router-dom";
import { getAllStudentJoinedByClassId, getClassDetail } from "@/api/classApi";
import moment from "moment";
import LecturesTab from "./Lectures/LecturesTab";
import useAuthToken from "@/hooks/userAuthToken";
import ExamsTab from "./Exams/ExamsTab";
import NotificationsTab from "./Announcements/NotificationsTab";
import MeetTab from "./MeetTab/MeetTab";
import MemberTab from "./MemberTab/MemberTab";

const TeacherClassDetail = () => {
  const auth = useAuthToken();
  const { classId } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [studentInclass, setStudentInClass] = useState([]);
  useEffect(() => {
    fetchClassDetails();
    fetchAllStudentInClass();
  }, [classId]);

  const fetchClassDetails = async () => {
    try {
      const res = await getClassDetail(classId);
      setClassDetails(res.data);
    } catch (error) {
      console.error("Error fetching class details:", error);
    }
  };

  const fetchAllStudentInClass = async () => {
    try {
      const res = await getAllStudentJoinedByClassId(classId);
      if (res.success) {
        setStudentInClass(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8  dark:bg-[#020818]  ">
      <div className="max-w-7xl mx-auto dark:bg-[#020818] ">
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 md:p-8 mb-6 h-[140px] dark:bg-[#020818]">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl text-white font-bold">
                {classDetails?.class_name}
              </h1>
              {auth?.role !== "student" && (
                <p className="mt-2 text-white text-lg font-medium">
                  {classDetails?.class_code}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          {/* Teacher Card */}
          <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300 dark:bg-blue-950">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-white">
                  Giáo viên
                </h3>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {classDetails?.teacher}
                </p>
              </div>
            </div>
          </div>

          {/* Created Date Card */}
          <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300 dark:bg-blue-950">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-white">
                  Ngày tạo
                </h3>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {moment(classDetails?.created_at).format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
          </div>

          {/* Student Count Card */}
          <div className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-shadow duration-300 dark:bg-blue-950">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-white">
                  Số học viên
                </h3>
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  {studentInclass?.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow duration-300 dark:bg-blue-950 ">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-amber-100 rounded-full">
              <ClipboardList className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Mô tả lớp học
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed pl-16 dark:text-white">
            {classDetails?.description}
          </p>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue="announcements"
          className="bg-white rounded-2xl shadow-lg p-4 md:p-6 dark:bg-blue-950"
        >
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger
              value="announcements"
              className="flex gap-2 items-center"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden md:inline">Bảng tin</span>
            </TabsTrigger>
            <TabsTrigger value="exams" className="flex gap-2 items-center">
              <BookOpen className="w-4 h-4" />
              <span className="hidden md:inline">Bài tập</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex gap-2 items-center">
              <Book className="w-4 h-4" />
              <span className="hidden md:inline">Bài giảng</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex gap-2 items-center">
              <Users className="w-4 h-4" />
              <span className="hidden md:inline">Mọi người</span>
            </TabsTrigger>
            <TabsTrigger value="meet" className="flex gap-2 items-center">
              <Video className="w-4 h-4" />
              <span className="hidden md:inline">Học trực tuyến</span>
            </TabsTrigger>
          </TabsList>

          {/* Notifications Tab  */}
          <NotificationsTab />

          {/* Exams Tab */}
          <ExamsTab />

          <LecturesTab />
          {/* Members Tab */}
          <MemberTab
            studentInclass={studentInclass}
            teacher={classDetails?.teacher_id}
            fetchAllStudentInClass={fetchAllStudentInClass}
          />
          {/* Schedule Tab */}

          <MeetTab classId={classId} />
        </Tabs>
      </div>
    </div>
  );
};

export default TeacherClassDetail;
