// LectureDetail.jsx - Full Width Version
import { useEffect, useState } from "react";
import { FileCodeIcon, FileText, Image, PlayCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getAllLecturesContentById, getLectureDetails } from "@/api/LectureApi";
import useAuthToken from "@/hooks/userAuthToken";
import NavigationBar from "./NavigationBar";
import VideoPlayer from "./VideoPlayer";
import LectureInfo from "./LectureInfo";
import ResourcesSection from "./ResourcesSection";
import AddFileOfLecture from "./AddFileOfLecture";
import DeleteLectureContent from "./DeleteLectureContent";

const LectureDetail = () => {
  const auth = useAuthToken();
  const { lectureId } = useParams();
  const navigate = useNavigate();

  const [lectureDetail, setLectureDetail] = useState();
  const [resources, setResources] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAddResourceDialogOpen, setIsAddResourceDialogOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchLectureDetail();
    fetchAllLecturesContentById();
  }, [lectureId]);

  useEffect(() => {
    if (resources.length > 0) {
      // Tìm resource video đầu tiên để hiển thị
      const videoResource = resources.find((resource) => {
        const fileName = resource.content
          ? resource.content.split("/").pop()
          : "";
        const ext = fileName.split(".").pop().toLowerCase();
        return ["mp4", "webm", "ogg"].includes(ext);
      });

      if (videoResource) {
        setSelectedVideo(videoResource);
      }
    }
  }, [resources]);

  const fetchLectureDetail = async () => {
    let res = await getLectureDetails(lectureId);
    if (res.success) {
      setLectureDetail(res.data);
    } else {
      console.error("Error fetching lecture detail:", res.error);
    }
  };

  const fetchAllLecturesContentById = async () => {
    let res = await getAllLecturesContentById(lectureId);
    if (res.success) {
      const lectureContentFile = res.data.reverse();
      setResources(lectureContentFile);
    } else {
      console.error("Error fetching lecture content:", res.error);
    }
  };

  // Hàm lấy icon dựa trên phần mở rộng file
  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();

    switch (ext) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-600" />;
      case "doc":
      case "docx":
        return <FileText className="h-5 w-5 text-blue-600" />;
      case "xls":
      case "xlsx":
        return <FileText className="h-5 w-5 text-green-600" />;
      case "ppt":
      case "pptx":
        return <FileText className="h-5 w-5 text-orange-600" />;
      case "jpg":
      case "jpeg":
      case "png":
        return <Image className="h-5 w-5 text-blue-600" />;
      case "mp4":
      case "webm":
      case "ogg":
        return <PlayCircle className="h-5 w-5 text-purple-600" />;
      // Các file JavaScript, JSX, MJS sẽ hiển thị icon code với màu vàng
      case "js":
      case "jsx":
      case "mjs":
        return <FileCodeIcon className="h-5 w-5 text-yellow-500" />;
      // File Python sẽ hiển thị icon code với màu xanh
      case "py":
        return <FileCodeIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleDeleteAttachment = (lecture) => {
    setLectureToDelete(lecture);
    setShowDeleteModal(true);
  };

  const viewFileOnline = (fileUrl) => {
    if (!fileUrl) return;
    const ext = fileUrl.split(".").pop().toLowerCase();

    if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
      // Mở ảnh trong tab mới
      window.open(fileUrl, "_blank");
    } else if (["mp4", "webm", "ogg", "mov", "avi", "mkv"].includes(ext)) {
      // Mở video trong tab mới
      window.open(fileUrl, "_blank");
    } else if (ext === "pdf") {
      // Sử dụng Google Docs Viewer để xem PDF
      try {
        const encodedUrl = encodeURIComponent(fileUrl);
        const viewerUrl = `https://docs.google.com/viewer?url=${encodedUrl}&embedded=true`;
        const newWindow = window.open("about:blank", "_blank");
        if (newWindow) {
          newWindow.document.write(`
          <html>
            <head>
              <title>Đang tải tài liệu...</title>
              <style>
                body, html { height: 100%; margin: 0; padding: 0; overflow: hidden; }
                .container { display: flex; flex-direction: column; height: 100%; }
                .loading { padding: 20px; text-align: center; }
                iframe { flex: 1; border: none; width: 100%; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="loading" id="loading">
                  <h2>Đang tải tài liệu...</h2>
                  <p>Nếu tài liệu không hiển thị trong vài giây, hãy 
                    <a href="${fileUrl}" download>tải xuống</a> để xem trực tiếp.
                  </p>
                </div>
                <iframe src="${viewerUrl}" onload="document.getElementById('loading').style.display='none'"></iframe>
              </div>
            </body>
          </html>
        `);
          newWindow.document.close();
        } else {
          window.open(fileUrl, "_blank");
        }
      } catch (error) {
        console.error("Lỗi khi mở file PDF:", error);
        window.open(fileUrl, "_blank");
      }
    } else if (["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext)) {
      // Sử dụng Office Online Viewer cho file Office
      try {
        const encodedUrl = encodeURIComponent(fileUrl);
        window.open(
          `https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`,
          "_blank"
        );
      } catch (error) {
        window.open(fileUrl, "_blank");
      }
    } else if (["js", "c", "cpp", "sql"].includes(ext)) {
      // Xem các file code (.js, .c, .cpp, .sql) trong tab mới với định dạng <pre>
      fetch(fileUrl)
        .then((res) => res.text())
        .then((text) => {
          const newWindow = window.open("about:blank", "_blank");
          if (newWindow) {
            newWindow.document.write(`
            <html>
              <head>
                <title>File ${ext.toUpperCase()} Viewer</title>
                <style>
                  body, html { margin: 0; padding: 0; }
                  pre {
                    white-space: pre-wrap;
                    word-wrap: break-word;
                    padding: 20px;
                    font-family: monospace;
                    background: #f7f7f7;
                  }
                </style>
              </head>
              <body>
                <pre>${text}</pre>
              </body>
            </html>
          `);
            newWindow.document.close();
          }
        })
        .catch((error) => {
          console.error("Error loading file", error);
          window.open(fileUrl, "_blank");
        });
    } else {
      // Các loại file khác - mở trực tiếp
      window.open(fileUrl, "_blank");
    }
  };

  const selectVideoResource = (resource) => {
    setSelectedVideo(resource);
  };

  const getVideoResources = () => {
    return resources.filter((resource) => {
      const fileName = resource.content
        ? resource.content.split("/").pop()
        : "";
      const ext = fileName.split(".").pop().toLowerCase();
      return ["mp4", "webm", "ogg"].includes(ext);
    });
  };

  const getDocumentResources = () => {
    return resources.filter((resource) => {
      const fileName = resource.content
        ? resource.content.split("/").pop()
        : "";
      const ext = fileName.split(".").pop().toLowerCase();
      return !["mp4", "webm", "ogg"].includes(ext);
    });
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen dark:bg-[#020818]">
      {/* Navigation Bar */}
      <NavigationBar
        title={lectureDetail?.title}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        goBack={() => navigate(-1)}
      />

      {/* Mobile Menu */}

      <div className="w-full py-6 px-3">
        <div className="grid grid-cols-1 gap-6">
          <div className="col-span-1 space-y-6">
            {/* Video Player or Lecture Info */}
            {selectedVideo ? (
              <VideoPlayer
                selectedVideo={selectedVideo}
                lectureDetail={lectureDetail}
              />
            ) : (
              <LectureInfo lectureDetail={lectureDetail} />
            )}

            {/* Resources Section */}
            <ResourcesSection
              resources={resources}
              getFileIcon={getFileIcon}
              auth={auth}
              setIsAddResourceDialogOpen={setIsAddResourceDialogOpen}
              selectedVideo={selectedVideo}
              selectVideoResource={selectVideoResource}
              viewFileOnline={viewFileOnline}
              handleDeleteAttachment={handleDeleteAttachment}
              getVideoResources={getVideoResources}
              getDocumentResources={getDocumentResources}
            />
          </div>
        </div>
      </div>

      <AddFileOfLecture
        open={isAddResourceDialogOpen}
        onOpenChange={setIsAddResourceDialogOpen}
        getFileIcon={getFileIcon}
        fetchAllLecturesContentById={fetchAllLecturesContentById}
      />

      {lectureToDelete && (
        <DeleteLectureContent
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          lectureToDelete={lectureToDelete}
          fetchAllLecturesContentById={fetchAllLecturesContentById}
        />
      )}
    </div>
  );
};

export default LectureDetail;
