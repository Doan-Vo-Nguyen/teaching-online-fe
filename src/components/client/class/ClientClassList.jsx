// src/pages/ClientClassList.jsx
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { KeyRound, Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  getAllClasses,
  getAllClassesByTeacherId,
  getClassDetail,
  getClassesStudentByStudentId,
} from "@/api/classApi";
import Pagination from "@/components/Pagination";
import useAuthToken from "@/hooks/userAuthToken";
import { getRandomColor } from "@/utils/colorUtils";

// Import các component con
import { leaveClass } from "@/api/userApi";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { triggerClassUpdate } from "@/store/classSlice";
import JoinClass from "@/components/Class-teacher/class/JoinClass";
import LeaveClassDialog from "@/components/Class-teacher/class/LeaveClassDialog";
import EmptyState from "@/components/Class-teacher/class/EmptyState";
import ClassSearch from "@/components/Class-teacher/class/ClassSearch";
import ClassGrid from "@/components/Class-teacher/class/ClassGrid";
import { useNavigate } from "react-router-dom";
import DeleteClass from "@/components/Class/DeleteClass";

const ClientClassList = () => {
  const auth = useAuthToken();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [joinedClasses, setJoinedClasses] = useState([]);
  const [joinedClassesDetails, setJoinedClassesDetails] = useState([]);
  const [classColors, setClassColors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const classesPerPage = 6;

  // Thêm state cho LeaveClassDialog
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);
  const [selectedClassToLeave, setSelectedClassToLeave] = useState(null);

  const [classToDelete, setClassToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllClasses();
    if (auth?.id) {
      fetchJoinedClasses();
    }
  }, [auth]);

  useEffect(() => {
    if (auth?.role !== "student" && classes.length > 0) {
      const newColors = { ...classColors };
      classes.forEach((classItem) => {
        if (!newColors[classItem.class_id]) {
          newColors[classItem.class_id] = getRandomColor();
        }
      });
      setClassColors(newColors);
    }
  }, [classes, auth]);

  const fetchAllClasses = async () => {
    try {
      let res;
      if (auth?.role === "admin") {
        res = await getAllClasses();
      } else if (auth?.role === "teacher") {
        res = await getAllClassesByTeacherId(auth.id);
      }

      // Đảo ngược thứ tự dữ liệu (nếu cần)
      const reversedClasses = res.data.reverse();
      setClasses(reversedClasses);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchJoinedClasses = async () => {
    try {
      const res = await getClassesStudentByStudentId(auth?.id);
      if (res.success) {
        setJoinedClasses(res.data);
      }
    } catch (error) {
      console.error("Error fetching joined classes:", error);
    }
  };

  useEffect(() => {
    if (joinedClasses.length > 0) {
      fetchJoinedClassDetails();
    }
  }, [joinedClasses]);

  const fetchJoinedClassDetails = async () => {
    try {
      const newColors = { ...classColors };
      joinedClasses.forEach((joinedClass) => {
        if (!newColors[joinedClass.class_id]) {
          newColors[joinedClass.class_id] = getRandomColor();
        }
      });
      setClassColors(newColors);

      const details = await Promise.all(
        joinedClasses.map(async (joinedClass) => {
          const res = await getClassDetail(joinedClass.class_id);
          return res.data;
        })
      );
      setJoinedClassesDetails(details);
    } catch (error) {
      console.error("Error fetching joined class details:", error);
    }
  };

  const handleOpenLeaveDialog = (classInfo) => {
    setSelectedClassToLeave(classInfo);
    setLeaveDialogOpen(true);
  };

  const handleLeaveClass = async () => {
    if (selectedClassToLeave) {
      setIsLoading(true);

      try {
        let res = await leaveClass(auth.id, selectedClassToLeave.class_id);
        await new Promise((resolve) => setTimeout(resolve, 3000));

        if (res.success) {
          toast.success(res.message);
          fetchJoinedClasses();
          setLeaveDialogOpen(false);
          setSelectedClassToLeave(null);
          dispatch(triggerClassUpdate());
        }
      } catch (error) {
        const errorMessage =
          error.response?.data?.error?.details || error?.message;
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const toggleSearchVisibility = () => {
    setIsSearchVisible(!isSearchVisible);
    if (isSearchVisible) {
      setSearchTerm("");
    }
  };

  const filterClass = auth?.role !== "student" ? classes : joinedClassesDetails;
  const joinedFilteredClasses = filterClass.filter((classItem) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearchClassName = classItem.class_name
      .toLowerCase()
      .includes(searchLower);
    const matchesSearchTeacherName = classItem.teacher
      .toLowerCase()
      .includes(searchLower);

    return matchesSearchClassName || matchesSearchTeacherName;
  });

  const totalPages = Math.ceil(joinedFilteredClasses.length / classesPerPage);
  const endIndex = currentPage * classesPerPage;
  const startIndex = endIndex - classesPerPage;
  const currentJoinedClasses = joinedFilteredClasses.slice(
    startIndex,
    endIndex
  );

  const navigateCreateClass = () => {
    if (auth && auth.role) {
      if (auth.role === "admin") {
        navigate("/admin/classes/create");
      } else if (auth.role === "teacher") {
        navigate("/teacher/classes/create");
      }
    }
  };

  const handleDeleteClass = (classInfo) => {
    setClassToDelete(classInfo);
    setShowDeleteModal(true);
  };

  return (
    <div className="container mx-auto py-4 md:py-8 px-3 md:px-4">
      <div className="flex flex-col space-y-4 md:space-y-6">
        {/* Header và Search/Action buttons */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-blue-600">
            Danh sách lớp học
          </h1>

          {/* Mobile Search Toggle Button */}
          <div className="flex md:hidden justify-between items-center w-full">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={toggleSearchVisibility}
            >
              {isSearchVisible ? (
                <X className="h-4 w-4" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>

            {auth?.role !== "student" ? (
              <Button
                size="sm"
                className="flex items-center gap-1  dark:text-white bg-gradient-to-r from-blue-600 to-indigo-600"
                onClick={navigateCreateClass}
              >
                <Plus className="h-3 w-3" />
                <span className="text-xs ">Thêm lớp</span>
              </Button>
            ) : (
              <Button
                onClick={() => setIsModalOpen(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <KeyRound className="w-3 h-3" />
                <span className="text-xs">Tham gia</span>
              </Button>
            )}
          </div>

          {/* Mobile Search Input - Conditionally shown */}
          {isSearchVisible && (
            <div className="md:hidden w-full py-2">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Tìm kiếm lớp học..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white"
              />
            </div>
          )}

          {/* Desktop Search and Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ClassSearch searchTerm={searchTerm} onSearch={handleSearch} />
            {auth?.role !== "student" ? (
              <div className="flex items-center gap-4">
                <Button
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 dark:text-white"
                  onClick={navigateCreateClass}
                >
                  <Plus className="h-4 w-4" />
                  Thêm lớp mới
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <KeyRound className="w-4 h-4" />
                  Tham gia lớp học
                </Button>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="joined" className="w-full">
          <TabsContent value="joined">
            {joinedFilteredClasses.length === 0 ? (
              <EmptyState
                role={auth?.role}
                onJoinClass={() => setIsModalOpen(true)}
                onCreateClass={navigateCreateClass}
              />
            ) : (
              <>
                <ClassGrid
                  classes={currentJoinedClasses}
                  classColors={classColors}
                  onLeaveClass={handleOpenLeaveDialog}
                  onDeleteClass={handleDeleteClass}
                />
                {totalPages > 1 && (
                  <div className="mt-6 overflow-x-auto">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                      showingFrom={startIndex + 1}
                      showingTo={Math.min(
                        endIndex,
                        joinedFilteredClasses.length
                      )}
                      totalItems={joinedFilteredClasses.length}
                      itemName="lớp"
                    />
                  </div>
                )}
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <JoinClass
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        fetchJoinedClasses={fetchJoinedClasses}
        fetchJoinedClassDetails={fetchJoinedClassDetails}
      />

      {leaveDialogOpen && selectedClassToLeave && (
        <LeaveClassDialog
          className={selectedClassToLeave.class_name}
          onLeave={handleLeaveClass}
          onCancel={() => setLeaveDialogOpen(false)}
          isLoading={isLoading}
        />
      )}
      {classToDelete && showDeleteModal && (
        <DeleteClass
          show={showDeleteModal}
          handleClose={() => setShowDeleteModal(false)}
          classData={classToDelete}
          fetchAllClasses={fetchAllClasses}
        />
      )}
    </div>
  );
};

export default ClientClassList;
