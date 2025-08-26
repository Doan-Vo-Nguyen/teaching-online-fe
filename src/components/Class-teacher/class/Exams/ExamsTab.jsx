import { getAllExams } from "@/api/ExamApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TabsContent } from "@/components/ui/tabs";
import useAuthToken from "@/hooks/userAuthToken";
import { Book, BookOpen, CheckSquare, FileText, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmptyExams from "./EmptyExams";
import { ScrollArea } from "@/components/ui/scroll-area";
import ExamsItem from "./ExamsItem";
import ExamsCard from "./ExamsCard";

const ExamsTab = () => {
  const auth = useAuthToken();
  const { classId } = useParams();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [sortOrder, setSortOrder] = useState("all");
  const dropdownRef = useRef(null);

  useEffect(() => {
    setExams([]);
    setLoading(true);

    if (classId) {
      fetchAllExamByClassId(classId);
    }
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [classId]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const fetchAllExamByClassId = async (classId) => {
    try {
      const res = await getAllExams();
      if (res.data) {
        let examData = res.data.filter(
          (exam) => exam.class_id.toString() === classId.toString()
        );
        setExams(examData);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const filterExams = (exams) => {
    let filtered = exams.filter((exam) =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortOrder !== "all") {
      if (sortOrder === "common") {
        filtered = filtered.filter((exam) => exam.type_student === "common");
      } else if (sortOrder === "code") {
        filtered = filtered.filter((exam) => exam.type_student === "it");
      }
    }
    return filtered;
  };
  const filteredExams = filterExams(exams);
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
    <TabsContent value="exams" className="pt-2">
      <div className="flex flex-col space-y-6">
        {/* Header with Search and filters */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold text-gray-900 flex items-center dark:text-white">
            <BookOpen className="mr-2 h-6 w-6 text-blue-600" />
            Bài tập
          </h2>
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-white" />
              <Input
                placeholder="Tìm kiếm bài tập..."
                className="pl-9 dark:text-white dark:bg-[#020818]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="border border-gray-300 rounded p-1 font-normal dark:bg-[#020818] dark:border-none dark:outline-none"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="all">Tất cả</option>
              <option value="common">Bài tập thường</option>
              <option value="code">Code</option>
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
                <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="info"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <Book className="mr-2 h-4 w-4" />
                    Tạo bài tập
                  </Button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#020818] border rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          className="flex items-center px-4 py-3 text-sm w-full text-left hover:bg-gray-100 dark:hover:bg-blue-950 transition-colors"
                          onClick={() =>
                            navigate(
                              `/teacher/classes/${classId}/exams/create-for-all`
                            )
                          }
                        >
                          <FileText className="w-5 h-5 mr-3 text-blue-500" />
                          <div>
                            <div className="font-medium">Bài tập chung</div>
                            <div className="text-xs text-gray-500">
                              Giành cho tất cả sinh viên
                            </div>
                          </div>
                        </button>
                        <button
                          className="flex items-center px-4 py-3 text-sm w-full text-left hover:bg-gray-100  dark:hover:bg-blue-950 transition-colors"
                          onClick={() =>
                            navigate(
                              `/teacher/classes/${classId}/exams/create-for-it`
                            )
                          }
                        >
                          <CheckSquare className="w-5 h-5 mr-3 text-green-500" />
                          <div>
                            <div className="font-medium">Bài tập CNTT</div>
                            <div className="text-xs text-gray-500">
                              Giành cho sinh viên CNTT
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content based on filtered data */}
        {filteredExams.length === 0 ? (
          <EmptyExams role={auth.role} classId={classId} navigate={navigate} />
        ) : (
          <>
            {view === "list" ? (
              <div className="bg-white dark:bg-[#020818] rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center p-4 bg-slate-50 dark:bg-[#020818] border-b border-gray-100 text-sm font-medium text-gray-500">
                  <div className="w-12"></div>
                  <div className="w-[40%] ml-7 pl-2 dark:text-white">
                    Tiêu đề bài tập
                  </div>
                  <div className="w-[20%] ml-7 pl-2 dark:text-white">
                    Loại bài tập
                  </div>
                  <div className="hidden md:flex w-[30%] mx-2 dark:text-white">
                    Thời hạn
                  </div>
                  {auth.role !== "student" && (
                    <div className="w-[10%] flex items-center justify-end pr-4 dark:text-white">
                      Thao tác
                    </div>
                  )}
                </div>
                <ScrollArea className="h-[calc(100vh-320px)]">
                  {filteredExams.map((exam) => (
                    <ExamsItem
                      key={exam.exam_id}
                      exam={exam}
                      fetchAllExamByClassId={fetchAllExamByClassId}
                    />
                  ))}
                </ScrollArea>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExams.map((exam) => (
                  <ExamsCard
                    key={exam.exam_id}
                    exam={exam}
                    fetchAllExamByClassId={fetchAllExamByClassId}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </TabsContent>
  );
};

export default ExamsTab;
