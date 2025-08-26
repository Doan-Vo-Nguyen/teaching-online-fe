/* eslint-disable react/prop-types */
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";
import AttachmentItem from "./AttachmentItem";

const AttachmentsCard = ({
  attachments,
  auth,
  setIsUploadDialogOpen,
  handleDeleteAttachment,
  getFileIcon,
  viewFileOnline,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tài liệu đính kèm</CardTitle>
        {auth?.role !== "student" && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
              onClick={() => setIsUploadDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Thêm tài liệu
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {attachments.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
            {attachments.map((attachment) => (
              <AttachmentItem
                key={attachment.id}
                attachment={attachment}
                auth={auth}
                handleDeleteAttachment={handleDeleteAttachment}
                getFileIcon={getFileIcon}
                viewFileOnline={viewFileOnline}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-gray-300 mb-2" />
            <p className="text-gray-500 dark:text-white">
              Chưa có tài liệu đính kèm
            </p>
            {auth?.role !== "student" && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Thêm tài liệu
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttachmentsCard;
