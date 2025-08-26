import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Video,
  LogOut,
  Trash,
  Plus,
  Users,
  Info,
  List,
} from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import useAuthToken from "@/hooks/userAuthToken";
import { getAllMeetingByClassId } from "@/api/MeetingApi";
import { useParams } from "react-router-dom";
import DeleteMeeting from "./DeleteMeeting";
import CreateMeeting from "./CreateMeeting";

const MeetTab = () => {
  const { classId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [isJoined, setIsJoined] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [meetingList, setMeetingList] = useState([]);
  const [meetingToDelete, setMeetingToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const jitsiContainerRef = useRef(null);
  const apiRef = useRef(null);
  const auth = useAuthToken();
  const isTeacher = auth?.role === "teacher" || auth?.role === "admin";

  useEffect(() => {
    fetchAllMeetingList();
  }, [classId]);

  // Load script Jitsi Meet API khi component render
  useEffect(() => {
    if (!window.JitsiMeetExternalAPI) {
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = () => {
        if (isJoined) initializeJitsi();
      };
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    } else if (isJoined) {
      initializeJitsi();
    }
    return () => {
      if (apiRef.current) {
        apiRef.current.dispose();
      }
    };
  }, [isJoined, roomName]);

  // Khởi tạo Jitsi Meeting
  const initializeJitsi = () => {
    if (!window.JitsiMeetExternalAPI || !roomName || !jitsiContainerRef.current)
      return;

    const domain = "meet.jit.si";
    const options = {
      roomName,
      width: "100%",
      height: "500px",
      parentNode: jitsiContainerRef.current,
      interfaceConfigOverwrite: {
        TOOLBAR_BUTTONS: [
          "microphone",
          "camera",
          "closedcaptions",
          "desktop",
          "fullscreen",
          "fodeviceselection",
          "hangup",
          "profile",
          "chat",
          "recording",
          "livestreaming",
          "etherpad",
          "sharedvideo",
          "settings",
          "raisehand",
          "videoquality",
          "filmstrip",
          "invite",
          "feedback",
          "stats",
          "shortcuts",
          "tileview",
          "videobackgroundblur",
          "download",
          "help",
          "mute-everyone",
        ],
        SETTINGS_SECTIONS: [
          "devices",
          "language",
          "moderator",
          "profile",
          "calendar",
        ],
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
      },
      configOverwrite: {
        prejoinPageEnabled: false,
      },
    };

    apiRef.current = new window.JitsiMeetExternalAPI(domain, options);

    apiRef.current.addEventListeners({
      readyToClose: () => {
        setIsJoined(false);
        setIsHost(false);
        setMeetingList("");
        apiRef.current = null;
      },
      participantJoined: (participant) => {
        console.log("Participant joined:", participant);
      },
      participantLeft: (participant) => {
        console.log("Participant left:", participant);
      },
    });
  };

  const fetchAllMeetingList = async () => {
    try {
      const res = await getAllMeetingByClassId(classId);
      if (res.success) {
        let meetingList = res.data.reverse();
        setMeetingList(meetingList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Sao chép link mời
  const copyMeetLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Đã sao chép link vào clipboard!");
  };

  // Rời phòng học
  const leaveMeeting = () => {
    if (apiRef.current) {
      apiRef.current.executeCommand("hangup");
    }
    setIsJoined(false);
    setIsHost(false);
    setMeetingList("");
    setRoomName("");
  };
  const handleDeleteMeeting = (meeting) => {
    setMeetingToDelete(meeting);
    setShowDeleteModal(true);
  };

  return (
    <TabsContent value="meet" className="pt-4">
      <div className="flex flex-col space-y-6">
        <div className=" ">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold  flex items-center">
              <Video className="mr-3 h-7 w-7 text-blue-600" />
              Phòng Học Trực Tuyến
            </h2>
            {isTeacher && (
              <Button variant="info" onClick={() => setShowCreateModal(true)}>
                <Plus className="w-4 h-4" />
                <span>Tạo phòng học mới</span>
              </Button>
            )}
          </div>
        </div>

        {!isJoined ? (
          <>
            {/* Danh sách các link phòng học đã tạo */}
            {meetingList.length > 0 ? (
              <div className="bg-white dark:bg-[#020818] dark:border-none p-6 rounded-xl shadow-md border border-gray-100">
                <h3 className="text-xl font-semibold mb-5 text-gray-800 dark:text-white flex items-center">
                  <List className="w-5 h-5 mr-2 text-blue-600" />
                  Danh sách phòng học
                </h3>
                <div className="overflow-hidden">
                  <ul className="space-y-3">
                    {meetingList.map((meeting, index) => (
                      <li
                        key={index}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-blue-950 dark:border-none transition-colors border border-gray-100"
                      >
                        <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                          <p className="font-medium text-gray-900 truncate dark:text-white">
                            {meeting?.room_name}
                          </p>
                          <p className="text-sm text-gray-500 truncate mt-1 dark:text-white">
                            {meeting?.room_url}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <Button
                            onClick={() => copyMeetLink(meeting?.room_url)}
                            variant="outline"
                            size="sm"
                            className="text-gray-700 hover:bg-gray-100 dark:hover:bg-black"
                            title="Sao chép link"
                          >
                            <Copy className="w-4 h-4 dark:text-white dark:hover:text-black" />
                          </Button>
                          <Button
                            onClick={() =>
                              window.open(meeting?.room_url, "_blank")
                            }
                            variant="secondary"
                            size="sm"
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 
             dark:bg-blue-900 dark:hover:bg-blue-800 dark:text-white 
             border border-transparent dark:border-blue-600 
             transition-colors"
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Tham gia
                          </Button>

                          {isTeacher && (
                            <Button
                              onClick={() => handleDeleteMeeting(meeting)}
                              variant="destructive"
                              size="sm"
                              className="bg-red-50 hover:bg-red-100 text-red-600"
                              title="Xóa phòng học"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Video className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Chưa có phòng học nào
                </h3>
                <p className="text-gray-500 mb-6">
                  {isTeacher
                    ? "Tạo phòng học mới để bắt đầu buổi dạy trực tuyến của bạn."
                    : "Hiện chưa có phòng học nào được tạo. Vui lòng quay lại sau."}
                </p>
                {isTeacher && (
                  <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Tạo phòng học mới
                  </Button>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Thông tin phòng học khi đã tham gia */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-4 md:space-y-0">
              {isHost && (
                <div className="flex items-center flex-wrap gap-2">
                  <div className="flex items-center bg-blue-50 px-3 py-2 rounded-lg">
                    <Users className="h-5 w-5 text-blue-600 mr-2" />
                    <p className="text-gray-700 font-medium">Link mời:</p>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg flex-1 min-w-0">
                    <span className="font-medium text-gray-900 truncate">
                      {meetingList}
                    </span>
                    <Button
                      onClick={() => copyMeetLink(meetingList)}
                      variant="outline"
                      size="sm"
                      className="shrink-0"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
              <Button
                onClick={leaveMeeting}
                variant="destructive"
                className="flex items-center shadow-sm transition-all hover:shadow"
              >
                <LogOut className="mr-2 w-5 h-5" /> Rời Phòng Học
              </Button>
            </div>

            {/* Container cho Jitsi với card style */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100">
              <div
                ref={jitsiContainerRef}
                className="w-full h-[600px] rounded-lg overflow-hidden"
              />

              <div className="mt-4 flex items-center justify-center space-x-3 py-2">
                <div className="text-xs text-gray-500 flex items-center">
                  <Info className="w-3 h-3 mr-1" />
                  Sử dụng các điều khiển trong giao diện để bật/tắt camera,
                  micro hoặc chia sẻ màn hình
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <CreateMeeting
        open={showCreateModal}
        onOpenChange={(open) => {
          setShowCreateModal(open);
          if (!open) {
            setShowCreateModal(null);
          }
        }}
        fetchAllMeetingList={fetchAllMeetingList}
      />

      {meetingToDelete && (
        <DeleteMeeting
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          meetingData={meetingToDelete}
          fetchAllMeetingList={fetchAllMeetingList}
        />
      )}
    </TabsContent>
  );
};

export default MeetTab;
