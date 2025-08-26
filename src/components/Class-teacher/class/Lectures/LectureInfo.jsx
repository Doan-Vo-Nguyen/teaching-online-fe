/* eslint-disable react/prop-types */
// components/LectureInfo.jsx
import { Calendar, Clock, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import moment from "moment";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getClassDetail } from "@/api/classApi";

const LectureInfo = ({ lectureDetail }) => {
  const { classId } = useParams();
  const [classDetails, setClassDetails] = useState(null);

  useEffect(() => {
    fetchClassDetails();
  }, [classId]);

  const fetchClassDetails = async () => {
    try {
      const res = await getClassDetail(classId);
      setClassDetails(res.data);
    } catch (error) {
      console.error("Error fetching class details:", error);
    }
  };
  return (
    <Card className="shadow-sm dark:bg-gray-900 dark:text-gray-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl dark:text-white">
          {lectureDetail?.title}
        </CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {moment(lectureDetail?.created_at).format("DD/MM/YYYY")}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {moment(lectureDetail?.created_at).format("HH:mm")}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-2 mb-4">
          <p className="text-gray-600 dark:text-gray-300">
            {lectureDetail?.description ||
              "Không có mô tả chi tiết cho bài giảng này."}
          </p>
        </div>
        <Separator className="my-4" />
        <div>
          <h3 className="font-medium mb-3 text-gray-800 dark:text-gray-200 flex items-center">
            <Info className="h-4 w-4 mr-2 text-blue-500" />
            Thông tin bổ sung
          </h3>
          <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
            <li className="flex items-center justify-between">
              <span>Người tạo:</span>
              <span className="font-medium">{classDetails?.teacher}</span>
            </li>
            <li className="flex items-center justify-between">
              <span>Ngày tạo:</span>
              <span className="font-medium">
                {moment(lectureDetail?.created_at).format("HH:mm - DD/MM/YYYY")}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span>Cập nhật:</span>
              <span className="font-medium">
                {moment(lectureDetail?.update_at).format("HH:mm - DD/MM/YYYY")}
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default LectureInfo;
