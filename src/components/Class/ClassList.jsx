import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  Search,
  MoreVertical,

} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";
import DeleteClass from "./DeleteClass";
import { getAllClasses, getAllClassesByTeacherId } from "@/api/classApi";
import moment from "moment";
import useAuthToken from "@/hooks/userAuthToken";

const ClassList = () => {
  const auth = useAuthToken();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [classToDelete, setClassToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dateFilter, setDateFilter] = useState("");
  const classesPerPage = 5;

 useEffect(() => {
   if (auth) {
     fetchAllClasses();
   }
 }, [auth]);

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


  const filteredClasses = classes.filter((classItem) => {
    // Lọc theo tên lớp
    const matchesSearchClassName = classItem.class_name
      .toLowerCase()
      .includes(searchTerm?.toLowerCase());
    const matchesSearchTeacherName = classItem.teacher
       .toLowerCase()
       .includes(searchTerm?.toLowerCase());


    // Lọc theo ngày tạo (nếu có chọn filter)
    let matchesDate = true;
    if (dateFilter && classItem.created_at) {
      const createdAt = moment(classItem.created_at);
      switch (dateFilter) {
        case "today":
          matchesDate = createdAt.isSame(moment(), "day");
          break;
        case "week":
          matchesDate = createdAt.isSame(moment(), "week");
          break;
        case "month":
          matchesDate = createdAt.isSame(moment(), "month");
          break;
        case "year":
          matchesDate = createdAt.isSame(moment(), "year");
          break;
        default:
          matchesDate = true;
      }
    }
    return matchesSearchClassName && matchesSearchTeacherName && matchesDate;
  });

  const endIndex = currentPage * classesPerPage;
  const startIndex = endIndex - classesPerPage;
  const currentClasses = filteredClasses.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredClasses.length / classesPerPage);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

   const handleDeleteClass = (classItem) => {
     setClassToDelete(classItem);
     setShowDeleteModal(true);
   };
  
   const navigateCreateClass = () =>{
     if(auth && auth.role) {
       if(auth.role === 'admin') {
         navigate('/admin/classes/create');
       } else if(auth.role === "teacher") {
         navigate('/teacher/classes/create');
       } 
      
     }
   }

    const navigateViewDetail = (classId) => {
      if (auth && auth.role) {
        if (auth.role === "admin") {
          navigate(`/admin/classes/${classId}`);
        } else if (auth.role === "teacher") {
           navigate(`/teacher/classes/${classId}`);
        }
      }
    };

     const navigateEditClass = (classId) => {
       if (auth && auth.role) {
         if (auth.role === "admin") {
           navigate(`/admin/classes/update/${classId}`);
         } else if (auth.role === "teacher") {
           navigate(`/teacher/classes/update/${classId}`);
         }
       }
     };
  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 p-5">
        <CardHeader>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Quản lý lớp học
              </h1>
              <p className="text-gray-500 mt-2">
                Quản lý và theo dõi các lớp học trực tuyến
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex space-x-4 mb-4 md:mb-0">
              {" "}
              <div>
                <select
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-6 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  <option value="today">Hôm nay</option>
                  <option value="week">Tuần này</option>
                  <option value="month">Tháng này</option>
                  <option value="year">Năm nay</option>
                </select>{" "}
              </div>
            </div>

            <div className="flex space-x-4 w-full md:w-auto">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Tìm kiếm lớp học..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <Button
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600"
                onClick={navigateCreateClass}
              >
                <Plus className="h-4 w-4" />
                Thêm lớp mới
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Mã lớp</TableHead>
                  <TableHead>Tên lớp</TableHead>
                  <TableHead>Giáo viên</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentClasses.map((classItem) => (
                  <TableRow key={classItem.class_id}>
                    <TableCell className="font-medium">
                      {classItem.class_id}
                    </TableCell>
                    <TableCell
                      className="font-medium"
                      onClick={() => navigateViewDetail(classItem.class_id)}
                    >
                      {classItem?.class_code}
                    </TableCell>
                    <TableCell
                      className="font-medium"
                      onClick={() => navigateViewDetail(classItem.class_id)}
                    >
                      {classItem.class_name}
                    </TableCell>
                    <TableCell>{classItem.teacher}</TableCell>
                    <TableCell>
                      {moment(classItem.created_at).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              navigateEditClass(classItem.class_id)
                            }
                          >
                            <span>Chỉnh sửa</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 w-full"
                            onClick={() => handleDeleteClass(classItem)}
                          >
                            <span>Xóa</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showingFrom={startIndex + 1}
            showingTo={Math.min(endIndex, filteredClasses.length)}
            totalItems={filteredClasses.length}
            itemName="lớp"
          />
        )}
      </Card>
      {classToDelete && (
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

export default ClassList;
