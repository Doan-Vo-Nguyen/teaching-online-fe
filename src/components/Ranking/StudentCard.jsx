/* eslint-disable react/prop-types */
import { Crown, Trophy, Medal, UserCircle } from "lucide-react";
import { Avatar, AvatarImage } from "../ui/avatar";

const StudentCard = ({ student, position, studentDetails }) => {
  console.log("studentDetails", studentDetails);

  const filteredStudentDetail = studentDetails.find(
    (detail) => detail.user_id === student.student_id
  );
  console.log("filteredStudentDetails", filteredStudentDetail);
  const getRankIcon = (pos) => {
    switch (pos) {
      case 1:
        return <Crown className="h-8 w-8 text-yellow-400" />;
      case 2:
        return <Trophy className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Medal className="h-8 w-8 text-amber-600" />;
      default:
        return <span className="text-2xl font-bold text-gray-600">#{pos}</span>;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-purple-500 text-white py-2 px-6 rounded-bl-2xl">
        {getRankIcon(position)}
      </div>

      <div className="flex flex-col items-center mb-4 pt-8">
        <Avatar className="ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-300 transition-all">
          {filteredStudentDetail?.profile_picture ? (
            <AvatarImage
              src={filteredStudentDetail.profile_picture}
              className="object-cover"
            />
          ) : (
            <UserCircle size={40} className="absolute inset-0 text-gray-400" />
          )}
        </Avatar>
        <h3 className="mt-4 text-xl font-bold text-gray-800 dark:text-white">
          {filteredStudentDetail?.fullname}
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">Điểm số:</span>
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {student.grade}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
