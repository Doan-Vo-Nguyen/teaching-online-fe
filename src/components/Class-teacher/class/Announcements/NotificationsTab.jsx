import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Bell, Edit, MoreHorizontal, Trash, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import CreateNotify from "./CreateNotify";
import { getAllNotifyInClass } from "@/api/NotifyApi";
import { useParams } from "react-router-dom";
import { getUserById } from "@/api/userApi";
import useAuthToken from "@/hooks/userAuthToken";

import DeleteNotify from "./DeleteNotify";
import UpdateNotify from "./UpdateNotify";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const NotificationsTab = () => {
  const auth = useAuthToken();
  const { classId } = useParams();
  const [teacherDetail, setTeacherDetail] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifyToDelete, setNotifyToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [notifyToEdit, setnotifyToEdit] = useState(null);
  useEffect(() => {
    fetchtAllNotifyInClass(classId);
  }, [classId]);
  useEffect(() => {
    const fetchTeacherDetail = async () => {
      if (notifications.length > 0 && notifications[0].teacher_id) {
        try {
          const res = await getUserById(notifications[0].teacher_id);
          if (res.success) {
            setTeacherDetail(res.data);
          }
        } catch (error) {
          console.error("Error fetching teacher detail:", error);
        }
      }
    };

    fetchTeacherDetail();
  }, [notifications]);

  const fetchtAllNotifyInClass = async (classId) => {
    try {
      const res = await getAllNotifyInClass();
      if (res.success) {
        const filteredNotifications = (res.data || []).filter(
          (notify) => notify.class_id.toString() === classId.toString()
        );
        const reversedNotifications = filteredNotifications.reverse();
        setNotifications(reversedNotifications);
      }
    } catch (error) {
      console.error("Error fetching lectures:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full mb-3"></div>
          <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  const handleDeleteNotify = (notify) => {
    setNotifyToDelete(notify);
    setShowDeleteModal(true);
  };

  const handleEditNotify = (notify) => {
    setnotifyToEdit(notify);
    setShowEditModal(true);
  };

  return (
    <TabsContent value="announcements" className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center dark:text-white">
          <Bell className="mr-2 h-6 w-6 text-blue-600" />
          Bảng tin
        </h2>
        {auth.role !== "student" && (
          <Button
            variant="info"
            className="flex items-center gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <Bell className="w-4 h-4" />
            <span>Tạo thông báo mới</span>
          </Button>
        )}
      </div>

      {notifications.map((notify, index) => (
        <Card
          key={`notify-${notify.id ?? index}`}
          className="shadow-md hover:shadow-lg transition-shadow"
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between">
              <CardTitle className="text-lg text-blue-600 dark:text-white">
                {notify.title}
              </CardTitle>
              {auth?.role !== "student" && (
                <div className="ml-auto">
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
                      className="w-32 rounded-md p-2 shadow-md ring-1 ring-gray-200 transition-all "
                    >
                      <div className="flex flex-col space-y-1 dark:bg-[#020818]">
                        <Button
                          variant="ghost"
                          className="flex items-center justify-start hover:bg-gray-100 dark:hover:bg-blue-950  rounded px-2 py-1 text-sm"
                          onClick={() => handleEditNotify(notify)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          <span className="font-normal">Chỉnh sửa</span>
                        </Button>
                        <Button
                          variant="ghost"
                          className="flex items-center justify-start hover:bg-gray-100 dark:hover:bg-blue-950 rounded px-2 py-1 text-sm text-red-500"
                          onClick={() => handleDeleteNotify(notify)}
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
            <div className="flex items-center gap-2 mt-2">
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
              <span className="text-sm text-gray-600 dark:text-white">
                {teacherDetail?.fullname}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-white">{notify?.content}</p>
          </CardContent>
        </Card>
      ))}
      <CreateNotify
        open={showCreateModal}
        onOpenChange={(open) => {
          setShowCreateModal(open);
          if (!open) {
            setShowCreateModal(null);
          }
        }}
        fetchtAllNotifyInClass={fetchtAllNotifyInClass}
      />
      {notifyToDelete && (
        <DeleteNotify
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          notifyToDelete={notifyToDelete}
          fetchtAllNotifyInClass={fetchtAllNotifyInClass}
        />
      )}
      <UpdateNotify
        open={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open);
          if (!open) {
            setnotifyToEdit(null);
          }
        }}
        notifyToEdit={notifyToEdit}
        fetchtAllNotifyInClass={fetchtAllNotifyInClass}
      />
    </TabsContent>
  );
};

export default NotificationsTab;
