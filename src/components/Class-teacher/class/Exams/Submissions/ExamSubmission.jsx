/* eslint-disable react/prop-types */
import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ACCEPTED_FILE_TYPES } from "../../../../../../constant";

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

// Schema cho phép nhiều file (bao gồm video)
const formSchema = z.object({
  files: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Vui lòng chọn ít nhất 1 file")
    .refine(
      (files) => Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `Một hoặc nhiều file vượt quá kích thước cho phép (100MB)`
    )
    .refine(
      (files) =>
        Array.from(files).every((file) => {
          // Kiểm tra MIME type và nếu file có đuôi .pdf thì cho phép
          const allowed =
            ACCEPTED_FILE_TYPES.includes(file.type) ||
            file.name.toLowerCase().endsWith(".pdf");
          return allowed;
        }),
      "Một hoặc nhiều file không đúng định dạng hỗ trợ"
    ),
});

const ExamSubmission = ({
  open,
  onOpenChange,
  onFilesSelected,
  getFileIcon,
}) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      files: undefined,
    },
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Xử lý nhiều file được chọn
  const processFiles = (filesList) => {
    const filesArray = Array.from(filesList);
    const validFileObjs = [];

    filesArray.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`File ${file.name} vượt quá kích thước cho phép (100MB)`);
        return;
      }

      // Kiểm tra định dạng file hoặc file PDF
      const isValidType =
        ACCEPTED_FILE_TYPES.includes(file.type) ||
        file.name.toLowerCase().endsWith(".pdf");
      if (!isValidType) {
        toast.error(`File ${file.name} không đúng định dạng hỗ trợ`);
        return;
      }

      const fileObj = {
        file,
        name: file.name,
        size: formatFileSize(file.size),
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : null,
        id: Date.now() + Math.random().toString(36).substring(2, 9),
      };
      validFileObjs.push(fileObj);
    });

    if (validFileObjs.length > 0) {
      setSelectedFiles((prevFiles) => {
        const newFiles = [...prevFiles, ...validFileObjs];
        const dt = new DataTransfer();
        newFiles.forEach((fileObj) => dt.items.add(fileObj.file));
        form.setValue("files", dt.files);
        return newFiles;
      });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Xoá file theo id
  const removeFile = (fileId) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = prevFiles.filter((file) => file.id !== fileId);
      const dt = new DataTransfer();
      newFiles.forEach((fileObj) => dt.items.add(fileObj.file));
      form.setValue("files", dt.files);
      return newFiles;
    });
  };

  const onSubmit = async (data) => {
    if (selectedFiles.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 file");
      return;
    }

    try {
      setIsLoading(true);
      // Chuyển danh sách file đã chọn lên SubmissionCard để hiển thị
      onFilesSelected(data.files);

      // Đóng dialog
      onOpenChange(false);
      setSelectedFiles([]);
      form.reset();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi chọn file");
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };


   
  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedFiles([]);
          form.reset();
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Chọn file để nộp bài</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 my-4"
          >
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        dragActive
                          ? "bg-blue-50 border-blue-500"
                          : "border-gray-300"
                      }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => !isLoading && fileInputRef.current.click()}
                    >
                      <input
                        ref={(e) => {
                          fileInputRef.current = e;
                          field.ref(e);
                        }}
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isLoading}
                      />
                      <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-lg font-medium text-gray-700 mb-1">
                        Kéo thả file vào đây
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        hoặc click để chọn file từ máy tính
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={isLoading}
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current.click();
                        }}
                      >
                        Chọn file
                      </Button>
                      <p className="text-xs text-gray-500 mt-4">
                        Hỗ trợ: PDF, DOCX, XLSX, PPTX, JPG, PNG, MP4, WEBM, OGG
                        (tối đa 100MB)
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Files đã chọn</h3>
                <div className="max-h-60 overflow-y-auto space-y-2 rounded-lg border p-2">
                  {selectedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div className="flex items-center gap-2 overflow-hidden flex-grow">
                        {file.preview ? (
                          <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center overflow-hidden">
                            <img
                              src={file.preview}
                              alt={file.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          getFileIcon(file.name)
                        )}
                        <div className="min-w-0 flex-grow">
                          <p
                            className="text-sm font-medium truncate"
                            title={file.name}
                          >
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-red-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        disabled={isLoading}
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                type="button"
              >
                Hủy
              </Button>
              <Button
                disabled={selectedFiles.length === 0 || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Chọn các file này
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ExamSubmission;
