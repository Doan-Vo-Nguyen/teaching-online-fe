/* eslint-disable react/prop-types */
import {
  FileText,
  PlusCircle,
  Trash2,
  Download,
  PlayCircle,
  Video,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import moment from "moment";

const ResourcesSection = ({
  resources,
  getFileIcon,
  auth,
  setIsAddResourceDialogOpen,
  selectedVideo,
  selectVideoResource,
  viewFileOnline,
  handleDeleteAttachment,
  getVideoResources,
  getDocumentResources,
}) => {
  // Hàm xử lý khi click vào tên file
  const handleFileNameClick = (resource, isVideo) => {
    if (isVideo) {
      selectVideoResource(resource);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      viewFileOnline(resource.content);
    }
  };

  // Hàm tải xuống file mà không làm xoay trang
  const handleDownload = (resourceUrl, fileName) => {
    // Tạo thẻ a ẩn để tải xuống
    const link = document.createElement("a");
    link.href = resourceUrl;
    link.download =
      fileName || decodeURIComponent(resourceUrl.split("/").pop());
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();

    // Đợi một chút rồi xóa thẻ a
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);

    // Ngăn chặn sự kiện mặc định
    return false;
  };

  // Kiểm tra xem file có phải là video hay không
  const isVideoFile = (fileName) => {
    const fileExt = fileName.split(".").pop().toLowerCase();
    return ["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(fileExt);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>Tài liệu bài giảng</CardTitle>
          {auth?.role !== "student" && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50"
              onClick={() => setIsAddResourceDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Thêm tài liệu
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="videos">Video</TabsTrigger>
            <TabsTrigger value="documents">Tài liệu</TabsTrigger>
          </TabsList>

          {/* Tab "Tất cả" */}
          <TabsContent value="all">
            {resources.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {resources.map((resource) => {
                  const fileName = resource.content
                    ? decodeURIComponent(resource.content.split("/").pop())
                    : "";
                  const isVideo = isVideoFile(fileName);

                  return (
                    <div
                      key={resource.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-100 border ${
                        isVideo && selectedVideo?.id === resource.id
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {fileName ? (
                          getFileIcon(fileName)
                        ) : (
                          <FileText className="h-5 w-5 text-gray-600" />
                        )}
                        <div className="max-w-[200px] sm:max-w-[300px]">
                          <button
                            onClick={() =>
                              handleFileNameClick(resource, isVideo)
                            }
                            className="font-medium text-sm line-clamp-1 text-blue-600 hover:underline text-left"
                          >
                            {fileName}
                          </button>
                          <p className="mt-1 text-xs text-gray-500">
                            {moment(resource.created_at).format(
                              "HH:mm - DD/MM/YYYY"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!isVideo && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-700 hover:text-green-600 hover:bg-green-50"
                            onClick={(e) => {
                              e.preventDefault();
                              handleDownload(resource.content, fileName);
                            }}
                          >
                            <Download className="h-4 w-4 mr-1" />
                          </Button>
                        )}
                        {auth?.role !== "student" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-700 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteAttachment(resource)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <ResourcesEmptyState
                role={auth?.role}
                setIsAddResourceDialogOpen={setIsAddResourceDialogOpen}
                type="all"
              />
            )}
          </TabsContent>

          {/* Tab "Video" */}
          <TabsContent value="videos">
            {getVideoResources().length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {getVideoResources().map((resource) => {
                  const fileName = resource.content
                    ? decodeURIComponent(resource.content.split("/").pop())
                    : "";
                  return (
                    <div
                      key={resource.id}
                      className={`flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-100 border ${
                        selectedVideo?.id === resource.id
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-100"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <PlayCircle className="h-5 w-5 text-purple-600" />
                        <div className="max-w-[200px] sm:max-w-[300px]">
                          <button
                            onClick={() => handleFileNameClick(resource, true)}
                            className="font-medium text-sm line-clamp-1 text-blue-600 hover:underline text-left"
                          >
                            {fileName}
                          </button>
                          <p className="mt-1 text-xs text-gray-500">
                            {moment(resource.created_at).format(
                              "HH:mm - DD/MM/YYYY"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {auth?.role !== "student" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-700 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteAttachment(resource)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <ResourcesEmptyState
                role={auth?.role}
                setIsAddResourceDialogOpen={setIsAddResourceDialogOpen}
                type="video"
              />
            )}
          </TabsContent>

          {/* Tab "Tài liệu" */}
          <TabsContent value="documents">
            {getDocumentResources().length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
                {getDocumentResources().map((resource) => {
                  const fileName = resource.content
                    ? decodeURIComponent(resource.content.split("/").pop())
                    : "";
                  return (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-3 rounded-lg transition-colors hover:bg-gray-100 border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        {fileName ? (
                          getFileIcon(fileName)
                        ) : (
                          <FileText className="h-5 w-5 text-gray-600" />
                        )}
                        <div className="max-w-[200px] sm:max-w-[300px]">
                          <button
                            onClick={() => handleFileNameClick(resource, false)}
                            className="font-medium text-sm line-clamp-1 text-blue-600 hover:underline text-left"
                          >
                            {fileName}
                          </button>
                          <p className="mt-1 text-xs text-gray-500">
                            {moment(resource.created_at).format(
                              "HH:mm - DD/MM/YYYY"
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-700 hover:text-green-600 hover:bg-green-50"
                          onClick={(e) => {
                            e.preventDefault();
                            handleDownload(resource.content, fileName);
                          }}
                        >
                          <Download className="h-4 w-4 mr-1" />
                        </Button>
                        {auth?.role !== "student" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-700 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteAttachment(resource)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <ResourcesEmptyState
                role={auth?.role}
                setIsAddResourceDialogOpen={setIsAddResourceDialogOpen}
                type="document"
              />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

// Subcomponent for empty states
const ResourcesEmptyState = ({ role, setIsAddResourceDialogOpen, type }) => {
  const getIcon = () => {
    switch (type) {
      case "video":
        return <Video className="h-16 w-16 text-gray-300 mb-4" />;
      case "document":
      case "all":
      default:
        return <FileText className="h-16 w-16 text-gray-300 mb-4" />;
    }
  };

  const getMessage = () => {
    switch (type) {
      case "video":
        return "Chưa có video đính kèm";
      case "document":
        return "Chưa có tài liệu đính kèm";
      case "all":
      default:
        return "Chưa có tài liệu đính kèm";
    }
  };

  const getButtonText = () => {
    switch (type) {
      case "video":
        return "Thêm video";
      case "document":
        return "Thêm tài liệu";
      case "all":
      default:
        return "Thêm tài liệu";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {getIcon()}
      <p className="text-gray-500 text-lg dark:text-white">{getMessage()}</p>
      <p className="text-gray-400 mb-6 max-w-md dark:text-white">
        Tài liệu bổ sung sẽ giúp bạn hiểu sâu hơn về nội dung bài giảng
      </p>
      {role !== "student" && (
        <Button
          variant="outline"
          className="mt-2"
          onClick={() => setIsAddResourceDialogOpen(true)}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          {getButtonText()}
        </Button>
      )}
    </div>
  );
};

export default ResourcesSection;
