/* eslint-disable react/prop-types */

import { FileText, MoreHorizontal, Edit, Trash, Calendar } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import moment from "moment";
import DeleteLecture from "./DeleteLecture";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthToken from "@/hooks/userAuthToken";
import EditLecture from "./EditLecture";

const LectureCard = ({ material, fetchAllLecturesByClassId }) => {
  const auth = useAuthToken();
  const { classId } = useParams();
  const navigate = useNavigate();
  const [lectureToDelete, setLectureToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [lectureToEdit, setLectureToEdit] = useState(null);

  const handleDeleteLecture = (lecture) => {
    setLectureToDelete(lecture);
    setShowDeleteModal(true);
  };

  const handleEditLecture = (lecture) => {
    setLectureToEdit(lecture);
    setShowEditModal(true);
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="p-3 bg-slate-50 rounded-lg">
            <FileText className="h-10 w-10 text-blue-500" />
          </div>
          {auth?.role !== "student" && (
            <div className="w-[10%] flex items-center justify-end pr-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  align="end"
                  sideOffset={4}
                  className="w-32 rounded-md p-2 shadow-md ring-1 ring-gray-200 transition-all bg-white dark:bg-[#020818]"
                >
                  <div className="flex flex-col space-y-1 dark:bg-[#020818]">
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start hover:bg-gray-100 dark:hover:bg-blue-950  rounded px-2 py-1 text-sm"
                      onClick={() => handleEditLecture(material)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      <span className="font-normal">Chỉnh sửa</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="flex items-center justify-start hover:bg-gray-100 dark:hover:bg-blue-950 rounded px-2 py-1 text-sm text-red-500"
                      onClick={() => handleDeleteLecture(material)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      <span className="font-normal">Xóa </span>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
        <CardTitle
          className="text-md mt-3 line-clamp-2"
          onClick={() =>
            navigate(`/classes/${classId}/lectures/${material.lecture_id}`)
          }
        >
          {material.title}
        </CardTitle>
        <CardDescription className="line-clamp-2"></CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span className="flex items-center dark:text-white">
            <Calendar className="h-4 w-4 mr-1" />
            Ngày tạo
          </span>
          <span className="dark:text-white">
            {moment(material.created_at).format("HH:mm - DD/MM/YYYY")}
          </span>
        </div>
      </CardContent>
      {lectureToDelete && (
        <DeleteLecture
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          lectureToDelete={lectureToDelete}
          fetchAllLecturesByClassId={fetchAllLecturesByClassId}
        />
      )}
      <EditLecture
        open={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open);
          if (!open) {
            setLectureToEdit(null);
          }
        }}
        lectureToEdit={lectureToEdit}
        fetchAllLecturesByClassId={fetchAllLecturesByClassId}
      />
    </Card>
  );
};

export default LectureCard;
