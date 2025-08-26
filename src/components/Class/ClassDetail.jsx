import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Calendar,
  Users,
  ClipboardList,
} from "lucide-react";
import { getClassDetail } from "@/api/classApi";
import moment from "moment";

const ClassDetail = () => {
  const { classId } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  useEffect(() => {
    fetchClassDetails();
  }, []);

  const fetchClassDetails = async () => {
    try {
       const res = await getClassDetail(classId);
       setClassDetails(res.data);
    } catch (error) {
      console.error("Error fetching class details:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8  ">
          <div className="flex justify-between items-start">
            <div>
             
                <h1 className="text-4xl text-blue-600 font-bold  ">
                  {classDetails?.class_name}
                </h1>
              <p className="mt-3 text-gray-600 text-lg font-bold">
                {classDetails?.class_code}
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Teacher Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Giáo viên</h3>
                <p className="text-lg font-semibold text-gray-800">
                  {classDetails?.teacher}
                </p>
              </div>
            </div>
          </div>

          {/* Created Date Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Ngày tạo</h3>
                <p className="text-lg font-semibold text-gray-800">
                  {moment(classDetails?.created_at).format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <ClipboardList className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Mô tả lớp học
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed pl-16">
            {classDetails?.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClassDetail;
