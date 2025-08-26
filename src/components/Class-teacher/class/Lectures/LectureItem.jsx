/* eslint-disable react/prop-types */

import { Calendar, FileText, MoreHorizontal, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import moment from "moment";
import { useState } from "react";
import DeleteLecture from "./DeleteLecture";
import { useNavigate, useParams } from "react-router-dom";
import useAuthToken from "@/hooks/userAuthToken";
import EditLecture from "./EditLecture";

const LectureItem = ({ material, fetchAllLecturesByClassId }) => {
  const { classId } = useParams();
  const auth = useAuthToken();
  const navigate = useNavigate();
  const [lectureToDelete, setLectureToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lectureToEdit, setLectureToEdit] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleDeleteLecture = (lecture) => {
    setLectureToDelete(lecture);
    setShowDeleteModal(true);
  };

  const handleEditLecture = (lecture) => {
    setLectureToEdit(lecture);
    setShowEditModal(true);
  };

  return (
    <div className="flex items-center space-x-4 p-4 border-b dark:bg-[#020818] border-gray-100 hover:bg-slate-50  transition-colors cursor-pointer">
      <div className="p-3  rounded-lg shadow-sm">
        <FileText className="h-10 w-10 text-blue-500" />
      </div>
      <div
        className="w-[60%]   ml-7 pl-2"
        onClick={() =>
          navigate(`/classes/${classId}/lectures/${material.lecture_id}`)
        }
      >
        <h3 className="text-md font-medium dark:text-white text-gray-900 truncate">
          {material.title}
        </h3>
      </div>
      <div className="hidden md:flex w-[30%] mx-2 pl-12 dark:text-white text-gray-500 ">
        <Calendar className="h-4 w-4 mr-1 mt-1" />
        {moment(material.created_at).format("HH:mm - DD/MM/YYYY")}
      </div>
      {auth?.role !== "student" && (
        <div className="w-[10%] flex items-center justify-end pr-4">
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
              className="w-32 rounded-md p-2 shadow-md ring-1 ring-gray-200 transition-all"
            >
              <div className="flex flex-col space-y-1">
                <Button
                  variant="ghost"
                  className="flex items-center justify-start hover:bg-gray-100 dark:hover:bg-blue-950 rounded px-2 py-1 text-sm"
                  onClick={() => handleEditLecture(material)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  <span className="font-normal">Chỉnh sửa </span>
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
    </div>
  );
};

export default LectureItem;
