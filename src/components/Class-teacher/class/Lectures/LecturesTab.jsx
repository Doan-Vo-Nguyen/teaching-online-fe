import { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Book, FilePlus, FolderPlus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "react-router-dom";
import LectureItem from "./LectureItem";
import { getAllLecturesByClassId } from "@/api/LectureApi";
import LectureCard from "./LectureCard";
import useAuthToken from "@/hooks/userAuthToken";
import CreateLecture from "./CreateLecture";

const LecturesTab = () => {
  const auth = useAuthToken();
  const { classId } = useParams();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    setLectures([]);
    setLoading(true);

    if (classId) {
      fetchAllLecturesByClassId(classId);
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [classId]);

  const fetchAllLecturesByClassId = async (classId) => {
    try {
      const res = await getAllLecturesByClassId(classId);
      if (res.success) {
        setLectures(res.data || []);
      }
    } catch (error) {
      console.error("Error fetching lectures:", error);
      setLectures([]);
    } finally {
      setLoading(false);
    }
  };
  const filteredMaterials = lectures.filter((material) =>
    material.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMaterials = [...filteredMaterials].sort((a, b) => {
    if (sortOrder === "newest") {
      return new Date(b.created_at) - new Date(a.created_at);
    } else {
      return new Date(a.created_at) - new Date(b.created_at);
    }
  });

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

  return (
    <TabsContent value="documents" className="pt-2">
      <div className="flex flex-col space-y-6">
        {/* Header với Search và bộ lọc sắp xếp */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center dark:text-white">
            <Book className="mr-2 h-6 w-6 text-blue-600 " />
            Bài giảng lớp học
          </h2>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto ">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64 ">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-white" />
              <Input
                placeholder="Tìm kiếm bài giảng..."
                className="pl-9 dark:bg-[#020818]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border w-28 border-gray-300 rounded p-1 font-normal dark:bg-[#020818] dark:outline dark:border-none"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>
            <div className="flex gap-2">
              <Button
                variant={view === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setView("grid")}
                className="hidden sm:flex"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setView("list")}
                className="hidden sm:flex"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </Button>
              {auth.role !== "student" && (
                <Button variant="info" onClick={() => setShowCreateModal(true)}>
                  <FilePlus className="mr-2 h-4 w-4" />
                  Thêm bài giảng
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Header của danh sách */}
        {sortedMaterials.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FolderPlus className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium dark:text-white text-gray-700 mb-2">
              Chưa có bài giảng nào
            </h3>
            {auth.role !== "student" && (
              <>
                <p className="text-gray-500 dark:text-white max-w-md mb-6">
                  Bắt đầu thêm bài giảng cho lớp học của bạn để hỗ trợ sinh viên
                  trong quá trình học tập.
                </p>
              </>
            )}
          </div>
        ) : (
          <>
            {view === "list" ? (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center p-4 bg-slate-50 dark:bg-[#020818] border-b border-gray-100 text-sm font-medium text-gray-500">
                  <div className="w-12"></div>
                  <div className="w-[60%] ml-7 pl-2 dark:text-white">
                    Tên bài giảng
                  </div>
                  <div
                    className={`hidden md:flex dark:text-white w-[30%] mx-2 ${
                      auth?.role === "student" ? "pl-14" : "pl-12"
                    }`}
                  >
                    Ngày tạo
                  </div>

                  {auth.role !== "student" && (
                    <div className="w-[10%]  dark:text-white flex items-center justify-end pr-4">
                      Thao tác
                    </div>
                  )}
                </div>
                <ScrollArea className="h-[calc(100vh-320px)]">
                  {sortedMaterials.map((material) => (
                    <LectureItem
                      key={material.lecture_id}
                      material={material}
                      fetchAllLecturesByClassId={fetchAllLecturesByClassId}
                    />
                  ))}
                </ScrollArea>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedMaterials.map((material) => (
                  <LectureCard
                    key={material.lecture_id}
                    material={material}
                    fetchAllLecturesByClassId={fetchAllLecturesByClassId}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <CreateLecture
        open={showCreateModal}
        onOpenChange={(open) => {
          setShowCreateModal(open);
          if (!open) {
            setShowCreateModal(null);
          }
        }}
        fetchAllLecturesByClassId={fetchAllLecturesByClassId}
      />
    </TabsContent>
  );
};

export default LecturesTab;
