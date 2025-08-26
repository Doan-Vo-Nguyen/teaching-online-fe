/* eslint-disable react/prop-types */
import { FileText, Download, PlayCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import moment from "moment";

// Utility function: handleDownload
export const handleDownload = (fileUrl, fileName) => {
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = fileName || decodeURIComponent(fileUrl.split("/").pop());
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const AttachmentItem = ({
  getFileIcon,
  attachment,
  auth,
  handleDeleteAttachment,
  viewFileOnline,
}) => {
  const fileName = attachment.description
    ? decodeURIComponent(attachment.description.split("/").pop())
    : "";
  const fileExt = fileName ? fileName.split(".").pop().toLowerCase() : "";
  const isVideo = ["mp4", "webm", "ogg"].includes(fileExt);

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
      <div className="flex items-center gap-3">
        {fileName ? (
          getFileIcon(fileName)
        ) : (
          <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        )}
        <div>
          {/* Hiển thị title nếu có */}
          {attachment.title && (
            <p className="font-bold text-md text-gray-800 dark:text-white">
              {attachment.title}
            </p>
          )}
          <button
            onClick={() => viewFileOnline(attachment.description)}
            className="font-semibold text-md line-clamp-1 text-blue-600 hover:underline dark:text-blue-400"
          >
            {fileName}
          </button>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-300">
            {moment(attachment.created_at).format("HH:mm - DD/MM/YYYY")}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isVideo ? (
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-500"
            onClick={() => window.open(attachment.description, "_blank")}
          >
            <PlayCircle className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500"
            onClick={() =>
              handleDownload(attachment.description, attachment.name)
            }
          >
            <Download className="h-4 w-4" />
          </Button>
        )}
        {auth?.role !== "student" && (
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-500"
            onClick={() => handleDeleteAttachment(attachment)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AttachmentItem;
